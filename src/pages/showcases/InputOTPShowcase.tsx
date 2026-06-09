import { useState } from 'react'
import { useLang } from '../../i18n'
import { InputOTP } from '../../components/ui/InputOTP/InputOTP'

const STRINGS = {
  fa: {
    verifyLabel: 'کد تأیید',
    verifyHelper: 'کد ۶ رقمی ارسال‌شده را وارد کنید.',
    entered: 'واردشده:',
    completed: '✓ کد کامل شد',
    fourLabel: 'چهار رقمی',
    errorLabel: 'حالت خطا',
    errorMsg: 'کد نامعتبر است.',
    disabledLabel: 'غیرفعال',
  },
  en: {
    verifyLabel: 'Verification code',
    verifyHelper: 'Enter the 6-digit code we sent you.',
    entered: 'Entered:',
    completed: '✓ Code complete',
    fourLabel: 'Four digits',
    errorLabel: 'Error state',
    errorMsg: 'Invalid code.',
    disabledLabel: 'Disabled',
  },
} as const

/** Live gallery of the InputOTP states, rendered inside the dashboard preview panel. */
export function InputOTPShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [code, setCode] = useState('')
  const [done, setDone] = useState(false)

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <InputOTP
          label={t.verifyLabel}
          helperText={t.verifyHelper}
          value={code}
          onChange={(value) => {
            setCode(value)
            if (value.length < 6) setDone(false)
          }}
          onComplete={() => setDone(true)}
        />
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {done ? (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{t.completed}</span>
          ) : (
            <>
              {t.entered} <span className="font-mono">{code || '—'}</span>
            </>
          )}
        </span>
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.fourLabel}</span>
        <InputOTP length={4} defaultValue="12" />
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.errorLabel}</span>
        <InputOTP defaultValue="123" error={t.errorMsg} />
      </div>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.disabledLabel}</span>
        <InputOTP defaultValue="123456" disabled />
      </div>
    </div>
  )
}
