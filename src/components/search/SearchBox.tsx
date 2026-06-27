'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type SearchBoxProps = {
  locale: string
  initialQuery?: string
}

type SearchHit = {
  id: string
  slug: string
  title: string
  excerpt?: string
  category?: string
}

export function SearchBox({ locale, initialQuery = '' }: SearchBoxProps) {
  const t = useTranslations('search')
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchHit[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`)
      const data = await response.json()
      setResults(data.results || [])
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 rounded-md border border-border bg-card px-4 py-3 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-accent px-4 py-3 text-sm font-medium text-background"
        >
          {t('title')}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {!searched && <p className="text-sm text-muted">{t('hint')}</p>}
        {searched && results.length === 0 && <p className="text-sm text-muted">{t('noResults')}</p>}

        {results.map((hit) => (
          <article key={hit.id} className="rounded-lg border border-border bg-card p-4">
            <Link href={`/blog/${hit.slug}`} className="text-lg font-medium text-accent">
              {hit.title}
            </Link>
            {hit.excerpt && <p className="mt-2 text-sm text-muted">{hit.excerpt}</p>}
          </article>
        ))}
      </div>
    </div>
  )
}
