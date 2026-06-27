import { ACCENT_COLOR } from '@/lib/theme'
import { CardGradient, cardGlowStyle } from '@/components/ui/CardGradient'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type TagChipProps = {
  name: string
  slug: string
  color?: string | null
  className?: string
}

export function TagChip({ name, slug, color, className }: TagChipProps) {
  const glowColor = color || ACCENT_COLOR

  return (
    <Link
      href={`/tags/${slug}`}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card px-5 py-3 shadow-sm transition',
        'hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
      style={cardGlowStyle(glowColor)}
    >
      <CardGradient color={glowColor} />
      <span
        className="relative font-medium transition group-hover:opacity-90"
        style={{ color: glowColor }}
      >
        #{name}
      </span>
    </Link>
  )
}
