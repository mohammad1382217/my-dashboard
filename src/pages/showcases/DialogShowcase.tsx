import { useState } from 'react'
import { useLang } from '../../i18n'
import { Dialog } from '../../components/ui/Dialog/Dialog'
import { Button } from '../../components/ui/Button/Button'

const STRINGS = {
  fa: {
    openButton: 'حذف حساب',
    title: 'حذف حساب کاربری',
    description: 'این عمل قابل بازگشت نیست.',
    body: 'با حذف حساب، همهٔ داده‌های شما برای همیشه پاک می‌شود. مطمئن هستید؟',
    cancel: 'انصراف',
    confirm: 'حذف کن',
    close: 'بستن',
  },
  en: {
    openButton: 'Delete account',
    title: 'Delete account',
    description: 'This action cannot be undone.',
    body: 'Deleting your account permanently removes all of your data. Are you sure?',
    cancel: 'Cancel',
    confirm: 'Delete',
    close: 'Close',
  },
} as const

/** Live demo of the Dialog, rendered inside the dashboard preview panel. */
export function DialogShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        {t.openButton}
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={t.title}
        description={t.description}
        closeLabel={t.close}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t.cancel}
            </Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              {t.confirm}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-zinc-400">{t.body}</p>
      </Dialog>
    </div>
  )
}
