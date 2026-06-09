import { useLang } from '../../i18n'
import { Progress } from '../../components/ui/Progress/Progress'

const STRINGS = {
  fa: { uploading: 'در حال آپلود', low: 'کم', high: 'زیاد' },
  en: { uploading: 'Uploading', low: 'Low', high: 'High' },
} as const

/** Live gallery of the Progress bar, rendered inside the dashboard preview panel. */
export function ProgressShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="grid max-w-sm gap-6">
      <Progress value={66} label={t.uploading} showValue />
      <Progress value={20} label={t.low} />
      <Progress value={90} label={t.high} />
      <Progress value={3} max={4} />
    </div>
  )
}
