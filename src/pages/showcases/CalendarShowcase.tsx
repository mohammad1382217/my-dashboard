import { useState } from 'react'
import { useLang } from '../../i18n'
import { Calendar } from '../../components/ui/Calendar/Calendar'

const STRINGS = {
  fa: { selected: 'انتخاب‌شده:', none: 'چیزی انتخاب نشده' },
  en: { selected: 'Selected:', none: 'Nothing selected' },
} as const

/** Live demo of the Gregorian Calendar. */
export function CalendarShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [date, setDate] = useState<Date | null>(null)
  // Force the Gregorian calendar even under fa-IR (which defaults to Jalali).
  const locale = lang === 'fa' ? 'fa-IR-u-ca-gregory' : 'en-US'
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar value={date} onChange={setDate} locale={locale} weekStartsOn={lang === 'fa' ? 6 : 0} />
      <span className="text-sm text-slate-500 dark:text-zinc-400">
        {t.selected} <span className="font-medium text-slate-700 dark:text-zinc-200">{date ? fmt.format(date) : t.none}</span>
      </span>
    </div>
  )
}
