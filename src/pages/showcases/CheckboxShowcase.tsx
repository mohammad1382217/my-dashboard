import { useState } from 'react'
import { useLang } from '../../i18n'
import { Checkbox } from '../../components/ui/Checkbox/Checkbox'

const STRINGS = {
  fa: {
    terms: 'شرایط و قوانین را می‌پذیرم',
    newsletter: 'عضویت در خبرنامه',
    newsletterHelper: 'هر زمان بخواهید می‌توانید لغو کنید.',
    required: 'پذیرش الزامی است.',
    disabledOff: 'گزینهٔ غیرفعال',
    disabledOn: 'غیرفعالِ تیک‌خورده',
    selectAll: 'انتخاب همه',
    apples: 'سیب',
    bananas: 'موز',
    cherries: 'گیلاس',
  },
  en: {
    terms: 'I accept the terms and conditions',
    newsletter: 'Subscribe to the newsletter',
    newsletterHelper: 'You can unsubscribe anytime.',
    required: 'Acceptance is required.',
    disabledOff: 'Disabled option',
    disabledOn: 'Disabled, checked',
    selectAll: 'Select all',
    apples: 'Apples',
    bananas: 'Bananas',
    cherries: 'Cherries',
  },
} as const

/** Live gallery of the Checkbox states, rendered inside the dashboard preview panel. */
export function CheckboxShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [fruits, setFruits] = useState([true, false, false])

  const allChecked = fruits.every(Boolean)
  const someChecked = fruits.some(Boolean)
  const fruitLabels = [t.apples, t.bananas, t.cherries]

  return (
    <div className="grid gap-6">
      <Checkbox label={t.terms} defaultChecked />

      <Checkbox label={t.newsletter} helperText={t.newsletterHelper} />

      <Checkbox label={t.terms} required error={t.required} />

      <div className="flex flex-wrap gap-6">
        <Checkbox label={t.disabledOff} disabled />
        <Checkbox label={t.disabledOn} disabled defaultChecked />
      </div>

      {/* Indeterminate "select all" pattern */}
      <div className="grid gap-2 border-t border-slate-200 pt-4 dark:border-zinc-800">
        <Checkbox
          label={t.selectAll}
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onCheckedChange={(checked) => setFruits(fruits.map(() => checked))}
        />
        <div className="grid gap-2 ps-7">
          {fruitLabels.map((fruitLabel, index) => (
            <Checkbox
              key={fruitLabel}
              label={fruitLabel}
              checked={fruits[index]}
              onCheckedChange={(checked) =>
                setFruits(fruits.map((value, i) => (i === index ? checked : value)))
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
