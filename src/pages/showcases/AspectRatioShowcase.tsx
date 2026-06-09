import { AspectRatio } from '../../components/ui/AspectRatio/AspectRatio'

/** Live demo of the AspectRatio at 16/9 and 1/1. */
export function AspectRatioShowcase() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-4">
      <AspectRatio ratio={16 / 9} className="rounded-lg">
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 font-mono text-sm text-white">
          16 / 9
        </div>
      </AspectRatio>
      <AspectRatio ratio={1} className="rounded-lg">
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 font-mono text-sm text-white">
          1 / 1
        </div>
      </AspectRatio>
    </div>
  )
}
