import { useEffect, useState, useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useLang } from '../i18n'
import type { Lang } from '../i18n'
import { Icon } from '../components/Icon'
import { CodeBlock } from './CodeBlock'
import { BUILDERS, defaultValues, buildStyle, buildClass, genCode, DEFAULT_STYLE, PALETTE } from '../data/builder'
import type { BuilderValues, StyleState, Control } from '../data/builder'
import { HOOKS } from '../data/hooks'
import type { HookEntry } from '../data/hooks'
import { COMPONENTS } from '../data/registry'
import type { ComponentEntry } from '../data/registry'
import { Input } from '../components/ui/Input/Input'
import { Switch } from '../components/ui/Switch/Switch'
import { Select } from '../components/ui/Select/Select'
import { Slider } from '../components/ui/Slider/Slider'
import { ImageCompressor } from '../components/ui/ImageCompressor/ImageCompressor'
import type { CompressorLabels } from '../components/ui/ImageCompressor/ImageCompressor'

type Theme = 'light' | 'dark'
type Section = 'components' | 'builder' | 'hooks' | 'tools'

const SHELL: Record<Lang, Record<string, string>> = {
  fa: {
    brand: 'کیت رابط',
    brandSub: '۵۶ کامپوننت + هوک + سازنده',
    components: 'کامپوننت‌ها',
    builder: 'سازنده',
    hooks: 'هوک‌ها',
    tools: 'ابزار',
    toolsTitle: 'فشرده‌سازِ تصویر (WebP)',
    toolsSub: 'چند عکس را هم‌زمان بکش‌و‌رها کن؛ همه در مرورگرِ خودت به WebP فشرده می‌شوند — بدون آپلود و بدون افتِ محسوسِ کیفیت.',
    preview: 'پیش‌نمایش',
    usage: 'فراخوانی',
    download: 'دانلود سورس',
    search: 'جست‌وجو…',
    noResults: 'چیزی پیدا نشد',
    pick: 'انتخاب کامپوننت',
    themeToggle: 'تغییر حالت تاریک و روشن',
    langToggle: 'تغییر زبان به انگلیسی',
    langLabel: 'EN',
    hooksTitle: 'هوک‌های کاربردی',
    hooksSub: 'هوک‌های پرکاربرد و اینترپرایسی — کپی یا دانلود کن.',
    builderTitle: 'کامپوننت‌ساز',
    builderSub: 'یک کامپوننت را انتخاب کن، استایل و پراپ‌هایش را عینِ فیگما تنظیم کن و کدِ نهاییِ ری‌اکت را بگیر.',
    builderProps: 'پراپ‌ها',
    builderStyle: 'استایل',
    builderPreview: 'پیش‌نمایشِ زنده',
    builderCode: 'کدِ تولیدشده',
    builderReset: 'بازنشانی',
    footer: 'ساخته‌شده با نیتیو HTML، Tailwind و دسترس‌پذیری.',
  },
  en: {
    brand: 'UI Kit',
    brandSub: '56 components + hooks + builder',
    components: 'Components',
    builder: 'Builder',
    hooks: 'Hooks',
    tools: 'Tools',
    toolsTitle: 'Image compressor (WebP)',
    toolsSub: 'Drag in many images at once; they are compressed to WebP right in your browser — no upload, no visible quality loss.',
    preview: 'Preview',
    usage: 'Usage',
    download: 'Download source',
    search: 'Search…',
    noResults: 'No matches',
    pick: 'Pick a component',
    themeToggle: 'Toggle dark mode',
    langToggle: 'Switch language to Persian',
    langLabel: 'فا',
    hooksTitle: 'Essential hooks',
    hooksSub: 'Production-grade hooks every app needs — copy or download.',
    builderTitle: 'Component builder',
    builderSub: 'Pick a component, tweak its style and props Figma-style, and grab the final React code.',
    builderProps: 'Props',
    builderStyle: 'Style',
    builderPreview: 'Live preview',
    builderCode: 'Generated code',
    builderReset: 'Reset',
    footer: 'Built on native HTML, Tailwind and accessibility.',
  },
}

