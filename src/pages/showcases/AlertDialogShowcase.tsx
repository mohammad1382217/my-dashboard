import { useState } from 'react'
import { useLang } from '../../i18n'
import { AlertDialog } from '../../components/ui/AlertDialog/AlertDialog'
import { Button } from '../../components/ui/Button/Button'

type Kind = 'delete' | 'publish'

const STRINGS = {
  fa: {
    delete: 'حذف پروژه',
    publish: 'انتشار',
    deleteTitle: 'پروژه حذف شود؟',
    deleteDesc: 'این عملیات قابل بازگشت نیست. تمام داده‌های پروژه برای همیشه پاک می‌شوند.',
    publishTitle: 'پروژه منتشر شود؟',
    publishDesc: 'نسخهٔ فعلی برای همهٔ کاربران در دسترس قرار می‌گیرد.',
    cancel: 'انصراف',
    confirmDelete: 'حذف',
    confirmPublish: 'انتشار',
    deleted: 'پروژه حذف شد.',
    published: 'پروژه منتشر شد.',
    cancelled: 'لغو شد.',
  },
  en: {
    delete: 'Delete project',
    publish: 'Publish',
    deleteTitle: 'Delete project?',
    deleteDesc: 'This action cannot be undone. All project data will be permanently removed.',
    publishTitle: 'Publish project?',
    publishDesc: 'The current version becomes available to all users.',
    cancel: 'Cancel',
    confirmDelete: 'Delete',
    confirmPublish: 'Publish',
    deleted: 'Project deleted.',
    published: 'Project published.',
    cancelled: 'Cancelled.',
  },
} as const

/** Live demo of the AlertDialog — destructive (red warning) vs neutral (amber) confirms. */
export function AlertDialogShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [kind, setKind] = useState<Kind | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const config =
    kind === 'delete'
      ? { title: t.deleteTitle, description: t.deleteDesc, confirmText: t.confirmDelete, destructive: true, done: t.deleted }
      : { title: t.publishTitle, description: t.publishDesc, confirmText: t.confirmPublish, destructive: false, done: t.published }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="destructive" onClick={() => setKind('delete')}>
          {t.delete}
        </Button>
        <Button variant="outline" onClick={() => setKind('publish')}>
          {t.publish}
        </Button>
      </div>
      <AlertDialog
        open={kind !== null}
        onOpenChange={(open) => !open && setKind(null)}
        title={config.title}
        description={config.description}
        cancelText={t.cancel}
        confirmText={config.confirmText}
        destructive={config.destructive}
        onConfirm={() => setResult(config.done)}
        onCancel={() => setResult(t.cancelled)}
      />
      {result ? <span className="text-sm text-slate-500 dark:text-zinc-400">{result}</span> : null}
    </div>
  )
}
