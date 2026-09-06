import { Fragment, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../data/appConfig'
import { saveTesterRemote } from '../utils/dataTracking'
import { trackEvent } from '../utils/tracking'
import { useLanguage } from '../i18n/language'
import {
  getChartReadingPracticeOptions,
  getGraphBlockBehaviorOptions,
  getProfileSkillOptions,
  getUiCopy,
} from '../i18n/uiCopy'

const USO_TV_STORAGE_KEY = 'uso_TV'

function renderTextWithBold(text) {
  const source = String(text ?? '')
  const parts = source.split(/(\*\*[\s\S]+?\*\*)/g)

  return parts.map((part, index) => {
    const match = part.match(/^\*\*([\s\S]+)\*\*$/)
    if (match) {
      return <strong key={`profile-bold-${index}`}>{match[1]}</strong>
    }
    return <Fragment key={`profile-text-${index}`}>{part}</Fragment>
  })
}

function readTesterId() {
  if (typeof window === 'undefined' || !window.localStorage) return ''
  return window.localStorage.getItem('nexora_tester_id') || ''
}

function readProfile() {
  if (typeof window === 'undefined' || !window.localStorage) return { name: '' }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.profile)
    if (!raw) return { name: '' }
    const parsed = JSON.parse(raw)
    return { name: parsed.name || '' }
  } catch (error) {
    console.warn('Errore nel parsing del profilo salvato', error)
    return { name: '' }
  }
}

