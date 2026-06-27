# Maple's Blog — Vercel + Neon 部署任务

按顺序执行，完成一项勾一项。Agent 部署时请读 `.cursor/skills/vercel-neon-deploy/SKILL.md`。

---

## 阶段 0：本地预检（必做）

```bash
npm install
npm run build
```

- [ ] 构建成功，无红色 Error（`npm run build` 仅跑 `next build`，不跑 `generate:importmap`）
- [ ] `.env` 未提交（`git status` 中不出现 `.env`）

可选环境自检：

```bash
node scripts/deploy/verify-env.mjs
```

---

## 阶段 1：Neon 数据库

- [ ] 登录 [neon.tech](https://neon.tech) → **New Project**
- [ ] 复制 **Connection string**（URI，含 `sslmode=require`）
- [ ] 本地 `.env` 写入：`DATABASE_URI=postgresql://...`
- [ ] 本地验证：`npm run dev` → 打开 `http://localhost:3000/admin`

| 报错 | 处理 |
|------|------|
| `password authentication failed` | Neon 重置密码，更新连接串 |
| `connection refused` | 检查 URI 是否完整、含 `sslmode=require` |

---

## 阶段 2：GitHub

仓库：https://github.com/skyiimaple/shrime-blog

```bash
git status
git add .
git commit -m "你的提交说明"
git push origin main
```

- [ ] 代码已推送到 `main`
- [ ] 未提交 `.env`、`media/`

---

## 阶段 3：Vercel 项目

- [ ] [vercel.com](https://vercel.com) → **Add New → Project** → 导入 `skyiimaple/shrime-blog`
- [ ] Framework：**Next.js**（自动识别）
- [ ] Build Command：`npm run build`（默认即可）

### 环境变量（Settings → Environment Variables）

至少勾选 **Production**：

| 变量 | 说明 |
|------|------|
| `PAYLOAD_SECRET` | 32+ 位随机串（**必须手动添加**，Neon 集成不会自动生成） |
| `DATABASE_URI` | **含数据的** Neon 连接串（优先级最高）；Vercel 集成 Neon 会另建空库，勿只用 `POSTGRES_URL` |
| `NEXT_PUBLIC_SITE_URL` | `https://xxx.vercel.app`（无末尾 `/`） |
| `BLOB_READ_WRITE_TOKEN` | 阶段 4 创建 Blob 后自动注入 |

可选：

| 变量 | 说明 |
|------|------|
| `MEILISEARCH_HOST` | 搜索服务 |
| `MEILISEARCH_API_KEY` | 搜索密钥 |

生成 `PAYLOAD_SECRET`（PowerShell）：

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 阶段 4：Vercel Blob（媒体上传必做）

- [ ] 项目 → **Storage** → **Create Database** → **Blob**
- [ ] **Connect to Project** 关联当前项目
- [ ] 确认环境变量中已有 `BLOB_READ_WRITE_TOKEN`
- [ ] **Deploy**（或 Redeploy）

---

## 阶段 5：部署后验证

- [ ] `https://你的域名/zh` 首页正常
- [ ] `https://你的域名/admin` 创建/登录管理员
- [ ] 后台发布一篇测试文章
- [ ] **Media** 上传一张图（验证 Blob）
- [ ] 前台文章页提交评论 → 后台 **Comments** 审核通过
- [ ] `https://你的域名/rss.xml` 可访问

### 自定义域名（可选）

- [ ] Vercel → **Domains** 添加域名
- [ ] 更新 `NEXT_PUBLIC_SITE_URL` 为正式域名
- [ ] **Redeploy**

---

## 快速排错

| 现象 | 检查 |
|------|------|
| 构建失败 | Vercel Build Log；本地 `npm run build` |
| `ERR_REQUIRE_ASYNC_MODULE` | 已修复：build 不再跑 `generate:importmap`，用已提交的 `importMap.js` |
| `/admin` 500 | `PAYLOAD_SECRET`、`DATABASE_URI` 是否配在 Production |
| 全站 500 / admin 登录失败 | 打开 `/api/health`；`database_env_hosts` 若多个主机不一致，在 Vercel 设置 `DATABASE_URI` 为本地同一 Neon 库 |
| 数据库 timeout | `DATABASE_URI` 用 Neon **Pooler** 连接串（含 `-pooler`）；勿设 `DATABASE_USE_DIRECT`；删除 Vercel Neon 集成多余的 `POSTGRES_*` |
| 图片上传失败 | Blob 是否创建并连接；`BLOB_READ_WRITE_TOKEN` |
| 评论失败 | 是否最新代码（`overrideAccess` 修复） |
| RSS/链接域名错 | `NEXT_PUBLIC_SITE_URL` + Redeploy |

---

## 环境变量核对表（复制用）

```text
[ ] PAYLOAD_SECRET
[ ] DATABASE_URI
[ ] NEXT_PUBLIC_SITE_URL
[ ] BLOB_READ_WRITE_TOKEN
[ ] MEILISEARCH_HOST（可选）
[ ] MEILISEARCH_API_KEY（可选）
```
