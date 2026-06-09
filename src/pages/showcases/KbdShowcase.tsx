import { useLang } from '../../i18n'
import { Kbd } from '../../components/ui/Kbd/Kbd'

const STRINGS = {
  fa: { search: 'باز کردن جست‌وجو', save: 'ذخیره', palette: 'پنل دستورات' },
  en: { search: 'Open search', save: 'Save', palette: 'Command palette' },
} as const

/** Live demo of the Kbd shortcut keys. */
export function KbdShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="flex flex-col gap-3 text-sm text-slate-700 dark:text-zinc-300">
      <div className="flex items-center justify-between gap-6">
        <span>{t.search}</span>
        <span className="flex gap-1">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span>{t.save}</span>
        <span className="flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span>{t.palette}</span>
        <span className="flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>P</Kbd>
        </span>
      </div>
    </div>
  )
}
