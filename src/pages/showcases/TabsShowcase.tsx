import { useLang } from '../../i18n'
import { Tabs } from '../../components/ui/Tabs/Tabs'

const STRINGS = {
  fa: {
    underlineStyle: 'سبک خط‌دار (underline)',
    pillStyle: 'سبک دکمه‌ای (pill)',
    account: 'حساب',
    accountBody: 'نام، ایمیل و اطلاعات عمومی حساب خود را اینجا مدیریت کنید.',
    password: 'گذرواژه',
    passwordBody: 'گذرواژه را تغییر دهید و ورود دومرحله‌ای را فعال کنید.',
    notifications: 'اعلان‌ها',
    notificationsBody: 'انتخاب کنید چه زمانی و چگونه به شما اطلاع داده شود.',
    billing: 'صورت‌حساب',
    soon: 'به‌زودی',
    overview: 'نمای کلی',
    overviewBody: 'خلاصه‌ای از وضعیت کلی.',
    analytics: 'تحلیل‌ها',
    analyticsBody: 'نمودارها و معیارهای دقیق‌تر.',
    reports: 'گزارش‌ها',
    reportsBody: 'گزارش‌های قابل دانلود.',
  },
  en: {
    underlineStyle: 'Underline',
    pillStyle: 'Pill / button',
    account: 'Account',
    accountBody: 'Manage your name, email and general account details here.',
    password: 'Password',
    passwordBody: 'Change your password and enable two-factor sign-in.',
    notifications: 'Notifications',
    notificationsBody: 'Choose when and how you want to be notified.',
    billing: 'Billing',
    soon: 'Coming soon',
    overview: 'Overview',
    overviewBody: 'A summary of the overall status.',
    analytics: 'Analytics',
    analyticsBody: 'Charts and more detailed metrics.',
    reports: 'Reports',
    reportsBody: 'Downloadable reports.',
  },
} as const

const bodyClass = 'leading-relaxed text-slate-600 dark:text-zinc-400'

/** Live gallery of the Tabs states, rendered inside the dashboard preview panel. */
export function TabsShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.underlineStyle}</span>
        <Tabs
          defaultValue="account"
          items={[
            { value: 'account', label: t.account, content: <p className={bodyClass}>{t.accountBody}</p> },
            { value: 'password', label: t.password, content: <p className={bodyClass}>{t.passwordBody}</p> },
            {
              value: 'notifications',
              label: t.notifications,
              content: <p className={bodyClass}>{t.notificationsBody}</p>,
            },
            { value: 'billing', label: t.billing, content: <p className={bodyClass}>{t.soon}</p>, disabled: true },
          ]}
        />
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.pillStyle}</span>
        <Tabs
          variant="pill"
          defaultValue="analytics"
          items={[
            { value: 'overview', label: t.overview, content: <p className={bodyClass}>{t.overviewBody}</p> },
            { value: 'analytics', label: t.analytics, content: <p className={bodyClass}>{t.analyticsBody}</p> },
            { value: 'reports', label: t.reports, content: <p className={bodyClass}>{t.reportsBody}</p> },
          ]}
        />
      </div>
    </div>
  )
}
