import { useState } from 'react'
import { useLang } from '../../i18n'
import { ToastProvider, useToast } from '../../components/ui/Toast/Toast'
import type { ToastPosition } from '../../components/ui/Toast/Toast'
import { Select } from '../../components/ui/Select/Select'
import { Button } from '../../components/ui/Button/Button'

const STRINGS = {
  fa: {
    positionLabel: 'جایگاه',
    success: 'موفقیت',
    successTitle: 'با موفقیت ذخیره شد',
    successDesc: 'تغییرات شما ذخیره شد.',
    error: 'خطا',
    errorTitle: 'ذخیره ناموفق بود',
    errorDesc: 'اتصال اینترنت را بررسی کنید.',
    warning: 'هشدار',
    warningTitle: 'فضای ذخیره‌سازی رو به اتمام است',
    warningDesc: 'تنها ۵٪ فضا باقی مانده.',
    gray: 'خاکستری',
    grayTitle: 'یک نکته',
    grayDesc: 'این یک پیام خنثی است.',
  },
  en: {
    positionLabel: 'Position',
    success: 'Success',
    successTitle: 'Saved successfully',
    successDesc: 'Your changes have been saved.',
    error: 'Error',
    errorTitle: 'Could not save',
    errorDesc: 'Please check your connection.',
    warning: 'Warning',
    warningTitle: 'Storage almost full',
    warningDesc: 'Only 5% of space is left.',
    gray: 'Gray',
    grayTitle: 'Heads up',
    grayDesc: 'This is a neutral message.',
  },
} as const

type Strings = (typeof STRINGS)[keyof typeof STRINGS]

const POSITIONS: { value: ToastPosition; fa: string; en: string }[] = [
  { value: 'top-left', fa: 'بالا چپ', en: 'Top left' },
  { value: 'top-center', fa: 'بالا وسط', en: 'Top center' },
  { value: 'top-right', fa: 'بالا راست', en: 'Top right' },
  { value: 'bottom-left', fa: 'پایین چپ', en: 'Bottom left' },
  { value: 'bottom-center', fa: 'پایین وسط', en: 'Bottom center' },
  { value: 'bottom-right', fa: 'پایین راست', en: 'Bottom right' },
]

function ToastButtons({ t }: { t: Strings }) {
  const toast = useToast()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => toast.success(t.successTitle, { description: t.successDesc })}>
        {t.success}
      </Button>
      <Button variant="destructive" onClick={() => toast.error(t.errorTitle, { description: t.errorDesc })}>
        {t.error}
      </Button>
      <Button variant="outline" onClick={() => toast.warning(t.warningTitle, { description: t.warningDesc })}>
        {t.warning}
      </Button>
      <Button variant="secondary" onClick={() => toast.message(t.grayTitle, { description: t.grayDesc })}>
        {t.gray}
      </Button>
    </div>
  )
}

/** Triggers each toast type and lets you switch the viewport position. */
export function ToastShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [position, setPosition] = useState<ToastPosition>('bottom-right')

  return (
    <div className="grid gap-5">
      <div className="max-w-xs">
        <Select
          label={t.positionLabel}
          value={position}
          onChange={(event) => setPosition(event.target.value as ToastPosition)}
        >
          {POSITIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {lang === 'fa' ? option.fa : option.en}
            </option>
          ))}
        </Select>
      </div>

      <ToastProvider position={position}>
        <ToastButtons t={t} />
      </ToastProvider>
    </div>
  )
}
