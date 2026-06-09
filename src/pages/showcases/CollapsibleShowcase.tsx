import { useLang } from '../../i18n'
import { Collapsible } from '../../components/ui/Collapsible/Collapsible'

const STRINGS = {
  fa: {
    trigger: 'جزئیات سفارش',
    body: 'سفارش شما در تاریخ ۱۴ خرداد ثبت و روز بعد ارسال شد. کد رهگیری از طریق پیامک برای شما فرستاده شده است.',
  },
  en: {
    trigger: 'Order details',
    body: 'Your order was placed on June 4 and shipped the next day. A tracking code has been sent to you by SMS.',
  },
} as const

/** Live demo of the single Collapsible region. */
export function CollapsibleShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="w-full max-w-sm rounded-lg border border-slate-200 p-3 dark:border-zinc-800">
      <Collapsible trigger={t.trigger} defaultOpen>
        {t.body}
      </Collapsible>
    </div>
  )
}
