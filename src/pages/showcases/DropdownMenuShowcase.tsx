import { useState } from 'react'
import { useLang } from '../../i18n'
import { DropdownMenu } from '../../components/ui/DropdownMenu/DropdownMenu'

const STRINGS = {
  fa: {
    actions: 'عملیات',
    edit: 'ویرایش',
    duplicate: 'تکثیر',
    archive: 'بایگانی',
    delete: 'حذف',
    last: 'آخرین عملیات:',
    none: '—',
  },
  en: {
    actions: 'Actions',
    edit: 'Edit',
    duplicate: 'Duplicate',
    archive: 'Archive',
    delete: 'Delete',
    last: 'Last action:',
    none: '—',
  },
} as const

/** Live demo of the DropdownMenu, rendered inside the dashboard preview panel. */
export function DropdownMenuShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [last, setLast] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <DropdownMenu
        label={t.actions}
        items={[
          { label: t.edit, onSelect: () => setLast(t.edit) },
          { label: t.duplicate, onSelect: () => setLast(t.duplicate) },
          { label: t.archive, disabled: true },
          { label: t.delete, onSelect: () => setLast(t.delete) },
        ]}
      />
      <span className="text-sm text-slate-500 dark:text-zinc-400">
        {t.last} <span className="font-medium text-slate-700 dark:text-zinc-200">{last ?? t.none}</span>
      </span>
    </div>
  )
}
