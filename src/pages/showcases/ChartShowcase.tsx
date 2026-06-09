import { useState } from 'react'
import { useLang } from '../../i18n'
import { Chart } from '../../components/ui/Chart/Chart'
import { ToggleGroup } from '../../components/ui/ToggleGroup/ToggleGroup'

const STRINGS = {
  fa: {
    bar: 'میله‌ای',
    line: 'خطی',
    months: ['فرو', 'ارد', 'خرد', 'تیر', 'مرد', 'شهر'],
  },
  en: {
    bar: 'Bar',
    line: 'Line',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
} as const

const values = [12, 19, 9, 23, 17, 28]

/** Live demo of the dependency-free Chart. */
export function ChartShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [type, setType] = useState<'bar' | 'line'>('bar')
  const data = t.months.map((label, i) => ({ label, value: values[i] }))

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <ToggleGroup
        value={type}
        onValueChange={(v) => v && setType(v as 'bar' | 'line')}
        items={[
          { value: 'bar', label: t.bar },
          { value: 'line', label: t.line },
        ]}
      />
      <Chart data={data} type={type} height={220} valueFormatter={(v) => `${v}k`} />
    </div>
  )
}
