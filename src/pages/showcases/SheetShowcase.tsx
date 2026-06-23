import { useState } from 'react'
import { useLang } from '../../i18n'
import { Sheet } from '../../components/ui/Sheet/Sheet'
import type { SheetSide } from '../../components/ui/Sheet/Sheet'
import { Button } from '../../components/ui/Button/Button'

const STRINGS = {
  fa: {
    start: 'از ابتدا',
    end: 'از انتها',
    top: 'از بالا',
    bottom: 'از پایین',
    title: 'فیلترها',
    desc: 'نتایج را بر اساس دلخواه محدود کنید.',
    body: 'محتوای کشو اینجا قرار می‌گیرد — فرم، منو یا جزئیات.',
    close: 'بستن',
  },
  en: {
    start: 'From start',
    end: 'From end',
    top: 'From top',
    bottom: 'From bottom',
    title: 'Filters',
    desc: 'Narrow the results to your liking.',
    body: 'Drawer content goes here — a form, a menu or details.',
    close: 'Close',
  },
} as const

/** Live demo of the Sheet sliding from any side. */
export function SheetShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [side, setSide] = useState<SheetSide | null>(null)

  const sides: { value: SheetSide; label: string }[] = [
    { value: 'start', label: t.start },
    { value: 'end', label: t.end },
    { value: 'top', label: t.top },
    { value: 'bottom', label: t.bottom },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {sides.map((s) => (
        <Button key={s.value} variant="outline" onClick={() => setSide(s.value)}>
          {s.label}
        </Button>
      ))}
      <Sheet open={side !== null} onOpenChange={(open) => !open && setSide(null)} side={side ?? 'end'} title={t.title} description={t.desc} closeLabel={t.close}>
        <p className="text-sm text-muted">{t.body}</p>
      </Sheet>
    </div>
  )
}
