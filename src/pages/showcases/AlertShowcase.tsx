import { useLang } from '../../i18n'
import { Alert } from '../../components/ui/Alert/Alert'

const STRINGS = {
  fa: {
    infoT: 'به‌روزرسانی',
    infoD: 'نسخهٔ جدیدی از داشبورد در دسترس است.',
    successT: 'ذخیره شد',
    successD: 'تغییرات شما با موفقیت ثبت شد.',
    warningT: 'فضای کم',
    warningD: 'فقط ۱۰٪ از فضای ذخیره‌سازی باقی مانده.',
    errorT: 'خطا در پرداخت',
    errorD: 'کارت شما رد شد؛ روش دیگری را امتحان کنید.',
  },
  en: {
    infoT: 'Update available',
    infoD: 'A new version of the dashboard is ready.',
    successT: 'Saved',
    successD: 'Your changes were stored successfully.',
    warningT: 'Low storage',
    warningD: 'Only 10% of your storage is left.',
    errorT: 'Payment failed',
    errorD: 'Your card was declined; try another method.',
  },
} as const

/** Live demo of the four Alert variants. */
export function AlertShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert variant="info" title={t.infoT}>
        {t.infoD}
      </Alert>
      <Alert variant="success" title={t.successT}>
        {t.successD}
      </Alert>
      <Alert variant="warning" title={t.warningT}>
        {t.warningD}
      </Alert>
      <Alert variant="error" title={t.errorT}>
        {t.errorD}
      </Alert>
    </div>
  )
}
