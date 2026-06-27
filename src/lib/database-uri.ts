const POSTGRES_ENV_KEYS = [
  'DATABASE_URI',
  'POSTGRES_URL',
  'DATABASE_URL',
] as const

export function resolvePostgresUri(): string | undefined {
  for (const key of POSTGRES_ENV_KEYS) {
    const value = process.env[key]?.trim()
    if (value?.startsWith('postgres')) {
      return value
    }
  }
  return undefined
}

/** Neon Pooler 在 Vercel Serverless + Drizzle 下可能失败，改用直连主机名 */
export function toDirectNeonUri(uri: string): string {
  if (uri.includes('-pooler.')) {
    return uri.replace('-pooler.', '.')
  }
  return uri
}

export function resolvePayloadDatabaseUri(): string | undefined {
  const uri = resolvePostgresUri()
  if (!uri) return undefined
  if (process.env.VERCEL) {
    return toDirectNeonUri(uri)
  }
  return uri
}

export function postgresHost(uri: string): string {
  const match = uri.match(/@([^/?]+)/)
  return match?.[1]?.split(':')[0] ?? 'unknown'
}

export function hasPostgresUri(): boolean {
  return Boolean(resolvePostgresUri())
}
