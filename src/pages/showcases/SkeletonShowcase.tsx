import { Skeleton } from '../../components/ui/Skeleton/Skeleton'

/**
 * Live demo of the Skeleton, shown the way it's actually used: as the loading
 * state of real UI — a media/profile card and a list — so the placeholders read
 * in context rather than as floating bars.
 */
export function SkeletonShowcase() {
  return (
    <div className="grid w-72 gap-5 sm:w-96">
      {/* Media card loading state */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Skeleton className="h-36 w-full rounded-none" />
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* List loading state */}
      <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg p-2">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2.5 w-3/4" />
            </div>
            <Skeleton className="h-6 w-12 shrink-0 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
