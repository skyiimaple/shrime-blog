import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Comments } from './collections/Comments'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { resolvePayloadDatabaseUri } from './lib/database-uri'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUri = resolvePayloadDatabaseUri()
const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

if (!databaseUri) {
  throw new Error(
    '未配置数据库：在 .env 设置 DATABASE_URI（Neon PostgreSQL 连接串）',
  )
}

if (process.env.VERCEL) {
  const secret = process.env.PAYLOAD_SECRET?.trim() ?? ''
  if (secret.length < 32) {
    throw new Error(
      'Vercel 未配置 PAYLOAD_SECRET：Settings → Environment Variables → 勾选 Production → 添加至少 32 位随机串 → Redeploy',
    )
  }
}

const postgresPool = {
  connectionString: databaseUri,
  max: process.env.VERCEL ? 1 : undefined,
  idleTimeoutMillis: process.env.VERCEL ? 10000 : undefined,
  connectionTimeoutMillis: process.env.VERCEL ? 30000 : undefined,
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tags, Posts, Comments],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: postgresPool,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: useBlobStorage,
      clientUploads: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  localization: {
    locales: [
      { label: '中文', code: 'zh' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'zh',
    fallback: true,
  },
})
