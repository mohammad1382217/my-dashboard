import { useLang } from '../../i18n'
import { Resizable } from '../../components/ui/Resizable/Resizable'

const STRINGS = {
  fa: {
    nav: 'ناوبری',
    navBody: 'این پنل را با کشیدنِ دستگیره یا کلیدهای جهت‌دار تغییراندازه بده.',
    content: 'محتوا',
    contentBody: 'پنل دوم فضای باقی‌مانده را پر می‌کند.',
  },
  en: {
    nav: 'Navigation',
    navBody: 'Resize this panel by dragging the handle or using the arrow keys.',
    content: 'Content',
    contentBody: 'The second panel fills the remaining space.',
  },
} as const

/** Live demo of the Resizable panels. */
export function ResizableShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]

  return (
    <Resizable
      className="h-56 w-full max-w-lg"
      defaultSize={35}
      first={
        <div className="h-full bg-slate-50 p-4 dark:bg-zinc-800/40">
          <p className="text-sm font-medium text-fg">{t.nav}</p>
          <p className="mt-1 text-xs text-muted">{t.navBody}</p>
        </div>
      }
      second={
        <div className="h-full p-4">
          <p className="text-sm font-medium text-fg">{t.content}</p>
          <p className="mt-1 text-xs text-muted">{t.contentBody}</p>
        </div>
      }
    />
  )
}