function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M9.5 4.5h5a1 1 0 0 1 .99.86l.21 1.64h3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 7.5h12l-.9 11.1a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 11.25v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 11.25v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Profile({ onSave, onDelete }) {
  const { language } = useLanguage()
  const ui = getUiCopy(language)
  const copy = ui.profile
  const initialSkillOptions = getProfileSkillOptions(language)
  const graphBlockBehaviorOptions = getGraphBlockBehaviorOptions(language)
  const chartReadingPracticeOptions = getChartReadingPracticeOptions(language)

  const [name, setName] = useState('')
  const [initialSkillLevel, setInitialSkillLevel] = useState('')
  const [initialSkillError, setInitialSkillError] = useState('')
  const [graphBlockBehavior, setGraphBlockBehavior] = useState('')
  const [graphBlockBehaviorError, setGraphBlockBehaviorError] = useState('')
  const [chartReadingPractice, setChartReadingPractice] = useState('')
  const [chartReadingPracticeError, setChartReadingPracticeError] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const storedTesterId = readTesterId().trim()
    const existing = readProfile()
    const initialName = (existing.name || storedTesterId || '').trim()
    setName(initialName)
    setShowOnboarding(!storedTesterId)
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    if (showOnboarding) {
      let hasOnboardingError = false

      if (!initialSkillLevel) {
        setInitialSkillError(copy.optionError)
        hasOnboardingError = true
      }

      if (!graphBlockBehavior) {
        setGraphBlockBehaviorError(copy.optionError)
        hasOnboardingError = true
      }

      if (!chartReadingPractice) {
        setChartReadingPracticeError(copy.optionError)
        hasOnboardingError = true
      }

      if (hasOnboardingError) {
        return
      }
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEYS.profile,
        JSON.stringify({ name: trimmedName, savedAt: new Date().toISOString() }),
      )
      window.localStorage.setItem('nexora_tester_id', trimmedName)
      if (showOnboarding) {
        window.localStorage.setItem(USO_TV_STORAGE_KEY, chartReadingPractice || '')
      }
      console.log('AUTOVALUTAZIONE INIZIALE', {
        tester_id: trimmedName,
        livello_percepito: initialSkillLevel || '',
        comportamento_blocco_grafico: graphBlockBehavior || '',
        uso_TV: chartReadingPractice || '',
      })
      saveTesterRemote({
        tester_id: trimmedName,
        filtro: initialSkillLevel || '',
        comportamento_blocco_grafico: graphBlockBehavior || '',
        uso_TV: chartReadingPractice || '',
        language,
        timestamp: new Date().toISOString(),
      })
      trackEvent({ type: 'profile_saved', tester_id: trimmedName || null })
      if (onSave) onSave(trimmedName)
    } catch (error) {
      console.warn('Impossibile salvare il profilo', error)
    }
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    try {
      if (onDelete) onDelete()
      setName('')
      setShowOnboarding(true)
      setShowDeleteConfirm(false)
    } catch (error) {
      console.warn('Impossibile eliminare il profilo', error)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  if (showOnboarding) {
    return (
      <section className="profile profile-onboarding">
        <div className="onboarding-card">
          <div className="onboarding-hero">
            <h1 className="onboarding-title">
              <span className="gradient-text">{copy.onboardingTitle}</span>
            </h1>
            <p className="lead">{copy.onboardingLead}</p>
          </div>

          <div className="onboarding-info" aria-label={copy.onboardingInfoAriaLabel}>
            {copy.onboardingPoints.map((point) => (
              <div key={point} className="onboarding-info-item">
                <span className="onboarding-info-dot" aria-hidden="true" />
                <span>{renderTextWithBold(point)}</span>
              </div>
            ))}
          </div>

         

          <div className="onboarding-test-info">
            <h4>{copy.testInfoTitle}</h4>
            <div className="onboarding-test-details">
              {copy.testInfoItems.map((item) => (
                <div key={item} className="onboarding-test-item">
                  <span>{renderTextWithBold(item)}</span>
                </div>
              ))}
            </div>
          </div>

          <form className="profile-form onboarding-form" onSubmit={handleSubmit}>
            <p className="muted onboarding-form-note">
              {renderTextWithBold(copy.formNote)}
             
            </p>

            <div className="onboarding-skill-card" role="group" aria-labelledby="initial-skill-title">
              <p id="initial-skill-title" className="onboarding-skill-title">{copy.initialSkillTitle}</p>
              <div className="onboarding-skill-options">
                {initialSkillOptions.map((option) => (
                  <label key={option.value} className="onboarding-skill-option">
                    <input
                      type="radio"
                      name="initialSkillLevel"
                      value={option.value}
                      checked={initialSkillLevel === option.value}
                      onChange={(event) => {
                        setInitialSkillLevel(event.target.value)
                        setInitialSkillError('')
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {initialSkillError && (
                <p className="onboarding-skill-error">{initialSkillError}</p>
              )}
            </div>

            <div className="onboarding-skill-card" role="group" aria-labelledby="graph-block-behavior-title">
              <p id="graph-block-behavior-title" className="onboarding-skill-title">
                {copy.graphBlockTitle}
              </p>
              <div className="onboarding-skill-options">
                {graphBlockBehaviorOptions.map((option) => (
                  <label key={option.value} className="onboarding-skill-option">
                    <input
                      type="radio"
                      name="graphBlockBehavior"
                      value={option.value}
                      checked={graphBlockBehavior === option.value}
                      onChange={(event) => {
                        setGraphBlockBehavior(event.target.value)
                        setGraphBlockBehaviorError('')
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {graphBlockBehaviorError && (
                <p className="onboarding-skill-error">{graphBlockBehaviorError}</p>
              )}
            </div>

            <div className="onboarding-skill-card" role="group" aria-labelledby="chart-reading-practice-title">
              <p id="chart-reading-practice-title" className="onboarding-skill-title">
                {copy.chartPracticeTitle}
              </p>
              <div className="onboarding-skill-options">
                {chartReadingPracticeOptions.map((option) => (
                  <label key={option.value} className="onboarding-skill-option">
                    <input
                      type="radio"
                      name="chartReadingPractice"
                      value={option.value}
                      checked={chartReadingPractice === option.value}
                      onChange={(event) => {
                        setChartReadingPractice(event.target.value)
                        setChartReadingPracticeError('')
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {chartReadingPracticeError && (
                <p className="onboarding-skill-error">{chartReadingPracticeError}</p>
              )}
            </div>

            <div className="field">
              <label htmlFor="profileName">{copy.usernameLabel}</label>
              <input
                id="profileName"
                name="profileName"
                type="text"
                placeholder={copy.usernamePlaceholder}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-action">
                {copy.submit}
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="profile">
      <header className="profile-head">
        <span className="eyebrow">{copy.profileEyebrow}</span>
        <h1 className="page-title">{copy.profileTitle}</h1>
      </header>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="profileName">{copy.profileNameLabel}</label>
          <input
            id="profileName"
            name="profileName"
            type="text"
            placeholder={copy.profileNamePlaceholder}
            value={name}
            readOnly
            required
          />
        </div>
      </form>

      <div className="profile-delete-card" role="group" aria-labelledby="profile-delete-title">
        <div className="profile-delete-info">
          <div className="profile-delete-text">
            <h3 id="profile-delete-title">{copy.deleteTitle}</h3>
            <p>
              {copy.deleteText}
            </p>
          </div>
        </div>
        <button type="button" className="profile-delete-button" onClick={handleDelete}>
          <span className="profile-delete-icon" aria-hidden="true">
            <TrashIcon className="profile-delete-icon-svg" />
          </span>
          <span>{copy.deleteButton}</span>
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="profile-delete-modal__backdrop" role="presentation">
          <div className="profile-delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
            <h3 id="delete-confirm-title">{copy.deleteConfirmTitle}</h3>
            <p>{copy.deleteConfirmText}</p>
            <div className="profile-delete-modal__actions">
              <button type="button" className="btn btn-outline" onClick={handleCancelDelete}>
                {copy.deleteBack}
              </button>
              <button type="button" className="btn btn-action" onClick={handleConfirmDelete}>
                {copy.deleteConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Profile
