/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Bilingual } from './registry'
import { Icon } from '../components/Icon'
import { Button } from '../components/ui/Button/Button'
import { Badge } from '../components/ui/Badge/Badge'
import { Alert } from '../components/ui/Alert/Alert'
import { Input } from '../components/ui/Input/Input'
import { Switch } from '../components/ui/Switch/Switch'
import { Checkbox } from '../components/ui/Checkbox/Checkbox'
import { Spinner } from '../components/ui/Spinner/Spinner'
import { Avatar } from '../components/ui/Avatar/Avatar'
import { Progress } from '../components/ui/Progress/Progress'
import { Slider } from '../components/ui/Slider/Slider'
import { Toggle } from '../components/ui/Toggle/Toggle'
import { Kbd } from '../components/ui/Kbd/Kbd'
import { Separator } from '../components/ui/Separator/Separator'
import { Tooltip } from '../components/ui/Tooltip/Tooltip'
import { Empty } from '../components/ui/Empty/Empty'
import { Textarea } from '../components/ui/Textarea/Textarea'
import { Select } from '../components/ui/Select/Select'
import { Accordion } from '../components/ui/Accordion/Accordion'
import { RadioGroup } from '../components/ui/RadioGroup/RadioGroup'
import { Form } from '../components/ui/Form/Form'
import { InputOTP } from '../components/ui/InputOTP/InputOTP'
import { Tabs } from '../components/ui/Tabs/Tabs'
import { Card } from '../components/ui/Card/Card'
import { Carousel } from '../components/ui/Carousel/Carousel'
import { Skeleton } from '../components/ui/Skeleton/Skeleton'
import { DropdownMenu } from '../components/ui/DropdownMenu/DropdownMenu'
import { Label } from '../components/ui/Label/Label'
import { AspectRatio } from '../components/ui/AspectRatio/AspectRatio'
import { Breadcrumb } from '../components/ui/Breadcrumb/Breadcrumb'
import { ToggleGroup } from '../components/ui/ToggleGroup/ToggleGroup'
import { ButtonGroup } from '../components/ui/ButtonGroup/ButtonGroup'
import { InputGroup } from '../components/ui/InputGroup/InputGroup'
import { Item } from '../components/ui/Item/Item'
import { Field } from '../components/ui/Field/Field'
import { Pagination } from '../components/ui/Pagination/Pagination'
import { Table } from '../components/ui/Table/Table'
import { ScrollArea } from '../components/ui/ScrollArea/ScrollArea'
import { Collapsible } from '../components/ui/Collapsible/Collapsible'
import { Popover } from '../components/ui/Popover/Popover'
import { HoverCard } from '../components/ui/HoverCard/HoverCard'
import { ContextMenu } from '../components/ui/ContextMenu/ContextMenu'
import { Calendar } from '../components/ui/Calendar/Calendar'
import { Combobox } from '../components/ui/Combobox/Combobox'
import { Command } from '../components/ui/Command/Command'
import { Menubar } from '../components/ui/Menubar/Menubar'
import { NavigationMenu } from '../components/ui/NavigationMenu/NavigationMenu'
import { Sidebar } from '../components/ui/Sidebar/Sidebar'
import { Resizable } from '../components/ui/Resizable/Resizable'
import { DataTable } from '../components/ui/DataTable/DataTable'
import { Chart } from '../components/ui/Chart/Chart'
import { DatePickerJalali } from '../components/ui/DatePickerJalali/DatePickerJalali'

/** One tweakable component-specific control in the builder's Props panel. */
export type Control =
  | { prop: string; kind: 'text'; label: Bilingual; default: string }
  | { prop: string; kind: 'boolean'; label: Bilingual; default: boolean }
  | { prop: string; kind: 'select'; label: Bilingual; options: string[]; default: string }
  | { prop: string; kind: 'number'; label: Bilingual; min: number; max: number; step: number; default: number }
  | { prop: string; kind: 'color'; label: Bilingual; default: string }

export type BuilderValues = Record<string, unknown>

export interface BuilderEntry {
  /** Matches a component id in the registry. */
  id: string
  /** Component name (used in generated code). */
  code: string
  /** Component-specific controls shown in the Props panel. */
  controls: Control[]
  /** Live preview for the current prop values + custom inline style. */
  render: (v: BuilderValues, style: CSSProperties) => ReactNode
  /** Optional custom codegen (defaults to the generic JSX generator). */
  toCode?: (v: BuilderValues, styleCode: string) => string
}

/* --------------------------------------------------------------------------- *
 * Universal style state — the "Figma" inspector applied to every component    *
 * --------------------------------------------------------------------------- */

/** A curated swatch palette (neutrals + the full hue wheel at a vivid shade). */
export const PALETTE = [
  '#000000', '#374151', '#64748b', '#94a3b8', '#e2e8f0', '#ffffff',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
]

export interface StyleState {
  background: string
  color: string
  borderColor: string
  borderWidth: number
  radius: number
  paddingX: number
  paddingY: number
  fontSize: number
  fontWeight: string
  shadow: string
  opacity: number
}

export const DEFAULT_STYLE: StyleState = {
  background: '',
  color: '',
  borderColor: '#6366f1',
  borderWidth: 0,
  radius: 0,
  paddingX: 0,
  paddingY: 0,
  fontSize: 0,
  fontWeight: '',
  shadow: '',
  opacity: 100,
}

