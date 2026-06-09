import { useLang } from '../../i18n'
import { InputGroup } from '../../components/ui/InputGroup/InputGroup'
import { Icon } from '../../components/Icon'

const STRINGS = {
  fa: { search: 'جست‌وجو…', site: 'آدرس سایت', price: 'قیمت' },
  en: { search: 'Search…', site: 'Website', price: 'Price' },
} as const

/** Live demo of the InputGroup with leading/trailing addons. */
export function InputGroupShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <InputGroup leading={<Icon name="search" size={16} />} placeholder={t.search} type="search" />
      <InputGroup leading={<span className="text-sm">https://</span>} placeholder="example.com" aria-label={t.site} />
      <InputGroup trailing={<span className="text-sm">تومان</span>} placeholder="۰" inputMode="numeric" aria-label={t.price} />
    </div>
  )
}