const STYLE_LABELS: Record<string, Record<Lang, string>> = {
  background: { fa: 'پس‌زمینه', en: 'Background' },
  color: { fa: 'رنگِ متن', en: 'Text color' },
  borderColor: { fa: 'رنگِ حاشیه', en: 'Border color' },
  borderWidth: { fa: 'ضخامتِ حاشیه', en: 'Border width' },
  radius: { fa: 'گردیِ گوشه', en: 'Corner radius' },
  paddingX: { fa: 'پدینگِ افقی', en: 'Padding X' },
  paddingY: { fa: 'پدینگِ عمودی', en: 'Padding Y' },
  fontSize: { fa: 'اندازهٔ فونت', en: 'Font size' },
  fontWeight: { fa: 'وزنِ فونت', en: 'Font weight' },
  shadow: { fa: 'سایه', en: 'Shadow' },
  opacity: { fa: 'شفافیت', en: 'Opacity' },
}

const STYLE_GROUPS: Record<string, Record<Lang, string>> = {
  colors: { fa: 'رنگ‌ها', en: 'Colors' },
  layout: { fa: 'ابعاد و فاصله', en: 'Sizing & spacing' },
  type: { fa: 'تایپوگرافی', en: 'Typography' },
  effects: { fa: 'افکت‌ها', en: 'Effects' },
}

function useTheme(): readonly [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  return [theme, toggle] as const
}

/** A red diagonal slash on white — the universal "no colour / transparent" affordance. */
const NONE_SWATCH: CSSProperties = {
  backgroundColor: '#fff',
  backgroundImage: 'linear-gradient(to top right, transparent calc(50% - 1px), #ef4444, transparent calc(50% + 1px))',
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const isNone = !value
  const swatchRing = 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-black/5 bg-white/60 py-0.5 ps-1 pe-1.5 dark:border-white/10 dark:bg-white/5">
          <span className="size-3.5 rounded-[4px] border border-black/10 dark:border-white/20" style={isNone ? NONE_SWATCH : { backgroundColor: value }} />
          <span className="font-mono text-[10px] uppercase text-zinc-400">{value || 'none'}</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PALETTE.map((swatch) => {
          const selected = value.toLowerCase() === swatch.toLowerCase()
          return (
            <button
              key={swatch}
              type="button"
              title={swatch}
              onClick={() => onChange(swatch)}
              style={{ backgroundColor: swatch }}
              className={twMerge('grid size-6 place-items-center rounded-md border border-black/10 transition-transform hover:scale-110 dark:border-white/15', selected && swatchRing)}
            >
              {selected ? <Icon name="check" size={12} className="text-white mix-blend-difference" /> : null}
            </button>
          )
        })}
        <button
          type="button"
          title="none"
          aria-label="none"
          onClick={() => onChange('')}
          style={NONE_SWATCH}
          className={twMerge('size-6 rounded-md border border-black/10 transition-transform hover:scale-110 dark:border-white/15', isNone && swatchRing)}
        />
        <label
          title="custom"
          className="relative grid size-6 cursor-pointer place-items-center overflow-hidden rounded-md border border-black/10 bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#06b6d4,#6366f1,#d946ef,#ef4444)] transition-transform hover:scale-110 dark:border-white/15"
        >
          <span className="grid size-3.5 place-items-center rounded-full bg-white/90 text-[11px] font-bold leading-none text-zinc-700 shadow-sm">+</span>
          <input
            type="color"
            aria-label="custom color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>
    </div>
  )
}

/** A titled cluster of inspector fields. */
function StyleGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{title}</span>
      {children}
    </div>
  )
}