const SHADOWS: Record<string, string> = {
  sm: '0 1px 2px rgba(0,0,0,0.08)',
  md: '0 4px 12px rgba(0,0,0,0.12)',
  lg: '0 10px 24px rgba(0,0,0,0.16)',
  xl: '0 20px 40px rgba(0,0,0,0.20)',
}

/** Build a React style object from the inspector state (only touched fields). */
export function buildStyle(s: StyleState): CSSProperties {
  const out: CSSProperties = {}
  if (s.background) out.backgroundColor = s.background
  if (s.color) out.color = s.color
  if (s.borderWidth > 0) {
    out.borderStyle = 'solid'
    out.borderWidth = s.borderWidth
    out.borderColor = s.borderColor || '#000000'
  }
  if (s.radius > 0) out.borderRadius = s.radius
  if (s.paddingX > 0 || s.paddingY > 0) out.padding = `${s.paddingY}px ${s.paddingX}px`
  if (s.fontSize > 0) out.fontSize = s.fontSize
  if (s.fontWeight) out.fontWeight = Number(s.fontWeight)
  if (s.shadow && SHADOWS[s.shadow]) out.boxShadow = SHADOWS[s.shadow]
  if (s.opacity < 100) out.opacity = s.opacity / 100
  return out
}

// Map the palette hexes back to Tailwind colour tokens (custom picks fall back to arbitrary values).
const HEX_TO_TOKEN: Record<string, string> = {
  '#000000': 'black', '#374151': 'gray-700', '#64748b': 'slate-500', '#94a3b8': 'slate-400',
  '#e2e8f0': 'slate-200', '#ffffff': 'white', '#ef4444': 'red-500', '#f97316': 'orange-500',
  '#f59e0b': 'amber-500', '#eab308': 'yellow-500', '#84cc16': 'lime-500', '#22c55e': 'green-500',
  '#10b981': 'emerald-500', '#14b8a6': 'teal-500', '#06b6d4': 'cyan-500', '#3b82f6': 'blue-500',
  '#6366f1': 'indigo-500', '#8b5cf6': 'violet-500', '#a855f7': 'purple-500', '#d946ef': 'fuchsia-500',
  '#ec4899': 'pink-500', '#f43f5e': 'rose-500',
}
const RADIUS_CLASS: Record<number, string> = { 2: 'rounded-sm', 4: 'rounded', 6: 'rounded-md', 8: 'rounded-lg', 12: 'rounded-xl', 16: 'rounded-2xl', 24: 'rounded-3xl' }
const BORDER_W_CLASS: Record<number, string> = { 1: 'border', 2: 'border-2', 4: 'border-4', 8: 'border-8' }
const FONT_SIZE_CLASS: Record<number, string> = { 12: 'text-xs', 14: 'text-sm', 16: 'text-base', 18: 'text-lg', 20: 'text-xl', 24: 'text-2xl', 30: 'text-3xl', 36: 'text-4xl' }
const FONT_WEIGHT_CLASS: Record<string, string> = { '400': 'font-normal', '500': 'font-medium', '600': 'font-semibold', '700': 'font-bold', '800': 'font-extrabold' }
const SHADOW_CLASS: Record<string, string> = { sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg', xl: 'shadow-xl' }

function colorClass(prefix: string, hex: string): string {
  const token = HEX_TO_TOKEN[hex.toLowerCase()]
  return token ? `${prefix}-${token}` : `${prefix}-[${hex}]`
}

/**
 * Convert the inspector state into Tailwind utility classes (the builder's code
 * output). Known palette colours become named tokens (`bg-indigo-500`); custom
 * picks and off-scale sizes become arbitrary values (`bg-[#abc123]`, `px-[13px]`).
 */
export function buildClass(s: StyleState): string {
  const parts: string[] = []
  if (s.background) parts.push(colorClass('bg', s.background))
  if (s.color) parts.push(colorClass('text', s.color))
  if (s.borderWidth > 0) {
    parts.push(BORDER_W_CLASS[s.borderWidth] ?? `border-[${s.borderWidth}px]`)
    if (s.borderColor) parts.push(colorClass('border', s.borderColor))
  }
  if (s.radius > 0) parts.push(RADIUS_CLASS[s.radius] ?? `rounded-[${s.radius}px]`)
  if (s.paddingX > 0) parts.push(s.paddingX % 4 === 0 ? `px-${s.paddingX / 4}` : `px-[${s.paddingX}px]`)
  if (s.paddingY > 0) parts.push(s.paddingY % 4 === 0 ? `py-${s.paddingY / 4}` : `py-[${s.paddingY}px]`)
  if (s.fontSize > 0) parts.push(FONT_SIZE_CLASS[s.fontSize] ?? `text-[${s.fontSize}px]`)
  if (s.fontWeight && FONT_WEIGHT_CLASS[s.fontWeight]) parts.push(FONT_WEIGHT_CLASS[s.fontWeight])
  if (s.shadow && SHADOW_CLASS[s.shadow]) parts.push(SHADOW_CLASS[s.shadow])
  if (s.opacity < 100) parts.push(`opacity-[${s.opacity / 100}]`)
  return parts.join(' ')
}

/** Seed the Props panel from each control's default. */
export function defaultValues(entry: BuilderEntry): BuilderValues {
  const out: BuilderValues = {}
  for (const c of entry.controls) out[c.prop] = c.default
  return out
}

/** Generic JSX generator: each prop value → an attribute, custom style → a Tailwind `className`. */
export function genCode(name: string, controls: Control[], v: BuilderValues, cls = ''): string {
  const attrs: string[] = []
  let children = ''
  for (const c of controls) {
    const val = v[c.prop]
    if (c.prop === 'children') {
      children = typeof val === 'string' ? val : ''
      continue
    }
    if (c.kind === 'boolean') {
      if (val) attrs.push(c.prop)
      continue
    }
    if (c.kind === 'number') {
      attrs.push(`${c.prop}={${Number(val)}}`)
      continue
    }
    const text = typeof val === 'string' ? val : ''
    if (text !== '') attrs.push(`${c.prop}="${text}"`)
  }
  if (cls) attrs.push(`className="${cls}"`)
  const attrStr = attrs.length ? ` ${attrs.join(' ')}` : ''
  return children ? `<${name}${attrStr}>${children}</${name}>` : `<${name}${attrStr} />`
}

// Short casts from the untyped value bag (source is `unknown`, so the casts are safe).
const s = (v: unknown) => (typeof v === 'string' ? v : '')
const n = (v: unknown) => Number(v ?? 0)
const b = (v: unknown) => Boolean(v)

type Size = 'sm' | 'md' | 'lg'

/** Wrap a single component instance so the custom style applies as a frame around it. */
const frame = (style: CSSProperties, node: ReactNode) => (
  <div style={style} className="inline-block">
    {node}
  </div>
)

/** Generate the framed code: the single component wrapped in a styled div (when styled). */
function framedCode(jsx: string, cls: string): string {
  if (!cls) return jsx
  return `<div className="${cls}">\n  ${jsx.split('\n').join('\n  ')}\n</div>`
}

const CHART_DATA = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: 19 },
  { label: 'Mar', value: 9 },
  { label: 'Apr', value: 22 },
]

