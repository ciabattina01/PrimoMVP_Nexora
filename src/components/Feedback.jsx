import { useMemo, useState } from 'react'
import { saveValutazione } from '../utils/dataTracking'
import { trackEvaluationEvent } from '../utils/tracking'
import { useLanguage } from '../i18n/language'
import { getUiCopy } from '../i18n/uiCopy'

function Feedback({ testerId }) {
  const { language } = useLanguage()
  const ui = getUiCopy(language)
  const copy = ui.feedback

  const [rating, setRating] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState(null)

  const disabled = useMemo(() => !testerId, [testerId])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!testerId) {
      setStatus({ type: 'error', message: copy.missingProfileError })
      return
    }

    if (!rating) {
      setStatus({ type: 'error', message: copy.missingRatingError })
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

    setStatus({ type: 'success', message: copy.success })
    setText('')
    setRating('')
  }

  return (
    <section className="feedback">
      <header className="feedback-head">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1 className="page-title">{copy.title}</h1>
        <p className="muted">
          {copy.subtitle}
        </p>
      </header>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="rating">{copy.ratingLabel}</label>
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
          <label htmlFor="feedbackText">{copy.textLabel}</label>
          <textarea
            id="feedbackText"
            name="feedbackText"
            rows={5}
            placeholder={copy.textPlaceholder}
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            {copy.submit}
          </button>
        </div>

        {disabled && (
          <p className="form-status warning">
            {copy.disabledHint}
          </p>
        )}
        {status && <p className={`form-status ${status.type}`}>{status.message}</p>}
      </form>
    </section>
  )
}

export default Feedback
