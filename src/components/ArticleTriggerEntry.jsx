import { Fragment, useEffect, useMemo, useState } from 'react'
import { getExerciseById } from '../data/exercises'
import LanguageGate from './LanguageGate'
import { useLanguage } from '../i18n/language'
import { getUiCopy } from '../i18n/uiCopy'

const ARTICLE_PATH = '/articolo/come-capire-quando-entrare-trading'
const ARTICLE_URL = `https://primo-mvp-nexora.vercel.app${ARTICLE_PATH}`
const ARTICLE_LANGUAGE_STORAGE_KEY = 'article_challenge_language'
const SEO_COPY = {
  it: {
    title: 'Come capire quando entrare in un trade: quali conferme aspettare sul grafico?',
    description: 'Hai studiato trading ma fai fatica a capire quando valutare un ingresso? Rifletti su uno scenario pratico.',
  },
  en: {
    title: 'How to know when to enter a trade: which chart confirmations should you wait for?',
    description: 'Have you studied trading but struggle to know when to consider an entry? Reflect on a practical scenario.',
  },
  fa: {
    title: 'چگونه زمان ورود به معامله را تشخیص دهیم؟ منتظر چه تأییدهایی روی نمودار باشیم؟',
    description: 'آیا تریدینگ را مطالعه کرده‌اید اما تشخیص زمان بررسی ورود برایتان دشوار است؟ روی یک سناریوی عملی فکر کنید.',
  },
}

function getSeoMetaTags(language) {
  const copy = SEO_COPY[language] || SEO_COPY.it
  return [
  { attr: 'name', key: 'description', content: copy.description },
  { attr: 'name', key: 'robots', content: 'index,follow' },
  { attr: 'property', key: 'og:type', content: 'article' },
  { attr: 'property', key: 'og:title', content: copy.title },
  { attr: 'property', key: 'og:description', content: copy.description },
  { attr: 'property', key: 'og:url', content: ARTICLE_URL },
  { attr: 'property', key: 'og:image', content: 'https://primo-mvp-nexora.vercel.app/Grafici_2/domanda_trigger_3.jpeg' },
  { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
  { attr: 'name', key: 'twitter:title', content: copy.title },
  { attr: 'name', key: 'twitter:description', content: copy.description },
  { attr: 'name', key: 'twitter:image', content: 'https://primo-mvp-nexora.vercel.app/Grafici_2/domanda_trigger_3.jpeg' },
  ]
}

function renderTextWithBold(text) {
  const source = String(text ?? '')
  const parts = source.split(/(\*\*[\s\S]+?\*\*)/g)

  return parts.map((part, index) => {
    const match = part.match(/^\*\*([\s\S]+)\*\*$/)
    if (match) {
      return <strong key={`article-bold-${index}`}>{match[1]}</strong>
    }
    return <Fragment key={`article-text-${index}`}>{part}</Fragment>
  })
}

function buildRichTextBlocks(text) {
  const lines = String(text || '').split('\n')
  const blocks = []
  let paragraphLines = []
  let listItems = []

  const flushParagraph = () => {
    if (!paragraphLines.length) return
    blocks.push({ type: 'p', text: paragraphLines.join(' ') })
    paragraphLines = []
  }

  const flushList = () => {
    if (!listItems.length) return
    blocks.push({ type: 'ul', items: listItems })
    listItems = []
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    if (/^(?:•|-)(?!\*)\s*|^\*(?!\*)\s+/.test(trimmed)) {
      flushParagraph()
      listItems.push(trimmed.replace(/^(•|\*|-)\s*/, ''))
      return
    }

    flushList()
    paragraphLines.push(trimmed)
  })

  flushParagraph()
  flushList()
  return blocks
}

function renderRichText(text) {
  const blocks = buildRichTextBlocks(text)
  return blocks.map((block, index) => {
    if (block.type === 'ul') {
      return (
        <ul key={`article-ul-${index}`} className="article-rich-list">
          {block.items.map((item, itemIndex) => (
            <li key={`article-li-${index}-${itemIndex}`}>{renderTextWithBold(item)}</li>
          ))}
        </ul>
      )
    }

    return <p key={`article-p-${index}`}>{renderTextWithBold(block.text)}</p>
  })
}

function readArticleLanguage() {
  if (typeof window === 'undefined' || !window.sessionStorage) return ''
  const storedLanguage = window.sessionStorage.getItem(ARTICLE_LANGUAGE_STORAGE_KEY)
  return ['it', 'en', 'fa'].includes(storedLanguage) ? storedLanguage : ''
}

