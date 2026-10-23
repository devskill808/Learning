# 学习与成长记录

记录我在做「待办清单」项目过程中的学习进度、问题和收获。

## 当前学习任务:Cloudflare 与网站用户相关技术

- 开始日期:2026-10-23
- 目标:借这次部署,了解 Cloudflare 的常用功能,以及网站接入用户后需要的技术。

### 学习清单

**Cloudflare 基础**
- [x] DNS 解析:记录类型(A / CNAME / MX / TXT)(已接触 CNAME,其余待深入)
- [x] 代理模式:灰色云朵与橙色云朵的区别
- [x] SSL/TLS 模式:Flexible / Full / Full (strict)
- [ ] 缓存与 Always Online

**安全与防护**
- [ ] 防火墙规则与 WAF
- [ ] DDoS 防护与 Bot 管理
- [ ] Rate Limiting(限速)

**用户相关技术**
- [ ] 用户访问统计:Cloudflare Web Analytics
- [ ] 用户登录与权限:Cloudflare Access
- [ ] 数据同步:让待办数据跨设备保存(Workers + KV / D1)
- [ ] 隐私与合规:Cookie 提示、数据最小化

## 项目进度

- [x] 完成待办清单页面,并推送到 GitHub
- [x] 绑定自定义域名 `todo.newai.store`
- [x] DNS 迁移到 Cloudflare(Namecheap → Cloudflare nameserver)
- [x] 添加 CNAME:`todo` → `devskill808.github.io`(DNS only)
- [x] 证书签发后开启 Enforce HTTPS
- [x] 开启 Cloudflare 代理(SSL/TLS 设为 Full,云朵改橙色)
- [x] 三个账号(Cloudflare / GitHub / Namecheap)开启 2FA,Namecheap 开启域名锁

## 学习日志

### 2026-10-23
- 了解到:GitHub Pages 自定义子域名需要 CNAME 指向 `<用户名>.github.io`。
- 了解到:Cloudflare 代理要先关闭(灰色云朵),GitHub 才能签发证书。
- 了解到:更换 nameserver 后需要等待生效,再回 GitHub 重新绑定域名。
- 待办数据目前存在浏览器 localStorage,不会同步到 GitHub。
- 完成:nameserver 切换到 Cloudflare,站点状态变为 Active。
- 完成:CNAME 改为 DNS only 后,在 GitHub 重新绑定域名,证书很快签发。
- 验证:HTTP 301 跳转到 HTTPS,Let's Encrypt 证书有效到 2027-01-20,浏览器显示 Connection is Secure。
- 了解到:新版 Chrome 用调节图标代替小锁,点开能看到 Connection is Secure。
- 了解到:SSL/TLS 模式决定的是 Cloudflare 到 GitHub 这一段的加密方式;GitHub 已强制 HTTPS,Flexible 会导致重定向循环,应选 Full 或 Full (strict)。
- 了解到:网站内容在 GitHub Pages,Namecheap 只是注册商,Cloudflare 提供 DNS、代理、DDoS/WAF 防护和缓存。
- 验证:响应头出现 `server: cloudflare` 与 `cf-ray`,确认流量已经走 Cloudflare。
- 了解到:待办数据在浏览器 localStorage,不经过服务器,Cloudflare 保护不了这部分。
- 完成:账号安全加固(2FA、Registrar Lock、Always Use HTTPS)。
- 新目标:系统学习网络基础,见下方书单。

## 问题与答案

| 日期 | 问题 | 结论 |
|---|---|---|
| 2026-10-23 | HTTPS 无法开启 | 证书未签发,需 DNS 正确生效后重新绑定域名 |
| 2026-10-23 | CNAME 怎么填 | Name 填 `todo`,Target 填 `devskill808.github.io` |
| 2026-10-23 | 看不到小锁 | 新版浏览器用图标代替,点开看 Connection is Secure |
| 2026-10-23 | dig 超时 | 本机连不上 DNS 服务器,不代表域名有问题,可用 curl 验证 |
| 2026-10-23 | 用 Cloudflare 比 Namecheap 更安全吗 | 网站在 GitHub;Cloudflare 提供代理、DDoS/WAF、缓存,账号安全才是关键 |

## 网络基础书单

书单已移到 [READING_LIST.md](READING_LIST.md),目前在读《图解HTTP》(2026-10-23 开始)。
