import { Skeleton } from '../../components/ui/Skeleton/Skeleton'

/** Live demo of the Skeleton, rendered inside the dashboard preview panel. */
export function SkeletonShowcase() {
  return (
    <div className="grid max-w-sm gap-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      <Skeleton className="h-32 w-full" />

      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
