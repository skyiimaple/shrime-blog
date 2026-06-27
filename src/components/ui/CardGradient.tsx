import { hexToRgba } from '@/lib/color'
import { cn } from '@/lib/utils'

import { ACCENT_COLOR } from '@/lib/theme'

export const CATEGORY_COLORS = {
  tech: ACCENT_COLOR,
  life: '#059669',
} as const

type CardGradientProps = {
  color: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-20 w-20 -right-6 -top-6 blur-2xl',
  md: 'h-24 w-24 -right-8 -top-8 blur-2xl',
  lg: 'h-32 w-32 -right-10 -top-10 blur-3xl',
}

export function CardGradient({ color, className, size = 'md' }: CardGradientProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute rounded-full transition group-hover:scale-110',
        sizeMap[size],
        className,
      )}
      style={{ background: hexToRgba(color, 0.35) }}
      aria-hidden
    />
  )
}

export function cardGlowStyle(color: string) {
  return {
    borderColor: hexToRgba(color, 0.25),
  } as const
}
