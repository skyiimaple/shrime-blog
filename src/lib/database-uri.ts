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

export function hasPostgresUri(): boolean {
  return Boolean(resolvePostgresUri())
}
