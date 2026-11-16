# EZHub 官网

EZHub 是个人独立软件创作品牌。本站使用 Astro 和 TypeScript 生成静态页面，已实现中文首页、产品中心、eNote 与 BuildingStore 的产品详情页、关于页和自定义 404 页面。正式发布环境中的路由与 404 状态码将在部署时验收。

## 本地开发

使用 [.node-version](.node-version) 指定的 Node.js 24 LTS 版本，以及 [package.json](package.json) 中声明的 npm 版本。

```sh
npm ci
npm run dev
```

访问终端显示的本地地址。运行以下命令可执行类型检查、构建并校验静态产物，然后启动预览。

```sh
npm run check
npm run build
npm run verify:dist
npm run preview
```

页面位于 `src/pages/`，公共布局位于 `src/layouts/`，基础设计 Token 位于 `src/styles/tokens.css`。PR CI 运行锁文件安装、类型检查、静态构建和页面及 SEO 产物校验。

- [站点规格](docs/SITE_SPEC.md)
- [开发工作流](docs/WORKFLOW.md)
- [Agent 协作入口](AGENTS.md)
- [代码与工程文档规范](docs/CODE_STYLE.md)
- [AI 协作与接管](AI_CONTEXT.md)
