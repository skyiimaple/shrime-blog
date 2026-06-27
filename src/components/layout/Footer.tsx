import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export async function Footer() {
  const t = await getTranslations('footer')

  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={24} height={24} className="rounded-md" />
          <span>© {new Date().getFullYear()} {t('copyright')}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/rss.xml" className="transition hover:text-accent">
            {t('rss')}
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-accent"
          >
            {t('github')}
          </a>
        </div>
      </div>
    </footer>
  )
}
