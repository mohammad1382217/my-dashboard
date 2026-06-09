import { useState } from 'react'
import { useLang } from '../../i18n'
import { Sidebar } from '../../components/ui/Sidebar/Sidebar'
import { Icon } from '../../components/Icon'
import type { IconName } from '../../components/Icon'
import { Avatar } from '../../components/ui/Avatar/Avatar'

const STRINGS = {
  fa: {
    main: 'اصلی',
    tools: 'ابزارها',
    dashboard: 'داشبورد',
    search: 'جست‌وجو',
    files: 'فایل‌ها',
    downloads: 'دانلودها',
    collapse: 'جمع کردن نوار',
    expand: 'باز کردن نوار',
    user: 'سما',
  },
  en: {
    main: 'Main',
    tools: 'Tools',
    dashboard: 'Dashboard',
    search: 'Search',
    files: 'Files',
    downloads: 'Downloads',
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    user: 'Sama',
  },
} as const

/** Live demo of the Sidebar (collapsible rail). */
export function SidebarShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [active, setActive] = useState('dashboard')

  const item = (id: string, label: string, icon: IconName) => ({
    label,
    icon: <Icon name={icon} size={18} />,
    active: active === id,
    onSelect: () => setActive(id),
  })

  return (
    <div className="h-96 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800">
      <Sidebar
        collapseLabel={t.collapse}
        expandLabel={t.expand}
        header={<span className="truncate text-base font-bold text-slate-900 dark:text-white">UI Kit</span>}
        footer={
          <div className="flex items-center gap-2">
            <Avatar fallback="S" size="sm" />
            <span className="truncate text-sm font-medium text-slate-700 dark:text-zinc-200">{t.user}</span>
          </div>
        }
        sections={[
          { label: t.main, items: [item('dashboard', t.dashboard, 'menu'), item('search', t.search, 'search')] },
          { label: t.tools, items: [item('files', t.files, 'copy'), item('downloads', t.downloads, 'download')] },
        ]}
      />
    </div>
  )
}
