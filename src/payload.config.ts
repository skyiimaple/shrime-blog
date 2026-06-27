import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
import { hasPostgresUri, resolvePostgresUri } from './lib/database-uri'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const postgresUri = resolvePostgresUri()
const databaseUri =
  postgresUri || `file:${path.resolve(dirname, '../data/shrimp-blog.db')}`
const usePostgres = databaseUri.startsWith('postgres')
const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

if (process.env.VERCEL) {
  const secret = process.env.PAYLOAD_SECRET?.trim() ?? ''
  if (secret.length < 32) {
    throw new Error(
      'Vercel 未配置 PAYLOAD_SECRET：Settings → Environment Variables → Production，至少 32 位随机串',
    )
  }
  if (!usePostgres) {
    throw new Error(
      'Vercel 未配置数据库：添加 DATABASE_URI，或使用 Neon 集成自带的 POSTGRES_URL',
    )
  }
}

const postgresPool = {
  connectionString: databaseUri,
  max: process.env.VERCEL ? 10 : undefined,
  idleTimeoutMillis: process.env.VERCEL ? 5000 : undefined,
  connectionTimeoutMillis: process.env.VERCEL ? 15000 : undefined,
}

const db = usePostgres
  ? postgresAdapter({
      pool: postgresPool,
    })
  : sqliteAdapter({
      client: {
        url: databaseUri,
      },
    })

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
  db,
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
