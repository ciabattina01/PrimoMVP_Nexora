import { useMemo, useState } from 'react'
import { saveValutazione } from '../utils/dataTracking'
import { trackEvaluationEvent } from '../utils/tracking'

function Feedback({ testerId }) {
  const [rating, setRating] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState(null)

  const disabled = useMemo(() => !testerId, [testerId])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!testerId) {
      setStatus({ type: 'error', message: 'Imposta un nome nel profilo per inviare il feedback.' })
      return
    }

    if (!rating) {
      setStatus({ type: 'error', message: 'Seleziona un livello di guida da 1 a 5.' })
      return
    }

    const parsedRating = Number.parseInt(rating, 10)
    const feedbackText = text.trim()

    saveValutazione({
      giorno: 1,
      valutazione: parsedRating,
      feedback_testo: feedbackText,
      esercizio_completato: false,
    })

    trackEvaluationEvent({
      tester_id: testerId,
      valutazione: parsedRating,
      feedback_testo: feedbackText || null,
      esercizio_completato: false,
    })

    setStatus({ type: 'success', message: 'Feedback salvato in locale.' })
    setText('')
    setRating('')
  }

  return (
    <section className="feedback">
      <header className="feedback-head">
        <span className="eyebrow">Lascia un Feedback</span>
        <h1 className="page-title">Quanto ti sei sentito guidato?</h1>
        <p className="muted">
          Il tuo contributo rimane nel browser e ci aiuta a validare la struttura dell’esperienza.
        </p>
      </header>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="rating">Quanto ti sei sentito guidato durante ogni esercizio?</label>
          <div className="rating-options">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className={`rating-pill${rating === String(value) ? ' is-active' : ''}`}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === String(value)}
                  onChange={(event) => setRating(event.target.value)}
                  disabled={disabled}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="feedbackText">C'è un esercizio in particolare, qualunque cosa che secondo te non è stata chiara? Esprimi un parere sincero</label>
          <textarea
            id="feedbackText"
            name="feedbackText"
            rows={5}
            placeholder="Scrivi qui il tuo feedback"
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            Invia feedback
          </button>
        </div>

        {disabled && (
          <p className="form-status warning">
            Imposta un nome nel profilo per attivare la raccolta del feedback.
          </p>
        )}
        {status && <p className={`form-status ${status.type}`}>{status.message}</p>}
      </form>
    </section>
  )
}

export default Feedback
