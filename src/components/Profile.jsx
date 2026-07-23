import { useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../data/appConfig'
import { saveTesterRemote } from '../utils/dataTracking'
import { trackEvent } from '../utils/tracking'

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

    try {
      window.localStorage.setItem(
        STORAGE_KEYS.profile,
        JSON.stringify({ name: trimmedName, savedAt: new Date().toISOString() }),
      )
      window.localStorage.setItem('nexora_tester_id', trimmedName)
      saveTesterRemote({ tester_id: trimmedName })
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
              <span className="gradient-text">Il primo prototipo di Nexora</span>
            </h1>
            <p className="lead">
              <strong>Questo è un test per validare il metodo di apprendimento</strong>.
            </p>
          </div>

          <div className="onboarding-info" aria-label="Informazioni sul test">
            <div className="onboarding-info-item">
              <span className="onboarding-info-dot" aria-hidden="true" />
              <span>Focus su <strong>comprensione</strong>, non sul profitto</span>
            </div>
            <div className="onboarding-info-item">
              <span className="onboarding-info-dot" aria-hidden="true" />
              <span>
                Pensato per:{' '}
                <strong>chi è alle prime armi o sta costruendo un metodo</strong>
              </span>
            </div>
          </div>

         

          <div className="onboarding-test-info">
            <h4>COME SI SVOLGE IL TEST:</h4>
            <div className="onboarding-test-details">
              <div className="onboarding-test-item">
                <span>• Durata: <strong>3 giorni · 9 esercizi · 10–30 Min ciascuno</strong></span>
              </div>
              <div className="onboarding-test-item">
                <span>• Accesso attuale: <strong>unico percorso di test</strong></span>
              </div>
              <div className="onboarding-test-item">
                <span>
                  • Formato del test:<strong>grafici statici reali per concentrarsi sul metodo di ragionamento</strong>.
                </span>
              </div>
              <div className="onboarding-test-item">
                <span>• 💻Consigliato: <strong>usa un computer per visualizzare meglio i grafici</strong></span>
              </div>
            </div>
          </div>

          <form className="profile-form onboarding-form" onSubmit={handleSubmit}>
            <p className="muted onboarding-form-note">
              <strong>Non è la versione definitiva. Prima di sviluppare tutte le funzionalità, verifichiamo che il metodo di apprendimento sia efficace.</strong>
             
            </p>
            <div className="field">
              <label htmlFor="profileName">Nome del tester</label>
              <input
                id="profileName"
                name="profileName"
                type="text"
                placeholder="es. tester_03"
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
        <h1 className="page-title">Imposta il tuo nome</h1>
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
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-action">
            Salva
          </button>
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
