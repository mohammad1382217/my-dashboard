import { useState } from 'react'
import { useLang } from '../../i18n'
import { BottomSheet } from '../../components/ui/BottomSheet/BottomSheet'
import { Button } from '../../components/ui/Button/Button'
import { RadioGroup } from '../../components/ui/RadioGroup/RadioGroup'

const STRINGS = {
  fa: {
    open: 'باز کردن شیت',
    title: 'مرتب‌سازی بر اساس',
    description: 'یک گزینه را انتخاب کنید.',
    newest: 'جدیدترین',
    cheapest: 'ارزان‌ترین',
    popular: 'محبوب‌ترین',
    apply: 'اعمال',
    close: 'بستن',
  },
  en: {
    open: 'Open sheet',
    title: 'Sort by',
    description: 'Pick one option.',
    newest: 'Newest',
    cheapest: 'Cheapest',
    popular: 'Most popular',
    apply: 'Apply',
    close: 'Close',
  },
} as const

/** Live demo of the BottomSheet, rendered inside the dashboard preview panel. */
export function BottomSheetShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [open, setOpen] = useState(false)
  const [sort, setSort] = useState('newest')

  return (
    <div>
      <Button onClick={() => setOpen(true)}>{t.open}</Button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={t.title}
        description={t.description}
        closeLabel={t.close}
        footer={<Button onClick={() => setOpen(false)}>{t.apply}</Button>}
      >
        <RadioGroup
          value={sort}
          onValueChange={setSort}
          options={[
            { value: 'newest', label: t.newest },
            { value: 'cheapest', label: t.cheapest },
            { value: 'popular', label: t.popular },
          ]}
        />
      </BottomSheet>
    </div>
  )
}
