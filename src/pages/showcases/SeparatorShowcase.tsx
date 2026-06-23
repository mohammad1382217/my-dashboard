import { useLang } from '../../i18n'
import { Separator } from '../../components/ui/Separator/Separator'

const STRINGS = {
  fa: { profile: 'پروفایل', settings: 'تنظیمات', logout: 'خروج', blog: 'بلاگ', docs: 'مستندات', source: 'سورس' },
  en: { profile: 'Profile', settings: 'Settings', logout: 'Logout', blog: 'Blog', docs: 'Docs', source: 'Source' },
} as const

/** Live demo of the Separator. */
export function SeparatorShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2 text-sm text-fg-soft">
        <span>{t.profile}</span>
        <Separator />
        <span>{t.settings}</span>
        <Separator />
        <span>{t.logout}</span>
      </div>
      <div className="flex h-5 items-center gap-3 text-sm text-fg-soft">
        <span>{t.blog}</span>
        <Separator orientation="vertical" />
        <span>{t.docs}</span>
        <Separator orientation="vertical" />
        <span>{t.source}</span>
      </div>
    </div>
  )
}
