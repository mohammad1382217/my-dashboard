import { useLang } from '../../i18n'
import { ScrollArea } from '../../components/ui/ScrollArea/ScrollArea'
import { Separator } from '../../components/ui/Separator/Separator'

const STRINGS = {
  fa: { title: 'برچسب‌ها', tag: 'برچسب' },
  en: { title: 'Tags', tag: 'Tag' },
} as const

/** Live demo of the ScrollArea with styled scrollbars. */
export function ScrollAreaShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const tags = Array.from({ length: 24 }, (_, i) => `${t.tag} ${i + 1}`)

  return (
    <ScrollArea className="h-56 w-56 rounded-lg border border-slate-200 p-4 dark:border-zinc-800">
      <p className="mb-2 text-sm font-medium text-slate-900 dark:text-zinc-100">{t.title}</p>
      {tags.map((tag, index) => (
        <div key={tag}>
          <div className="py-1.5 text-sm text-slate-600 dark:text-zinc-400">{tag}</div>
          {index < tags.length - 1 ? <Separator /> : null}
        </div>
      ))}
    </ScrollArea>
  )
}