function StylePanel({ style, setStyle, lang }: { style: StyleState; setStyle: (updater: (prev: StyleState) => StyleState) => void; lang: Lang }) {
  const L = (key: keyof typeof STYLE_LABELS) => STYLE_LABELS[key][lang]
  const G = (key: keyof typeof STYLE_GROUPS) => STYLE_GROUPS[key][lang]
  const set = (patch: Partial<StyleState>) => setStyle((prev) => ({ ...prev, ...patch }))

  return (
    <div className="flex flex-col gap-5">
      <StyleGroup title={G('colors')}>
        <ColorField label={L('background')} value={style.background} onChange={(v) => set({ background: v })} />
        <ColorField label={L('color')} value={style.color} onChange={(v) => set({ color: v })} />
        <ColorField label={L('borderColor')} value={style.borderColor} onChange={(v) => set({ borderColor: v })} />
      </StyleGroup>

      <StyleGroup title={G('layout')}>
        <Slider label={L('borderWidth')} showValue min={0} max={8} step={1} value={style.borderWidth} onChange={(e) => set({ borderWidth: Number(e.target.value) })} />
        <Slider label={L('radius')} showValue min={0} max={40} step={1} value={style.radius} onChange={(e) => set({ radius: Number(e.target.value) })} />
        <Slider label={L('paddingX')} showValue min={0} max={64} step={1} value={style.paddingX} onChange={(e) => set({ paddingX: Number(e.target.value) })} />
        <Slider label={L('paddingY')} showValue min={0} max={64} step={1} value={style.paddingY} onChange={(e) => set({ paddingY: Number(e.target.value) })} />
      </StyleGroup>

      <StyleGroup title={G('type')}>
        <Slider label={L('fontSize')} showValue min={0} max={36} step={1} value={style.fontSize} onChange={(e) => set({ fontSize: Number(e.target.value) })} />
        <Select label={L('fontWeight')} value={style.fontWeight} onChange={(e) => set({ fontWeight: e.target.value })}>
          <option value="">—</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
        </Select>
      </StyleGroup>

      <StyleGroup title={G('effects')}>
        <Select label={L('shadow')} value={style.shadow} onChange={(e) => set({ shadow: e.target.value })}>
          <option value="">none</option>
          <option value="sm">sm</option>
          <option value="md">md</option>
          <option value="lg">lg</option>
          <option value="xl">xl</option>
        </Select>
        <Slider label={L('opacity')} showValue min={0} max={100} step={1} value={style.opacity} onChange={(e) => set({ opacity: Number(e.target.value) })} />
      </StyleGroup>
    </div>
  )
}

/** Save a string to a downloadable file. */
function downloadFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/** A shadcn-style example row: a label header with a chevron that expands its code. */
function CollapsibleCode({ label, code, defaultOpen = false }: { label: string; code: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-xl border border-white/60 bg-white/60 dark:border-white/10 dark:bg-zinc-900/50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-start text-sm font-medium text-zinc-700 transition-colors hover:bg-white dark:text-zinc-200 dark:hover:bg-white/5"
      >
        <span>{label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={twMerge('shrink-0 text-zinc-400 transition-transform', open && 'transform-[rotate(180deg)]')}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? <CodeBlock code={code} /> : null}
    </div>
  )
}

/** One component's page: header + a live preview, then each usage variant's code (collapsible). */
function ComponentDetail({ entry, lang }: { entry: ComponentEntry; lang: Lang }) {
  const t = SHELL[lang]
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{entry.name[lang]}</h2>
            <span className="shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 dark:bg-white/10 dark:text-zinc-400">{entry.code}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{entry.description[lang]}</p>
        </div>
        <button
          type="button"
          onClick={() => downloadFile(entry.file, entry.source)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <Icon name="download" size={14} /> {t.download}
        </button>
      </div>

      {/* Live preview */}
      <div className="grid min-h-52 place-items-center rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10 dark:border-white/10 dark:bg-zinc-900/60">
        {entry.render()}
      </div>

      {/* Usage variants — preview above, each code collapsible */}
      <div className="flex flex-col gap-2">
        <span className="px-0.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">{t.usage}</span>
        {entry.usage.map((ex, i) => (
          <CollapsibleCode key={i} label={ex.label[lang]} code={ex.code} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  )
}

/** A search rail + single-item detail layout, shared by Components and Hooks. */
function RailLayout({ rail, mobile, children }: { rail: ReactNode; mobile: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
      <div className="lg:hidden">{mobile}</div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col gap-3">{rail}</div>
      </aside>
      {children}
    </div>
  )
}

function ComponentsView({ lang }: { lang: Lang }) {
  const t = SHELL[lang]
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(COMPONENTS[0].id)
  const active = COMPONENTS.find((c) => c.id === activeId) ?? COMPONENTS[0]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMPONENTS
    return COMPONENTS.filter((c) => c.code.toLowerCase().includes(q) || c.name.en.toLowerCase().includes(q) || c.name.fa.includes(query.trim()))
  }, [query])

  return (
    <RailLayout
      mobile={
        <Select aria-label={t.pick} value={activeId} onChange={(e) => setActiveId(e.target.value)}>
          {COMPONENTS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name[lang]} — {c.code}
            </option>
          ))}
        </Select>
      }
      rail={
        <>
          <Input startIcon={<Icon name="search" size={16} />} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} />
          <div className="flex-1 space-y-0.5 overflow-y-auto rounded-2xl border border-white/60 bg-white/60 p-2 dark:border-white/10 dark:bg-zinc-900/50">
            {filtered.length === 0 ? (
              <p className="p-4 text-center text-sm text-zinc-400">{t.noResults}</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  aria-current={c.id === activeId ? 'true' : undefined}
                  className={twMerge(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                    c.id === activeId
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white',
                  )}
                >
                  <span className="truncate">{c.name[lang]}</span>
                  <span className={twMerge('shrink-0 font-mono text-[10px]', c.id === activeId ? 'text-white/70' : 'text-zinc-400')}>{c.code}</span>
                </button>
              ))
            )}
          </div>
        </>
      }
    >
      <ComponentDetail entry={active} lang={lang} />
    </RailLayout>
  )
}

