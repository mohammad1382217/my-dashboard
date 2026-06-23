import { useLang } from '../../i18n'
import { HoverCard } from '../../components/ui/HoverCard/HoverCard'
import { Avatar } from '../../components/ui/Avatar/Avatar'

const STRINGS = {
  fa: {
    handle: '@ada',
    name: 'آدا لاولیس',
    bio: 'اولین برنامه‌نویس جهان. علاقه‌مند به ماشین تحلیلی و ریاضیات.',
    joined: 'عضو از ۱۸۴۳',
  },
  en: {
    handle: '@ada',
    name: 'Ada Lovelace',
    bio: "The world's first programmer. Into the Analytical Engine and mathematics.",
    joined: 'Joined 1843',
  },
} as const

/** Live demo of the HoverCard. */
export function HoverCardShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="text-sm text-muted">
      <HoverCard
        trigger={
          <button className="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400">{t.handle}</button>
        }
      >
        <div className="flex gap-3">
          <Avatar fallback="AL" size="lg" />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-fg">{t.name}</p>
            <p className="text-xs text-muted">{t.bio}</p>
            <p className="text-xs text-faint">{t.joined}</p>
          </div>
        </div>
      </HoverCard>
    </div>
  )
}
