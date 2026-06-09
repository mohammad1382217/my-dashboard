import { useState } from 'react'
import { useLang } from '../../i18n'
import { Pagination } from '../../components/ui/Pagination/Pagination'

const STRINGS = {
  fa: { page: 'صفحهٔ', of: 'از', prev: 'قبلی', next: 'بعدی', label: 'صفحه' },
  en: { page: 'Page', of: 'of', prev: 'Previous', next: 'Next', label: 'Pagination' },
} as const

/** Live demo of the Pagination control. */
export function PaginationShowcase() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [page, setPage] = useState(5)
  const count = 12

  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination page={page} count={count} onPageChange={setPage} label={t.label} prevLabel={t.prev} nextLabel={t.next} />
      <span className="text-sm text-slate-500 dark:text-zinc-400">
        {t.page} {page} {t.of} {count}
      </span>
    </div>
  )
}
