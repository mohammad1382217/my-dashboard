import { useState } from 'react'
import { useLang } from '../../i18n'
import { Menubar } from '../../components/ui/Menubar/Menubar'

const STRINGS = {
  fa: {
    file: 'فایل',
    edit: 'ویرایش',
    view: 'نمایش',
    newFile: 'جدید',
    open: 'باز کردن',
    save: 'ذخیره',
    undo: 'واگرد',
    redo: 'ازنو',
    cut: 'برش',
    zoomIn: 'بزرگ‌نمایی',
    zoomOut: 'کوچک‌نمایی',
    full: 'تمام‌صفحه',
    ran: 'اجرا شد:',
    none: '—',
  },
  en: {
    file: 'File',
    edit: 'Edit',
    view: 'View',
    newFile: 'New',
    open: 'Open',
    save: 'Save',
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    full: 'Fullscreen',
    ran: 'Ran:',
    none: '—',
  },
} as const

/** Live demo of the Menubar. */
export function MenubarShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [ran, setRan] = useState<string | null>(null)
  const pick = (label: string) => () => setRan(label)

  return (
    <div className="flex flex-col gap-3">
      <Menubar
        menus={[
          { label: t.file, items: [{ label: t.newFile, onSelect: pick(t.newFile) }, { label: t.open, onSelect: pick(t.open) }, { label: t.save, onSelect: pick(t.save) }] },
          { label: t.edit, items: [{ label: t.undo, onSelect: pick(t.undo) }, { label: t.redo, disabled: true }, { label: t.cut, onSelect: pick(t.cut) }] },
          { label: t.view, items: [{ label: t.zoomIn, onSelect: pick(t.zoomIn) }, { label: t.zoomOut, onSelect: pick(t.zoomOut) }, { label: t.full, onSelect: pick(t.full) }] },
        ]}
      />
      <span className="text-sm text-slate-500 dark:text-zinc-400">
        {t.ran} <span className="font-medium text-slate-700 dark:text-zinc-200">{ran ?? t.none}</span>
      </span>
    </div>
  )
}