function applySeoTags(language) {
  const seoMetaTags = getSeoMetaTags(language)
  const head = document.head
  const previousTitle = document.title
  const previousMetaState = seoMetaTags.map(({ attr, key, content }) => {
    let element = head.querySelector(`meta[${attr}="${key}"]`)
    const existed = Boolean(element)
    const previousContent = element ? element.getAttribute('content') : null

    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attr, key)
      head.appendChild(element)
    }

    element.setAttribute('content', content)
    element.setAttribute('data-article-seo', 'true')

    return {
      element,
      existed,
      previousContent,
    }
  })

  let canonical = head.querySelector('link[rel="canonical"]')
  const canonicalExisted = Boolean(canonical)
  const previousCanonicalHref = canonical ? canonical.getAttribute('href') : null

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    head.appendChild(canonical)
  }

  canonical.setAttribute('href', ARTICLE_URL)
  canonical.setAttribute('data-article-seo', 'true')
  document.title = SEO_COPY[language]?.title || SEO_COPY.it.title

  return () => {
    document.title = previousTitle

    previousMetaState.forEach(({ element, existed, previousContent }) => {
      element.removeAttribute('data-article-seo')
      if (!existed) {
        element.remove()
        return
      }

      if (previousContent == null) {
        element.removeAttribute('content')
      } else {
        element.setAttribute('content', previousContent)
      }
    })

    canonical.removeAttribute('data-article-seo')
    if (!canonicalExisted) {
      canonical.remove()
      return
    }

    if (previousCanonicalHref == null) {
      canonical.removeAttribute('href')
    } else {
      canonical.setAttribute('href', previousCanonicalHref)
    }
  }
}

function ArticleTriggerEntry() {
  const [showReasoning, setShowReasoning] = useState(false)
  const { language: globalLanguage } = useLanguage()
  const [articleLanguage, setArticleLanguage] = useState(() => readArticleLanguage())
  const language = articleLanguage || globalLanguage
  const ui = getUiCopy(language)
  const article = ui.article
  const scenario = useMemo(() => getExerciseById('day2-ex3', language), [language])

  const handleArticleLanguageConfirmed = (nextLanguage) => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(ARTICLE_LANGUAGE_STORAGE_KEY, nextLanguage)
    }
    setArticleLanguage(nextLanguage)
  }

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    return applySeoTags(language)
  }, [language])

  if (!articleLanguage) {
    return (
      <LanguageGate
        persistLanguage={false}
        onLanguageConfirmed={handleArticleLanguageConfirmed}
      />
    )
  }

  if (!scenario) {
    return (
      <main className="article-page" dir={language === 'fa' ? 'rtl' : 'ltr'}>
        <article className="article-shell">
          <h1 className="article-title">{article.challengeTitle}</h1>
          <p>{article.unavailable}</p>
        </article>
      </main>
    )
  }

  const initialImage = scenario.imageBefore
  const explainedImage = scenario.imageAfter

  return (
    <main className="article-page" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <article className="article-shell">
        <header className="article-hero">
          <h1 className="article-title">{article.challengeTitle}</h1>
          <p className="article-kicker">{article.challengeQuestion}</p>
          <a href="#scenario-trigger" className="btn btn-outline article-jump-link">
            {article.startChallenge}
          </a>
        </header>

        <section id="scenario-trigger" className="article-scenario" aria-label={article.scenarioAriaLabel}>
          <h2 className="article-section-title">{article.scenarioTitle}</h2>

          <figure className="article-chart-card">
            <img src={initialImage} alt={article.initialImageAlt} loading="lazy" />
          </figure>

          <div className="article-copy-card">
            {renderRichText(scenario.question)}
            <ul className="article-answer-options" aria-label={article.answerOptionsLabel}>
              {scenario.answers.map((answer) => (
                <li key={answer.key}>{answer.key}. {answer.text}</li>
              ))}
            </ul>
          </div>

          <div className="article-reflection-space">
            <p>{article.reflectionPrompt}</p>
          </div>

          {!showReasoning && (
            <button
              type="button"
              className="btn btn-action"
              onClick={() => setShowReasoning(true)}
            >
              {article.showReasoning}
            </button>
          )}

          {showReasoning && (
            <div className="article-answer-block">
              <figure className="article-chart-card">
                <img src={explainedImage} alt={article.explainedImageAlt} loading="lazy" />
              </figure>

              <div className="article-copy-card article-copy-card--answer">
                <h3>{article.guidedReasoning}</h3>
                {renderRichText(scenario.feedback)}
              </div>
            </div>
          )}
        </section>

        <section className="article-cta-box" aria-label={article.ctaAriaLabel}>
          <h2>{article.ctaTitle}</h2>
          <p>{article.ctaText}</p>
          <a href="https://primo-mvp-nexora.vercel.app/" className="btn btn-action">
            {article.ctaButton}
          </a>
        </section>
      </article>
    </main>
  )
}

export default ArticleTriggerEntry
