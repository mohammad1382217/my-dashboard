import { useLang } from '../../i18n'
import { ButtonGroup } from '../../components/ui/ButtonGroup/ButtonGroup'
import { Button } from '../../components/ui/Button/Button'

const STRINGS = {
  fa: { day: 'روز', week: 'هفته', month: 'ماه', prev: 'قبلی', next: 'بعدی' },
  en: { day: 'Day', week: 'Week', month: 'Month', prev: 'Prev', next: 'Next' },
} as const

/** Live demo of the ButtonGroup segmented control. */
export function ButtonGroupShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">{t.day}</Button>
        <Button variant="outline">{t.week}</Button>
        <Button variant="outline">{t.month}</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary">{t.prev}</Button>
        <Button variant="secondary">{t.next}</Button>
      </ButtonGroup>
    </div>
  )
}
