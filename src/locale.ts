import { createContext, useContext } from 'react'

export type Locale = {
  pattern: string
  locale: string
}

export const defaultLocale: Locale = {
  locale: 'en',
  pattern: 'YYYY-MM-DD',
}

const LocaleContext = createContext<Locale>(null)

export const LocaleProvider = LocaleContext.Provider

export const useLocale = () => {
  const locale = useContext(LocaleContext)
  return locale
}
