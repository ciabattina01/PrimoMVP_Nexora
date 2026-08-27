import { Fragment, useEffect, useMemo, useState } from 'react'
import {
  EXERCISE_DAYS,
  getExerciseById,
  getExercisesForDay,
} from '../data/exercises'
import { getRisposte, saveRisposta, saveDifficultyRating, getDifficultyRatingForExercise, updateRispostaWithDifficulty } from '../utils/dataTracking'
import { getDayMeta, getExerciseNumber, markDayStarted } from '../utils/dayLogic'

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
  if (title.match(/^Step\s+\d+/)) {
    return title
  }

  // If title starts with "Esercizio [numero]", convert it to step naming
  if (title.match(/^Esercizio\s+\d+/)) {
    return title.replace(/^Esercizio\s+/, 'Step ')
  }
  
  // Otherwise, add the "Step [numero] —" prefix
  return `Step ${exerciseNumber} — ${title}`
}

const DAY_SCENARIO_LABELS = {
  1: ' •⌚meno di 5 min ogni step',
  2: ' •⌚meno di 5 min ogni step',
  3: '• Gold Spot / USD •⌚meno di 5 min ogni step',
}

const DAILY_OBJECTIVES = {
  1: {
    title: '🎯 Obiettivo di oggi — Giorno 1: DOVE INIZIARE A GUARDARE',
    lines: ['Gli step allenano un modo di ragionare da utilizzare su timeframe e tipi di operatività diversi '],
    divider: `📉 Grafici qualitativi`
  },
  2: {
    title: '🎯 Obiettivo di oggi — Giorno 2: SELEZIONARE CIO` CHE CONTA DAVVERO SUL GRAFICO',
    lines: [
      'Gli step allenano un modo di ragionare da utilizzare su timeframe e tipi di operatività diversi',
      '',
    ],
    divider: '📉 Grafici qualitativi - Domani avrai grafici statici reali',
  },
  3: {
    title: '🎯 Obiettivo di oggi — Giorno 3: PRENDI UNA DECISIONE MOTIVATA',
    lines: [
      '',
      `   Useremo questi colori: 
 Arancio = candela ribassista = Apertura > Chiusura  |
Grigio = candela rialzista = Apertura < Chiusura ____📉 Grafico statico reale`,
    ],
  },
}

const GENERAL_OBJECTIVES = [
  {
    title: '📈 Fai correttamente almeno 1 step sul Trend',
    steps: [1, 4, 7],
  },
  {
    title: '📍 Fai correttamente almeno 1 step sulle Zone',
    steps: [2, 5, 8],
  },
  {
    title: '🛡️ Fai correttamente almeno 1 step su Trigger/Rischio',
    steps: [3, 6, 9],
  },
]

function getGeneralObjectiveSummary(correctSteps) {
  if (!correctSteps.length) {
    return 'Nessuno step ancora completato correttamente'
  }

  if (correctSteps.length === 1) {
    return `🎉Hai capito lo step ${correctSteps[0]}`
  }

  return `🎉Hai capito gli step ${correctSteps.join(', ')}`
}

function formatStepList(stepNumbers) {
  if (stepNumbers.length <= 1) {
    return String(stepNumbers[0] || '')
  }

  if (stepNumbers.length === 2) {
    return `${stepNumbers[0]} e ${stepNumbers[1]}`
  }

  const initialSteps = stepNumbers.slice(0, -1).join(', ')
  const lastStep = stepNumbers[stepNumbers.length - 1]
  return `${initialSteps} e ${lastStep}`
}

function buildDayCompletionFeedback(day, risposteByExercise) {
  const dayExercises = getExercisesForDay(day)
  const incorrectSteps = dayExercises
    .map((exercise, index) => {
      const exerciseNumber = getExerciseNumber(exercise)
      const risposta = risposteByExercise.get(exerciseNumber)
      return Boolean(risposta?.risposta_corretta) ? null : index + 1
    })
    .filter((step) => step != null)

  if (!incorrectSteps.length) {
    return '3 step su 3 corretti — stai iniziando a capire come prendere una decisione sul grafico!'
  }

  if (incorrectSteps.length === 1) {
    return `Hai sbagliato lo Step ${incorrectSteps[0]}. In Ragionamenti chiave puoi rivedere il ragionamento.`
  }

  return `Hai sbagliato gli Step ${formatStepList(incorrectSteps)}. In Ragionamenti chiave puoi rivedere i ragionamenti.`
}

