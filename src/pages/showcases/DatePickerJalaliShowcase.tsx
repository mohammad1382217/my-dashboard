import { useState } from 'react'
import { useLang } from '../../i18n'
import { DatePickerJalali } from '../../components/ui/DatePickerJalali/DatePickerJalali'

const STRINGS = {
  fa: {
    label: 'تاریخ تولد',
    placeholder: 'انتخاب تاریخ',
    helper: 'تاریخ را از تقویم شمسی انتخاب کنید.',
    errorLabel: 'حالت خطا',
    errorMsg: 'انتخاب تاریخ الزامی است.',
    picked: 'معادل میلادی:',
    none: 'هنوز انتخاب نشده',
  },
  en: {
    label: 'Date of birth',
    placeholder: 'Pick a date',
    helper: 'Choose a date from the Jalali calendar.',
    errorLabel: 'Error state',
    errorMsg: 'A date is required.',
    picked: 'Gregorian equivalent:',
    none: 'Nothing selected yet',
  },
} as const

/** Live demo of the Jalali date picker, rendered inside the preview panel. */
export function DatePickerJalaliShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [date, setDate] = useState<Date | null>(null)

  return (
    <div className="grid max-w-xs gap-6">
      <div className="grid gap-2">
        <DatePickerJalali
          label={t.label}
          placeholder={t.placeholder}
          helperText={t.helper}
          value={date}
          onChange={setDate}
        />
        <span className="text-sm text-slate-500 dark:text-zinc-400">
          {t.picked}{' '}
          <span className="font-mono">{date ? date.toISOString().slice(0, 10) : t.none}</span>
        </span>
      </div>

      <div className="grid gap-2">
        <span className="text-xs font-medium text-neutral-400">{t.errorLabel}</span>
        <DatePickerJalali label={t.label} placeholder={t.placeholder} error={t.errorMsg} />
      </div>
    </div>
  )
}
