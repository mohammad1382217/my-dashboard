import { useLang } from '../../i18n'
import { Select } from '../../components/ui/Select/Select'

const STRINGS = {
  fa: {
    countryLabel: 'کشور',
    countryPlaceholder: 'یک کشور انتخاب کنید',
    countryUs: 'ایالات متحده',
    countryDe: 'آلمان',
    countryIr: 'ایران',
    fruitLabel: 'میوه',
    fruitHelper: 'میوهٔ موردعلاقه‌تان را انتخاب کنید.',
    fruitApple: 'سیب',
    fruitBanana: 'موز',
    fruitCherry: 'گیلاس',
    planLabel: 'طرح',
    planError: 'لطفاً یک طرح انتخاب کنید.',
    planPlaceholder: 'انتخاب کنید…',
    planFree: 'رایگان',
    planPro: 'حرفه‌ای',
    disabledLabel: 'غیرفعال',
    disabledOptionA: 'گزینهٔ الف',
    sizes: 'اندازه‌ها',
    small: 'کوچک',
    large: 'بزرگ',
  },
  en: {
    countryLabel: 'Country',
    countryPlaceholder: 'Select a country',
    countryUs: 'United States',
    countryDe: 'Germany',
    countryIr: 'Iran',
    fruitLabel: 'Fruit',
    fruitHelper: 'Pick your favorite.',
    fruitApple: 'Apple',
    fruitBanana: 'Banana',
    fruitCherry: 'Cherry',
    planLabel: 'Plan',
    planError: 'Please choose a plan.',
    planPlaceholder: 'Choose…',
    planFree: 'Free',
    planPro: 'Pro',
    disabledLabel: 'Disabled',
    disabledOptionA: 'Option A',
    sizes: 'Sizes',
    small: 'Small',
    large: 'Large',
  },
} as const

/** Live gallery of the Select states, rendered inside the dashboard preview panel. */
export function SelectShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="grid gap-6">
      <Select label={t.countryLabel} placeholder={t.countryPlaceholder} defaultValue="">
        <option value="us">{t.countryUs}</option>
        <option value="de">{t.countryDe}</option>
        <option value="ir">{t.countryIr}</option>
      </Select>

      <Select label={t.fruitLabel} helperText={t.fruitHelper} defaultValue="apple">
        <option value="apple">{t.fruitApple}</option>
        <option value="banana">{t.fruitBanana}</option>
        <option value="cherry">{t.fruitCherry}</option>
      </Select>

      <Select label={t.planLabel} required error={t.planError} placeholder={t.planPlaceholder} defaultValue="">
        <option value="free">{t.planFree}</option>
        <option value="pro">{t.planPro}</option>
      </Select>

      <Select label={t.disabledLabel} disabled defaultValue="a">
        <option value="a">{t.disabledOptionA}</option>
      </Select>

      <div className="grid gap-3">
        <span className="text-xs font-medium text-neutral-400">{t.sizes}</span>
        <Select size="sm" aria-label={t.small} defaultValue="1">
          <option value="1">{t.small}</option>
        </Select>
        <Select size="lg" aria-label={t.large} defaultValue="1">
          <option value="1">{t.large}</option>
        </Select>
      </div>
    </div>
  )
}
