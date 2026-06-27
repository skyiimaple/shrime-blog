'use client'

import { useTheme } from '@/components/theme/ThemeProvider'
import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const t = useTranslations('theme')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'rounded-md border border-border p-2 text-muted transition hover:bg-card hover:text-foreground',
        className,
      )}
      aria-label={theme === 'light' ? t('switchDark') : t('switchLight')}
      title={theme === 'light' ? t('switchDark') : t('switchLight')}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  )
}
