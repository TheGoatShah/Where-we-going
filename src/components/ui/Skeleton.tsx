interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg skeleton-shimmer ${className}`}
      style={{ background: 'var(--skeleton-base)' }}
      role="status"
      aria-label="Loading..."
    />
  )
}
