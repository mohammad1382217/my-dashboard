import { useEffect, useState, useMemo } from 'react'
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

type Theme = 'light' | 'dark'
type Section = 'components' | 'builder' | 'hooks'

const SHELL: Record<Lang, Record<string, string>> = {
  fa: {
    brand: 'کیت رابط',
    brandSub: '۵۶ کامپوننت + هوک + سازنده',
    components: 'کامپوننت‌ها',
    builder: 'سازنده',
    hooks: 'هوک‌ها',
    preview: 'پیش‌نمایش',
    usage: 'فراخوانی',
    download: 'دانلود سورس',
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
    preview: 'Preview',
    usage: 'Usage',
    download: 'Download source',
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

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</span>
        <span className="font-mono text-[11px] text-zinc-400">{value || 'none'}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PALETTE.map((swatch) => (
          <button
            key={swatch}
            type="button"
            title={swatch}
            onClick={() => onChange(swatch)}
            style={{ backgroundColor: swatch }}
            className={twMerge(
              'size-5 rounded-md border border-black/10 transition-transform hover:scale-110 dark:border-white/15',
              value.toLowerCase() === swatch.toLowerCase() && 'ring-2 ring-indigo-500',
            )}
          />
        ))}
        <button
          type="button"
          title="none"
          onClick={() => onChange('')}
          className="grid size-5 place-items-center rounded-md border border-black/10 text-[10px] text-zinc-400"
        >
          ✕
        </button>
        <input
          type="color"
          aria-label="custom color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="size-5 cursor-pointer rounded-md border border-black/10 p-0"
        />
      </div>
    </div>
  )
}

