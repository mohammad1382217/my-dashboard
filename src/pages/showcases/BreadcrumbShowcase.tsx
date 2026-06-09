import { useLang } from '../../i18n'
import { Breadcrumb } from '../../components/ui/Breadcrumb/Breadcrumb'

const STRINGS = {
  fa: { home: 'خانه', products: 'محصولات', laptops: 'لپ‌تاپ‌ها', model: 'مدل X' },
  en: { home: 'Home', products: 'Products', laptops: 'Laptops', model: 'Model X' },
} as const

/** Live demo of the Breadcrumb (chevrons flip in RTL). */
export function BreadcrumbShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <Breadcrumb
      items={[
        { label: t.home, href: '#' },
        { label: t.products, href: '#' },
        { label: t.laptops, href: '#' },
        { label: t.model },
      ]}
    />
  )
}
