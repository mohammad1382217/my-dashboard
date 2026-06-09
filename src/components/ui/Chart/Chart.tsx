import { forwardRef, useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ChartPoint {
  /** X-axis label. */
  label: string
  /** Y value. */
  value: number
}

export interface ChartProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Data points. */
  data: ChartPoint[]
  /** Bar or line. Defaults to "bar". */
  type?: 'bar' | 'line'
  /** Plot height in px. Defaults to 220. */
  height?: number
  /** Series colour (any CSS colour). Defaults to indigo. */
  color?: string
  /** Number of horizontal gridlines. Defaults to 4. */
  gridLines?: number
  /** Format the axis/aria values. Defaults to String. */
  valueFormatter?: (value: number) => string
  /** Accessible summary of the chart. */
  ariaLabel?: string
}

/** Round up to a visually pleasant axis maximum (1, 2, 5 × 10ⁿ). */
function niceCeil(value: number) {
  if (value <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(value)))
  const n = value / pow
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return nice * pow
}

/**
 * A dependency-free chart drawn with inline SVG (no charting library), so it
 * stays tiny and downloadable. Renders a single bar or line series from `data`,
 * with gridlines, y-axis ticks and x-axis labels. Width tracks the container via
 * ResizeObserver; theme-aware via Tailwind `stroke-*`/`fill-*` classes. Exposed
 * as `role="img"` with an `aria-label` summary.
 */
export const Chart = forwardRef<HTMLDivElement, ChartProps>(function Chart(
  { data, type = 'bar', height = 220, color = '#6366f1', gridLines = 4, valueFormatter = String, ariaLabel, className, ...props },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(Math.max(240, entry.contentRect.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const W = width
  const H = height
  const padLeft = 40
  const padBottom = 26
  const padTop = 10
  const padRight = 10
  const x0 = padLeft
  const x1 = W - padRight
  const y0 = padTop
  const y1 = H - padBottom
  const plotW = Math.max(1, x1 - x0)
  const plotH = Math.max(1, y1 - y0)

  const max = niceCeil(Math.max(0, ...data.map((d) => d.value)))
  const n = data.length || 1
  const yFor = (v: number) => y1 - (v / max) * plotH
  const bandW = plotW / n
  const barW = bandW * 0.6
  const xCenter = (i: number) => x0 + bandW * (i + 0.5)
  const xLine = (i: number) => (n === 1 ? x0 + plotW / 2 : x0 + (i / (n - 1)) * plotW)

  const linePoints = data.map((d, i) => `${xLine(i)},${yFor(d.value)}`).join(' ')
  const areaPoints = `${x0},${y1} ${linePoints} ${x0 + (n === 1 ? plotW / 2 : plotW)},${y1}`

  const summary =
    ariaLabel ?? `${type} chart: ${data.map((d) => `${d.label} ${valueFormatter(d.value)}`).join(', ')}`

  return (
    <div ref={(node) => {
      containerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }} className={twMerge('w-full', className)} {...props}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary} className="w-full">
        {/* Gridlines + y ticks */}
        {Array.from({ length: gridLines + 1 }, (_, i) => {
          const v = (max / gridLines) * i
          const y = yFor(v)
          return (
            <g key={i}>
              <line x1={x0} y1={y} x2={x1} y2={y} className="stroke-slate-200 dark:stroke-zinc-800" strokeWidth={1} />
              <text x={x0 - 6} y={y + 3} textAnchor="end" className="fill-slate-400 dark:fill-zinc-500" fontSize={10}>
                {valueFormatter(Math.round(v))}
              </text>
            </g>
          )
        })}

        {/* Series */}
        {type === 'bar'
          ? data.map((d, i) => (
              <rect key={i} x={xCenter(i) - barW / 2} y={yFor(d.value)} width={barW} height={y1 - yFor(d.value)} rx={3} fill={color}>
                <title>{`${d.label}: ${valueFormatter(d.value)}`}</title>
              </rect>
            ))
          : (
            <>
              <polygon points={areaPoints} fill={color} opacity={0.12} />
              <polyline points={linePoints} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              {data.map((d, i) => (
                <circle key={i} cx={xLine(i)} cy={yFor(d.value)} r={3} fill={color}>
                  <title>{`${d.label}: ${valueFormatter(d.value)}`}</title>
                </circle>
              ))}
            </>
          )}

        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={type === 'bar' ? xCenter(i) : xLine(i)} y={H - 8} textAnchor="middle" className="fill-slate-500 dark:fill-zinc-400" fontSize={10}>
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  )
})
