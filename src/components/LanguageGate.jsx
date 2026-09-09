import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/language'
import { getUiCopy } from '../i18n/uiCopy'

function LanguageGate({ persistLanguage = true, onLanguageConfirmed }) {
  const { language, setLanguage } = useLanguage()
  const ui = getUiCopy(language)
  const [pendingLanguage, setPendingLanguage] = useState(language || '')
  const [error, setError] = useState('')

  useEffect(() => {
    setPendingLanguage((current) => current || language || '')
  }, [language])

  const handleConfirm = () => {
    if (!pendingLanguage) {
      setError(ui.languageGate.error)
      return
    }

    if (persistLanguage) {
      const didSet = setLanguage(pendingLanguage)
      if (!didSet) {
        setError(ui.languageGate.error)
        return
      }
    } else {
      onLanguageConfirmed?.(pendingLanguage)
    }

    setError('')
  }

  return (
    <section className="welcome-screen language-gate-screen">
      <div className="onboarding-card language-gate-card">
        <h1 className="onboarding-title language-gate-title">{ui.languageGate.title}</h1>
        <div className="language-gate-options" role="radiogroup" aria-label={ui.languageGate.title}>
          <label className="onboarding-skill-option language-gate-option">
            <input
              type="radio"
              name="language"
              value="it"
              checked={pendingLanguage === 'it'}
              onChange={(event) => {
                setPendingLanguage(event.target.value)
                setError('')
              }}
            />
            <span>{ui.languageGate.italian}</span>
          </label>

          <label className="onboarding-skill-option language-gate-option">
            <input
              type="radio"
              name="language"
              value="en"
              checked={pendingLanguage === 'en'}
              onChange={(event) => {
                setPendingLanguage(event.target.value)
                setError('')
              }}
            />
            <span>{ui.languageGate.english}</span>
          </label>
        </div>

        {error && <p className="onboarding-skill-error">{error}</p>}

        <div className="form-actions language-gate-actions">
          <button type="button" className="btn btn-action" onClick={handleConfirm}>
            {ui.languageGate.confirm}
          </button>
        </div>
      </div>
    </section>
  )
}

export default LanguageGate
