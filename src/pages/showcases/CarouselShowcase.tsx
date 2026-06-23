import { useLang } from '../../i18n'
import { Carousel } from '../../components/ui/Carousel/Carousel'

const STRINGS = {
  fa: {
    label: 'گالری',
    one: 'اسلاید یک',
    two: 'اسلاید دو',
    three: 'اسلاید سه',
    four: 'اسلاید چهار',
    hint: 'با دکمه‌ها، نقطه‌ها یا کلیدهای جهت‌دار جابه‌جا شوید.',
  },
  en: {
    label: 'Gallery',
    one: 'Slide one',
    two: 'Slide two',
    three: 'Slide three',
    four: 'Slide four',
    hint: 'Move with the buttons, dots or arrow keys.',
  },
} as const

const GRADIENTS = [
  'from-primary-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
]

/** Live demo of the Carousel, rendered inside the dashboard preview panel. */
export function CarouselShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const labels = [t.one, t.two, t.three, t.four]

  return (
    <div className="grid max-w-md gap-3">
      <Carousel
        label={t.label}
        loop
        items={labels.map((labelText, i) => (
          <div
            key={labelText}
            className={`grid h-44 place-items-center bg-gradient-to-br ${GRADIENTS[i]} text-2xl font-bold text-white`}
          >
            {labelText}
          </div>
        ))}
      />
      <p className="text-center text-sm text-muted">{t.hint}</p>
    </div>
  )
}