function HooksView({ lang }: { lang: Lang }) {
  const [activeId, setActiveId] = useState(HOOKS[0].id)
  const active = HOOKS.find((h) => h.id === activeId) ?? HOOKS[0]
  const groups = useMemo(() => {
    const map = new Map<string, HookEntry[]>()
    for (const hook of HOOKS) {
      const key = hook.category[lang]
      const arr = map.get(key) ?? []
      arr.push(hook)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [lang])

  return (
    <RailLayout
      mobile={
        <Select value={activeId} onChange={(e) => setActiveId(e.target.value)}>
          {HOOKS.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name} — {h.category[lang]}
            </option>
          ))}
        </Select>
      }
      rail={
        <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/60 bg-white/60 p-3 dark:border-white/10 dark:bg-zinc-900/50">
          {groups.map(([category, hooks]) => (
            <div key={category} className="flex flex-col gap-1">
              <span className="px-2 text-[10px] font-semibold uppercase tracking-wide text-indigo-500">{category}</span>
              {hooks.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveId(h.id)}
                  aria-current={h.id === activeId ? 'true' : undefined}
                  className={twMerge(
                    'rounded-lg px-3 py-2 text-start font-mono text-xs transition-colors',
                    h.id === activeId ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white',
                  )}
                >
                  {h.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      }
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-300">{active.name}</h2>
            <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-500 dark:bg-white/10 dark:text-zinc-400">{active.category[lang]}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{active.description[lang]}</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <CodeBlock code={active.code} filename={active.file} />
        </div>
      </div>
    </RailLayout>
  )
}

function ControlField({ control, value, onChange, lang }: { control: Control; value: unknown; onChange: (value: unknown) => void; lang: Lang }) {
  const label = control.label[lang]
  if (control.kind === 'boolean') {
    return <Switch label={label} checked={Boolean(value)} onCheckedChange={onChange} />
  }
  if (control.kind === 'select') {
    return (
      <Select label={label} value={String(value)} onChange={(e) => onChange(e.target.value)}>
        {control.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    )
  }
  if (control.kind === 'number') {
    return <Slider label={label} showValue min={control.min} max={control.max} step={control.step} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))} />
  }
  return <Input label={label} value={String(value)} onChange={(e) => onChange(e.target.value)} />
}

function BuilderView({ lang }: { lang: Lang }) {
  const t = SHELL[lang]
  const [activeIdx, setActiveIdx] = useState(0)
  const [values, setValues] = useState<BuilderValues>(() => defaultValues(BUILDERS[0]))
  const [style, setStyle] = useState<StyleState>(DEFAULT_STYLE)
  const [tab, setTab] = useState<'props' | 'style'>('props')

  const [query, setQuery] = useState('')
  const builder = BUILDERS[activeIdx]
  const hasProps = builder.controls.length > 0
  const cssStyle = buildStyle(style)
  const cls = buildClass(style)
  const preview = builder.render(values, cssStyle)
  // Remount the preview when prop values change so uncontrolled props (defaultChecked,
  // defaultPressed, defaultValue, indeterminate…) re-apply — otherwise toggling them in
  // the inspector silently no-ops, since React only reads `default*` props at mount.
  const previewKey = `${builder.id}:${JSON.stringify(values)}`
  const code = builder.toCode ? builder.toCode(values, cls) : genCode(builder.code, builder.controls, values, cls)
  const setValue = (prop: string, value: unknown) => setValues((prev) => ({ ...prev, [prop]: value }))

  /** A friendly, localized name for a builder (falls back to its component code). */
  const nameFor = (b: (typeof BUILDERS)[number]) => COMPONENTS.find((c) => c.id === b.id)?.name[lang] ?? b.code

  const filteredBuilders = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return BUILDERS
    const raw = query.trim()
    return BUILDERS.filter((b) => {
      const entry = COMPONENTS.find((c) => c.id === b.id)
      return b.code.toLowerCase().includes(q) || (entry ? entry.name.en.toLowerCase().includes(q) || entry.name.fa.includes(raw) : false)
    })
  }, [query])

  function selectBuilder(i: number) {
    setActiveIdx(i)
    setValues(defaultValues(BUILDERS[i]))
    setStyle(DEFAULT_STYLE)
    setTab(BUILDERS[i].controls.length > 0 ? 'props' : 'style')
  }

  function reset() {
    setValues(defaultValues(builder))
    setStyle(DEFAULT_STYLE)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{t.builderTitle}</h2>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">{t.builderSub}</p>
      </div>

      {/* Mobile picker — a simple select; the desktop rail handles the rest */}
      <div className="lg:hidden">
        <Select aria-label={t.pick} value={String(activeIdx)} onChange={(e) => selectBuilder(Number(e.target.value))}>
          {BUILDERS.map((b, i) => (
            <option key={b.id} value={i}>
              {nameFor(b)} — {b.code}
            </option>
          ))}
        </Select>
      </div>

      {/* min-w-0 on the canvas track (via minmax) keeps the wide code block from
          shoving the inspector off-screen. */}
      <div className="grid gap-5 lg:grid-cols-[13.5rem_minmax(0,1fr)_17rem]">
        {/* Picker rail (desktop) */}
        <aside className="hidden lg:flex lg:flex-col lg:gap-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
          <Input startIcon={<Icon name="search" size={16} />} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} />
          <div className="flex-1 space-y-0.5 overflow-y-auto rounded-2xl border border-white/60 bg-white/60 p-2 dark:border-white/10 dark:bg-zinc-900/50">
            {filteredBuilders.length === 0 ? (
              <p className="p-4 text-center text-sm text-zinc-400">{t.noResults}</p>
            ) : (
              filteredBuilders.map((b) => {
                const i = BUILDERS.indexOf(b)
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => selectBuilder(i)}
                    aria-current={i === activeIdx ? 'true' : undefined}
                    className={twMerge(
                      'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                      i === activeIdx
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white',
                    )}
                  >
                    <span className="truncate">{nameFor(b)}</span>
                    <span className={twMerge('shrink-0 font-mono text-[10px]', i === activeIdx ? 'text-white/70' : 'text-zinc-400')}>{b.code}</span>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Canvas + generated code */}
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{t.builderPreview}</span>
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 dark:bg-white/10 dark:text-zinc-400">{builder.code}</span>
            </div>
            <div className="grid min-h-64 place-items-center overflow-hidden rounded-2xl border border-white/60 bg-zinc-50 bg-[radial-gradient(circle,rgba(99,102,241,0.12)_1px,transparent_1px)] bg-[size:18px_18px] p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900 dark:bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)]">
              <div key={previewKey} className="contents">
                {preview}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">{t.builderCode}</span>
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-sm">
              <CodeBlock code={code} />
            </div>
          </div>
        </div>

        {/* Inspector */}
        <aside className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/60 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <div className="flex items-center justify-between gap-2">
            {hasProps ? (
              <div className="inline-flex items-center gap-1 rounded-lg border border-white/50 bg-white/50 p-1 dark:border-white/10 dark:bg-white/5">
                {(['props', 'style'] as const).map((tb) => (
                  <button
                    key={tb}
                    type="button"
                    onClick={() => setTab(tb)}
                    aria-current={tab === tb ? 'true' : undefined}
                    className={twMerge(
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                      tab === tb ? 'bg-white text-indigo-700 shadow-sm dark:bg-white/15 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
                    )}
                  >
                    {tb === 'props' ? t.builderProps : t.builderStyle}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-xs font-semibold uppercase text-zinc-400">{t.builderStyle}</span>
            )}
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-300"
            >
              {t.builderReset}
            </button>
          </div>

          {hasProps && tab === 'props' ? (
            <div className="flex flex-col gap-4">
              {builder.controls.map((control) => (
                <ControlField key={control.prop} control={control} value={values[control.prop]} onChange={(value) => setValue(control.prop, value)} lang={lang} />
              ))}
            </div>
          ) : (
            <StylePanel style={style} setStyle={setStyle} lang={lang} />
          )}
        </aside>
      </div>
    </div>
  )
}

const COMPRESSOR_LABELS: Record<Lang, CompressorLabels> = {
  fa: {
    drop: 'عکس‌ها را اینجا رها کن',
    hint: 'PNG، JPG، GIF — در مرورگرِ خودت به WebP فشرده می‌شوند',
    browse: 'انتخابِ فایل',
    quality: 'کیفیت',
    maxWidth: 'حداکثر عرض (px)',
    original: 'مجموعِ صرفه‌جویی',
    keep: 'اصلی',
    download: 'دانلود',
    downloadAll: 'دانلودِ همه',
    clear: 'پاک‌کردن',
    saved: 'کم‌تر',
    images: 'تصویر',
    working: 'در حال فشرده‌سازی…',
  },
  en: {
    drop: 'Drop images here',
    hint: 'PNG, JPG, GIF — compressed to WebP, in your browser',
    browse: 'Choose files',
    quality: 'Quality',
    maxWidth: 'Max width (px)',
    original: 'Total saved',
    keep: 'original',
    download: 'Download',
    downloadAll: 'Download all',
    clear: 'Clear',
    saved: 'saved',
    images: 'images',
    working: 'Compressing…',
  },
}

function ToolsView({ lang }: { lang: Lang }) {
  const t = SHELL[lang]
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">{t.toolsTitle}</h2>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">{t.toolsSub}</p>
      </div>
      <div className="rounded-2xl border border-white/60 bg-white/70 p-4 sm:p-6 dark:border-white/10 dark:bg-zinc-900/60">
        <ImageCompressor labels={COMPRESSOR_LABELS[lang]} />
      </div>
    </div>
  )
}

function Dashboard() {
  const [section, setSection] = useState<Section>('components')
  const [theme, toggleTheme] = useTheme()
  const { lang, toggle: toggleLang } = useLang()
  const t = SHELL[lang]

  return (
    <div className="relative min-h-screen bg-linear-to-b from-slate-50 to-slate-200 text-zinc-900 dark:from-zinc-900 dark:to-black dark:text-zinc-50">
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/60 backdrop-blur dark:border-white/5 dark:bg-zinc-950/50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
              UI
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-semibold">{t.brand}</span>
              <span className="text-xs text-zinc-400">{t.brandSub}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/50 bg-white/50 p-1 dark:border-white/10 dark:bg-white/5">
            {(['components', 'builder', 'hooks', 'tools'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                aria-current={s === section ? 'true' : undefined}
                className={twMerge(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  s === section ? 'bg-white text-indigo-700 shadow-sm dark:bg-white/15 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
                )}
              >
                {t[s]}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              className="grid size-9 place-items-center rounded-lg border border-white/50 bg-white/60 text-xs font-semibold text-zinc-600 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
            >
              {t.langLabel}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="grid size-9 place-items-center rounded-lg border border-white/50 bg-white/60 text-zinc-600 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {section === 'components' ? (
          <ComponentsView lang={lang} />
        ) : section === 'builder' ? (
          <BuilderView lang={lang} />
        ) : section === 'hooks' ? (
          <HooksView lang={lang} />
        ) : (
          <ToolsView lang={lang} />
        )}
        <footer className="mt-12 border-t border-white/40 pt-6 text-center text-xs text-zinc-400">{t.footer}</footer>
      </main>
    </div>
  )
}

export default Dashboard