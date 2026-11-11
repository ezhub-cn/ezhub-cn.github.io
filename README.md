# EZHub 官网

EZHub 是个人独立软件创作品牌。本站使用 Astro 和 TypeScript 生成静态页面。目前的中文首页用于验证工程基础，正式首页将在独立任务中实现和验收。

## 本地开发

使用 [.node-version](.node-version) 指定的 Node.js 24 LTS 版本，以及 [package.json](package.json) 中声明的 npm 版本。

```sh
npm ci
npm run dev
```

访问终端显示的本地地址。运行以下命令可执行类型检查、生成 `dist/index.html`，并预览构建产物。

```sh
npm run check
npm run build
npm run preview
```

页面位于 `src/pages/`，公共布局位于 `src/layouts/`，基础设计 Token 位于 `src/styles/tokens.css`。PR CI 运行锁文件安装、类型检查、静态构建和首页产物检查。

- [站点规格](docs/SITE_SPEC.md)
- [开发工作流](docs/WORKFLOW.md)
- [Agent 协作入口](AGENTS.md)