const DAY_COMPLETION_MESSAGES = {
  1: {
    title: '🎉 Hai completato il Giorno 1!',
    lines: [
      'Ottimo lavoro!',
      '⏱️ Torna domani per il Giorno 2. Bastano meno di 5 minuti. 💪🏻',
    ],
  },
  2: {
    title: '🎉 Hai completato il Giorno 2!',
    lines: [
      'Ottimo lavoro! Hai concluso i tre step di oggi.',
      '⏱️ Torna domani per il Giorno 3. Bastano meno di 5 minuti. 💪🏻',
    ],
  },
  3: {
    title: '🎉 Hai completato tutto il percorso!',
    lines: [
      'Grazie per aver partecipato al test.',
      'Il tuo feedback sarà molto importante per migliorare il secondo prototipo.',
    ],
  },
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

function splitStep7ZoomFeedbackSection(text) {
  const source = String(text ?? '')
  const lines = source.split('\n')
  const markerLineIndex = lines.findIndex((line) => /Ma\s+il\s+Massimo\s+2\?/i.test(line))

  if (markerLineIndex < 0) {
    return null
  }

  const isSeparatorLine = (line) => /^_{3,}$/.test(String(line).trim())

  let topSeparatorLineIndex = -1
  for (let index = markerLineIndex - 1; index >= 0; index -= 1) {
    if (isSeparatorLine(lines[index])) {
      topSeparatorLineIndex = index
      break
    }
  }

  let bottomSeparatorLineIndex = -1
  for (let index = markerLineIndex + 1; index < lines.length; index += 1) {
    if (isSeparatorLine(lines[index])) {
      bottomSeparatorLineIndex = index
      break
    }
  }

  if (topSeparatorLineIndex < 0 || bottomSeparatorLineIndex < 0) {
    return null
  }

  const before = lines.slice(0, markerLineIndex).join('\n')
  const focus = lines.slice(markerLineIndex, bottomSeparatorLineIndex).join('\n')
  const after = lines.slice(bottomSeparatorLineIndex).join('\n')

  if (!focus.trim()) {
    return null
  }

  return {
    before,
    focus,
    after,
  }
}

function Exercises({ testerId, onNavigateToProgress, onReturnToProgram }) {
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

    return getExerciseById(selectedExerciseId)
  }, [selectedExerciseId])
  const step7ZoomFeedbackSection = useMemo(() => {
    if (!selectedExercise || selectedExercise.id !== 'day3-ex1') {
      return null
    }

    return splitStep7ZoomFeedbackSection(selectedExercise.feedback)
  }, [selectedExercise])

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

  const currentObjective = DAILY_OBJECTIVES[currentObjectiveDay] || DAILY_OBJECTIVES[1]

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

    const selectedDayExercises = getExercisesForDay(selectedExercise.day)
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
      setDifficultySelectionMessage('Prima seleziona quanto era facile o difficile per te. Ti serve solo un click.')
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
      setDifficultySelectionMessage('Prima seleziona quanto era facile o difficile per te. Ti serve solo un click.')
      scrollToDifficultyRating()
      return
    }

    if (testerId) {
      persistDifficultyFeedback()
    }

    const dayExercises = getExercisesForDay(selectedExercise.day)
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
    const completionCopy = DAY_COMPLETION_MESSAGES[completedDayScreen] || DAY_COMPLETION_MESSAGES[1]
    const completionFeedback = buildDayCompletionFeedback(completedDayScreen, risposteByExercise)

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
              Torna al programma
            </button>
            {onNavigateToProgress && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => onNavigateToProgress(completedDayScreen)}
              >
                Rivedi i ragionamenti
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
    const selectedDayExercises = getExercisesForDay(selectedExercise.day)
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
            ← Torna al programma di oggi
          </button>
        )}

        <div className="exercise-detail" aria-live="polite">
          <div className="exercise-detail-head">
            <span className="exercise-detail-day">{`Giorno ${selectedExercise.day}`}</span>
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
              {isFreeResponseExercise ? (
                <button
                  type="button"
                  className="btn btn-action"
                  onClick={handleConfirmAnswer}
                  disabled={answerButtonDisabled}
                >
                  Conferma e confronta
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
                        Conferma e confronta
                      </button>
                    </div>
                  )}
                </>
              )}
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

          {hasAnswered && (
            <div className={feedbackClass}>
              <h3>Ragionamento guidato</h3>
              {selectedExercise.id === 'day3-ex1' && step7ZoomFeedbackSection ? (
                <>
                  {renderRichText(step7ZoomFeedbackSection.before)}
                  <div className="exercise-zoom-es4-layout">
                    <div className="exercise-zoom-es4-copy">{renderRichText(step7ZoomFeedbackSection.focus)}</div>
                    <div className="exercise-zoom-es4-visual">
                      <img
                        src={STEP7_ZOOM_IMAGE_PATH}
                        alt="Zoom di approfondimento sul confronto tra Massimo 1 e Massimo 2"
                        className="exercise-zoom-es4-image"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  {renderRichText(step7ZoomFeedbackSection.after)}
                </>
              ) : (
                renderRichText(selectedExercise.feedback)
              )}
            </div>
          )}

          {hasAnswered && (
            <div className="exercise-difficulty-rating">
              <h4>Questo esercizio per me</h4>
              <div className="difficulty-scale">
                <div className="scale-labels">
                  <span className="scale-label scale-label-left">Troppo facile</span>
                  <span className="scale-label scale-label-center">Per me ok</span>
                  <span className="scale-label scale-label-right">Troppo difficile</span>
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
                <h4>C'è qualcosa che ti è rimasto poco chiaro? (facoltativo)</h4>
                <textarea
                  className="exercise-confirm-modal__textarea"
                  placeholder="Scrivi qui eventuali osservazioni"
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
                  {isSavingAndClosingDay ? 'Salvataggio...' : 'Salva e chiudi il giorno'}
                </button>
              ) : (
                <>
                  {canGoToNextStep && (
                    <button type="button" className="btn btn-action" onClick={handleGoToNextStep}>
                      Vai al prossimo ➡️
                    </button>
                  )}
                  <button type="button" className="btn" onClick={handleReturnToProgram}>
                    Torna al programma
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
         💡 Non sai cosa guardare sul grafico?
        </button>
        {isExercisesInfoOpen && (
          <div>
            {renderRichText(`

Gli step servono ad **allenare un modo di ragionare sul grafico**, un passo alla volta.

Il focus non è memorizzare tutti i termini tecnici, ma imparare a farsi le **domande giuste, capire cosa osservare e riconoscere ciò che conta davvero su un grafico.**

Questo modo di ragionare può essere applicato su **timeframe e tipi di operatività diversi.**

Nel percorso partiremo da:

**Giorno 1 e 2 — Grafici semplici e qualitativi**

**Obiettivo:** imparare cosa osservare sul grafico e distinguere le informazioni che contano davvero.

**Giorno 3 — Primo grafico reale**

**Obiettivo:** allenare l’occhio su una situazione più realistica e complessa, applicando però lo stesso ragionamento imparato nei giorni precedenti.`)}
          </div>
        )}
        <span className="eyebrow">Esercitati</span>
        <h1 className="page-title">Cosa guardare sul grafico</h1>
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
          <p className="exercise-goal-title">🎯 Obiettivi generali</p>
          {GENERAL_OBJECTIVES.map((objective) => {
            const correctSteps = objective.steps.filter((stepNumber) => {
              const risposta = risposteByExercise.get(stepNumber)
              return Boolean(risposta?.risposta_corretta)
            })
            const objectiveSummary = getGeneralObjectiveSummary(correctSteps)

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
          const scenarioLabel = DAY_SCENARIO_LABELS[day]
          const dayHeading = scenarioLabel
            ? `Giorno ${day}  ${scenarioLabel}`
            : `Giorno ${day}`
          const lockCopy = status?.isBlockedByDate
            ? 'Disponibile da domani⏰'
            : 'Termina prima il giorno precedente.'

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
                               Ragionamenti chiave
                              </button>
                            )}
                            {!testerId && (
                              <span className="exercise-hint">
                                Salva il profilo per abilitare il tracciamento quando gli step saranno attivi.
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
                      <span className="exercise-day-summary-copy">{lockCopy}</span>
                    </div>
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
                        <span className="exercise-day-summary-copy">Ragionamenti chiave</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-review" onClick={() => toggleDay(day)}>
                          Rivedi tutto
                        </button>
                        {onNavigateToProgress && (
                          <button type="button" className="btn btn-outline" onClick={() => onNavigateToProgress()}>
                           Ragionamenti chiave
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="exercise-day-summary-card">
                        <span className="exercise-day-summary-score">{`${status?.correctCount ?? 0}/${dayExercises.length} corretti`}</span>
                        <span className="exercise-day-summary-copy">Ragionamenti chiave</span>
                      </div>
                      <div className="exercise-day-summary-actions">
                        <button type="button" className="btn btn-outline" onClick={() => toggleDay(day)}>
                          Continua
                        </button>
                        {onNavigateToProgress && (
                          <button type="button" className="btn btn-outline" onClick={() => onNavigateToProgress()}>
                            Ragionamenti chiave
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
