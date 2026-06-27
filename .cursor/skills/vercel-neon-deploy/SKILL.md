---
name: vercel-neon-deploy
description: >-
  Deploy Next.js + Payload CMS blogs to Vercel with Neon PostgreSQL and Vercel
  Blob. Use when deploying Maple's Blog, shrimp-blog, shrime-blog, or when the
  user asks about Vercel deployment, Neon database setup, environment variables,
  or post-deploy verification for this stack.
---

# Vercel + Neon 部署（Maple's Blog / Payload 3）

## 触发时先读

- 项目任务清单：[docs/DEPLOY.md](docs/DEPLOY.md)
- 环境变量模板：`.env.example`

## 执行顺序（Agent 工作流）

复制进度清单并逐项执行：

```
部署进度：
- [ ] 0. 本地 npm run build 通过
- [ ] 1. Neon DATABASE_URI 已配置且可连接
- [ ] 2. 代码已 push 到 GitHub（无 .env）
- [ ] 3. Vercel 导入项目 + 环境变量
- [ ] 4. Vercel Blob 已创建并连接
- [ ] 5. Deploy / Redeploy 成功
- [ ] 6. 部署后验证（/zh、/admin、Media、评论、RSS）
```

### 0. 本地预检

```bash
npm install
npm run build
node scripts/deploy/verify-env.mjs
```

构建失败先修，不要部署。

### 1. Neon

- 本地与生产均使用 **Neon PostgreSQL**（`DATABASE_URI` 或 Vercel 集成的 `POSTGRES_URL`）
- 密码泄露后：Neon 重置密码 → 更新 Vercel 与本地 `.env`

### 2. GitHub

- 仓库：`https://github.com/skyiimaple/shrime-blog`
- 确认 `.gitignore` 含 `.env*`、`/data/`、`/media/`
- 提交 `.env.example`，永不提交 `.env`

### 3. Vercel 环境变量（Production 必填）

| 变量 | 要求 |
|------|------|
| `PAYLOAD_SECRET` | 32+ 随机，非 `dev-secret` |
| `DATABASE_URI` | Neon PostgreSQL URI |
| `NEXT_PUBLIC_SITE_URL` | `https://域名` 无末尾 `/` |
| `BLOB_READ_WRITE_TOKEN` | Blob 创建后自动注入 |

可选：`MEILISEARCH_HOST`、`MEILISEARCH_API_KEY`

构建使用已提交的 `importMap.js`（`npm run build`）。若改了 Payload 后台组件，本地再跑 `npm run generate:importmap`。

### 4. Vercel Blob

Storage → Create → **Blob** → Connect to Project。无 Blob 则后台 Media 上传在 Serverless 上不可用。

项目已配置 `@payloadcms/storage-vercel-blob` + `clientUploads: true`。

### 5. 部署后验证 URL

- `/zh`、`/en`、`/admin`
- 发文章、上传 Media、提交评论、审核评论
- `/rss.xml`

改域名后必须更新 `NEXT_PUBLIC_SITE_URL` 并 **Redeploy**。

## 排错速查

| 现象 | 动作 |
|------|------|
| Build 失败 `ERR_REQUIRE_ASYNC_MODULE` | 勿在 build 中跑 `generate:importmap`；用 `next build`，importMap 已提交 |
| `/admin` 500 | 查 Production 的 `PAYLOAD_SECRET`、`DATABASE_URI` |
| No files were uploaded | 创建 Blob；Paste URL 需图片直链非 `#pid=` |
| 评论 500 | `api/comments` 需 `overrideAccess` + 数字 post ID |
| 413 上传 | 确认 Blob + `clientUploads` |
| RSS 域名错 | `NEXT_PUBLIC_SITE_URL` + Redeploy |

## 数据

本地与生产共用 Neon PostgreSQL（`DATABASE_URI`）。新库可在 `/admin` 创建管理员后发布内容，或开发环境调用 `POST /api/seed` 填充示例数据。

生产 `/api/seed` 已禁用。

## 详细参考

完整步骤与核对表见 [docs/DEPLOY.md](docs/DEPLOY.md)。
