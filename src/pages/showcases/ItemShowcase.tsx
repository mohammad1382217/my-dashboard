import { useLang } from '../../i18n'
import { Item } from '../../components/ui/Item/Item'
import { Avatar } from '../../components/ui/Avatar/Avatar'
import { Badge } from '../../components/ui/Badge/Badge'

const STRINGS = {
  fa: {
    ada: 'آدا لاولیس',
    adaRole: 'مهندس نرم‌افزار',
    linus: 'لینوس توروالدز',
    linusRole: 'نگه‌دارندهٔ هسته',
    online: 'آنلاین',
  },
  en: {
    ada: 'Ada Lovelace',
    adaRole: 'Software Engineer',
    linus: 'Linus Torvalds',
    linusRole: 'Kernel Maintainer',
    online: 'Online',
  },
} as const

/** Live demo of the Item content row. */
export function ItemShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Item
        interactive
        leading={<Avatar fallback="AL" />}
        title={t.ada}
        description={t.adaRole}
        trailing={<Badge>{t.online}</Badge>}
      />
      <Item interactive leading={<Avatar fallback="LT" />} title={t.linus} description={t.linusRole} />
    </div>
  )
}
