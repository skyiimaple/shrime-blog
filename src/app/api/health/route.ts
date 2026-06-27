import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const secret = process.env.PAYLOAD_SECRET?.trim() ?? ''
  const databaseUri = process.env.DATABASE_URI?.trim() ?? ''

  const checks: Record<string, boolean | string> = {
    PAYLOAD_SECRET: secret.length >= 32,
    DATABASE_URI_postgres: databaseUri.startsWith('postgres'),
    NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
    BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    VERCEL: Boolean(process.env.VERCEL),
  }

  if (!checks.PAYLOAD_SECRET) {
    checks.PAYLOAD_SECRET_hint = '在 Vercel 设置至少 32 位的 PAYLOAD_SECRET'
  }

  if (!checks.DATABASE_URI_postgres) {
    checks.DATABASE_URI_hint =
      '在 Vercel 设置 Neon 连接串；Serverless 建议用 -pooler 主机名'
  }

  let dbOk = false
  let dbError: string | undefined

  if (checks.DATABASE_URI_postgres && checks.PAYLOAD_SECRET) {
    try {
      const { getPayloadClient } = await import('@/lib/payload')
      const payload = await getPayloadClient()
      await payload.find({ collection: 'users', limit: 1 })
      dbOk = true
    } catch (error) {
      dbError = error instanceof Error ? error.message : String(error)
    }
  }

  checks.database_connect = dbOk
  if (dbError) checks.database_error = dbError

  const ok =
    checks.PAYLOAD_SECRET &&
    checks.DATABASE_URI_postgres &&
    checks.NEXT_PUBLIC_SITE_URL &&
    dbOk

  return NextResponse.json(
    { ok, checks },
    { status: ok ? 200 : 503 },
  )
}
