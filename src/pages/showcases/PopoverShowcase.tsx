import { useLang } from '../../i18n'
import { Popover } from '../../components/ui/Popover/Popover'
import { Input } from '../../components/ui/Input/Input'
import { Button } from '../../components/ui/Button/Button'

const STRINGS = {
  fa: {
    trigger: 'تنظیمات ابعاد',
    title: 'ابعاد',
    desc: 'اندازهٔ کادر را تنظیم کنید.',
    width: 'عرض',
    height: 'ارتفاع',
    apply: 'اعمال',
  },
  en: {
    trigger: 'Dimensions',
    title: 'Dimensions',
    desc: 'Set the box size.',
    width: 'Width',
    height: 'Height',
    apply: 'Apply',
  },
} as const

/** Live demo of the Popover. */
export function PopoverShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <Popover align="start" trigger={t.trigger}>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-zinc-100">{t.title}</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{t.desc}</p>
        </div>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>{t.width}</span>
          <Input defaultValue="320" className="h-8 w-24" />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>{t.height}</span>
          <Input defaultValue="240" className="h-8 w-24" />
        </label>
        <Button size="sm">{t.apply}</Button>
      </div>
    </Popover>
  )
}
