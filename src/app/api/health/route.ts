import { NextResponse } from 'next/server'
import { hasPostgresUri, resolvePostgresUri } from '@/lib/database-uri'

export const dynamic = 'force-dynamic'

export async function GET() {
  const secret = process.env.PAYLOAD_SECRET?.trim() ?? ''
  const databaseUri = resolvePostgresUri() ?? ''

  const checks: Record<string, boolean | string> = {
    PAYLOAD_SECRET: secret.length >= 32,
    database_postgres: hasPostgresUri(),
    NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
    BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    VERCEL: Boolean(process.env.VERCEL),
  }

  if (!checks.PAYLOAD_SECRET) {
    checks.PAYLOAD_SECRET_hint = '在 Vercel 手动添加 PAYLOAD_SECRET（至少 32 位）'
  }

  if (!checks.database_postgres) {
    checks.database_hint =
      '需要 DATABASE_URI 或 Neon 集成的 POSTGRES_URL / DATABASE_URL'
  }

  let dbOk = false
  let dbError: string | undefined

  if (checks.database_postgres && checks.PAYLOAD_SECRET) {
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
    checks.database_postgres &&
    checks.NEXT_PUBLIC_SITE_URL &&
    dbOk

  return NextResponse.json(
    { ok, checks },
    { status: ok ? 200 : 503 },
  )
}
