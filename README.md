# Shrimp Blog

生活 + 技术的开发者风格博客，基于 Next.js 16 与 Payload CMS 3。

## 功能

- Payload CMS 后台（`/admin`）管理文章、标签、评论
- 中英文多语言（`/zh`、`/en`，默认中文）
- 生活 / 技术分类
- 自研评论系统（提交后待审核，后台通过后展示）
- Meilisearch 全文搜索（可选）
- RSS 订阅（`/rss.xml`）
- 开发者风格深色 UI

## 技术栈

- **框架**: Next.js 16 + TypeScript
- **CMS**: Payload CMS 3
- **数据库**: PostgreSQL
- **多语言**: next-intl
- **搜索**: Meilisearch
- **样式**: Tailwind CSS 4

## 快速开始

### 1. 环境要求

- Node.js 20+
- PostgreSQL 14+
- Meilisearch（可选，用于搜索）

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并修改：

```env
PAYLOAD_SECRET=your-secret-key-at-least-32-characters-long
DATABASE_URI=postgresql://postgres:postgres@localhost:5432/shrimp_blog
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_API_KEY=dev-master-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 启动 PostgreSQL

本地 Docker 示例：

```bash
docker run --name shrimp-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=shrimp_blog -p 5432:5432 -d postgres:16
```

或使用 [Neon](https://neon.tech) 免费 PostgreSQL，把连接串填入 `DATABASE_URI`。

### 5. 启动 Meilisearch（可选）

```bash
docker run -d -p 7700:7700 -e MEILI_MASTER_KEY=dev-master-key getmeili/meilisearch:latest
```

未配置 Meilisearch 时，博客其余功能正常，仅搜索不可用。

### 6. 启动开发服务器

```bash
npm run dev
```

- 前台: http://localhost:3000/zh
- 后台: http://localhost:3000/admin

首次访问 `/admin` 会引导创建管理员账号。

## 项目结构

```
src/
├── app/
│   ├── [locale]/          # 多语言前台页面
│   ├── (payload)/         # Payload 后台与 API
│   └── api/               # 评论、搜索 API
├── collections/           # Payload 内容模型
├── components/            # React 组件
├── i18n/                  # 多语言配置与文案
└── lib/                   # 工具函数
```

## 内容模型

| 集合 | 说明 |
|------|------|
| `posts` | 文章（标题、正文、分类、标签、多语言） |
| `tags` | 标签 |
| `comments` | 评论（待审核 / 已通过 / 已拒绝） |
| `media` | 图片媒体 |
| `users` | 管理员账号 |

## 评论流程

1. 读者在文章页提交评论
2. 评论以 `pending` 状态写入数据库
3. 管理员在 `/admin` → Comments 中审核
4. 状态改为 `approved` 后，前台自动展示

## 常用命令

```bash
npm run dev                 # 开发
npm run build               # 构建
npm run generate:types      # 生成 Payload TypeScript 类型
npm run generate:importmap  # 生成 Payload import map
```

## 部署

完整任务清单见 **[docs/DEPLOY.md](docs/DEPLOY.md)**。

```bash
npm run deploy:verify   # 部署前环境变量自检
npm run build           # 本地构建预检
```

Vercel + Neon + Blob 步骤见文档；Cursor Agent 可引用 Skill：`vercel-neon-deploy`。

## 后续可扩展

- 阅读统计（Umami / Plausible）
- 系列文章 / 友链 / 相册
- 评论反垃圾（Akismet / 频率限制）
- 邮件通知（新评论提醒）
