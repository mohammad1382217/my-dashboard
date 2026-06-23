import { useState } from 'react'
import { useLang } from '../../i18n'
import { ContextMenu } from '../../components/ui/ContextMenu/ContextMenu'

const STRINGS = {
  fa: {
    hint: 'اینجا راست‌کلیک کن',
    copy: 'کپی',
    rename: 'تغییر نام',
    duplicate: 'تکثیر',
    delete: 'حذف',
    last: 'آخرین عملیات:',
    none: '—',
  },
  en: {
    hint: 'Right-click here',
    copy: 'Copy',
    rename: 'Rename',
    duplicate: 'Duplicate',
    delete: 'Delete',
    last: 'Last action:',
    none: '—',
  },
} as const

/** Live demo of the ContextMenu. */
export function ContextMenuShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [last, setLast] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <ContextMenu
        items={[
          { label: t.copy, onSelect: () => setLast(t.copy) },
          { label: t.rename, onSelect: () => setLast(t.rename) },
          { label: t.duplicate, disabled: true },
          { label: t.delete, onSelect: () => setLast(t.delete) },
        ]}
      >
        <div className="flex h-32 w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 select-none dark:border-zinc-700 dark:text-zinc-400">
          {t.hint}
        </div>
      </ContextMenu>
      <span className="text-sm text-muted">
        {t.last} <span className="font-medium text-fg-soft">{last ?? t.none}</span>
      </span>
    </div>
  )
}
