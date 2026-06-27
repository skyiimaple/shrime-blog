'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { BookOpen, Home, Search, Tags, UserRound, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const navItems: { href: string; key: 'home' | 'blog' | 'tags' | 'about' | 'search'; icon: LucideIcon }[] = [
  { href: '/', key: 'home', icon: Home },
  { href: '/blog', key: 'blog', icon: BookOpen },
  { href: '/tags', key: 'tags', icon: Tags },
  { href: '/about', key: 'about', icon: UserRound },
  { href: '/search', key: 'search', icon: Search },
]

type IndicatorStyle = {
  left: number
  width: number
  opacity: number
}

export function NavLinks() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  })

  useEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current
      if (!nav) return

      const active = nav.querySelector<HTMLElement>('[data-nav-active="true"]')
      if (!active) {
        setIndicator((prev) => ({ ...prev, opacity: 0 }))
        return
      }

      setIndicator({
        left: active.offsetLeft,
        width: active.offsetWidth,
        opacity: 1,
      })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)

    return () => window.removeEventListener('resize', updateIndicator)
  }, [pathname])

  return (
    <nav ref={navRef} className="relative hidden items-center gap-0.5 md:flex">
      <span
        className="pointer-events-none absolute bottom-0 top-0 rounded-lg bg-sky-400/15 transition-[left,width,opacity] duration-300 ease-out dark:bg-sky-400/20"
        style={{
          left: indicator.left,
          width: indicator.width,
          opacity: indicator.opacity,
        }}
        aria-hidden
      />

      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.key}
            href={item.href}
            data-nav-active={isActive ? 'true' : 'false'}
            className={cn(
              'group relative z-10 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-[color,transform,background-color] duration-300 ease-out',
              isActive
                ? 'font-semibold text-sky-600 dark:text-sky-300'
                : 'text-muted hover:bg-sky-400/35 hover:font-medium hover:text-sky-800 dark:hover:bg-sky-400/40 dark:hover:text-sky-100',
              'active:scale-[0.97]',
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4 shrink-0 transition-transform duration-300 ease-out',
                isActive ? 'scale-110' : 'group-hover:scale-105',
              )}
              strokeWidth={2.25}
            />
            <span>{t(item.key)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
