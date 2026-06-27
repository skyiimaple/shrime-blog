const POSTGRES_ENV_KEYS = [
  'DATABASE_URI',
  'POSTGRES_URL',
  'DATABASE_URL',
] as const

export type PostgresEnvKey = (typeof POSTGRES_ENV_KEYS)[number]

export function resolvePostgresUri(): string | undefined {
  return resolvePostgresUriWithSource()?.uri
}

export function resolvePostgresUriWithSource():
  | { uri: string; source: PostgresEnvKey }
  | undefined {
  for (const key of POSTGRES_ENV_KEYS) {
    const value = process.env[key]?.trim()
    if (value?.startsWith('postgres')) {
      return { uri: value, source: key }
    }
  }
  return undefined
}

export function listPostgresEnvHosts(): Partial<Record<PostgresEnvKey, string>> {
  const hosts: Partial<Record<PostgresEnvKey, string>> = {}
  for (const key of POSTGRES_ENV_KEYS) {
    const value = process.env[key]?.trim()
    if (value?.startsWith('postgres')) {
      hosts[key] = postgresHost(value)
    }
  }
  return hosts
}

/** 去掉 Neon Pooler 后缀，改用直连主机名（仅 DATABASE_USE_DIRECT=true 时启用） */
export function toDirectNeonUri(uri: string): string {
  if (uri.includes('-pooler.')) {
    return uri.replace('-pooler.', '.')
  }
  return uri
}

export function resolvePayloadDatabaseUri(): string | undefined {
  const resolved = resolvePostgresUriWithSource()
  if (!resolved) return undefined
  // Vercel Serverless 应保留 Pooler 连接串；直连易 timeout
  if (process.env.VERCEL && process.env.DATABASE_USE_DIRECT === 'true') {
    return toDirectNeonUri(resolved.uri)
  }
  return resolved.uri
}

export function postgresHost(uri: string): string {
  const match = uri.match(/@([^/?]+)/)
  return match?.[1]?.split(':')[0] ?? 'unknown'
}

export function hasPostgresUri(): boolean {
  return Boolean(resolvePostgresUri())
}

export function hasConflictingPostgresHosts(): boolean {
  const hosts = Object.values(listPostgresEnvHosts())
  if (hosts.length <= 1) return false
  return new Set(hosts).size > 1
}
