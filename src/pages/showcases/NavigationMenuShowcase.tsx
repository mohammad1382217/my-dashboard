import { useLang } from '../../i18n'
import { NavigationMenu } from '../../components/ui/NavigationMenu/NavigationMenu'

const STRINGS = {
  fa: {
    label: 'اصلی',
    products: 'محصولات',
    analytics: 'تحلیل‌ها',
    analyticsD: 'رفتار کاربران را دنبال کنید',
    billing: 'صورتحساب',
    billingD: 'مدیریت اشتراک و فاکتورها',
    company: 'شرکت',
    about: 'درباره ما',
    aboutD: 'داستان و تیم ما',
    careers: 'فرصت‌های شغلی',
    careersD: 'به ما بپیوندید',
    pricing: 'قیمت‌گذاری',
  },
  en: {
    label: 'Main',
    products: 'Products',
    analytics: 'Analytics',
    analyticsD: 'Track user behaviour',
    billing: 'Billing',
    billingD: 'Manage plans and invoices',
    company: 'Company',
    about: 'About',
    aboutD: 'Our story and team',
    careers: 'Careers',
    careersD: 'Come work with us',
    pricing: 'Pricing',
  },
} as const

/** Live demo of the NavigationMenu. */
export function NavigationMenuShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <NavigationMenu
      label={t.label}
      items={[
        {
          label: t.products,
          content: [
            { label: t.analytics, href: '#', description: t.analyticsD },
            { label: t.billing, href: '#', description: t.billingD },
          ],
        },
        {
          label: t.company,
          content: [
            { label: t.about, href: '#', description: t.aboutD },
            { label: t.careers, href: '#', description: t.careersD },
          ],
        },
        { label: t.pricing, href: '#' },
      ]}
    />
  )
}
