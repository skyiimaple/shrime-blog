'use client'

import { SiteTitle } from '@/components/brand/SiteTitle'
import { NavLinks } from '@/components/layout/NavLinks'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { Search } from 'lucide-react'

export function Header() {
  const t = useTranslations('nav')
  const tSite = useTranslations('site')

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={44}
            height={44}
            className="rounded-xl ring-1 ring-border transition group-hover:ring-accent/40"
          />
          <SiteTitle>{tSite('title')}</SiteTitle>
        </Link>

        <NavLinks />

        <div className="flex items-center gap-1.5">
          <Link
            href="/search"
            className="rounded-lg border border-border p-2 text-muted transition hover:bg-card hover:text-foreground md:hidden"
            aria-label={t('search')}
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <LanguageSwitcher />
          <a
            href="/admin"
            className="hidden rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:border-accent hover:text-accent sm:inline-block"
          >
            {t('admin')}
          </a>
        </div>
      </div>
    </header>
  )
}

function LanguageSwitcher() {
  const pathname = usePathname()
  const locale = useLocale()

  return (
    <div className="flex overflow-hidden rounded-lg border border-border text-xs font-medium">
      <Link
        href={pathname}
        locale="zh"
        className={cn(
          'px-2.5 py-2 transition',
          locale === 'zh'
            ? 'bg-sky-400 font-semibold text-sky-950'
            : 'text-muted hover:bg-sky-400/35 hover:text-sky-800 dark:hover:bg-sky-400/40 dark:hover:text-sky-100',
        )}
      >
        中
      </Link>
      <Link
        href={pathname}
        locale="en"
        className={cn(
          'border-l border-border px-2.5 py-2 transition',
          locale === 'en'
            ? 'bg-sky-400 font-semibold text-sky-950'
            : 'text-muted hover:bg-sky-400/35 hover:text-sky-800 dark:hover:bg-sky-400/40 dark:hover:text-sky-100',
        )}
      >
        EN
      </Link>
    </div>
  )
}
