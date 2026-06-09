import { useState } from 'react'
import { Input } from '../../components/ui/Input/Input'
import { Icon } from '../../components/Icon'
import { useLang } from '../../i18n'

const STRINGS = {
  fa: {
    defaultLabel: 'پیش‌فرض',
    defaultPlaceholder: 'چیزی بنویسید…',
    emailLabel: 'ایمیل',
    emailPlaceholder: 'you@example.com',
    emailHelper: 'هرگز آن را با کسی به اشتراک نمی‌گذاریم.',
    passwordLabel: 'گذرواژه',
    passwordError: 'گذرواژه بسیار کوتاه است.',
    searchLabel: 'جستجو',
    searchPlaceholder: 'جستجو…',
    disabledLabel: 'غیرفعال',
    disabledValue: 'فقط‌خواندنی',
    sizes: 'اندازه‌ها',
    small: 'کوچک',
    medium: 'متوسط',
    large: 'بزرگ',
  },
  en: {
    defaultLabel: 'Default',
    defaultPlaceholder: 'Type something…',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    emailHelper: "We'll never share it.",
    passwordLabel: 'Password',
    passwordError: 'Password is too short.',
    searchLabel: 'Search',
    searchPlaceholder: 'Search…',
    disabledLabel: 'Disabled',
    disabledValue: 'Read only',
    sizes: 'Sizes',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },
} as const

/** Live gallery of the Input states, rendered inside the dashboard preview panel. */
export function InputShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [value, setValue] = useState('')

  return (
    <div className="grid gap-6">
      <Input
        label={t.defaultLabel}
        placeholder={t.defaultPlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Input
        label={t.emailLabel}
        type="email"
        placeholder={t.emailPlaceholder}
        helperText={t.emailHelper}
      />

      <Input label={t.passwordLabel} type="password" required error={t.passwordError} />

      <Input
        label={t.searchLabel}
        type="search"
        endIcon={<Icon name="search" size={16} />}
        placeholder={t.searchPlaceholder}
      />

      <Input label={t.disabledLabel} disabled value={t.disabledValue} readOnly />

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.sizes}</span>
        <Input size="sm" placeholder={t.small} aria-label={t.small} />
        <Input size="md" placeholder={t.medium} aria-label={t.medium} />
        <Input size="lg" placeholder={t.large} aria-label={t.large} />
      </div>
    </div>
  )
}