import { useState } from 'react'
import { useLang } from '../../i18n'
import { Combobox } from '../../components/ui/Combobox/Combobox'

const STRINGS = {
  fa: { placeholder: 'یک فریم‌ورک انتخاب کن…', empty: 'موردی یافت نشد', picked: 'انتخاب:', none: '—' },
  en: { placeholder: 'Pick a framework…', empty: 'No results', picked: 'Picked:', none: '—' },
} as const

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
  { value: 'qwik', label: 'Qwik', disabled: true },
]

/** Live demo of the Combobox. */
export function ComboboxShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [value, setValue] = useState<string | null>(null)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Combobox options={options} value={value} onChange={setValue} placeholder={t.placeholder} emptyText={t.empty} />
      <span className="text-sm text-muted">
        {t.picked} <span className="font-medium text-fg-soft">{value ?? t.none}</span>
      </span>
    </div>
  )
}
