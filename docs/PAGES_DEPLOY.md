# Pages 发布与恢复

## 首次发布前

- 核对 Pages 的发布来源为 **GitHub Actions**，Actions 策略允许工作流中固定的 Action，且 `github-pages` Environment 允许 `main` 部署。若配置了审批、等待时间等保护规则，由发布人按现行规则操作。发布来源或保护规则需要变更时，先取得单独授权。[GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- 在 GitHub 的部署记录和对应 Actions 运行中核对当前成功部署的部署 ID、运行链接、提交 SHA 和 URL，确认哪个版本正在对外服务。对默认域名保存首页最终 URL、状态、响应头、原始 HTML 和关键资源校验值，记录采集时间。若站点已使用自定义域名，同时保存当前 Pages 域名与 HTTPS 设置、DNS 记录和值及 TTL。
- 对照下方旧站采集记录核对线上首页和样式。若实际线上版本已变化，先更新并离线复验恢复材料。历史部署关联提交 `4b842420abde7e43b29777a4d0f1b348b3a75e88` 的树只有 `README.md`，恢复入口使用已采集的静态快照。

## 手动发布或恢复旧站

1. 取得本次发布或恢复授权。在 GitHub Actions 打开 **发布 GitHub Pages**，用 **Run workflow** 选择 `main`，核对要运行的提交。选择 `astro-v1` 构建和校验 `dist/`，或显式选择 `legacy-snapshot` 复制并校验旧站文件。
2. 核对运行记录中的提交与发布目标。构建作业成功并上传后，部署作业使用 `github-pages` Environment。处理所需的审批，并保存成功运行的链接、SHA、目标和部署 URL。避免重复派发，GitHub 并发组可能替换尚在排队的运行。
3. 验证默认地址 `https://ezhub-cn.github.io/` 的最终 URL、HTTPS 和首页状态。恢复旧站时对照下方记录检查标题、正文、首页链接和同站 CSS、JS。发布 Astro 时按站点规格检查公开路由、静态资源、Sitemap、robots 和自定义 404 的状态与内容。记录实际响应，如有自定义域名同时记录默认地址的重定向及目标域名响应。
4. 若构建、审批、部署或验收失败，停止后续发布，保存运行日志和实际 HTTP 响应。核对最新成功部署与线上响应，确认当前状态后再决定是否重试或采用其他恢复路径。

## 后续 Astro 版本和域名恢复

- **Git 回退**调整源码。需要恢复已知良好的 Astro 版本时，从成功部署记录找出其 SHA，经独立审核和 Git 授权后，通过正常 PR 将对应站点源码和构建配置恢复到 `main`，保留经过审核的发布和恢复入口。核对新提交构建的产物再进入发布流程。
- **Pages 重新部署**替换线上静态文件。将恢复源码合入 `main` 后，另经发布授权手动选择 `astro-v1`，记录原良好 SHA 与本次实际部署 SHA 并验收。恢复 V1 之前的旧站时直接选择 `legacy-snapshot`。
- **DNS 回退**调整流量指向。自定义域名启用后，依据事前保存的记录和单独授权，核对 Pages 域名绑定、DNS 目标与 TTL、CAA、域名验证记录、TLS 证书状态和 HTTPS 强制配置。由域名及证书负责方处理所需变更，并分别验证 DNS 解析、证书与 HTTP 跳转。旧站快照的 canonical 与可见首页链接指向默认域名，启用自定义域名后仍需验收实际跳转。[GitHub Pages 自定义域名管理](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 旧站采集记录和快照

2026-11-17 23:56:58（北京时间），从 `https://ezhub-cn.github.io/` 取得原始 HTML，最终 URL 相同，HTTP 200。SHA-256 为 `be781318e81cffa696d1af9cd6ec8017b48504ef08031a41833079cc85c200c5`。

| 响应头 | 采集值 |
| --- | --- |
| `Content-Type` | `text/html; charset=utf-8` |
| `ETag` | `"6af4109f-7f4"` |
| `Last-Modified` | `Wed, 11 Nov 2026 06:52:15 GMT` |
| `Server` | `GitHub.com` |
| `Date` | `Tue, 17 Nov 2026 15:56:55 GMT` |

首页标题为 `ezhub-cn.github.io | ezhub`，可见内容包括链接 `ezhub`、标题 `ezhub-cn.github.io` 和正文 `Official website of EZHub`。可见链接指向默认域名的首页。AnchorJS 默认处理 `h2` 至 `h6`，该页的两个标题均为 `h1`。恢复范围为首页与下列资源。页面未引用外部图片，AnchorJS 使用内嵌字体，样式未引用其他文件。

| 快照文件 | 来源与差异 |
| --- | --- |
| `index.html` | 公开首页。去除行尾空格，将 CDN 脚本引用改为同站路径，保留完整性校验和可见链接。 |
| `assets/css/style.css` | `https://ezhub-cn.github.io/assets/css/style.css?v=4b842420abde7e43b29777a4d0f1b348b3a75e88`，HTTP 200，原始字节。 |
| `assets/js/anchor.min.js` | `https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js`，HTTP 200，原始字节。 |
| `assets/LICENSE.txt` | 快照附带的第三方许可证声明。 |

快照目录为 [`ops/rollback/legacy-site/`](../ops/rollback/legacy-site/)。在该目录执行 `sha256sum --check --strict ../legacy-site.sha256` 校验全部文件，使用静态 HTTP 服务从该目录根路径打开首页。工作流将清单中的四个文件复制到专用临时目录，校验后从该目录根上传。Astro 发布使用 `dist/`。
