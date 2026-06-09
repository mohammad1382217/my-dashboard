import { useLang } from '../../i18n'
import { Card } from '../../components/ui/Card/Card'
import { Button } from '../../components/ui/Button/Button'
import { Badge } from '../../components/ui/Badge/Badge'

const STRINGS = {
  fa: {
    planTitle: 'پلن حرفه‌ای',
    planDesc: 'صورت‌حساب ماهانه',
    planBody: 'دسترسی به همهٔ امکانات، پشتیبانی اولویت‌دار و فضای نامحدود.',
    active: 'فعال',
    upgrade: 'ارتقا',
    manage: 'مدیریت',
    simpleTitle: 'کارت ساده',
    simpleBody: 'یک کارت فقط با بدنه، بدون هدر و فوتر.',
  },
  en: {
    planTitle: 'Pro plan',
    planDesc: 'Billed monthly',
    planBody: 'Access to every feature, priority support and unlimited storage.',
    active: 'Active',
    upgrade: 'Upgrade',
    manage: 'Manage',
    simpleTitle: 'Simple card',
    simpleBody: 'A card with just a body — no header or footer.',
  },
} as const

/** Live gallery of the Card, rendered inside the dashboard preview panel. */
export function CardShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Card
        title={
          <span className="flex items-center gap-2">
            {t.planTitle}
            <Badge variant="success" dot>
              {t.active}
            </Badge>
          </span>
        }
        description={t.planDesc}
        footer={
          <>
            <Button variant="outline" size="sm">
              {t.manage}
            </Button>
            <Button size="sm">{t.upgrade}</Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed">{t.planBody}</p>
      </Card>

      <Card title={t.simpleTitle}>
        <p className="text-sm leading-relaxed">{t.simpleBody}</p>
      </Card>
    </div>
  )
}
