/**
 * 部署前环境变量自检（本地 .env 或 process.env）
 * 用法: node scripts/deploy/verify-env.mjs
 */
import { config } from 'dotenv'
import { existsSync } from 'fs'
import { resolve } from 'path'

config()

const postgresUri =
  [process.env.DATABASE_URI, process.env.POSTGRES_URL, process.env.DATABASE_URL]
    .map((v) => v?.trim())
    .find((v) => v?.startsWith('postgres'))

const required = [
  { key: 'PAYLOAD_SECRET', minLength: 32, hint: '至少 32 位随机字符串' },
  {
    key: 'DATABASE_URI',
    pattern: /^postgres/,
    hint: '请设置 DATABASE_URI 或 POSTGRES_URL（Neon PostgreSQL）',
    resolved: postgresUri,
  },
  { key: 'NEXT_PUBLIC_SITE_URL', pattern: /^https?:\/\//, hint: '站点 URL，如 https://xxx.vercel.app' },
]

const optional = ['BLOB_READ_WRITE_TOKEN', 'MEILISEARCH_HOST', 'MEILISEARCH_API_KEY']

let failed = 0

console.log('=== Maple\'s Blog 部署环境自检 ===\n')

if (!existsSync(resolve(process.cwd(), '.env'))) {
  console.warn('⚠ 未找到 .env（Vercel 上在控制台配置即可）\n')
}

for (const { key, minLength, pattern, hint, resolved } of required) {
  const value =
    key === 'DATABASE_URI' ? resolved : process.env[key]?.trim()
  if (!value) {
    console.error(`✗ ${key} 未设置 — ${hint}`)
    failed++
    continue
  }
  if (minLength && value.length < minLength) {
    console.error(`✗ ${key} 长度不足 ${minLength} — ${hint}`)
    failed++
    continue
  }
  if (pattern && !pattern.test(value)) {
    console.error(`✗ ${key} 格式不符 — ${hint}`)
    failed++
    continue
  }
  if (key === 'PAYLOAD_SECRET' && value.includes('dev-secret')) {
    console.warn(`⚠ ${key} 看起来像开发密钥，生产请更换`)
  }
  console.log(`✓ ${key}`)
}

console.log('\n--- 可选 ---')
for (const key of optional) {
  const value = process.env[key]?.trim()
  console.log(value ? `✓ ${key}` : `○ ${key}（未设置）`)
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.warn('\n⚠ 未配置 BLOB_READ_WRITE_TOKEN：Vercel 上需在 Storage 创建 Blob')
}

if (postgresUri) {
  try {
    const { Client } = await import('pg')
    const client = new Client({ connectionString: postgresUri })
    await client.connect()
    await client.query('SELECT 1')
    await client.end()
    console.log('\n✓ 数据库连接成功')
  } catch (err) {
    console.error('\n✗ 数据库连接失败:', err.message)
    failed++
  }
}

console.log(failed ? `\n${failed} 项必填未通过` : '\n全部必填项通过，可部署')
process.exit(failed ? 1 : 0)
