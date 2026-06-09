import { useLang } from '../../i18n'
import { Spinner } from '../../components/ui/Spinner/Spinner'

const STRINGS = {
  fa: { loading: 'در حال بارگذاری…' },
  en: { loading: 'Loading…' },
} as const

/** Live demo of the Spinner sizes. */
export function SpinnerShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <Spinner size="sm" label={t.loading} />
        <Spinner size="md" label={t.loading} />
        <Spinner size="lg" label={t.loading} />
      </div>
      <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
        <Spinner size="sm" label={t.loading} />
        <span>{t.loading}</span>
      </div>
    </div>
  )
}