/** Pagination is always controlled, so the preview needs real page state to be interactive. */
function PaginationDemo({ style }: { style: CSSProperties }) {
  const [page, setPage] = useState(2)
  return frame(style, <Pagination page={page} count={5} onPageChange={setPage} />)
}

export const BUILDERS: BuilderEntry[] = [
  {
    id: 'button',
    code: 'Button',
    controls: [
      { prop: 'children', kind: 'text', label: { fa: 'متن', en: 'Text' }, default: 'Button' },
      { prop: 'variant', kind: 'select', label: { fa: 'واریانت', en: 'Variant' }, options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'], default: 'primary' },
      { prop: 'size', kind: 'select', label: { fa: 'اندازه', en: 'Size' }, options: ['sm', 'md', 'lg'], default: 'md' },
      { prop: 'disabled', kind: 'boolean', label: { fa: 'غیرفعال', en: 'Disabled' }, default: false },
    ],
    render: (v, style) => (
      <Button variant={s(v.variant) as 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'} size={s(v.size) as Size} disabled={b(v.disabled)} style={style}>
        {s(v.children)}
      </Button>
    ),
  },
  {
    id: 'badge',
    code: 'Badge',
    controls: [
      { prop: 'children', kind: 'text', label: { fa: 'متن', en: 'Text' }, default: 'Active' },
      { prop: 'variant', kind: 'select', label: { fa: 'واریانت', en: 'Variant' }, options: ['default', 'secondary', 'success', 'warning', 'destructive', 'outline'], default: 'success' },
      { prop: 'dot', kind: 'boolean', label: { fa: 'نقطهٔ وضعیت', en: 'Status dot' }, default: false },
    ],
    render: (v, style) => (
      <Badge variant={s(v.variant) as 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'} dot={b(v.dot)} style={style}>
        {s(v.children)}
      </Badge>
    ),
  },
  {
    id: 'alert',
    code: 'Alert',
    controls: [
      { prop: 'variant', kind: 'select', label: { fa: 'واریانت', en: 'Variant' }, options: ['info', 'success', 'warning', 'error'], default: 'success' },
      { prop: 'title', kind: 'text', label: { fa: 'عنوان', en: 'Title' }, default: 'Saved' },
      { prop: 'children', kind: 'text', label: { fa: 'متن', en: 'Body' }, default: 'Your changes were stored.' },
    ],
    render: (v, style) => (
      <div className="w-80">
        <Alert variant={s(v.variant) as 'info' | 'success' | 'warning' | 'error'} title={s(v.title)} style={style}>
          {s(v.children)}
        </Alert>
      </div>
    ),
  },
  {
    id: 'input',
    code: 'Input',
    controls: [
      { prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Email' },
      { prop: 'placeholder', kind: 'text', label: { fa: 'پلیس‌هولدر', en: 'Placeholder' }, default: 'you@example.com' },
      { prop: 'size', kind: 'select', label: { fa: 'اندازه', en: 'Size' }, options: ['sm', 'md', 'lg'], default: 'md' },
      { prop: 'error', kind: 'text', label: { fa: 'متنِ خطا', en: 'Error text' }, default: '' },
      { prop: 'disabled', kind: 'boolean', label: { fa: 'غیرفعال', en: 'Disabled' }, default: false },
    ],
    render: (v, style) => (
      <div className="w-64">
        <Input label={s(v.label)} placeholder={s(v.placeholder)} size={s(v.size) as Size} error={s(v.error) || undefined} disabled={b(v.disabled)} style={style} />
      </div>
    ),
  },
  {
    id: 'switch',
    code: 'Switch',
    controls: [
      { prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Wi-Fi' },
      { prop: 'size', kind: 'select', label: { fa: 'اندازه', en: 'Size' }, options: ['sm', 'md', 'lg'], default: 'md' },
      { prop: 'defaultChecked', kind: 'boolean', label: { fa: 'روشن', en: 'On' }, default: true },
      { prop: 'disabled', kind: 'boolean', label: { fa: 'غیرفعال', en: 'Disabled' }, default: false },
    ],
    render: (v, style) => <Switch label={s(v.label)} size={s(v.size) as Size} defaultChecked={b(v.defaultChecked)} disabled={b(v.disabled)} style={style} />,
  },
  {
    id: 'checkbox',
    code: 'Checkbox',
    controls: [
      { prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'I accept the terms' },
      { prop: 'defaultChecked', kind: 'boolean', label: { fa: 'تیک‌خورده', en: 'Checked' }, default: false },
      { prop: 'indeterminate', kind: 'boolean', label: { fa: 'نامعین', en: 'Indeterminate' }, default: false },
      { prop: 'disabled', kind: 'boolean', label: { fa: 'غیرفعال', en: 'Disabled' }, default: false },
    ],
    render: (v, style) => <Checkbox label={s(v.label)} defaultChecked={b(v.defaultChecked)} indeterminate={b(v.indeterminate)} disabled={b(v.disabled)} style={style} />,
  },
  {
    id: 'spinner',
    code: 'Spinner',
    controls: [
      { prop: 'size', kind: 'select', label: { fa: 'اندازه', en: 'Size' }, options: ['sm', 'md', 'lg'], default: 'md' },
      { prop: 'label', kind: 'text', label: { fa: 'لیبلِ دسترس‌پذیری', en: 'A11y label' }, default: 'Loading' },
    ],
    render: (v, style) => <Spinner size={s(v.size) as Size} label={s(v.label)} style={style} />,
  },
  {
    id: 'avatar',
    code: 'Avatar',
    controls: [
      { prop: 'fallback', kind: 'text', label: { fa: 'حروفِ اول', en: 'Initials' }, default: 'AL' },
      { prop: 'size', kind: 'select', label: { fa: 'اندازه', en: 'Size' }, options: ['sm', 'md', 'lg'], default: 'md' },
    ],
    render: (v, style) => <Avatar fallback={s(v.fallback)} size={s(v.size) as Size} style={style} />,
  },
  {
    id: 'progress',
    code: 'Progress',
    controls: [
      { prop: 'value', kind: 'number', label: { fa: 'مقدار', en: 'Value' }, min: 0, max: 100, step: 1, default: 66 },
      { prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Uploading' },
      { prop: 'showValue', kind: 'boolean', label: { fa: 'نمایشِ درصد', en: 'Show value' }, default: true },
    ],
    render: (v, style) => (
      <div className="w-64">
        <Progress value={n(v.value)} label={s(v.label) || undefined} showValue={b(v.showValue)} style={style} />
      </div>
    ),
  },
  {
    id: 'slider',
    code: 'Slider',
    controls: [
      { prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Volume' },
      { prop: 'min', kind: 'number', label: { fa: 'کمینه', en: 'Min' }, min: 0, max: 100, step: 1, default: 0 },
      { prop: 'max', kind: 'number', label: { fa: 'بیشینه', en: 'Max' }, min: 1, max: 200, step: 1, default: 100 },
      { prop: 'step', kind: 'number', label: { fa: 'گام', en: 'Step' }, min: 1, max: 50, step: 1, default: 1 },
      { prop: 'defaultValue', kind: 'number', label: { fa: 'مقدارِ اولیه', en: 'Default value' }, min: 0, max: 200, step: 1, default: 40 },
      { prop: 'showValue', kind: 'boolean', label: { fa: 'نمایشِ مقدار', en: 'Show value' }, default: true },
      { prop: 'disabled', kind: 'boolean', label: { fa: 'غیرفعال', en: 'Disabled' }, default: false },
    ],
    render: (v, style) => (
      <div className="w-64">
        <Slider label={s(v.label)} min={n(v.min)} max={n(v.max)} step={n(v.step)} defaultValue={n(v.defaultValue)} showValue={b(v.showValue)} disabled={b(v.disabled)} style={style} />
      </div>
    ),
  },
  {
    id: 'toggle',
    code: 'Toggle',
    controls: [
      { prop: 'children', kind: 'text', label: { fa: 'متن', en: 'Text' }, default: 'B' },
      { prop: 'variant', kind: 'select', label: { fa: 'واریانت', en: 'Variant' }, options: ['default', 'outline'], default: 'outline' },
      { prop: 'size', kind: 'select', label: { fa: 'اندازه', en: 'Size' }, options: ['sm', 'md', 'lg'], default: 'md' },
      { prop: 'defaultPressed', kind: 'boolean', label: { fa: 'فعال', en: 'Pressed' }, default: false },
    ],
    render: (v, style) => (
      <Toggle variant={s(v.variant) as 'default' | 'outline'} size={s(v.size) as Size} defaultPressed={b(v.defaultPressed)} style={style}>
        {s(v.children)}
      </Toggle>
    ),
  },
  {
    id: 'kbd',
    code: 'Kbd',
    controls: [{ prop: 'children', kind: 'text', label: { fa: 'کلید', en: 'Key' }, default: 'K' }],
    render: (v, style) => <Kbd style={style}>{s(v.children)}</Kbd>,
  },
  {
    id: 'separator',
    code: 'Separator',
    controls: [{ prop: 'orientation', kind: 'select', label: { fa: 'جهت', en: 'Orientation' }, options: ['horizontal', 'vertical'], default: 'horizontal' }],
    render: (v, style) =>
      s(v.orientation) === 'vertical' ? (
        <div className="flex h-6 items-center gap-3 text-sm text-slate-500 dark:text-zinc-400">
          <span>A</span>
          <Separator orientation="vertical" style={style} />
          <span>B</span>
        </div>
      ) : (
        <div className="w-48">
          <Separator style={style} />
        </div>
      ),
  },
  {
    id: 'tooltip',
    code: 'Tooltip',
    controls: [
      { prop: 'content', kind: 'text', label: { fa: 'متنِ راهنما', en: 'Tooltip text' }, default: 'A short hint' },
      { prop: 'side', kind: 'select', label: { fa: 'جهت', en: 'Side' }, options: ['top', 'right', 'bottom', 'left'], default: 'top' },
    ],
    render: (v, style) => (
      <Tooltip content={s(v.content)} side={s(v.side) as 'top' | 'right' | 'bottom' | 'left'}>
        <Button variant="outline" style={style}>
          Hover me
        </Button>
      </Tooltip>
    ),
    toCode: (v, sc) => `<Tooltip content="${s(v.content)}" side="${s(v.side)}">
  <Button variant="outline"${sc ? ` className="${sc}"` : ''}>Hover me</Button>
</Tooltip>`,
  },
  {
    id: 'empty',
    code: 'Empty',
    controls: [
      { prop: 'title', kind: 'text', label: { fa: 'عنوان', en: 'Title' }, default: 'No results' },
      { prop: 'description', kind: 'text', label: { fa: 'توضیح', en: 'Description' }, default: 'Try another search.' },
    ],
    render: (v, style) => (
      <div className="w-72">
        <Empty icon={<Icon name="search" size={22} />} title={s(v.title)} description={s(v.description)} style={style} />
      </div>
    ),
    toCode: (v, sc) => `<Empty
  icon={<Icon name="search" />}
  title="${s(v.title)}"
  description="${s(v.description)}"${sc ? `\n  className="${sc}"` : ''}
/>`,
  },

  // ---- single-instance entries (style applied as a frame around exactly one component) ----
  {
    id: 'textarea',
    code: 'Textarea',
    controls: [
      { prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Bio' },
      { prop: 'placeholder', kind: 'text', label: { fa: 'پلیس‌هولدر', en: 'Placeholder' }, default: 'Tell us…' },
    ],
    render: (v, style) => frame(style, <Textarea label={s(v.label)} placeholder={s(v.placeholder)} className="w-72" />),
    toCode: (v, sc) => framedCode(`<Textarea label="${s(v.label)}" placeholder="${s(v.placeholder)}" />`, sc),
  },
  {
    id: 'select',
    code: 'Select',
    controls: [{ prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Country' }],
    render: (v, style) =>
      frame(
        style,
        <div className="w-56">
          <Select label={s(v.label)} defaultValue="us">
            <option value="us">United States</option>
            <option value="de">Germany</option>
          </Select>
        </div>,
      ),
    toCode: (v, sc) => framedCode(`<Select label="${s(v.label)}">\n  <option value="us">United States</option>\n  <option value="de">Germany</option>\n</Select>`, sc),
  },
  {
    id: 'skeleton',
    code: 'Skeleton',
    controls: [],
    render: (_v, style) => frame(style, <Skeleton className="h-6 w-48" />),
    toCode: (_v, sc) => framedCode(`<Skeleton className="h-6 w-48" />`, sc),
  },
  {
    id: 'label',
    code: 'Label',
    controls: [{ prop: 'children', kind: 'text', label: { fa: 'متن', en: 'Text' }, default: 'Email address' }],
    render: (v, style) => frame(style, <Label>{s(v.children)}</Label>),
    toCode: (v, sc) => framedCode(`<Label>${s(v.children)}</Label>`, sc),
  },
  {
    id: 'aspect-ratio',
    code: 'AspectRatio',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <div className="w-64">
          <AspectRatio ratio={16 / 9}>
            <div className="grid h-full place-items-center bg-indigo-500 text-sm text-white">16 : 9</div>
          </AspectRatio>
        </div>,
      ),
    toCode: (_v, sc) => framedCode(`<AspectRatio ratio={16 / 9}>\n  <img className="size-full object-cover" src="/cover.jpg" alt="" />\n</AspectRatio>`, sc),
  },
  {
    id: 'accordion',
    code: 'Accordion',
    controls: [{ prop: 'title', kind: 'text', label: { fa: 'عنوان', en: 'Title' }, default: 'Is it accessible?' }],
    render: (v, style) =>
      frame(
        style,
        <div className="w-72">
          <Accordion type="single" defaultOpen="a" items={[{ id: 'a', title: s(v.title), content: 'Yes — it follows WAI-ARIA.' }]} />
        </div>,
      ),
    toCode: (v, sc) => framedCode(`<Accordion\n  type="single"\n  items={[{ id: 'a', title: '${s(v.title)}', content: '…' }]}\n/>`, sc),
  },
  {
    id: 'radio-group',
    code: 'RadioGroup',
    controls: [{ prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Billing plan' }],
    render: (v, style) =>
      frame(
        style,
        <RadioGroup label={s(v.label)} defaultValue="pro" options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]} />,
      ),
    toCode: (v, sc) => framedCode(`<RadioGroup\n  label="${s(v.label)}"\n  defaultValue="pro"\n  options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]}\n/>`, sc),
  },
  {
    id: 'form',
    code: 'Form',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <div className="w-64">
          <Form onSubmit={() => {}}>
            <Input name="email" label="Email" type="email" />
            <Button type="submit">Submit</Button>
          </Form>
        </div>,
      ),
    toCode: (_v, sc) => framedCode(`<Form onSubmit={(values) => console.log(values)}>\n  <Input name="email" label="Email" type="email" />\n  <Button type="submit">Submit</Button>\n</Form>`, sc),
  },
  {
    id: 'input-otp',
    code: 'InputOTP',
    controls: [],
    render: (_v, style) => frame(style, <InputOTP length={4} />),
    toCode: (_v, sc) => framedCode(`<InputOTP length={4} />`, sc),
  },
  {
    id: 'tabs',
    code: 'Tabs',
    controls: [{ prop: 'variant', kind: 'select', label: { fa: 'واریانت', en: 'Variant' }, options: ['underline', 'pill'], default: 'underline' }],
    render: (v, style) =>
      frame(
        style,
        <div className="w-72">
          <Tabs
            variant={s(v.variant) as 'underline' | 'pill'}
            defaultValue="a"
            items={[
              { value: 'a', label: 'Account', content: <p className="pt-2 text-sm">Account settings…</p> },
              { value: 'b', label: 'Password', content: <p className="pt-2 text-sm">Password settings…</p> },
            ]}
          />
        </div>,
      ),
    toCode: (v, sc) => framedCode(`<Tabs\n  variant="${s(v.variant)}"\n  items={[\n    { value: 'a', label: 'Account', content: <p>…</p> },\n    { value: 'b', label: 'Password', content: <p>…</p> },\n  ]}\n/>`, sc),
  },
  {
    id: 'card',
    code: 'Card',
    controls: [
      { prop: 'title', kind: 'text', label: { fa: 'عنوان', en: 'Title' }, default: 'Pro plan' },
      { prop: 'description', kind: 'text', label: { fa: 'توضیح', en: 'Description' }, default: 'Billed monthly' },
    ],
    render: (v, style) =>
      frame(
        style,
        <div className="w-64">
          <Card title={s(v.title)} description={s(v.description)}>
            <p>Access to every feature.</p>
          </Card>
        </div>,
      ),
    toCode: (v, sc) => framedCode(`<Card title="${s(v.title)}" description="${s(v.description)}">\n  <p>Access to every feature.</p>\n</Card>`, sc),
  },
  {
    id: 'carousel',
    code: 'Carousel',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <div className="w-72">
          <Carousel
            items={[
              <div key="1" className="grid h-32 place-items-center bg-indigo-500 text-white">1</div>,
              <div key="2" className="grid h-32 place-items-center bg-emerald-500 text-white">2</div>,
            ]}
          />
        </div>,
      ),
    toCode: (_v, sc) => framedCode(`<Carousel items={[<Slide1 />, <Slide2 />]} />`, sc),
  },
  {
    id: 'breadcrumb',
    code: 'Breadcrumb',
    controls: [],
    render: (_v, style) => frame(style, <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Library', href: '#' }, { label: 'Data' }]} />),
    toCode: (_v, sc) => framedCode(`<Breadcrumb items={[\n  { label: 'Home', href: '/' },\n  { label: 'Library', href: '/library' },\n  { label: 'Data' },\n]} />`, sc),
  },
  {
    id: 'toggle-group',
    code: 'ToggleGroup',
    controls: [],
    render: (_v, style) =>
      frame(style, <ToggleGroup defaultValue="center" items={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]} />),
    toCode: (_v, sc) => framedCode(`<ToggleGroup\n  type="single"\n  defaultValue="center"\n  items={[\n    { value: 'left', label: 'Left' },\n    { value: 'center', label: 'Center' },\n    { value: 'right', label: 'Right' },\n  ]}\n/>`, sc),
  },
  {
    id: 'button-group',
    code: 'ButtonGroup',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <ButtonGroup>
          <Button variant="outline">Day</Button>
          <Button variant="outline">Week</Button>
          <Button variant="outline">Month</Button>
        </ButtonGroup>,
      ),
    toCode: (_v, sc) => framedCode(`<ButtonGroup>\n  <Button variant="outline">Day</Button>\n  <Button variant="outline">Week</Button>\n  <Button variant="outline">Month</Button>\n</ButtonGroup>`, sc),
  },
  {
    id: 'input-group',
    code: 'InputGroup',
    controls: [{ prop: 'placeholder', kind: 'text', label: { fa: 'پلیس‌هولدر', en: 'Placeholder' }, default: 'Search…' }],
    render: (v, style) => frame(style, <div className="w-64"><InputGroup leading={<Icon name="search" size={16} />} placeholder={s(v.placeholder)} /></div>),
    toCode: (v, sc) => framedCode(`<InputGroup leading={<Icon name="search" />} placeholder="${s(v.placeholder)}" />`, sc),
  },
  {
    id: 'item',
    code: 'Item',
    controls: [
      { prop: 'title', kind: 'text', label: { fa: 'عنوان', en: 'Title' }, default: 'Ada Lovelace' },
      { prop: 'description', kind: 'text', label: { fa: 'توضیح', en: 'Description' }, default: 'Engineer' },
    ],
    render: (v, style) => frame(style, <div className="w-64"><Item title={s(v.title)} description={s(v.description)} /></div>),
    toCode: (v, sc) => framedCode(`<Item title="${s(v.title)}" description="${s(v.description)}" />`, sc),
  },
  {
    id: 'field',
    code: 'Field',
    controls: [
      { prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Email' },
      { prop: 'error', kind: 'text', label: { fa: 'خطا', en: 'Error' }, default: '' },
    ],
    render: (v, style) =>
      frame(
        style,
        <div className="w-64">
          <Field label={s(v.label)} error={s(v.error) || undefined}>
            <Input type="email" />
          </Field>
        </div>,
      ),
    toCode: (v, sc) => framedCode(`<Field label="${s(v.label)}"${s(v.error) ? ` error="${s(v.error)}"` : ''}>\n  <Input type="email" />\n</Field>`, sc),
  },
  {
    id: 'pagination',
    code: 'Pagination',
    controls: [],
    render: (_v, style) => <PaginationDemo style={style} />,
    toCode: (_v, sc) => framedCode(`<Pagination page={page} count={12} onPageChange={setPage} />`, sc),
  },
  {
    id: 'table',
    code: 'Table',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <div className="w-80">
          <Table columns={[{ key: 'name', header: 'Name' }, { key: 'role', header: 'Role' }]} data={[{ name: 'Ada', role: 'Engineer' }, { name: 'Linus', role: 'Maintainer' }]} />
        </div>,
      ),
    toCode: (_v, sc) => framedCode(`<Table\n  columns={[{ key: 'name', header: 'Name' }, { key: 'role', header: 'Role' }]}\n  data={rows}\n/>`, sc),
  },
  {
    id: 'scroll-area',
    code: 'ScrollArea',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <ScrollArea className="h-32 w-56 rounded-lg border border-slate-200 p-3 dark:border-zinc-800">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            Scrollable content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </ScrollArea>,
      ),
    toCode: (_v, sc) => framedCode(`<ScrollArea className="h-56">\n  {/* long content */}\n</ScrollArea>`, sc),
  },
  {
    id: 'collapsible',
    code: 'Collapsible',
    controls: [{ prop: 'trigger', kind: 'text', label: { fa: 'تریگر', en: 'Trigger' }, default: 'Order details' }],
    render: (v, style) =>
      frame(
        style,
        <div className="w-64">
          <Collapsible trigger={s(v.trigger)} defaultOpen>
            Shipped on June 4.
          </Collapsible>
        </div>,
      ),
    toCode: (v, sc) => framedCode(`<Collapsible trigger="${s(v.trigger)}" defaultOpen>\n  Shipped on June 4.\n</Collapsible>`, sc),
  },
  {
    id: 'popover',
    code: 'Popover',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <Popover trigger="Open">
          <p className="text-sm">Floating content</p>
        </Popover>,
      ),
    toCode: (_v, sc) => framedCode(`<Popover trigger="Open">\n  <p>Floating content</p>\n</Popover>`, sc),
  },
  {
    id: 'hover-card',
    code: 'HoverCard',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <HoverCard trigger={<button className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400">@ada</button>}>
          <p className="text-sm">Ada Lovelace — the first programmer.</p>
        </HoverCard>,
      ),
    toCode: (_v, sc) => framedCode(`<HoverCard trigger={<button>@ada</button>}>\n  <Profile />\n</HoverCard>`, sc),
  },
  {
    id: 'context-menu',
    code: 'ContextMenu',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <ContextMenu items={[{ label: 'Copy' }, { label: 'Delete' }]}>
          <div className="grid h-24 w-56 place-items-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-zinc-700 dark:text-zinc-400">Right-click me</div>
        </ContextMenu>,
      ),
    toCode: (_v, sc) => framedCode(`<ContextMenu items={[{ label: 'Copy', onSelect: () => {} }]}>\n  <div>Right-click me</div>\n</ContextMenu>`, sc),
  },
  {
    id: 'dropdown-menu',
    code: 'DropdownMenu',
    controls: [{ prop: 'label', kind: 'text', label: { fa: 'لیبل', en: 'Label' }, default: 'Actions' }],
    render: (v, style) => frame(style, <DropdownMenu label={s(v.label)} items={[{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Delete' }]} />),
    toCode: (v, sc) => framedCode(`<DropdownMenu\n  label="${s(v.label)}"\n  items={[{ label: 'Edit', onSelect: () => {} }, { label: 'Delete', onSelect: () => {} }]}\n/>`, sc),
  },
  {
    id: 'calendar',
    code: 'Calendar',
    controls: [],
    render: (_v, style) => frame(style, <Calendar />),
    toCode: (_v, sc) => framedCode(`<Calendar value={date} onChange={setDate} />`, sc),
  },
  {
    id: 'combobox',
    code: 'Combobox',
    controls: [],
    render: (_v, style) => frame(style, <div className="w-56"><Combobox options={[{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }]} placeholder="Pick…" /></div>),
    toCode: (_v, sc) => framedCode(`<Combobox\n  options={[{ value: 'react', label: 'React' }]}\n  value={value}\n  onChange={setValue}\n/>`, sc),
  },
  {
    id: 'command',
    code: 'Command',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <div className="w-72">
          <Command items={[{ value: 'new', label: 'New file', group: 'File' }, { value: 'open', label: 'Open file', group: 'File' }, { value: 'settings', label: 'Settings', group: 'General' }]} />
        </div>,
      ),
    toCode: (_v, sc) => framedCode(`<Command items={[\n  { value: 'new', label: 'New file', group: 'File', onSelect: () => {} },\n]} />`, sc),
  },
  {
    id: 'menubar',
    code: 'Menubar',
    controls: [],
    render: (_v, style) =>
      frame(style, <Menubar menus={[{ label: 'File', items: [{ label: 'New' }, { label: 'Open' }] }, { label: 'Edit', items: [{ label: 'Undo' }] }]} />),
    toCode: (_v, sc) => framedCode(`<Menubar menus={[\n  { label: 'File', items: [{ label: 'New', onSelect: () => {} }] },\n]} />`, sc),
  },
  {
    id: 'navigation-menu',
    code: 'NavigationMenu',
    controls: [],
    render: (_v, style) =>
      frame(style, <NavigationMenu items={[{ label: 'Products', content: [{ label: 'Analytics', href: '#', description: 'Track metrics' }] }, { label: 'Pricing', href: '#' }]} />),
    toCode: (_v, sc) => framedCode(`<NavigationMenu items={[\n  { label: 'Products', content: [{ label: 'Analytics', href: '/a' }] },\n  { label: 'Pricing', href: '/pricing' },\n]} />`, sc),
  },
  {
    id: 'sidebar',
    code: 'Sidebar',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <div className="h-72 w-60 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800">
          <Sidebar
            header={<span className="text-base font-bold">UI Kit</span>}
            sections={[{ label: 'Main', items: [{ label: 'Dashboard', href: '#', active: true }, { label: 'Search', href: '#' }] }]}
          />
        </div>,
      ),
    toCode: (_v, sc) => framedCode(`<Sidebar\n  header={<Brand />}\n  sections={[{ label: 'Main', items: [{ label: 'Dashboard', active: true }] }]}\n/>`, sc),
  },
  {
    id: 'resizable',
    code: 'Resizable',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <Resizable
          className="h-40 w-80"
          defaultSize={40}
          first={<div className="p-3 text-sm text-slate-600 dark:text-zinc-400">Nav</div>}
          second={<div className="p-3 text-sm text-slate-600 dark:text-zinc-400">Content</div>}
        />,
      ),
    toCode: (_v, sc) => framedCode(`<Resizable first={<Nav />} second={<Content />} defaultSize={35} />`, sc),
  },
  {
    id: 'data-table',
    code: 'DataTable',
    controls: [],
    render: (_v, style) =>
      frame(
        style,
        <div className="w-80">
          <DataTable
            columns={[{ key: 'name', header: 'Name', sortable: true }, { key: 'age', header: 'Age', sortable: true, align: 'end' }]}
            data={[{ name: 'Ada', age: 30 }, { name: 'Linus', age: 35 }, { name: 'Grace', age: 28 }]}
          />
        </div>,
      ),
    toCode: (_v, sc) => framedCode(`<DataTable\n  columns={[{ key: 'name', header: 'Name', sortable: true }]}\n  data={rows}\n  pageSize={10}\n/>`, sc),
  },
  {
    id: 'chart',
    code: 'Chart',
    controls: [{ prop: 'type', kind: 'select', label: { fa: 'نوع', en: 'Type' }, options: ['bar', 'line'], default: 'bar' }],
    render: (v, style) => frame(style, <div className="w-80"><Chart type={s(v.type) as 'bar' | 'line'} data={CHART_DATA} height={180} /></div>),
    toCode: (v, sc) => framedCode(`<Chart\n  type="${s(v.type)}"\n  data={[{ label: 'Jan', value: 12 }, { label: 'Feb', value: 19 }]}\n/>`, sc),
  },
  {
    id: 'datepicker-jalali',
    code: 'DatePickerJalali',
    controls: [],
    render: (_v, style) => frame(style, <div className="w-56"><DatePickerJalali label="تاریخ" /></div>),
    toCode: (_v, sc) => framedCode(`<DatePickerJalali label="تاریخ تولد" value={date} onChange={setDate} />`, sc),
  },
]
