(function () {
  'use strict';
  var KEY = 'todo-agent-v1';
  var URG = { high: '紧急', mid: '一般', low: '不急' };
  var URG_ORDER = { high: 0, mid: 1, low: 2 };
  var cat = 'work';
  var tasks = load();

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(d) ? d : [];
    } catch (e) { return []; }
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(tasks)); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text; // textContent: 防止 XSS
    return n;
  }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function weekStart(s) { // 周一为一周开始
    var d = parse(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d;
  }
  function weekLabel(d) {
    var e = new Date(d); e.setDate(e.getDate() + 6);
    var t = new Date(), ts = weekStart(fmt(t)).getTime() === d.getTime();
    return fmt(d) + ' ~ ' + fmt(e) + (ts ? '(本周)' : '');
  }

  function render() {
    var box = document.getElementById('list');
    box.textContent = '';
    var items = tasks.filter(function (t) { return t.cat === cat; });
    if (!items.length) { box.appendChild(el('div', 'empty', '还没有任务,先添加一个吧 ✨')); return; }

    var groups = {};
    if (cat === 'travel') {
      groups.all = items;
    } else {
      items.forEach(function (t) {
        var k = fmt(weekStart(t.start));
        (groups[k] = groups[k] || []).push(t);
      });
    }
    Object.keys(groups).sort().forEach(function (k) {
      var list = groups[k].sort(function (a, b) {
        return a.done - b.done || URG_ORDER[a.urgency] - URG_ORDER[b.urgency] || a.start.localeCompare(b.start);
      });
      var sec = el('div', 'week');
      var h = el('h2', '', cat === 'travel' ? '旅行计划' : weekLabel(parse(k)));
      var done = list.filter(function (t) { return t.done; }).length;
      h.appendChild(el('small', '', done + '/' + list.length + ' 完成'));
      sec.appendChild(h);
      list.forEach(function (t) { sec.appendChild(card(t)); });
      box.appendChild(sec);
    });
  }

  function card(t) {
    var urg = URG[t.urgency] ? t.urgency : 'mid';
    var c = el('div', 'card task ' + urg + (t.done ? ' done' : ''));
    var cb = el('input'); cb.type = 'checkbox'; cb.checked = !!t.done;
    cb.onchange = function () { t.done = cb.checked; save(); render(); };
    var body = el('div', 'body');
    body.appendChild(el('div', 'title', t.title));
    var meta = el('div', 'meta', t.start + ' → ' + t.end);
    meta.appendChild(el('span', 'badge ' + urg, URG[urg]));
    body.appendChild(meta);
    if (t.notes) body.appendChild(el('div', 'notes', t.notes));
    var del = el('button', 'del', '✕'); del.title = '删除';
    del.onclick = function () {
      tasks = tasks.filter(function (x) { return x.id !== t.id; }); save(); render();
    };
    c.appendChild(cb); c.appendChild(body); c.appendChild(del);
    return c;
  }

  document.getElementById('tabs').addEventListener('click', function (e) {
    var b = e.target.closest('.tab'); if (!b) return;
    cat = b.dataset.cat;
    document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('active', x === b); });
    render();
  });

  var start = document.getElementById('f-start'), end = document.getElementById('f-end');
  start.value = end.value = fmt(new Date());

  document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (end.value < start.value) { alert('结束时间不能早于开始时间'); return; }
    var title = document.getElementById('f-title');
    tasks.push({
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      cat: cat, title: title.value.trim(), start: start.value, end: end.value,
      urgency: document.getElementById('f-urgency').value,
      notes: document.getElementById('f-notes').value.trim(), done: false
    });
    save();
    title.value = ''; document.getElementById('f-notes').value = '';
    render();
  });

  render();
})();
