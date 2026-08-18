import { useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../data/appConfig'
import { saveTesterRemote } from '../utils/dataTracking'
import { trackEvent } from '../utils/tracking'

const INITIAL_SKILL_OPTIONS = [
  'Mi oriento da solo.',
  'Ho qualche base ma mi perdo spesso.',
  'Spesso non so cosa guardare.',
]

const GRAPH_BLOCK_BEHAVIOR_OPTIONS = [
  { value: 'Lascio perdere o rimando', label: 'Lascio perdere o rimando' },
  {
    value: 'Cerco altre informazioni o spiegazioni (video, libri, forum, persone…)',
    label: 'Cerco altre informazioni o spiegazioni (video, libri, forum, persone…)',
  },
  {
    value: 'Continuo comunque e finisco spesso per decidere a sensazione',
    label: 'Continuo comunque e finisco spesso per decidere a sensazione',
  },
  { value: 'Non mi ci rivedo', label: 'Non mi ci rivedo' },
]

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
  const [name, setName] = useState('')
  const [initialSkillLevel, setInitialSkillLevel] = useState('')
  const [initialSkillError, setInitialSkillError] = useState('')
  const [graphBlockBehavior, setGraphBlockBehavior] = useState('')
  const [graphBlockBehaviorError, setGraphBlockBehaviorError] = useState('')
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
        setInitialSkillError('Seleziona un’opzione prima di continuare.')
        hasOnboardingError = true
      }

      if (!graphBlockBehavior) {
        setGraphBlockBehaviorError('Seleziona un’opzione prima di continuare.')
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
      console.log('AUTOVALUTAZIONE INIZIALE', {
        tester_id: trimmedName,
        livello_percepito: initialSkillLevel || '',
        comportamento_blocco_grafico: graphBlockBehavior || '',
      })
      saveTesterRemote({
        tester_id: trimmedName,
        filtro: initialSkillLevel || '',
        comportamento_blocco_grafico: graphBlockBehavior || '',
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
              <span></span>
              <span className="gradient-text"> Prototipo Test di Percep</span>
            </h1>
            <p className="lead">
              <strong></strong>.
            </p>
          </div>

          <div className="onboarding-info" aria-label="Informazioni sul test">
            <div className="onboarding-info-item">
              <span className="onboarding-info-dot" aria-hidden="true" />
              <span>Gli step <strong>allenano un modo di ragionare da utilizzare su timeframe e tipi di operatività diversi</strong></span>
            </div>
            <div className="onboarding-info-item">
              <span className="onboarding-info-dot" aria-hidden="true" />
              <span>
                Pensato per:{' '}
                <strong>chi parte da 0</strong>
              </span>
            </div>
          </div>

         

          <div className="onboarding-test-info">
            <h4>COME SI SVOLGE IL TEST:</h4>
            <div className="onboarding-test-details">
              <div className="onboarding-test-item">
                <span>2 percorsi:</span>
              </div>
              <div className="onboarding-test-item">
                <span>• Percorso"Da dove iniziare": <strong> 3 step per avere le basi pratiche</strong></span>
              </div>
              <div className="onboarding-test-item">
                <span>
                  • Percorso "Capire cosa guardare sul grafico":<strong> 9 step</strong>
                </span>
              </div>
              <div className="onboarding-test-item">
                <span>• 💻 <strong>Usa un computer per visualizzare meglio i grafici</strong></span>
              </div>
            </div>
          </div>

          <form className="profile-form onboarding-form" onSubmit={handleSubmit}>
            <p className="muted onboarding-form-note">
              <strong>Non è la versione definitiva. Verifichiamo prima che il metodo di apprendimento sia efficace.</strong>
             
            </p>

            <div className="onboarding-skill-card" role="group" aria-labelledby="initial-skill-title">
              <p id="initial-skill-title" className="onboarding-skill-title">📊 Sul grafico io…</p>
              <div className="onboarding-skill-options">
                {INITIAL_SKILL_OPTIONS.map((option) => (
                  <label key={option} className="onboarding-skill-option">
                    <input
                      type="radio"
                      name="initialSkillLevel"
                      value={option}
                      checked={initialSkillLevel === option}
                      onChange={(event) => {
                        setInitialSkillLevel(event.target.value)
                        setInitialSkillError('')
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {initialSkillError && (
                <p className="onboarding-skill-error">{initialSkillError}</p>
              )}
            </div>

            <div className="onboarding-skill-card" role="group" aria-labelledby="graph-block-behavior-title">
              <p id="graph-block-behavior-title" className="onboarding-skill-title">
                Quando non sai cosa guardare sul grafico, cosa fai dopo?
              </p>
              <div className="onboarding-skill-options">
                {GRAPH_BLOCK_BEHAVIOR_OPTIONS.map((option) => (
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

            <div className="field">
              <label htmlFor="profileName">Nome utente</label>
              <input
                id="profileName"
                name="profileName"
                type="text"
                placeholder="es. Marco"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-action">
                Salva e inizia
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
        <span className="eyebrow">Profilo</span>
        <h1 className="page-title">Il tuo profilo</h1>
      </header>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="profileName">Nome</label>
          <input
            id="profileName"
            name="profileName"
            type="text"
            placeholder="es. tester_03"
            value={name}
            readOnly
            required
          />
        </div>
      </form>

      <div className="profile-delete-card" role="group" aria-labelledby="profile-delete-title">
        <div className="profile-delete-info">
          <div className="profile-delete-text">
            <h3 id="profile-delete-title">Elimina il tuo profilo</h3>
            <p>
              Questa azione cancella il nome salvato e i dati locali del test su questo dispositivo.
            </p>
          </div>
        </div>
        <button type="button" className="profile-delete-button" onClick={handleDelete}>
          <span className="profile-delete-icon" aria-hidden="true">
            <TrashIcon className="profile-delete-icon-svg" />
          </span>
          <span>Elimina</span>
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="profile-delete-modal__backdrop" role="presentation">
          <div className="profile-delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
            <h3 id="delete-confirm-title">Sicuro di confermare?</h3>
            <p>Questa azione eliminerà il profilo e i dati salvati su questo dispositivo.</p>
            <div className="profile-delete-modal__actions">
              <button type="button" className="btn btn-outline" onClick={handleCancelDelete}>
                Indietro
              </button>
              <button type="button" className="btn btn-action" onClick={handleConfirmDelete}>
                Confermo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Profile
