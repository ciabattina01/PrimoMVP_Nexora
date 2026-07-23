import { useEffect, useMemo, useState } from 'react'
import {
  EXERCISE_DAYS,
  getExerciseById,
  getExercisesForDay,
} from '../data/exercises'
import { getRisposte, saveRisposta, saveDifficultyRating, getDifficultyRatingForExercise, updateRispostaWithDifficulty } from '../utils/dataTracking'
import { getDayMeta, getExerciseNumber } from '../utils/dayLogic'

function markDay1Completion() {
  window.localStorage?.setItem('nexora_day1_completion_date', new Date().toISOString())
}

function isDayComplete(risposteMap, dayExercises) {
  const completedCount = dayExercises.filter((exercise) =>
    risposteMap.has(getExerciseNumber(exercise)),
  ).length
  return completedCount === dayExercises.length
}

function formatExerciseTitle(exercise) {
  const exerciseNumber = getExerciseNumber(exercise)
  const title = exercise.title || ''
  
  // If title already starts with "Esercizio [numero]", return it as-is
  if (title.match(/^Esercizio\s+\d+/)) {
    return title
  }
  
  // Otherwise, add the "Esercizio [numero] —" prefix
  return `Esercizio ${exerciseNumber} — ${title}`
}

const DAY_SCENARIO_LABELS = {
  1: 'Gold Spot / U.S. Dollar',
  2: 'EUR/USD',
  3: 'GBP/USD',
}

