import { useLang } from '../../i18n'
import { Empty } from '../../components/ui/Empty/Empty'
import { Button } from '../../components/ui/Button/Button'
import { Icon } from '../../components/Icon'

const STRINGS = {
  fa: { title: 'هیچ پروژه‌ای نیست', description: 'برای شروع، اولین پروژه‌ات را بساز.', action: 'پروژهٔ جدید' },
  en: { title: 'No projects yet', description: 'Create your first project to get started.', action: 'New project' },
} as const

/** Live demo of the Empty state. */
export function EmptyShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="w-full max-w-sm">
      <Empty icon={<Icon name="search" size={22} />} title={t.title} description={t.description}>
        <Button>{t.action}</Button>
      </Empty>
    </div>
  )
}
