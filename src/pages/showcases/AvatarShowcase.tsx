import { useLang } from '../../i18n'
import { Avatar } from '../../components/ui/Avatar/Avatar'

const AVATAR_IMG =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='80'%20height='80'%3E%3Crect%20width='80'%20height='80'%20fill='%234f46e5'/%3E%3Ccircle%20cx='40'%20cy='32'%20r='14'%20fill='white'/%3E%3Crect%20x='14'%20y='52'%20width='52'%20height='30'%20rx='15'%20fill='white'/%3E%3C/svg%3E"

const STRINGS = {
  fa: { image: 'با عکس', initials: 'حروف اول', sizes: 'اندازه‌ها', error: 'خطای بارگذاری → جایگزین' },
  en: { image: 'With image', initials: 'Initials', sizes: 'Sizes', error: 'Load error → fallback' },
} as const

/** Live gallery of the Avatar, rendered inside the dashboard preview panel. */
export function AvatarShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.image}</span>
        <Avatar src={AVATAR_IMG} alt="Ada" size="lg" />
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.initials}</span>
        <div className="flex items-center gap-3">
          <Avatar fallback="AL" />
          <Avatar
            fallback="GH"
            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          />
          <Avatar
            fallback="MK"
            className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
          />
        </div>
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.sizes}</span>
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback="S" />
          <Avatar size="md" fallback="M" />
          <Avatar size="lg" fallback="L" />
        </div>
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.error}</span>
        <Avatar src="/does-not-exist.jpg" alt="Grace" fallback="GH" />
      </div>
    </div>
  )
}