function buildRichTextBlocks(text) {
  const lines = String(text || '').split('\n')
  const blocks = []
  let paragraphLines = []
  let listItems = []

  const flushParagraph = () => {
    if (paragraphLines.length) {
      blocks.push({ type: 'p', text: paragraphLines.join(' ') })
      paragraphLines = []
    }
  }

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: 'ul', items: listItems })
      listItems = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    if (trimmed.startsWith('* ')) {
      flushParagraph()
      listItems.push(trimmed.slice(2))
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
        <ul key={`ul-${index}`} className="exercise-rich-list">
          {block.items.map((item, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`}>{item}</li>
          ))}
        </ul>
      )
    }

    return <p key={`p-${index}`}>{block.text}</p>
  })
}

function Exercises({ testerId, onNavigateToProgress, onReturnToProgram }) {
  const [activeDay, setActiveDay] = useState(1)
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [pendingAnswer, setPendingAnswer] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [hasInteractedWithDays, setHasInteractedWithDays] = useState(false)
  const [openDays, setOpenDays] = useState(new Set([1]))
  const [observationText, setObservationText] = useState('')
  const [observationError, setObservationError] = useState('')
  const [difficultyRating, setDifficultyRating] = useState(null)
  const [difficultySaved, setDifficultySaved] = useState(false)
  const [showDifficultyToast, setShowDifficultyToast] = useState(false)
  const savedRisposte = useMemo(
    () => getRisposte(),
    [selectedExerciseId, selectedAnswer, pendingAnswer, showConfirmModal, isReviewMode],
  )

  const selectedExercise = useMemo(
    () => (selectedExerciseId ? getExerciseById(selectedExerciseId) : null),
    [selectedExerciseId],
  )

  const risposteByExercise = useMemo(() => {
    const map = new Map()
    savedRisposte.forEach((risposta) => {
      if (risposta?.esercizio_id != null) {
        map.set(risposta.esercizio_id, risposta)
      }
    })
    return map
  }, [savedRisposte])

  const day1Exercises = useMemo(() => getExercisesForDay(1), [])
  const dayStatuses = useMemo(
    () => EXERCISE_DAYS.map((day) => getDayMeta(day, risposteByExercise)),
    [risposteByExercise],
  )
  const day1Status = dayStatuses.find((status) => status.day === 1)
  const day2Status = dayStatuses.find((status) => status.day === 2)

  useEffect(() => {
    if (selectedExerciseId || hasInteractedWithDays) {
      return
    }

    if (day1Status?.isCompleted && day2Status?.isUnlocked) {
      setActiveDay(2)
      return
    }

    if (activeDay === null) {
      setActiveDay(1)
    }
  }, [activeDay, day1Status, day2Status, hasInteractedWithDays, selectedExerciseId])

  const handleSelectDay = (day) => {
    setHasInteractedWithDays(true)
    setActiveDay(day)
    setSelectedExerciseId(null)
    setSelectedAnswer(null)
    setPendingAnswer(null)
    setShowConfirmModal(false)
    setIsReviewMode(false)
  }

  const toggleDay = (day) => {
    const newOpenDays = new Set(openDays)
    if (newOpenDays.has(day)) {
      newOpenDays.delete(day)
    } else {
      newOpenDays.add(day)
    }
    setOpenDays(newOpenDays)
    setHasInteractedWithDays(true)
  }

  const handleStartExercise = (exerciseId) => {
    setSelectedExerciseId(exerciseId)
    setSelectedAnswer(null)
    setPendingAnswer(null)
    setShowConfirmModal(false)
    setIsReviewMode(false)
  }

  const handleReviewExercise = (exerciseId) => {
    const exercise = getExerciseById(exerciseId)
    const exerciseNumber = getExerciseNumber(exercise)
    const risposta = risposteByExercise.get(exerciseNumber)

    setSelectedExerciseId(exerciseId)
    setSelectedAnswer(risposta?.risposta_scelta || null)
    setPendingAnswer(null)
    setShowConfirmModal(false)
    setIsReviewMode(true)
  }

  const handleAnswerSelect = (answerKey) => {
    if (!selectedExercise || isReviewMode || selectedAnswer) return
    setPendingAnswer(answerKey)
    setShowConfirmModal(true)
  }

  const handleConfirmAnswer = () => {
    if (!selectedExercise || !pendingAnswer) return

    // Validate observation text
    if (!observationText.trim()) {
      setObservationError('Scrivi almeno una breve osservazione prima di vedere il ragionamento.')
      return
    }

    const isCorrect = pendingAnswer === selectedExercise.correctAnswer
    const numericExerciseId = getExerciseNumber(selectedExercise)

    saveRisposta({
      esercizio_id: numericExerciseId,
      risposta_scelta: pendingAnswer,
      risposta_corretta: isCorrect,
      motivazione_utente: observationText.trim(),
    })

    const updatedRisposte = [...savedRisposte]
    const newRisposta = {
      esercizio_id: numericExerciseId,
      risposta_scelta: pendingAnswer,
      risposta_corretta: isCorrect,
      motivazione_utente: observationText.trim(),
      timestamp: new Date().toISOString(),
    }
    const existingIndex = updatedRisposte.findIndex((r) => r.esercizio_id === numericExerciseId)
    if (existingIndex >= 0) {
      updatedRisposte[existingIndex] = newRisposta
    } else {
      updatedRisposte.push(newRisposta)
    }

    const updatedMap = new Map()
    updatedRisposte.forEach((r) => {
      if (r?.esercizio_id != null) {
        updatedMap.set(r.esercizio_id, r)
      }
    })

    if (isDayComplete(updatedMap, day1Exercises)) {
      markDay1Completion()
    }

    setSelectedAnswer(pendingAnswer)
    setPendingAnswer(null)
    setShowConfirmModal(false)
    setObservationText('')
    setObservationError('')
  }

  const handleCancelConfirmation = () => {
    setPendingAnswer(null)
    setShowConfirmModal(false)
    setObservationText('')
    setObservationError('')
  }

  const handleDifficultySelect = (value) => {
    if (!selectedExercise || !testerId) return
    
    const exerciseNumber = getExerciseNumber(selectedExercise)
    const day = selectedExercise.day
    
    // Save to nexora_difficolta_esercizi (existing functionality)
    saveDifficultyRating({
      testerId,
      giorno: day,
      esercizio_id: exerciseNumber,
      difficolta_percepita: value
    })
    
    // Also update the existing response record in nexora_risposte
    updateRispostaWithDifficulty({
      testerId,
      esercizio_id: exerciseNumber,
      difficolta_percepita: value
    })
    
    setDifficultyRating(value)
    setDifficultySaved(true)
  }

  const handleReturnToProgram = () => {
    // If exercise is completed but difficulty not selected, show validation message
    if (selectedAnswer && !difficultyRating && !difficultySaved) {
      setShowDifficultyToast(true)
      // Auto-scroll to difficulty form
      setTimeout(() => {
        const difficultyForm = document.querySelector('.exercise-difficulty-rating')
        if (difficultyForm) {
          difficultyForm.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowDifficultyToast(false)
      }, 3000)
      return
    }
    
    const returnDay = selectedExercise?.day ?? activeDay ?? 1
    setActiveDay(returnDay)
    setOpenDays((prev) => {
      const next = new Set(prev)
      next.add(returnDay)
      return next
    })
    setHasInteractedWithDays(true)

    // Normal return logic
    setSelectedExerciseId(null)
    setSelectedAnswer(null)
    setPendingAnswer(null)
    setShowConfirmModal(false)
    setIsReviewMode(false)
    if (onReturnToProgram) {
      onReturnToProgram()
    }
  }

  // Reset and load difficulty rating when exercise changes
  useEffect(() => {
    if (selectedExercise && testerId) {
      const exerciseNumber = getExerciseNumber(selectedExercise)
      const existingRating = getDifficultyRatingForExercise(testerId, exerciseNumber)
      
      if (existingRating) {
        setDifficultyRating(existingRating.difficolta_percepita)
        setDifficultySaved(true)
      } else {
        setDifficultyRating(null)
        setDifficultySaved(false)
      }
      // Reset toast when changing exercises
      setShowDifficultyToast(false)
    } else {
      setDifficultyRating(null)
      setDifficultySaved(false)
      setShowDifficultyToast(false)
    }
  }, [selectedExercise, testerId])

  if (selectedExercise) {
    const initialImage = selectedExercise.imageBefore ?? selectedExercise.image ?? null
    const explainedImage = selectedExercise.imageAfter ?? selectedExercise.explanationImage ?? null
    const hasAnswered = Boolean(selectedAnswer)
    const answerButtonDisabled = hasAnswered || isReviewMode
    const isAnswerCorrect = hasAnswered && selectedAnswer === selectedExercise.correctAnswer
    const feedbackCopy = hasAnswered && selectedExercise.feedback
      ? selectedExercise.feedback
      : 'Il feedback comparirà dopo la risposta.'
    const feedbackClass = `exercise-feedback${hasAnswered ? (isAnswerCorrect ? ' is-correct' : ' is-incorrect') : ''}`

    return (
      <section className="exercises">
        <button type="button" className="btn btn-outline back-to-program" onClick={handleReturnToProgram}>
          ← Torna al programma di oggi
        </button>

        <div className="exercise-detail" aria-live="polite">
          <div className="exercise-detail-head">
            <span className="exercise-detail-day">Giorno {selectedExercise.day}</span>
            <h1 className="page-title">{formatExerciseTitle(selectedExercise)}</h1>
            <span className="exercise-detail-block">{selectedExercise.block}</span>
          </div>

          <div className="exercise-chart-section">
            <h3>Grafico iniziale</h3>
            {selectedExercise.chartMeta && (
              <div className="chart-meta">
                <span className="chart-meta-badge">{selectedExercise.chartMeta.source}</span>
                <span className="chart-meta-badge">{selectedExercise.chartMeta.timeframe}</span>
                <span className="chart-meta-badge">{selectedExercise.chartMeta.instrument}</span>
              </div>
            )}
            <div className="exercise-chart">
              {initialImage ? (
                <img
                  src={initialImage}
                  alt={`Grafico di riferimento per ${formatExerciseTitle(selectedExercise)}`}
                  loading="lazy"
                />
              ) : (
                <div className="chart-placeholder">Screenshot grafico</div>
              )}
            </div>
          </div>

          <div className="exercise-section">
            <div className="exercise-question">
              <h3>Spunto di riflessione</h3>
              {renderRichText(selectedExercise.question)}
            </div>
          </div>

          <div className="exercise-section">
            <div className="exercise-answers">
              {selectedExercise.answers.map((answer) => (
                <button
                  key={answer.key}
                  type="button"
                  className={`answer-option${(selectedAnswer === answer.key || pendingAnswer === answer.key) ? ' is-selected' : ''}`}
                  onClick={() => handleAnswerSelect(answer.key)}
                  disabled={answerButtonDisabled}
                >
                  <span className="answer-key">{answer.key}.</span>
                  <span className="answer-text">{answer.text}</span>
                </button>
              ))}
            </div>
          </div>

          {hasAnswered && (
            <div className="exercise-chart-section">
              <h3>Grafico spiegato</h3>
              {selectedExercise.chartMeta && (
                <div className="chart-meta">
                  <span className="chart-meta-badge">{selectedExercise.chartMeta.source}</span>
                  <span className="chart-meta-badge">{selectedExercise.chartMeta.timeframe}</span>
                  <span className="chart-meta-badge">{selectedExercise.chartMeta.instrument}</span>
                </div>
              )}
              <div className="exercise-chart">
                {explainedImage ? (
                  <img
                    src={explainedImage}
                    alt={`Grafico spiegato per ${formatExerciseTitle(selectedExercise)}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="chart-placeholder">Secondo screenshot grafico</div>
                )}
              </div>
            </div>
          )}

          <div className={feedbackClass}>
            <h3>Ragionamento guidato</h3>
            {renderRichText(feedbackCopy)}
          </div>

          {hasAnswered && (
            <div className="exercise-difficulty-rating">
              <h4>Quanto era facile o difficile per te?</h4>
              <div className="difficulty-scale">
                <div className="scale-labels">
                  <span className="scale-label scale-label-left">Troppo facile</span>
                  <span className="scale-label scale-label-center">Per me andava bene così</span>
                  <span className="scale-label scale-label-right">Troppo difficile</span>
                </div>
                <div className="scale-buttons">
                  {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`difficulty-btn ${difficultyRating === value ? 'is-selected' : ''}`}
                      onClick={() => handleDifficultySelect(value)}
                      disabled={difficultySaved}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              {difficultySaved && (
                <p className="difficulty-saved">Risposta salvata</p>
              )}
            </div>
          )}

          {showDifficultyToast && (
            <div className="difficulty-toast">
              <p>Prima seleziona quanto era facile o difficile per te. Ti serve solo un click.</p>
            </div>
          )}

          <div className="exercise-detail-actions">
            <button type="button" className="btn" onClick={handleReturnToProgram}>
              Torna al programma
            </button>
          </div>

          {showConfirmModal && (
            <div className="exercise-confirm-modal__backdrop" role="presentation">
              <div className="exercise-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-answer-title">
                <h3 id="confirm-answer-title">Confermi?</h3>
                <p>Prima di vedere il ragionamento guidato, scrivi <strong>in breve</strong> cosa hai osservato.</p>
                
                <div className="exercise-confirm-modal__guide">
                  <p>Puoi aiutarti con una di queste domande:</p>
                  <ul>
                    <li>Quale parte del grafico hai osservato di più?</li>
                    <li>Quale movimento o elemento ti ha fatto scegliere questa risposta?</li>
                    <li>C'è qualcosa che ti rende sicuro/a oppure ti fa avere dubbi?</li>
                  </ul>
                </div>

                <div className="exercise-confirm-modal__field">
                  <textarea
                    placeholder="Scrivi in poche parole cosa hai osservato…"
                    value={observationText}
                    onChange={(e) => {
                      setObservationText(e.target.value)
                      setObservationError('')
                    }}
                    className={`exercise-confirm-modal__textarea ${observationError ? 'has-error' : ''}`}
                    rows={3}
                  />
                  {observationError && (
                    <p className="exercise-confirm-modal__error">{observationError}</p>
                  )}
                </div>

                <div className="exercise-confirm-modal__actions">
                  <button type="button" className="btn btn-outline" onClick={handleCancelConfirmation}>
                    Voglio pensare ancora
                  </button>
                  <button type="button" className="btn" onClick={handleConfirmAnswer}>
                    Conferma e confronta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  const activeDayExercises = getExercisesForDay(activeDay ?? 1)
  const activeDaySummary = dayStatuses.find((status) => status.day === (activeDay ?? 1))
  const activeDayProgressValue = activeDaySummary
    ? `${activeDaySummary.completedCount}/${activeDayExercises.length} esercizi completati`
    : `0/${activeDayExercises.length} esercizi completati`

  return (
    <section className="exercises">
      <header className="exercise-head">
        <span className="eyebrow">Esercitati</span>
        <h1 className="page-title">Segui l'ordine dei 3 esercizi giornalieri</h1>
      </header>

      <div className="exercise-progress" aria-live="polite">
        <div className="exercise-progress-head">
          <span className="exercise-progress-title">Oggi</span>
          <span className="exercise-progress-value">{activeDayProgressValue}</span>
        </div>
        <div className="exercise-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <span className="exercise-progress-fill" style={{ width: '0%' }} />
        </div>
      </div>

      <div className="exercise-day-header">
        <span className="day-pill">Giorni del programma</span>
        <p className="muted"><strong></strong></p>
      </div>

      <div className="exercise-days-list">
        {EXERCISE_DAYS.map((day) => {
          const status = dayStatuses.find((item) => item.day === day)
          const dayExercises = getExercisesForDay(day)
          const isOpen = openDays.has(day)
          const isLocked = day > 1 && !status?.isUnlocked
          const isCompleted = status?.isCompleted
          const isNotStarted = !isLocked && status?.completedCount === 0
          const isInProgress = !isLocked && !isCompleted && status?.completedCount > 0
          
          // Check if day is unlockable (previous day completed and next calendar day has arrived)
          const previousDay = day > 1 ? day - 1 : null
          const previousDayMeta = previousDay ? dayStatuses.find((item) => item.day === previousDay) : null
          const isUnlockable = day > 1 && 
            previousDayMeta?.isCompleted && 
            previousDayMeta?.completedAt &&
            !status?.isUnlocked
          const scenarioLabel = DAY_SCENARIO_LABELS[day]
          const dayHeading = scenarioLabel
            ? `Giorno ${day} – Scenario: ${scenarioLabel}`
            : `Giorno ${day}`

          return (
            <section key={day} className={`exercise-day-section ${isOpen ? 'is-open' : 'is-collapsed'}`}>
              <header className="exercise-day-head">
                <h2>{dayHeading}</h2>
              </header>

              {isOpen ? (
                <>
                  {isCompleted && (
                    <div className="exercise-day-actions">
                      <button type="button" className="btn btn-outline" onClick={() => toggleDay(day)}>
                        Chiudi
                      </button>
                    </div>
                  )}
                  <div className="exercise-list">
                    {dayExercises.map((exercise) => {
                      const exerciseNumber = getExerciseNumber(exercise)
                      const risposta = risposteByExercise.get(exerciseNumber)
                      const hasConfirmedResponse = Boolean(risposta?.risposta_scelta)
                      const chartMeta = exercise.chartMeta ?? {
                        source: 'TradingView',
                        timeframe: '1H',
                        instrument: 'Gold Spot / U.S. Dollar',
                      }
                      const statusLabel = !hasConfirmedResponse
                        ? 'Da iniziare'
                        : risposta?.risposta_corretta
                          ? 'Compreso ✅'
                          : 'Da rivedere'
                      const buttonLabel = hasConfirmedResponse ? 'Rivedi' : 'Inizia'

                      return (
                        <article key={exercise.id} className="exercise-card">
                          <div className="exercise-card-content">
                            <header className="exercise-card-head">
                              <div className="exercise-chip">{exercise.block}</div>
                              <span className="exercise-status">{statusLabel}</span>
                            </header>
                            <div className="exercise-body">
                              <h2>{formatExerciseTitle(exercise)}</h2>
                              <div className="exercise-meta" aria-label="Dettagli didattici">
                                <span className="exercise-meta-item">📉 Grafico reale ({chartMeta.source})</span>
                                <span className="exercise-meta-item">🕐 Timeframe: {chartMeta.timeframe}</span>
                                <span className="exercise-meta-item"> Asset: {chartMeta.instrument}</span>
                              </div>
                            </div>
                          </div>
                          <div className="exercise-card-actions">
                            <button
                              type="button"
                              className={hasConfirmedResponse ? "btn btn-review" : "btn btn-action"}
                              onClick={() => (hasConfirmedResponse ? handleReviewExercise(exercise.id) : handleStartExercise(exercise.id))}
                            >
                              {buttonLabel}
                            </button>
                            {!testerId && (
                              <span className="exercise-hint">
                                Salva il profilo per abilitare il tracciamento quando gli esercizi saranno attivi.
                              </span>
                            )}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="exercise-day-summary">
                  {isLocked ? (
                    <div className="exercise-day-summary-card">
                      <span className="exercise-day-summary-score">🔒 Bloccato</span>
                      <span className="exercise-day-summary-copy">Termina prima il Giorno precedente.</span>
                    </div>
                  ) : isUnlockable ? (
                    <>
                      <div className="exercise-day-summary-card">
                        <span className="exercise-day-summary-score">SBLOCCABILE</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-action" onClick={() => handleSelectDay(day)}>
                          Sblocca e inizia
                        </button>
                      </div>
                    </>
                  ) : isNotStarted ? (
                    <>
                      <div className="exercise-day-summary-card">
                        <span className="exercise-day-summary-score">DA INIZIARE</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-outline" onClick={() => toggleDay(day)}>
                          Inizia
                        </button>
                      </div>
                    </>
                  ) : isCompleted ? (
                    <>
                      <div className="exercise-day-summary-card">
                        <span className="exercise-day-summary-score">{`${status?.correctCount ?? 0}/${dayExercises.length} corretti`}</span>
                        <span className="exercise-day-summary-copy">Vai a Progressi per rivedere i ragionamenti</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-review" onClick={() => toggleDay(day)}>
                          Rivedi tutto
                        </button>
                        {onNavigateToProgress && (
                          <button type="button" className="btn btn-outline" onClick={() => onNavigateToProgress()}>
                            Progressi
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="exercise-day-summary-card">
                        <span className="exercise-day-summary-score">{`${status?.correctCount ?? 0}/${dayExercises.length} corretti`}</span>
                        <span className="exercise-day-summary-copy">Vai a Progressi per rivedere i ragionamenti</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-outline" onClick={() => toggleDay(day)}>
                          Continua
                        </button>
                        {onNavigateToProgress && (
                          <button type="button" className="btn btn-outline" onClick={() => onNavigateToProgress()}>
                            Progressi
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </section>
  )
}

export default Exercises
