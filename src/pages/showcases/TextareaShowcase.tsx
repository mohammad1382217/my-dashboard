import { useState } from 'react'
import { Textarea } from '../../components/ui/Textarea/Textarea'
import { useLang } from '../../i18n'

const STRINGS = {
  fa: {
    messageLabel: 'پیام',
    messagePlaceholder: 'پیام خود را بنویسید…',
    bioLabel: 'بیوگرافی',
    bioHelper: 'توضیحی کوتاه درباره‌ی خودتان.',
    bioPlaceholder: 'درباره‌ی خودتان بگویید…',
    feedbackLabel: 'بازخورد',
    feedbackError: 'تکمیل این فیلد الزامی است.',
    feedbackPlaceholder: '…',
    disabledLabel: 'غیرفعال',
    disabledValue: 'فقط‌خواندنی',
    sizes: 'اندازه‌ها',
    smallPlaceholder: 'کوچک',
    smallAria: 'کوچک',
    largePlaceholder: 'بزرگ',
    largeAria: 'بزرگ',
  },
  en: {
    messageLabel: 'Message',
    messagePlaceholder: 'Write your message…',
    bioLabel: 'Bio',
    bioHelper: 'A short description about yourself.',
    bioPlaceholder: 'Tell us about you…',
    feedbackLabel: 'Feedback',
    feedbackError: 'This field is required.',
    feedbackPlaceholder: '…',
    disabledLabel: 'Disabled',
    disabledValue: 'Read only',
    sizes: 'Sizes',
    smallPlaceholder: 'Small',
    smallAria: 'Small',
    largePlaceholder: 'Large',
    largeAria: 'Large',
  },
} as const

/** Live gallery of the Textarea states, rendered inside the dashboard preview panel. */
export function TextareaShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [value, setValue] = useState('')

  return (
    <div className="grid gap-6">
      <Textarea
        label={t.messageLabel}
        placeholder={t.messagePlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Textarea
        label={t.bioLabel}
        helperText={t.bioHelper}
        placeholder={t.bioPlaceholder}
      />

      <Textarea label={t.feedbackLabel} required error={t.feedbackError} placeholder={t.feedbackPlaceholder} />

      <Textarea label={t.disabledLabel} disabled value={t.disabledValue} readOnly />

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.sizes}</span>
        <Textarea size="sm" placeholder={t.smallPlaceholder} aria-label={t.smallAria} />
        <Textarea size="lg" placeholder={t.largePlaceholder} aria-label={t.largeAria} />
      </div>
    </div>
  )
}
