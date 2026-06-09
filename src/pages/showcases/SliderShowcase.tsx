import { useState } from 'react'
import { useLang } from '../../i18n'
import { Slider } from '../../components/ui/Slider/Slider'

const STRINGS = {
  fa: { volume: 'بلندی صدا', brightness: 'روشنایی', disabled: 'غیرفعال' },
  en: { volume: 'Volume', brightness: 'Brightness', disabled: 'Disabled' },
} as const

/** Live gallery of the Slider, rendered inside the dashboard preview panel. */
export function SliderShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [volume, setVolume] = useState(40)

  return (
    <div className="grid max-w-sm gap-6">
      <Slider
        label={t.volume}
        showValue
        min={0}
        max={100}
        value={volume}
        onChange={(event) => setVolume(Number(event.target.value))}
      />
      <Slider label={t.brightness} min={0} max={100} step={10} defaultValue={70} showValue />
      <Slider label={t.disabled} disabled defaultValue={30} />
    </div>
  )
}
