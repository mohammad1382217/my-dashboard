import { useLang } from '../../i18n'
import { Badge } from '../../components/ui/Badge/Badge'

const STRINGS = {
  fa: {
    variants: 'واریانت‌ها',
    withDot: 'با نقطهٔ وضعیت',
    new: 'جدید',
    draft: 'پیش‌نویس',
    active: 'فعال',
    pending: 'در انتظار',
    failed: 'ناموفق',
    default: 'پیش‌فرض',
    online: 'آنلاین',
    away: 'غایب',
    offline: 'آفلاین',
  },
  en: {
    variants: 'Variants',
    withDot: 'With status dot',
    new: 'New',
    draft: 'Draft',
    active: 'Active',
    pending: 'Pending',
    failed: 'Failed',
    default: 'Default',
    online: 'Online',
    away: 'Away',
    offline: 'Offline',
  },
} as const

/** Live gallery of the Badge variants, rendered inside the dashboard preview panel. */
export function BadgeShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.variants}</span>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{t.new}</Badge>
          <Badge variant="secondary">{t.draft}</Badge>
          <Badge variant="success">{t.active}</Badge>
          <Badge variant="warning">{t.pending}</Badge>
          <Badge variant="destructive">{t.failed}</Badge>
          <Badge variant="outline">{t.default}</Badge>
        </div>
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.withDot}</span>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" dot>
            {t.online}
          </Badge>
          <Badge variant="warning" dot>
            {t.away}
          </Badge>
          <Badge variant="secondary" dot>
            {t.offline}
          </Badge>
        </div>
      </div>
    </div>
  )
}
