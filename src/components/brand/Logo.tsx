export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="40" height="40" rx="10" className="fill-accent-soft" />
      <path
        d="M11 22c0-4.5 3.5-8 8-8s8 3.5 8 8"
        className="stroke-accent"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27 18c2.5 1 4 3.2 4 5.5 0 3.6-3.1 6.5-7 6.5-2.2 0-4.2-.9-5.6-2.4"
        className="stroke-accent"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="17" cy="20" r="1.2" className="fill-accent" />
      <circle cx="21" cy="20" r="1.2" className="fill-accent" />
      <path
        d="M13 14l-2-2M27 14l2-2"
        className="stroke-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 24c1.5-1 3-1 4.5 0M32 24c-1.5-1-3-1-4.5 0"
        className="stroke-success"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
