import { useState } from 'react'
import { useLang } from '../../i18n'
import { ToggleGroup } from '../../components/ui/ToggleGroup/ToggleGroup'

const STRINGS = {
  fa: {
    alignTitle: 'ترازبندی (تکی)',
    left: 'چپ',
    center: 'وسط',
    right: 'راست',
    formatTitle: 'قالب‌بندی (چندتایی)',
    bold: 'درشت',
    italic: 'مورب',
    underline: 'زیرخط',
  },
  en: {
    alignTitle: 'Alignment (single)',
    left: 'Left',
    center: 'Center',
    right: 'Right',
    formatTitle: 'Formatting (multiple)',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
  },
} as const

/** Live demo of the ToggleGroup in single and multiple modes. */
export function ToggleGroupShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [align, setAlign] = useState<string | null>('center')
  const [format, setFormat] = useState<string[]>(['bold'])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 dark:text-zinc-400">{t.alignTitle}</span>
        <ToggleGroup
          value={align}
          onValueChange={setAlign}
          items={[
            { value: 'left', label: t.left },
            { value: 'center', label: t.center },
            { value: 'right', label: t.right },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 dark:text-zinc-400">{t.formatTitle}</span>
        <ToggleGroup
          type="multiple"
          value={format}
          onValueChange={setFormat}
          items={[
            { value: 'bold', label: t.bold },
            { value: 'italic', label: t.italic },
            { value: 'underline', label: t.underline },
          ]}
        />
      </div>
    </div>
  )
}
