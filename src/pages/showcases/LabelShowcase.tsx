import { useLang } from '../../i18n'
import { Label } from '../../components/ui/Label/Label'
import { Input } from '../../components/ui/Input/Input'

const STRINGS = {
  fa: { email: 'ایمیل', placeholder: 'you@example.com', terms: 'با قوانین موافقم' },
  en: { email: 'Email', placeholder: 'you@example.com', terms: 'I accept the terms' },
} as const

/** Live demo of the Label paired with controls. */
export function LabelShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label-demo-email" required>
          {t.email}
        </Label>
        <Input id="label-demo-email" type="email" placeholder={t.placeholder} />
      </div>
      <div className="flex items-center gap-2">
        <input id="label-demo-terms" type="checkbox" className="peer size-4 accent-indigo-600" />
        <Label htmlFor="label-demo-terms">{t.terms}</Label>
      </div>
    </div>
  )
}