function StylePanel({ style, setStyle, lang }: { style: StyleState; setStyle: (updater: (prev: StyleState) => StyleState) => void; lang: Lang }) {
  const L = (key: keyof typeof STYLE_LABELS) => STYLE_LABELS[key][lang]
  const set = (patch: Partial<StyleState>) => setStyle((prev) => ({ ...prev, ...patch }))

  return (
    <div className="flex flex-col gap-4">
      <ColorField label={L('background')} value={style.background} onChange={(v) => set({ background: v })} />
      <ColorField label={L('color')} value={style.color} onChange={(v) => set({ color: v })} />
      <ColorField label={L('borderColor')} value={style.borderColor} onChange={(v) => set({ borderColor: v })} />
      <Slider label={L('borderWidth')} showValue min={0} max={8} step={1} value={style.borderWidth} onChange={(e) => set({ borderWidth: Number(e.target.value) })} />
      <Slider label={L('radius')} showValue min={0} max={40} step={1} value={style.radius} onChange={(e) => set({ radius: Number(e.target.value) })} />
      <Slider label={L('paddingX')} showValue min={0} max={64} step={1} value={style.paddingX} onChange={(e) => set({ paddingX: Number(e.target.value) })} />
      <Slider label={L('paddingY')} showValue min={0} max={64} step={1} value={style.paddingY} onChange={(e) => set({ paddingY: Number(e.target.value) })} />
      <Slider label={L('fontSize')} showValue min={0} max={36} step={1} value={style.fontSize} onChange={(e) => set({ fontSize: Number(e.target.value) })} />
      <Select label={L('fontWeight')} value={style.fontWeight} onChange={(e) => set({ fontWeight: e.target.value })}>
        <option value="">—</option>
        <option value="400">400</option>
        <option value="500">500</option>
        <option value="600">600</option>
        <option value="700">700</option>
      </Select>
      <Select label={L('shadow')} value={style.shadow} onChange={(e) => set({ shadow: e.target.value })}>
        <option value="">none</option>
        <option value="sm">sm</option>
        <option value="md">md</option>
        <option value="lg">lg</option>
        <option value="xl">xl</option>
      </Select>
      <Slider label={L('opacity')} showValue min={0} max={100} step={1} value={style.opacity} onChange={(e) => set({ opacity: Number(e.target.value) })} />
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

function ComponentSection({ entry, lang }: { entry: ComponentEntry; lang: Lang }) {
  const t = SHELL[lang]
  const [view, setView] = useState<'preview' | 'usage'>('preview')

  return (
    <section id={entry.id} className="overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/70 px-4 py-3 sm:px-5 dark:border-white/10">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold text-zinc-900 dark:text-white">{entry.name[lang]}</h2>
            <span className="shrink-0 rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
              {entry.code}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">{entry.description[lang]}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => downloadFile(entry.file, entry.source)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Icon name="download" size={14} />
            <span className="hidden sm:inline">{t.download}</span>
          </button>
          <div className="inline-flex items-center gap-1 rounded-lg border border-white/50 bg-white/50 p-1 dark:border-white/10 dark:bg-white/5">
            {(['preview', 'usage'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-current={view === v ? 'true' : undefined}
                className={twMerge(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  view === v ? 'bg-white text-indigo-700 shadow-sm dark:bg-white/15 dark:text-white' : 'text-zinc-500 dark:text-zinc-400',
                )}
              >
                {t[v]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'preview' ? (
        <div className="p-5 sm:p-8">{entry.render()}</div>
      ) : (
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          {entry.usage.map((example, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h3 className="px-0.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">{example.label[lang]}</h3>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <CodeBlock code={example.code} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function ComponentsView({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col gap-6">
      {COMPONENTS.map((entry) => (
        <ComponentSection key={entry.id} entry={entry} lang={lang} />
      ))}
    </div>
  )
}

function HooksView({ lang }: { lang: Lang }) {
  const t = SHELL[lang]
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
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold">{t.hooksTitle}</h2>
        <p className="mt-1 text-sm text-zinc-500">{t.hooksSub}</p>
      </div>
      {groups.map(([category, hooks]) => (
        <div key={category} className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase text-indigo-500">{category}</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {hooks.map((hook) => (
              <div key={hook.id} className="overflow-hidden rounded-2xl border border-white/60 bg-white/70 dark:border-white/10 dark:bg-zinc-900/60">
                <div className="flex flex-col gap-3 border-b border-zinc-200/70 px-4 py-3 dark:border-white/10">
                  <code className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{hook.name}</code>
                  <p className="text-xs text-zinc-500">{hook.description[lang]}</p>
                </div>
                <CodeBlock code={hook.code} filename={hook.file} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
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

  const builder = BUILDERS[activeIdx]
  const hasProps = builder.controls.length > 0
  const cssStyle = buildStyle(style)
  const cls = buildClass(style)
  const preview = builder.render(values, cssStyle)
  const code = builder.toCode ? builder.toCode(values, cls) : genCode(builder.code, builder.controls, values, cls)
  const setValue = (prop: string, value: unknown) => setValues((prev) => ({ ...prev, [prop]: value }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">{t.builderTitle}</h2>
        <p className="mt-1 text-sm text-zinc-500">{t.builderSub}</p>
      </div>

      <div className="flex max-h-32 flex-wrap gap-1 overflow-y-auto rounded-xl border border-white/60 bg-white/40 p-2 dark:border-white/10 dark:bg-white/5">
        {BUILDERS.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setActiveIdx(i)
              setValues(defaultValues(b))
              setStyle(DEFAULT_STYLE)
              setTab(b.controls.length > 0 ? 'props' : 'style')
            }}
            aria-current={i === activeIdx ? 'true' : undefined}
            className={twMerge(
              'rounded-lg border px-2.5 py-1 font-mono text-xs font-medium transition-colors',
              i === activeIdx ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-zinc-200 bg-white/60 text-zinc-600 dark:border-white/10 dark:bg-white/5',
            )}
          >
            {b.code}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase text-zinc-400">{t.builderPreview}</span>
            <div className="grid min-h-56 place-items-center rounded-xl border border-white/60 bg-zinc-50 p-8 dark:border-white/10 dark:bg-zinc-900">
              {preview}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="mb-2 text-xs font-semibold uppercase text-zinc-400">{t.builderCode}</span>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <CodeBlock code={code} />
            </div>
          </div>
        </div>

        <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60 lg:sticky lg:top-24">
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
              onClick={() => {
                setValues(defaultValues(builder))
                setStyle(DEFAULT_STYLE)
              }}
              className="text-xs font-medium text-indigo-600 hover:underline"
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
            {(['components', 'builder', 'hooks'] as const).map((s) => (
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
        {section === 'components' ? <ComponentsView lang={lang} /> : section === 'builder' ? <BuilderView lang={lang} /> : <HooksView lang={lang} />}
        <footer className="mt-12 border-t border-white/40 pt-6 text-center text-xs text-zinc-400">{t.footer}</footer>
      </main>
    </div>
  )
}

export default Dashboard