import { NextResponse } from 'next/server'
import {
  hasConflictingPostgresHosts,
  hasPostgresUri,
  listPostgresEnvHosts,
  postgresHost,
  resolvePayloadDatabaseUri,
  resolvePostgresUriWithSource,
} from '@/lib/database-uri'

export const dynamic = 'force-dynamic'

export async function GET() {
  const secret = process.env.PAYLOAD_SECRET?.trim() ?? ''
  const resolved = resolvePostgresUriWithSource()
  const payloadDatabaseUri = resolvePayloadDatabaseUri()

  const checks: Record<string, boolean | string | Record<string, string>> = {
    PAYLOAD_SECRET: secret.length >= 32,
    database_postgres: hasPostgresUri(),
    NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
    BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    VERCEL: Boolean(process.env.VERCEL),
    database_source: resolved?.source ?? 'missing',
    database_env_hosts: listPostgresEnvHosts(),
    database_connect_host: payloadDatabaseUri ? postgresHost(payloadDatabaseUri) : 'missing',
    database_uses_pooler: Boolean(payloadDatabaseUri?.includes('-pooler.')),
  }

  if (!checks.PAYLOAD_SECRET) {
    checks.PAYLOAD_SECRET_hint = '在 Vercel 手动添加 PAYLOAD_SECRET（至少 32 位）'
  }

  if (!checks.database_postgres) {
    checks.database_hint =
      '需要 DATABASE_URI 或 Neon 集成的 POSTGRES_URL / DATABASE_URL'
  }

  if (
    resolved?.uri.includes('-pooler.') &&
    payloadDatabaseUri &&
    !payloadDatabaseUri.includes('-pooler.')
  ) {
    checks.database_hint =
      'DATABASE_URI 含 pooler 但连接被转为直连（旧代码）；请 push 最新代码并 Redeploy'
  } else if (hasConflictingPostgresHosts()) {
    checks.database_hint =
      'POSTGRES_URL/DATABASE_URL 与 DATABASE_URI 指向不同 Neon 库；请在 Vercel 删除 Neon 集成注入的 POSTGRES_* / DATABASE_URL，仅保留 DATABASE_URI'
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
      const err = error as Error & { cause?: unknown }
      dbError =
        err.cause instanceof Error
          ? `${err.message} | ${err.cause.message}`
          : err.message
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
