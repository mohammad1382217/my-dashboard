import { Button } from '../../components/ui/Button/Button'
import { useLang } from '../../i18n'

const STRINGS = {
  fa: {
    variants: 'حالت‌ها',
    sizes: 'اندازه‌ها',
    disabled: 'غیرفعال',
    primary: 'اصلی',
    secondary: 'فرعی',
    outline: 'خطی',
    ghost: 'شفاف',
    destructive: 'حذف',
    small: 'کوچک',
    medium: 'متوسط',
    large: 'بزرگ',
  },
  en: {
    variants: 'Variants',
    sizes: 'Sizes',
    disabled: 'Disabled',
    primary: 'Primary',
    secondary: 'Secondary',
    outline: 'Outline',
    ghost: 'Ghost',
    destructive: 'Destructive',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },
} as const

/** Live gallery of the Button variants and sizes, rendered in the preview panel. */
export function ButtonShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.variants}</span>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">{t.primary}</Button>
          <Button variant="secondary">{t.secondary}</Button>
          <Button variant="outline">{t.outline}</Button>
          <Button variant="ghost">{t.ghost}</Button>
          <Button variant="destructive">{t.destructive}</Button>
        </div>
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.sizes}</span>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">{t.small}</Button>
          <Button size="md">{t.medium}</Button>
          <Button size="lg">{t.large}</Button>
        </div>
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.disabled}</span>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>{t.primary}</Button>
          <Button variant="outline" disabled>
            {t.outline}
          </Button>
        </div>
      </div>
    </div>
  )
}