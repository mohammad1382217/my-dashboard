import { useState } from 'react'
import { useLang } from '../../i18n'
import { Form } from '../../components/ui/Form/Form'
import { Input } from '../../components/ui/Input/Input'
import { Textarea } from '../../components/ui/Textarea/Textarea'
import { Select } from '../../components/ui/Select/Select'
import { Switch } from '../../components/ui/Switch/Switch'
import { RadioGroup } from '../../components/ui/RadioGroup/RadioGroup'
import { Button } from '../../components/ui/Button/Button'

const STRINGS = {
  fa: {
    nameLabel: 'نام',
    namePlaceholder: 'نام و نام خانوادگی',
    emailLabel: 'ایمیل',
    countryLabel: 'کشور',
    countryPlaceholder: 'یک کشور انتخاب کنید',
    us: 'ایالات متحده',
    de: 'آلمان',
    ir: 'ایران',
    planLabel: 'پلن',
    planFree: 'رایگان',
    planPro: 'حرفه‌ای',
    bioLabel: 'درباره‌ی شما',
    bioPlaceholder: 'یک توضیح کوتاه…',
    newsletterLabel: 'عضویت در خبرنامه',
    submit: 'ثبت',
    reset: 'پاک کردن',
    submitted: 'مقادیر ارسال‌شده',
  },
  en: {
    nameLabel: 'Name',
    namePlaceholder: 'Full name',
    emailLabel: 'Email',
    countryLabel: 'Country',
    countryPlaceholder: 'Select a country',
    us: 'United States',
    de: 'Germany',
    ir: 'Iran',
    planLabel: 'Plan',
    planFree: 'Free',
    planPro: 'Pro',
    bioLabel: 'About you',
    bioPlaceholder: 'A short description…',
    newsletterLabel: 'Subscribe to the newsletter',
    submit: 'Submit',
    reset: 'Reset',
    submitted: 'Submitted values',
  },
} as const

/** A realistic form composed from the library's fields, wired through <Form>. */
export function FormShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [submitted, setSubmitted] = useState<Record<string, string> | null>(null)

  return (
    <Form onSubmit={(values) => setSubmitted(values)}>
      <Input name="name" label={t.nameLabel} placeholder={t.namePlaceholder} required />
      <Input name="email" type="email" label={t.emailLabel} placeholder="you@example.com" required />

      <Select name="country" label={t.countryLabel} placeholder={t.countryPlaceholder} defaultValue="">
        <option value="us">{t.us}</option>
        <option value="de">{t.de}</option>
        <option value="ir">{t.ir}</option>
      </Select>

      <RadioGroup
        name="plan"
        label={t.planLabel}
        orientation="horizontal"
        defaultValue="free"
        options={[
          { value: 'free', label: t.planFree },
          { value: 'pro', label: t.planPro },
        ]}
      />

      <Textarea name="bio" label={t.bioLabel} placeholder={t.bioPlaceholder} />

      <Switch name="newsletter" value="yes" label={t.newsletterLabel} />

      <div className="flex items-center gap-3">
        <Button type="submit">{t.submit}</Button>
        <Button type="reset" variant="outline" onClick={() => setSubmitted(null)}>
          {t.reset}
        </Button>
      </div>

      {submitted ? (
        <div className="grid gap-1.5">
          <span className="text-xs font-medium text-neutral-400">{t.submitted}</span>
          <pre
            dir="ltr"
            className="overflow-x-auto rounded-lg bg-zinc-900 p-3 text-left text-xs text-zinc-100 dark:bg-zinc-950"
          >
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      ) : null}
    </Form>
  )
}
