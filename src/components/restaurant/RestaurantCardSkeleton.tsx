import { Skeleton } from '../ui/Skeleton'

export function RestaurantCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface-bg)',
        border: '1px solid var(--surface-border)',
      }}
    >
      {/* Photo placeholder */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      {/* Info placeholders */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-1/3" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
        <div className="flex gap-2 mt-1">
          <Skeleton className="flex-1 h-10 rounded-xl" />
          <Skeleton className="w-10 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
