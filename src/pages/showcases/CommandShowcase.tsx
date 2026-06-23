import { useState } from 'react'
import { useLang } from '../../i18n'
import { Command } from '../../components/ui/Command/Command'
import { Icon } from '../../components/Icon'
import { Kbd } from '../../components/ui/Kbd/Kbd'

const STRINGS = {
  fa: {
    placeholder: 'یک دستور بنویس یا جست‌وجو کن…',
    empty: 'موردی یافت نشد',
    gActions: 'کنش‌ها',
    gTheme: 'پوسته',
    search: 'جست‌وجو',
    copy: 'کپی لینک',
    download: 'دانلود',
    light: 'حالت روشن',
    dark: 'حالت تیره',
    ran: 'اجرا شد:',
    none: '—',
  },
  en: {
    placeholder: 'Type a command or search…',
    empty: 'No results',
    gActions: 'Actions',
    gTheme: 'Theme',
    search: 'Search',
    copy: 'Copy link',
    download: 'Download',
    light: 'Light mode',
    dark: 'Dark mode',
    ran: 'Ran:',
    none: '—',
  },
} as const

/** Live demo of the Command palette. */
export function CommandShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [ran, setRan] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <Command
        placeholder={t.placeholder}
        emptyText={t.empty}
        items={[
          { value: 'search', label: t.search, group: t.gActions, icon: <Icon name="search" size={16} />, onSelect: () => setRan(t.search) },
          { value: 'copy', label: t.copy, group: t.gActions, icon: <Icon name="copy" size={16} />, shortcut: <Kbd>⌘C</Kbd>, onSelect: () => setRan(t.copy) },
          { value: 'download', label: t.download, group: t.gActions, icon: <Icon name="download" size={16} />, onSelect: () => setRan(t.download) },
          { value: 'light', label: t.light, group: t.gTheme, icon: <Icon name="sun" size={16} />, onSelect: () => setRan(t.light) },
          { value: 'dark', label: t.dark, group: t.gTheme, icon: <Icon name="moon" size={16} />, onSelect: () => setRan(t.dark) },
        ]}
      />
      <span className="text-sm text-muted">
        {t.ran} <span className="font-medium text-fg-soft">{ran ?? t.none}</span>
      </span>
    </div>
  )
}
