import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { LangContext } from './i18n'
import type { Lang } from './i18n'

/**
 * App-wide language state. Persists the choice, and keeps the document's `lang`
 * and `dir` in sync (fa → rtl, en → ltr) so the whole UI flips direction.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'fa'
    const stored = window.localStorage.getItem('lang')
    return stored === 'en' || stored === 'fa' ? stored : 'fa'
  })

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'fa' ? 'rtl' : 'ltr'
    window.localStorage.setItem('lang', lang)
  }, [lang])

  const toggle = () => setLang((current) => (current === 'fa' ? 'en' : 'fa'))

  return <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>
}
