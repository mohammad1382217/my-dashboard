import { useLang } from '../../i18n'
import { Tooltip } from '../../components/ui/Tooltip/Tooltip'
import { Button } from '../../components/ui/Button/Button'

const STRINGS = {
  fa: {
    top: 'بالا',
    bottom: 'پایین',
    left: 'چپ',
    right: 'راست',
    tip: 'یک راهنمای کوتاه',
    hint: 'موس را روی دکمه‌ها ببرید یا با Tab فوکوس کنید.',
  },
  en: {
    top: 'Top',
    bottom: 'Bottom',
    left: 'Left',
    right: 'Right',
    tip: 'A short hint',
    hint: 'Hover the buttons or focus them with Tab.',
  },
} as const

/** Live gallery of the Tooltip, rendered inside the dashboard preview panel. */
export function TooltipShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tooltip content={t.tip} side="top">
          <Button variant="outline">{t.top}</Button>
        </Tooltip>
        <Tooltip content={t.tip} side="bottom">
          <Button variant="outline">{t.bottom}</Button>
        </Tooltip>
        <Tooltip content={t.tip} side="left">
          <Button variant="outline">{t.left}</Button>
        </Tooltip>
        <Tooltip content={t.tip} side="right">
          <Button variant="outline">{t.right}</Button>
        </Tooltip>
      </div>
      <p className="text-sm text-slate-500 dark:text-zinc-400">{t.hint}</p>
    </div>
  )
}
