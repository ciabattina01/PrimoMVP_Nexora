import { Fragment, useEffect, useMemo, useState } from 'react'
import {
  EXERCISE_DAYS,
  getExerciseById,
  getExercisesForDay,
} from '../data/exercises'
import { getRisposte, saveRisposta, saveDifficultyRating, getDifficultyRatingForExercise, updateRispostaWithDifficulty } from '../utils/dataTracking'
import { getDayMeta, getExerciseNumber, markDayStarted } from '../utils/dayLogic'
import { useLanguage } from '../i18n/language'
import { getUiCopy } from '../i18n/uiCopy'

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
  
  // If title already starts with "Step [numero]", return it as-is
  if (title.match(/^Step\s+\d+/i)) {
    return title
  }

  // If title starts with "Esercizio [numero]" or "Exercise [number]", convert it to step naming
  if (title.match(/^(Esercizio|Exercise)\s+\d+/i)) {
    return title.replace(/^(Esercizio|Exercise)\s+/i, 'Step ')
  }
  
  // Otherwise, add the "Step [numero] —" prefix
  return `Step ${exerciseNumber} — ${title}`
}

function getGeneralObjectiveSummary(correctSteps, language) {
  if (!correctSteps.length) {
    return language === 'en'
      ? 'No step correctly completed yet'
      : 'Nessuno step ancora completato correttamente'
  }

  if (correctSteps.length === 1) {
    return language === 'en'
      ? `🎉You understood step ${correctSteps[0]}`
      : `🎉Hai capito lo step ${correctSteps[0]}`
  }

  return language === 'en'
    ? `🎉You understood steps ${correctSteps.join(', ')}`
    : `🎉Hai capito gli step ${correctSteps.join(', ')}`
}

function formatStepList(stepNumbers, language) {
  if (stepNumbers.length <= 1) {
    return String(stepNumbers[0] || '')
  }

  if (stepNumbers.length === 2) {
    return language === 'en'
      ? `${stepNumbers[0]} and ${stepNumbers[1]}`
      : `${stepNumbers[0]} e ${stepNumbers[1]}`
  }

  const initialSteps = stepNumbers.slice(0, -1).join(', ')
  const lastStep = stepNumbers[stepNumbers.length - 1]
  return language === 'en'
    ? `${initialSteps}, and ${lastStep}`
    : `${initialSteps} e ${lastStep}`
}

function buildDayCompletionFeedback(day, risposteByExercise, language) {
  const dayExercises = getExercisesForDay(day)
  const incorrectSteps = dayExercises
    .map((exercise, index) => {
      const exerciseNumber = getExerciseNumber(exercise)
      const risposta = risposteByExercise.get(exerciseNumber)
      return Boolean(risposta?.risposta_corretta) ? null : index + 1
    })
    .filter((step) => step != null)

  if (!incorrectSteps.length) {
    return language === 'en'
      ? '3 out of 3 steps correct — you are starting to understand how to make a chart-based decision!'
      : '3 step su 3 corretti — stai iniziando a capire come prendere una decisione sul grafico!'
  }

  if (incorrectSteps.length === 1) {
    return language === 'en'
      ? `You got Step ${incorrectSteps[0]} wrong. In Key reasoning you can review the reasoning.`
      : `Hai sbagliato lo Step ${incorrectSteps[0]}. In Ragionamenti chiave puoi rivedere il ragionamento.`
  }

  return language === 'en'
    ? `You got Steps ${formatStepList(incorrectSteps, language)} wrong. In Key reasoning you can review the reasonings.`
    : `Hai sbagliato gli Step ${formatStepList(incorrectSteps, language)}. In Ragionamenti chiave puoi rivedere i ragionamenti.`
}

const FREE_RESPONSE_ANSWER = 'RISPOSTA_LIBERA'
const STEP7_ZOOM_IMAGE_PATH = '/Grafici_2/zoom_step4.png'

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

