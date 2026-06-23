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
  const rtl = lang === 'fa'
  const searchIcon = <Icon name="search" size={16} />

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {/* Search: text follows the page direction, but the magnifier stays on the physical
          left (leading in LTR, trailing in RTL). */}
      <InputGroup
        {...(rtl ? { trailing: searchIcon } : { leading: searchIcon })}
        placeholder={t.search}
        type="search"
      />
      {/* URL is LTR content — force the field LTR so `https://` sits on the left and reads naturally. */}
      <InputGroup dir="ltr" leading={<span className="text-sm">https://</span>} placeholder="example.com" aria-label={t.site} />
      {/* Price: digits are LTR (number on the left), unit تومان trails on the right. */}
      <InputGroup dir="ltr" trailing={<span className="text-sm">تومان</span>} placeholder="۰" inputMode="numeric" aria-label={t.price} />
    </div>
  )
}
