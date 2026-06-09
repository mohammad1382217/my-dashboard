import { createContext, useContext } from 'react'

export type Lang = 'fa' | 'en'

export interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Flip between Persian and English. */
  toggle: () => void
}

export const LangContext = createContext<LangContextValue | null>(null)

/** Read the current language (and switch it). Throws outside <LanguageProvider>. */
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (ctx === null) throw new Error('useLang must be used within <LanguageProvider>')
  return ctx
}
