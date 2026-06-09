import { useState } from 'react'
import { useLang } from '../../i18n'
import { Toggle } from '../../components/ui/Toggle/Toggle'

const STRINGS = {
  fa: { bold: 'درشت', italic: 'مورب', underline: 'زیرخط', state: 'وضعیت درشت:', on: 'روشن', off: 'خاموش' },
  en: { bold: 'Bold', italic: 'Italic', underline: 'Underline', state: 'Bold state:', on: 'on', off: 'off' },
} as const

/** Live demo of the Toggle button. */
export function ToggleShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [bold, setBold] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Toggle pressed={bold} onPressedChange={setBold} aria-label={t.bold}>
          <span className="font-bold">B</span>
        </Toggle>
        <Toggle variant="outline" defaultPressed aria-label={t.italic}>
          <span className="italic">I</span>
        </Toggle>
        <Toggle variant="outline" aria-label={t.underline}>
          <span className="underline">U</span>
        </Toggle>
      </div>
      <span className="text-sm text-slate-500 dark:text-zinc-400">
        {t.state} <span className="font-medium text-slate-700 dark:text-zinc-200">{bold ? t.on : t.off}</span>
      </span>
    </div>
  )
}