function renderTextWithBold(text) {
  const source = String(text ?? '')
  const parts = source.split(/(\*\*[\s\S]+?\*\*)/g)

  return parts.map((part, index) => {
    const match = part.match(/^\*\*([\s\S]+)\*\*$/)
    if (match) {
      return <strong key={`exercise-bold-${index}`}>{match[1]}</strong>
    }

    return <Fragment key={`exercise-text-${index}`}>{part}</Fragment>
  })
}

function renderRichText(text) {
  const blocks = buildRichTextBlocks(text)
  return blocks.map((block, index) => {
    if (block.type === 'ul') {
      return (
        <ul key={`ul-${index}`} className="exercise-rich-list">
          {block.items.map((item, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`}>{renderTextWithBold(item)}</li>
          ))}
        </ul>
      )
    }

    return <p key={`p-${index}`}>{renderTextWithBold(block.text)}</p>
  })
}

function Exercises({ testerId, onNavigateToProgress, onReturnToProgram }) {
  const { language } = useLanguage()
  const ui = getUiCopy(language)
  const copy = ui.exercises
  const dayScenarioLabels = copy.dayScenarioLabels
  const dailyObjectives = copy.dailyObjectives
  const generalObjectives = copy.generalObjectives
  const dayCompletionMessages = copy.dayCompletionMessages

  const [activeDay, setActiveDay] = useState(1)
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const [isExercisesInfoOpen, setIsExercisesInfoOpen] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [pendingAnswer, setPendingAnswer] = useState(null)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [hasInteractedWithDays, setHasInteractedWithDays] = useState(false)
  const [openDays, setOpenDays] = useState(new Set([1]))
  const [difficultyRating, setDifficultyRating] = useState(null)
  const [difficultyFeedbackText, setDifficultyFeedbackText] = useState('')
  const [difficultySelectionMessage, setDifficultySelectionMessage] = useState('')
  const [difficultySaved, setDifficultySaved] = useState(false)
  const [isDifficultyFeedbackLocked, setIsDifficultyFeedbackLocked] = useState(false)
  const [isSavingAndClosingDay, setIsSavingAndClosingDay] = useState(false)
  const [pendingCompletionDay, setPendingCompletionDay] = useState(null)
  const [completedDayScreen, setCompletedDayScreen] = useState(null)
  const savedRisposte = useMemo(
    () => getRisposte(),
    [selectedExerciseId, selectedAnswer, pendingAnswer, isReviewMode],
  )

  const selectedExercise = useMemo(() => {
    if (!selectedExerciseId) {
      return null
    }

    return getExerciseById(selectedExerciseId, language)
  }, [selectedExerciseId])

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
  const currentObjectiveDay = useMemo(() => {
    const unlockedDays = EXERCISE_DAYS.filter((day) => {
      if (day === 1) return true
      const status = dayStatuses.find((item) => item.day === day)
      return Boolean(status?.isUnlocked)
    })

    if (!unlockedDays.length) {
      return activeDay ?? 1
    }

    return unlockedDays[unlockedDays.length - 1]
  }, [activeDay, dayStatuses])

  const currentObjective = dailyObjectives[currentObjectiveDay] || dailyObjectives[1]

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
    const exercise = getExerciseById(exerciseId)
    if (exercise?.day) {
      markDayStarted(exercise.day)
    }

    setSelectedExerciseId(exerciseId)
    setSelectedAnswer(null)
    setPendingAnswer(null)
    setIsReviewMode(false)
    setPendingCompletionDay(null)
    setDifficultySelectionMessage('')
  }

  const handleReviewExercise = (exerciseId) => {
    const exercise = getExerciseById(exerciseId)
    const exerciseNumber = getExerciseNumber(exercise)
    const risposta = risposteByExercise.get(exerciseNumber)

    setSelectedExerciseId(exerciseId)
    setSelectedAnswer(risposta?.risposta_scelta || null)
    setPendingAnswer(null)
    setIsReviewMode(true)
    setPendingCompletionDay(null)
    setDifficultySelectionMessage('')
  }

  const handleAnswerSelect = (answerKey) => {
    if (!selectedExercise || isReviewMode || selectedAnswer) return
    setPendingAnswer(answerKey)
  }

  const handleConfirmAnswer = () => {
    if (!selectedExercise) return

    const isFreeResponseExercise = !selectedExercise.answers?.length
    if (!isFreeResponseExercise && !pendingAnswer) return

    const submittedAnswer = isFreeResponseExercise ? FREE_RESPONSE_ANSWER : pendingAnswer
    const isCorrect = isFreeResponseExercise || submittedAnswer === selectedExercise.correctAnswer
    const numericExerciseId = getExerciseNumber(selectedExercise)

    saveRisposta({
      esercizio_id: numericExerciseId,
      risposta_scelta: submittedAnswer,
      risposta_corretta: isCorrect,
    })

    const updatedRisposte = [...savedRisposte]
    const newRisposta = {
      esercizio_id: numericExerciseId,
      risposta_scelta: submittedAnswer,
      risposta_corretta: isCorrect,
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

    const selectedDayExercises = getExercisesForDay(selectedExercise.day, language)
    const completedBefore = selectedDayExercises.filter((exercise) => {
      const exerciseNumber = getExerciseNumber(exercise)
      return risposteByExercise.has(exerciseNumber)
    }).length
    const completedAfter = selectedDayExercises.filter((exercise) => {
      const exerciseNumber = getExerciseNumber(exercise)
      return updatedMap.has(exerciseNumber)
    }).length
    const hasJustCompletedDay = completedBefore < selectedDayExercises.length && completedAfter === selectedDayExercises.length
    setPendingCompletionDay(hasJustCompletedDay ? selectedExercise.day : null)

    if (isDayComplete(updatedMap, day1Exercises)) {
      markDay1Completion()
    }

    setSelectedAnswer(submittedAnswer)
    setPendingAnswer(null)
  }

  const handleDifficultySelect = (value) => {
    if (!selectedExercise || !testerId) return
    if (isDifficultyFeedbackLocked) return

    setDifficultyRating(value)
    setDifficultySaved(false)
    setDifficultySelectionMessage('')
  }

  const persistDifficultyFeedback = (ratingOverride = null) => {
    if (isDifficultyFeedbackLocked) return false
    const ratingToSave = ratingOverride ?? difficultyRating
    if (!selectedAnswer || !testerId || !selectedExercise || ratingToSave == null) return false

    const exerciseNumber = getExerciseNumber(selectedExercise)
    const day = selectedExercise.day
    const difficultyFeedbackPayload = {
      testerId,
      giorno: day,
      esercizio_id: exerciseNumber,
      difficolta_percepita: ratingToSave,
      cosa_non_chiaro: difficultyFeedbackText.trim(),
    }

    saveDifficultyRating(difficultyFeedbackPayload)

    updateRispostaWithDifficulty({
      ...difficultyFeedbackPayload,
    })

    setDifficultySaved(true)
    return true
  }

  const scrollToDifficultyRating = () => {
    setTimeout(() => {
      const difficultyForm = document.querySelector('.exercise-difficulty-rating')
      if (difficultyForm) {
        difficultyForm.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const scrollToTopOnStepChange = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  const handleReturnToProgram = () => {
    if (selectedAnswer && difficultyRating == null) {
      setDifficultySelectionMessage(copy.difficultyMissing)
      scrollToDifficultyRating()
      return
    }

    if (selectedAnswer && testerId && selectedExercise) {
      persistDifficultyFeedback()
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
    setIsReviewMode(false)
    setPendingCompletionDay(null)
    setDifficultySelectionMessage('')
    if (onReturnToProgram) {
      onReturnToProgram()
    }
  }

  const handleSaveAndCloseDay = async () => {
    if (!selectedExercise || !testerId || !selectedAnswer || difficultyRating == null) return
    if (!pendingCompletionDay || pendingCompletionDay !== selectedExercise.day) return
    if (isSavingAndClosingDay) return

    setIsSavingAndClosingDay(true)
    try {
      const hasPersisted = await Promise.resolve(persistDifficultyFeedback())
      if (!hasPersisted) return

      setCompletedDayScreen(pendingCompletionDay)
      setPendingCompletionDay(null)

      const returnDay = selectedExercise.day
      setActiveDay(returnDay)
      setOpenDays((prev) => {
        const next = new Set(prev)
        next.add(returnDay)
        return next
      })
      setHasInteractedWithDays(true)
      setSelectedExerciseId(null)
      setSelectedAnswer(null)
      setPendingAnswer(null)
      setIsReviewMode(false)
      setDifficultySelectionMessage('')
    } finally {
      setIsSavingAndClosingDay(false)
    }
  }

  const handleCloseDayCompletionScreen = () => {
    setCompletedDayScreen(null)
  }

  const handleGoToNextStep = () => {
    if (!selectedExercise) return

    if (difficultyRating == null) {
      setDifficultySelectionMessage(copy.difficultyMissing)
      scrollToDifficultyRating()
      return
    }

    if (testerId) {
      persistDifficultyFeedback()
    }

    const dayExercises = getExercisesForDay(selectedExercise.day, language)
    const currentIndex = dayExercises.findIndex((exercise) => exercise.id === selectedExercise.id)
    if (currentIndex < 0) return

    const nextExercise = dayExercises[currentIndex + 1]
    if (!nextExercise) return

    const nextExerciseNumber = getExerciseNumber(nextExercise)
    const hasConfirmedNextExercise = Boolean(
      risposteByExercise.get(nextExerciseNumber)?.risposta_scelta,
    )

    if (hasConfirmedNextExercise) {
      handleReviewExercise(nextExercise.id)
      scrollToTopOnStepChange()
      return
    }

    handleStartExercise(nextExercise.id)
    scrollToTopOnStepChange()
  }

  // Reset and load difficulty rating when exercise changes
  useEffect(() => {
    if (selectedExercise && testerId) {
      const exerciseNumber = getExerciseNumber(selectedExercise)
      const savedRisposta = risposteByExercise.get(exerciseNumber)
      const existingRating = getDifficultyRatingForExercise(testerId, exerciseNumber)

      const rispostaDifficulty = Number.parseInt(String(savedRisposta?.difficolta_percepita), 10)
      const ratingDifficulty = Number.parseInt(String(existingRating?.difficolta_percepita), 10)
      const hasSavedDifficulty = !Number.isNaN(rispostaDifficulty) || !Number.isNaN(ratingDifficulty)
      const savedDifficulty = !Number.isNaN(rispostaDifficulty)
        ? rispostaDifficulty
        : (!Number.isNaN(ratingDifficulty) ? ratingDifficulty : null)
      const savedFeedback = typeof savedRisposta?.cosa_non_chiaro === 'string'
        ? savedRisposta.cosa_non_chiaro
        : (existingRating?.cosa_non_chiaro || '')

      if (hasSavedDifficulty) {
        setDifficultyRating(savedDifficulty)
        setDifficultyFeedbackText(savedFeedback)
        setDifficultySaved(true)
        setIsDifficultyFeedbackLocked(true)
      } else {
        setDifficultyRating(null)
        setDifficultyFeedbackText('')
        setDifficultySaved(false)
        setIsDifficultyFeedbackLocked(false)
      }
      setDifficultySelectionMessage('')
    } else {
      setDifficultyRating(null)
      setDifficultyFeedbackText('')
      setDifficultySaved(false)
      setIsDifficultyFeedbackLocked(false)
      setDifficultySelectionMessage('')
    }
  }, [selectedExercise, testerId, risposteByExercise])

  if (completedDayScreen) {
    const completionCopy = dayCompletionMessages[completedDayScreen] || dayCompletionMessages[1]
    const completionFeedback = buildDayCompletionFeedback(completedDayScreen, risposteByExercise, language)

    return (
      <section className="exercises">
        <div className="exercise-day-completion">
          <h2>{completionCopy.title}</h2>
          {completionCopy.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="exercise-day-completion__feedback">{completionFeedback}</p>
          <div className="exercise-day-completion__actions">
            <button type="button" className="btn" onClick={handleCloseDayCompletionScreen}>
              {copy.returnProgram}
            </button>
            {onNavigateToProgress && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => onNavigateToProgress(completedDayScreen)}
              >
                {copy.keyReasoning}
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (selectedExercise) {
    const initialImage = selectedExercise.imageBefore ?? selectedExercise.image ?? null
    const explainedImage = selectedExercise.imageAfter ?? selectedExercise.explanationImage ?? null
    const selectedDayExercises = getExercisesForDay(selectedExercise.day, language)
    const selectedExerciseIndex = selectedDayExercises.findIndex(
      (exercise) => exercise.id === selectedExercise.id,
    )
    const nextExerciseInDay =
      selectedExerciseIndex >= 0 ? selectedDayExercises[selectedExerciseIndex + 1] : null
    const isFreeResponseExercise = !selectedExercise.answers?.length
    const hasAnswered = Boolean(selectedAnswer)
    const answerButtonDisabled = hasAnswered || isReviewMode
    const isAnswerCorrect = hasAnswered && (isFreeResponseExercise || selectedAnswer === selectedExercise.correctAnswer)
    const canContinue = hasAnswered && difficultyRating != null
    const canGoToNextStep = canContinue && Boolean(nextExerciseInDay)
    const canSaveAndCloseDay = canContinue && pendingCompletionDay === selectedExercise.day
    const feedbackClass = `exercise-feedback${hasAnswered ? (isAnswerCorrect ? ' is-correct' : ' is-incorrect') : ''}`

    return (
      <section className="exercises">
        {!canSaveAndCloseDay && (
          <button type="button" className="btn btn-outline back-to-program" onClick={handleReturnToProgram}>
            {copy.backToDayProgram}
          </button>
        )}

        <div className="exercise-detail" aria-live="polite">
          <div className="exercise-detail-head">
            <span className="exercise-detail-day">{`${copy.dayLabel} ${selectedExercise.day}`}</span>
            <h1 className="page-title">{formatExerciseTitle(selectedExercise)}</h1>
            <span className="exercise-detail-block">{selectedExercise.block}</span>
          </div>

          <div className="exercise-chart-section">
            <h3>{copy.initialChart}</h3>
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
                <div className="chart-placeholder">{copy.chartPlaceholder}</div>
              )}
            </div>
          </div>

          <div className="exercise-section">
            <div className="exercise-question">
              <h3>{copy.reflectionPrompt}</h3>
              {renderRichText(selectedExercise.question)}
            </div>
          </div>

          <div className="exercise-answers">
            {isFreeResponseExercise ? (
              <button
                type="button"
                className="btn btn-action"
                onClick={handleConfirmAnswer}
                disabled={answerButtonDisabled}
              >
                {copy.confirmAndCompare}
              </button>
            ) : (
              <>
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
                {!hasAnswered && (
                  <div className="exercise-detail-actions">
                    <button
                      type="button"
                      className="btn btn-action"
                      onClick={handleConfirmAnswer}
                      disabled={!pendingAnswer || isReviewMode}
                    >
                      {copy.confirmAndCompare}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {hasAnswered && (
            <div className="exercise-chart-section">
              <h3>{copy.explainedChart}</h3>
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
                  <div className="chart-placeholder">{copy.secondChartPlaceholder}</div>
                )}
              </div>
            </div>
          )}

          {hasAnswered && (
            <div className={feedbackClass}>
              <h3>{copy.guidedReasoning}</h3>
              {renderRichText(selectedExercise.feedback)}
              {selectedExercise.id === 'day3-ex1' && (
                <div className="exercise-zoom-es4-layout">
                  <div className="exercise-zoom-es4-copy" />
                  <div className="exercise-zoom-es4-visual">
                    <img
                      src={STEP7_ZOOM_IMAGE_PATH}
                      alt={language === 'en'
                        ? 'Deep-dive zoom on the comparison between High 1 and High 2'
                        : 'Zoom di approfondimento sul confronto tra Massimo 1 e Massimo 2'}
                      className="exercise-zoom-es4-image"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {hasAnswered && (
            <div className="exercise-difficulty-rating">
              <h4>{copy.difficultyTitle}</h4>
              <div className="difficulty-scale">
                <div className="scale-labels">
                  <span className="scale-label scale-label-left">{copy.tooEasy}</span>
                  <span className="scale-label scale-label-center">{copy.okForMe}</span>
                  <span className="scale-label scale-label-right">{copy.tooHard}</span>
                </div>
                <div className="scale-buttons">
                  {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`difficulty-btn ${difficultyRating === value ? 'is-selected' : ''}`}
                      onClick={() => handleDifficultySelect(value)}
                      disabled={isDifficultyFeedbackLocked || (isReviewMode && difficultySaved)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              {difficultySelectionMessage && <p className="exercise-confirm-modal__error">{difficultySelectionMessage}</p>}
              <div className="exercise-difficulty-feedback">
                <h4>{copy.reflectionTitle}</h4>
                <textarea
                  className="exercise-confirm-modal__textarea"
                  placeholder={copy.reflectionPlaceholder}
                  value={difficultyFeedbackText}
                  onChange={(e) => {
                    if (isDifficultyFeedbackLocked) return
                    setDifficultyFeedbackText(e.target.value)
                    if (difficultySaved) {
                      setDifficultySaved(false)
                    }
                  }}
                  readOnly={isDifficultyFeedbackLocked}
                  disabled={isDifficultyFeedbackLocked}
                  rows={5}
                />
              </div>
            </div>
          )}

          {canContinue && (
            <div className="exercise-detail-actions">
              {canSaveAndCloseDay ? (
                <button
                  type="button"
                  className="btn btn-action"
                  onClick={handleSaveAndCloseDay}
                  disabled={isSavingAndClosingDay}
                >
                  {isSavingAndClosingDay ? copy.saving : copy.saveAndCloseDay}
                </button>
              ) : (
                <>
                  {canGoToNextStep && (
                    <button type="button" className="btn btn-action" onClick={handleGoToNextStep}>
                      {copy.next}
                    </button>
                  )}
                  <button type="button" className="btn" onClick={handleReturnToProgram}>
                    {copy.returnProgram}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="exercises">
      <header className="exercise-head">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setIsExercisesInfoOpen((prev) => !prev)}
          aria-expanded={isExercisesInfoOpen}
          style={{ alignSelf: 'flex-start', width: 'auto' }}
        >
          {copy.infoToggle}
        </button>
        {isExercisesInfoOpen && (
          <div>
            {renderRichText(copy.infoText)}
          </div>
        )}
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1 className="page-title">{copy.title}</h1>
      </header>

      <div className="exercise-goals-grid">
        <div className="exercise-progress" aria-live="polite">
          <p className="exercise-goal-title">{currentObjective.title}</p>
          {currentObjective.lines.map((line) => (
            <p key={line} className="exercise-goal-line">{line}</p>
          ))}
          {currentObjective.divider && (
            <p className="exercise-goal-divider">{currentObjective.divider}</p>
          )}
        </div>

        <div className="exercise-progress exercise-progress-general">
          <p className="exercise-goal-title">{copy.goalsGeneralTitle}</p>
          {generalObjectives.map((objective) => {
            const correctSteps = objective.steps.filter((stepNumber) => {
              const risposta = risposteByExercise.get(stepNumber)
              return Boolean(risposta?.risposta_corretta)
            })
            const objectiveSummary = getGeneralObjectiveSummary(correctSteps, language)

            return (
              <div key={objective.title} className="exercise-general-objective-item">
                <p className="exercise-goal-line">{objective.title}</p>
                <p className="exercise-goal-line exercise-goal-line-secondary">{objectiveSummary}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="exercise-day-header">
        <span className="day-pill">{copy.dayPill}</span>
        <p className="muted">{copy.daysHeaderText}</p>
      </div>

      <div className="exercise-days-list">
        {EXERCISE_DAYS.map((day) => {
          const status = dayStatuses.find((item) => item.day === day)
          const dayExercises = getExercisesForDay(day, language)
          const isOpen = openDays.has(day)
          const isLocked = day > 1 && !status?.isUnlocked
          const isCompleted = status?.isCompleted
          const isNotStarted = !isLocked && status?.completedCount === 0
          const scenarioLabel = dayScenarioLabels[day]
          const dayHeading = scenarioLabel
            ? `${copy.dayLabel} ${day}  ${scenarioLabel}`
            : `${copy.dayLabel} ${day}`
          const lockCopy = status?.isBlockedByDate
            ? copy.lockByDate
            : copy.lockByPrevious

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
                        {copy.closeButton}
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
                        ? copy.statusTodo
                        : risposta?.risposta_corretta
                          ? copy.statusDone
                          : copy.statusReview
                      const buttonLabel = hasConfirmedResponse ? copy.reviewButton : copy.startButton

                      return (
                        <article key={exercise.id} className="exercise-card">
                          <div className="exercise-card-content">
                            <header className="exercise-card-head">
                              <div className="exercise-chip">{exercise.block}</div>
                              <span className="exercise-status">{statusLabel}</span>
                            </header>
                            <div className="exercise-body">
                              <h2>{formatExerciseTitle(exercise)}</h2>
                              <div className="exercise-meta" aria-label={copy.exerciseMetaAriaLabel}>
                                <span className="exercise-meta-item">📉 {chartMeta.source}</span>
                                <span className="exercise-meta-item"> {chartMeta.timeframe}</span>
                                <span className="exercise-meta-item"> {chartMeta.instrument}</span>
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
                            {hasConfirmedResponse && onNavigateToProgress && (
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => onNavigateToProgress(exercise.day)}
                              >
                                {copy.keyReasoning}
                              </button>
                            )}
                            {!testerId && (
                              <span className="exercise-hint">
                                {copy.hintNoProfile}
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
                      <span className="exercise-day-summary-score">{copy.locked}</span>
                      <span className="exercise-day-summary-copy">{lockCopy}</span>
                    </div>
                  ) : isNotStarted ? (
                    <>
                      <div className="exercise-day-summary-card">
                        <span className="exercise-day-summary-score">{copy.notStarted}</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-outline" onClick={() => toggleDay(day)}>
                          {copy.startButton}
                        </button>
                      </div>
                    </>
                  ) : isCompleted ? (
                    <>
                      <div className="exercise-day-summary-card">
                        <span className="exercise-day-summary-score">{`${status?.correctCount ?? 0}/${dayExercises.length} ${language === 'en' ? 'correct' : 'corretti'}`}</span>
                        <span className="exercise-day-summary-copy">{copy.summaryKeyReasoning}</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-review" onClick={() => toggleDay(day)}>
                          {copy.reviewAll}
                        </button>
                        {onNavigateToProgress && (
                          <button type="button" className="btn btn-outline" onClick={() => onNavigateToProgress()}>
                            {copy.keyReasoning}
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="exercise-day-summary-card">
                        <span className="exercise-day-summary-score">{`${status?.correctCount ?? 0}/${dayExercises.length} ${language === 'en' ? 'correct' : 'corretti'}`}</span>
                        <span className="exercise-day-summary-copy">{copy.summaryKeyReasoning}</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-outline" onClick={() => toggleDay(day)}>
                          {copy.continueButton}
                        </button>
                        {onNavigateToProgress && (
                          <button type="button" className="btn btn-outline" onClick={() => onNavigateToProgress()}>
                            {copy.keyReasoning}
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
