import { createContext, createElement, useContext, useMemo, useState } from 'react'

export const LANGUAGE_STORAGE_KEY = 'language'
export const ARTICLE_LANGUAGE_STORAGE_KEY = 'article_challenge_language'
export const DEFAULT_LANGUAGE = 'it'
const SUPPORTED_LANGUAGES = new Set(['it', 'en'])

function normalizeLanguage(value) {
  const normalized = String(value || '').trim().toLowerCase()
  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : ''
}

function readStoredLanguage() {
  if (typeof window === 'undefined' || !window.localStorage) return ''

  const isArticleEntry = new URLSearchParams(window.location.search).get('entry') === 'chart-exercise'
  if (isArticleEntry && window.sessionStorage) {
    const articleLanguage = normalizeLanguage(
      window.sessionStorage.getItem(ARTICLE_LANGUAGE_STORAGE_KEY),
    )
    if (articleLanguage) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, articleLanguage)
      return articleLanguage
    }
  }

  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [storedLanguage, setStoredLanguage] = useState(() => readStoredLanguage())

  const setLanguage = (nextLanguage) => {
    const normalized = normalizeLanguage(nextLanguage)
    if (!normalized) return false

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized)
    }
    setStoredLanguage(normalized)
    return true
  }

  const value = useMemo(() => {
    const language = storedLanguage || DEFAULT_LANGUAGE
    return {
      language,
      isLanguageConfirmed: Boolean(storedLanguage),
      setLanguage,
    }
  }, [storedLanguage])

  return createElement(LanguageContext.Provider, { value }, children)
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
