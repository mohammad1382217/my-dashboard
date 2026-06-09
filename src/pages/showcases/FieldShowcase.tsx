import { useState } from 'react'
import { useLang } from '../../i18n'
import { Field } from '../../components/ui/Field/Field'
import { Input } from '../../components/ui/Input/Input'

const STRINGS = {
  fa: {
    email: 'ایمیل',
    emailDesc: 'هیچ‌وقت آن را با کسی به اشتراک نمی‌گذاریم.',
    emailErr: 'یک ایمیل معتبر وارد کنید.',
    placeholder: 'you@example.com',
  },
  en: {
    email: 'Email',
    emailDesc: 'We will never share it with anyone.',
    emailErr: 'Enter a valid email address.',
    placeholder: 'you@example.com',
  },
} as const

/** Live demo of the Field wrapper (label + control + description/error wiring). */
export function FieldShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [value, setValue] = useState('not-an-email')
  const invalid = value.length > 0 && !value.includes('@')

  return (
    <div className="w-full max-w-sm">
      <Field label={t.email} required description={t.emailDesc} error={invalid ? t.emailErr : undefined}>
        <Input type="email" value={value} onChange={(e) => setValue(e.target.value)} placeholder={t.placeholder} />
      </Field>
    </div>
  )
}
