'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Github, Mail, type LucideIcon } from 'lucide-react'

const circleClass =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/35 transition hover:bg-muted/50 dark:bg-muted/20 dark:hover:bg-muted/35'

type SocialItem = {
  key: string
  href: string
  external?: boolean
  labelKey: 'socialGithub' | 'socialEmail'
  icon: LucideIcon
  iconClassName: string
}

export function ProfileSocialLinks() {
  const t = useTranslations('home')

  const items: SocialItem[] = [
    {
      key: 'github',
      href: 'https://github.com',
      external: true,
      labelKey: 'socialGithub',
      icon: Github,
      iconClassName: 'text-slate-800 dark:text-slate-100',
    },
    {
      key: 'email',
      href: '/about',
      labelKey: 'socialEmail',
      icon: Mail,
      iconClassName: 'text-sky-500 dark:text-sky-400',
    },
  ]

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      {items.map((item) => {
        const label = t(item.labelKey)
        const className = cn(circleClass)
        const icon = (
          <item.icon className={cn('h-[18px] w-[18px]', item.iconClassName)} strokeWidth={2.25} />
        )

        if (item.external) {
          return (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={className}
            >
              {icon}
            </a>
          )
        }

        return (
          <Link key={item.key} href={item.href} aria-label={label} className={className}>
            {icon}
          </Link>
        )
      })}
    </div>
  )
}
