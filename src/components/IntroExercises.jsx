import { Fragment, useMemo, useState } from 'react'
import { INTRO_STEPS, getIntroStepById } from '../data/introExercises'
import {
  getTesterId,
  saveDifficultyRating,
  saveRisposta,
  updateRispostaWithDifficulty,
} from '../utils/dataTracking'
import introStep0AInitialImage from '../../immagini_intro/2coppie_e_3perche_prezzi_si_muovono.jpeg'
import introStep0ASecondImage from '../../immagini_intro/domanda_offerta.jpeg'
import introStep0ATrendUpImage from '../../immagini_intro/rialzista.png'
import introStep0ATrendDownImage from '../../immagini_intro/ribassista.png'
import introStep0BInitialImage from '../../immagini_intro/candele_bidask.jpeg'
import introStep0BSecondImage from '../../immagini_intro/ordini.jpeg'
import introStep0BMyfxbookImage from '../../immagini_intro/posizione.png'
import introStep0BLeverageImage from '../../immagini_intro/leva.jpeg'
import introStep0BZoneImage from '../../immagini_intro/zona.JPG'
import introStep0BTimeframeSupImage from '../../immagini_intro/timeframesup_AGGIUNTE.JPG'
import introStep0BTimeframeInfImage from '../../immagini_intro/timeframeinf.JPG'
import introStep0BConfermaMassimoImage from '../../immagini_intro/confermamassimo.png'
import introStep0BTriggerImage from '../../immagini_intro/trigger.JPG'

const INTRO_STEP_A_ID = 'intro-step-1'
const INTRO_STEP_B_ID = 'intro-step-2'
const INTRO_STEP_C_ID = 'intro-step-3'
const INTRO_GUIDED_STEP_IDS = new Set([INTRO_STEP_A_ID, INTRO_STEP_B_ID, INTRO_STEP_C_ID])

function getIntroExerciseKey(step) {
  if (!step) return ''
  if (step.id === INTRO_STEP_A_ID) return '0A'
  if (step.id === INTRO_STEP_B_ID) return '0B'
  if (step.id === INTRO_STEP_C_ID) return '0C'
  return `0${String(step.order)}`
}

function renderIntroTextWithBold(text) {
  const source = String(text ?? '')
  const parts = source.split(/(\*\*[\s\S]+?\*\*)/g)

  return parts.map((part, index) => {
    const match = part.match(/^\*\*([\s\S]+)\*\*$/)
    if (match) {
      return <strong key={`intro-bold-${index}`}>{match[1]}</strong>
    }

    return <Fragment key={`intro-text-${index}`}>{part}</Fragment>
  })
}

function splitIntroStepBMyfxbookSection(feedbackText) {
  const source = String(feedbackText ?? '')
  const markerPattern = /(\*\*\s*Come\s+usare\s+il\s+calcolatore\s+Myfxbook:\s*\*\*[\s\S]*)/i
  const parts = source.split(markerPattern)

  if (parts.length < 2 || !parts[1]?.trim()) {
    return null
  }

  return {
    beforeMyfxbook: parts[0] || '',
    myfxbookSection: parts[1],
  }
}

function splitIntroStepATrendSection(feedbackText) {
  const source = String(feedbackText ?? '')
  const trendHeadingPattern = /\*\*\s*Come riconoscere un trend rialzista\/ribassista\?\s*\*\*/i
  const headingMatch = trendHeadingPattern.exec(source)

  if (!headingMatch || typeof headingMatch.index !== 'number') {
    return null
  }

  const beforeTrend = source.slice(0, headingMatch.index)
  const afterHeading = source.slice(headingMatch.index + headingMatch[0].length)
  const nextSectionMatch = /(\*\*\s*5-Cosa[\s\S]*)/i.exec(afterHeading)

  if (!nextSectionMatch?.[1]) {
    return null
  }

  const trendBody = afterHeading.slice(0, nextSectionMatch.index)
  const trendSectionPattern = /(?:^|\n)\s*(\*\*[^\n]*?:\s*\*\*[\s\S]*?)(?=(?:\n\s*\*\*[^\n]*?:\s*\*\*)|$)/g
  const trendSections = Array.from(trendBody.matchAll(trendSectionPattern))
    .map((match) => String(match[1] ?? '').trim())
    .filter(Boolean)

  if (trendSections.length < 2) {
    return null
  }

  return {
    beforeTrend,
    trendUpSection: trendSections[0],
    trendDownSection: trendSections[1],
    afterTrend: nextSectionMatch[1],
  }
}

function splitIntroStepBLeverageSection(feedbackText) {
  const source = String(feedbackText ?? '')
  const leverageHeadingPattern = /(\*\*6\s*-\s*Ma se[\s\S]*?la Leva\*\*)/i
  const headingMatch = leverageHeadingPattern.exec(source)

  if (!headingMatch || typeof headingMatch.index !== 'number') {
    return null
  }

  const beforeLeverage = source.slice(0, headingMatch.index)
  const afterHeading = source.slice(headingMatch.index + headingMatch[0].length)
  const pipMarkerPattern = /🔎\s*\*\*Unità di Pip\*\*/i
  const pipMatch = pipMarkerPattern.exec(afterHeading)

  if (!pipMatch || typeof pipMatch.index !== 'number') {
    return null
  }

  return {
    beforeLeverage,
    leverageSection: `${headingMatch[0]}${afterHeading.slice(0, pipMatch.index)}`,
    afterLeverage: afterHeading.slice(pipMatch.index),
  }
}

function splitIntroStepBZoneSection(practicalExplanationText) {
  const source = String(practicalExplanationText ?? '')
  const zoneStartPattern = /(\*\*\s*Quale candela utilizzo\?\s*\*\*)/i
  const zoneStartMatch = zoneStartPattern.exec(source)

  if (!zoneStartMatch || typeof zoneStartMatch.index !== 'number') {
    return null
  }

  const beforeZone = source.slice(0, zoneStartMatch.index)
  const fromZoneStart = source.slice(zoneStartMatch.index)
  const nextSectionPattern = /(\*\*\s*7[\s\S]*?\*\*)/i
  const nextSectionMatch = nextSectionPattern.exec(fromZoneStart)

  if (!nextSectionMatch || typeof nextSectionMatch.index !== 'number') {
    return null
  }

  return {
    beforeZone,
    zoneSection: fromZoneStart.slice(0, nextSectionMatch.index),
    afterZone: fromZoneStart.slice(nextSectionMatch.index),
  }
}

function splitIntroStepCZoneSection(questionText) {
  const source = String(questionText ?? '')
  const zoneStartPatterns = [
    /((?:_{2,}\s*)?\*\*\s*A\s*cosa\s*serve\s*\*\*)/i,
    /((?:_{2,}\s*)?A\s*cosa\s*serve)/i,
    /(\*\*\s*3\s*-\s*Zona\s+interessante[\s\S]*?\*\*)/i,
  ]
  const zoneStartMatch = zoneStartPatterns
    .map((pattern) => pattern.exec(source))
    .find((match) => match && typeof match.index === 'number')

  if (!zoneStartMatch || typeof zoneStartMatch.index !== 'number') {
    return null
  }

  const beforeZone = source.slice(0, zoneStartMatch.index)
  const zoneSection = source.slice(zoneStartMatch.index)

  return {
    beforeZone,
    zoneSection,
    afterZone: '',
  }
}

function splitIntroStepBTriggerSection(zoneSectionText) {
  const source = String(zoneSectionText ?? '')
  const triggerHeadingPattern = /(\*\*\s*TRIGGER\s*\*\*)/i
  const triggerHeadingMatch = triggerHeadingPattern.exec(source)

  if (!triggerHeadingMatch || typeof triggerHeadingMatch.index !== 'number') {
    return null
  }
  const beforeTrigger = source.slice(0, triggerHeadingMatch.index)

  const fromTrigger = source.slice(triggerHeadingMatch.index)
  const takeProfitPattern = /(\*\*\s*TAKE\s+PROFIT\s*\*\*)/i
  const takeProfitMatch = takeProfitPattern.exec(fromTrigger)

  if (!takeProfitMatch || typeof takeProfitMatch.index !== 'number') {
    return null
  }

  return {
    beforeTrigger,
    triggerSection: fromTrigger.slice(0, takeProfitMatch.index),
    afterTrigger: fromTrigger.slice(takeProfitMatch.index),
  }
}

function splitIntroStepCTriggerIntroAndDetails(triggerSectionText) {
  const source = String(triggerSectionText ?? '').trim()
  if (!source) {
    return null
  }

  const triggerHeadingPatterns = [
    /(\*\*\s*TRIGGER\s*:[\s\S]*?\*\*)/i,
    /(\*\*\s*TRIGGER\s*\*\*)/i,
  ]
  const headingMatch = triggerHeadingPatterns
    .map((pattern) => pattern.exec(source))
    .find((match) => match && typeof match.index === 'number')

  if (!headingMatch || typeof headingMatch.index !== 'number') {
    return {
      intro: source,
      details: '',
    }
  }

  const heading = headingMatch[0].trimEnd()
  const afterHeading = source.slice(headingMatch.index + headingMatch[0].length).trimStart()

  if (!afterHeading) {
    return {
      intro: heading,
      details: '',
    }
  }

  const paragraphBreakMatch = /(\n\s*\n+)/.exec(afterHeading)

  if (!paragraphBreakMatch || typeof paragraphBreakMatch.index !== 'number') {
    return {
      intro: `${heading}\n${afterHeading}`.trim(),
      details: '',
    }
  }

  const introBody = afterHeading.slice(0, paragraphBreakMatch.index).trim()
  const details = afterHeading.slice(paragraphBreakMatch.index + paragraphBreakMatch[0].length).trim()

  return {
    intro: `${heading}\n${introBody}`.trim(),
    details,
  }
}

function splitIntroStepCTriggerSection(feedbackText) {
  const source = String(feedbackText ?? '')
  const triggerHeadingPatterns = [
    /(\*\*\s*TRIGGER\s*:[\s\S]*?\*\*)/i,
    /(\*\*\s*TRIGGER\s*\*\*)/i,
  ]
  const triggerHeadingMatch = triggerHeadingPatterns
    .map((pattern) => pattern.exec(source))
    .find((match) => match && typeof match.index === 'number')

  if (!triggerHeadingMatch || typeof triggerHeadingMatch.index !== 'number') {
    return null
  }

  const timeframeLeadPattern = /(•\s*\*\*\s*Ci\s+spostiamo\s+su\s+un\s+timeframe\s+inferiore\s*\*\*)/i
  const timeframeLeadMatch = timeframeLeadPattern.exec(source)
  const hasTimeframeLeadBeforeTrigger =
    timeframeLeadMatch &&
    typeof timeframeLeadMatch.index === 'number' &&
    timeframeLeadMatch.index <= triggerHeadingMatch.index

  let beforeTrigger = source.slice(0, triggerHeadingMatch.index)
  let timeframeLead = ''

  if (hasTimeframeLeadBeforeTrigger) {
    const leadStart = timeframeLeadMatch.index
    const leadText = timeframeLeadMatch[0] ?? ''
    const leadEnd = leadStart + leadText.length
    const beforeLead = source.slice(0, leadStart)
    const betweenLeadAndTrigger = source.slice(leadEnd, triggerHeadingMatch.index)

    timeframeLead = leadText
    beforeTrigger = `${beforeLead}${betweenLeadAndTrigger}`
  }

  const fromTrigger = source.slice(triggerHeadingMatch.index)
  const takeProfitPattern = /(\*\*\s*TAKE\s+PROFIT\s*\*\*)/i
  const takeProfitMatch = takeProfitPattern.exec(fromTrigger)

  if (!takeProfitMatch || typeof takeProfitMatch.index !== 'number') {
    return null
  }

  return {
    beforeTrigger,
    timeframeLead,
    triggerSection: fromTrigger.slice(0, takeProfitMatch.index),
    afterTrigger: fromTrigger.slice(takeProfitMatch.index),
  }
}

function splitIntroStepBRiskWinSection(practicalExplanationText) {
  const source = String(practicalExplanationText ?? '')
  const markerPattern = /(\*\*\s*8\s*-\s*Rischio\/Rendimento\s+e\s+Win\s+Ratio[\s\S]*)/i
  const markerMatch = markerPattern.exec(source)

  if (!markerMatch || typeof markerMatch.index !== 'number') {
    return null
  }

  return {
    beforeRiskWin: source.slice(0, markerMatch.index),
    riskWinSection: source.slice(markerMatch.index),
  }
}

function splitIntroStepBStructureFocusSection(text) {
  const source = String(text ?? '')
  const stepOneHeadingPattern = /(\*\*\s*1\s*-\s*Da\s+dove\s+inizia\s+la\s+struttura\s+rialzista\?\s*\*\*)/i
  const stepOneHeadingMatch = stepOneHeadingPattern.exec(source)

  if (!stepOneHeadingMatch || typeof stepOneHeadingMatch.index !== 'number') {
    return null
  }

  const sourceFromStepOne = source.slice(stepOneHeadingMatch.index)
  const stepTwoHeadingPattern = /(\*\*\s*2\s*-\s*Minimi\s+strutturali\s+rialzisti[\s\S]*?\*\*)/i
  const stepTwoHeadingMatch = stepTwoHeadingPattern.exec(sourceFromStepOne)
  const stepOneSection = stepTwoHeadingMatch
    ? sourceFromStepOne.slice(0, stepTwoHeadingMatch.index)
    : sourceFromStepOne
  const afterStepOneSection = stepTwoHeadingMatch
    ? sourceFromStepOne.slice(stepTwoHeadingMatch.index)
    : ''

  const focusBoundaryPatterns = [
    /(\n+\s*Ora[\s\S]{0,120}massimo\s+strutturale\s+ribassista[\s\S]*)/i,
    /(\n+\s*_{3,}\s*Troviamo[\s\S]*)/i,
    /(\n+\s*(?:Adesso\s+)?ci\s+interessa[\s\S]*)/i,
  ]

  const match = focusBoundaryPatterns
    .map((pattern) => pattern.exec(stepOneSection))
    .find((boundaryMatch) => boundaryMatch && typeof boundaryMatch.index === 'number')

  if (!match || typeof match.index !== 'number') {
    return null
  }

  return {
    beforeFocus: source.slice(0, stepOneHeadingMatch.index) + stepOneSection.slice(0, match.index),
    afterFocus: stepOneSection.slice(match.index) + afterStepOneSection,
  }
}

function getSavedIntroState(step) {
  if (!step || typeof window === 'undefined' || !window.localStorage) return null

  const testerId = getTesterId()
  if (!testerId) return null

  const introExerciseKey = String(getIntroExerciseKey(step)).trim().toUpperCase()
  if (!introExerciseKey) return null

  try {
    const rawRisposte = window.localStorage.getItem('nexora_risposte')
    const parsedRisposte = rawRisposte ? JSON.parse(rawRisposte) : []
    if (!Array.isArray(parsedRisposte)) return null

    const savedResponse = [...parsedRisposte]
      .reverse()
      .find((risposta) => {
        if (!risposta || risposta.tester_id !== testerId) return false

        const savedExerciseKey = String(risposta.esercizio_id ?? risposta.esercizio ?? '').trim().toUpperCase()
        return savedExerciseKey === introExerciseKey
      })

    if (!savedResponse) return null

    const savedAnswer = String(savedResponse.risposta_scelta ?? savedResponse.risposta ?? '').trim()
    if (!savedAnswer) return null

    const hasMatchingOption = step.answers?.some((answer) => answer.key === savedAnswer)
    if (!hasMatchingOption) return null

    const parsedDifficulty = Number.parseInt(String(savedResponse.difficolta_percepita), 10)
    const hasSavedDifficulty = !Number.isNaN(parsedDifficulty)
    const savedReflectionText =
      typeof savedResponse.cosa_non_chiaro === 'string' ? savedResponse.cosa_non_chiaro : ''

    return {
      answer: savedAnswer,
      difficultyRating: hasSavedDifficulty ? parsedDifficulty : null,
      reflectionText: savedReflectionText,
      isDifficultyFeedbackLocked: hasSavedDifficulty,
    }
  } catch (error) {
    console.warn('Impossibile leggere la risposta introduttiva salvata', error)
    return null
  }
}

function IntroExercises() {
  const [selectedStepId, setSelectedStepId] = useState(null)
  const [pendingAnswer, setPendingAnswer] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false)
  const [difficultyRating, setDifficultyRating] = useState(null)
  const [reflectionText, setReflectionText] = useState('')
  const [isDifficultyFeedbackLocked, setIsDifficultyFeedbackLocked] = useState(false)
  const [isSavingAndClosingIntro, setIsSavingAndClosingIntro] = useState(false)
  const [completedStepIds, setCompletedStepIds] = useState(() => new Set())
  const [showFinalScreen, setShowFinalScreen] = useState(false)

  const scrollToTopOnStepChange = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  const selectedStep = useMemo(
    () => (selectedStepId ? getIntroStepById(selectedStepId) : null),
    [selectedStepId],
  )
  const isStepA = selectedStep?.id === INTRO_STEP_A_ID
  const isStepB = selectedStep?.id === INTRO_STEP_B_ID
  const isStepC = selectedStep?.id === INTRO_STEP_C_ID

  const stepBMyfxbookFeedback = useMemo(() => {
    if (!isStepB || !selectedStep) {
      return null
    }

    return splitIntroStepBMyfxbookSection(selectedStep.feedback)
  }, [isStepB, selectedStep])
  const stepATrendFeedback = useMemo(() => {
    if (!isStepA || !selectedStep) {
      return null
    }

    return splitIntroStepATrendSection(selectedStep.feedback)
  }, [isStepA, selectedStep])
  const stepBLeverageFeedback = useMemo(() => {
    if (!isStepB || !selectedStep) {
      return null
    }

    return splitIntroStepBLeverageSection(selectedStep.feedback)
  }, [isStepB, selectedStep])
  const stepCZoneQuestionSection = useMemo(() => {
    if (!isStepC || !selectedStep?.question) {
      return null
    }

    return splitIntroStepCZoneSection(selectedStep.question)
  }, [isStepC, selectedStep])
  const stepCStructureFocusQuestionSection = useMemo(() => {
    if (!stepCZoneQuestionSection?.beforeZone) {
      return null
    }

    return splitIntroStepBStructureFocusSection(stepCZoneQuestionSection.beforeZone)
  }, [stepCZoneQuestionSection])
  const stepCTriggerFeedbackSection = useMemo(() => {
    if (!isStepC || !selectedStep?.feedback) {
      return null
    }

    return splitIntroStepCTriggerSection(selectedStep.feedback)
  }, [isStepC, selectedStep])
  const stepCFeedbackRiskWinSection = useMemo(() => {
    if (!stepCTriggerFeedbackSection?.afterTrigger) {
      return null
    }

    return splitIntroStepBRiskWinSection(stepCTriggerFeedbackSection.afterTrigger)
  }, [stepCTriggerFeedbackSection])
  const stepCTriggerContentSplit = useMemo(() => {
    if (!stepCTriggerFeedbackSection?.triggerSection) {
      return null
    }

    return splitIntroStepCTriggerIntroAndDetails(stepCTriggerFeedbackSection.triggerSection)
  }, [stepCTriggerFeedbackSection])

  const handleOpenStep = (stepId) => {
    const step = getIntroStepById(stepId)
    const savedIntroState = getSavedIntroState(step)

    setSelectedStepId(stepId)
    setPendingAnswer(null)
    setSelectedAnswer(savedIntroState?.answer ?? null)
    setIsAnswerConfirmed(Boolean(savedIntroState?.answer))
    setDifficultyRating(savedIntroState?.difficultyRating ?? null)
    setReflectionText(savedIntroState?.reflectionText ?? '')
    setIsDifficultyFeedbackLocked(Boolean(savedIntroState?.isDifficultyFeedbackLocked))
    setShowFinalScreen(false)
  }

  const handleBackToIntroProgram = () => {
    setSelectedStepId(null)
    setPendingAnswer(null)
    setSelectedAnswer(null)
    setIsAnswerConfirmed(false)
    setDifficultyRating(null)
    setReflectionText('')
    setIsDifficultyFeedbackLocked(false)
  }

  const handleConfirmAnswer = () => {
    if (isAnswerConfirmed) return
    if (!selectedStep) return

    const isGuidedIntroStep = INTRO_GUIDED_STEP_IDS.has(selectedStep.id)
    const confirmedAnswer = isGuidedIntroStep
      ? selectedStep.answers?.[0]?.key ?? 'INTRO_CONTINUA'
      : pendingAnswer
    if (!confirmedAnswer) return

    const introExerciseKey = getIntroExerciseKey(selectedStep)
    const isCorrect = selectedStep.correctAnswer
      ? confirmedAnswer === selectedStep.correctAnswer
      : true

    saveRisposta({
      esercizio_id: introExerciseKey,
      risposta_scelta: confirmedAnswer,
      risposta_corretta: isCorrect,
    })

    setSelectedAnswer(confirmedAnswer)
    setPendingAnswer(null)
    setIsAnswerConfirmed(true)
  }

  const persistIntroDifficultyFeedback = (difficultyValue) => {
    if (isDifficultyFeedbackLocked) return
    if (!selectedStep || !selectedAnswer) return

    const testerId = getTesterId()
    if (!testerId) return

    const introExerciseKey = getIntroExerciseKey(selectedStep)
    const payload = {
      testerId,
      giorno: 0,
      esercizio_id: introExerciseKey,
      difficolta_percepita: difficultyValue,
      cosa_non_chiaro: reflectionText.trim(),
    }

    saveDifficultyRating(payload)
    updateRispostaWithDifficulty(payload)
  }

  const markCurrentStepAsCompleted = () => {
    if (!selectedStep) return

    setCompletedStepIds((prev) => {
      const next = new Set(prev)
      next.add(selectedStep.id)
      return next
    })
  }

  const handleDifficultySelect = (value) => {
    if (isDifficultyFeedbackLocked) return
    if (!selectedStep) return

    const isLastIntroStep = selectedStep.order === INTRO_STEPS.length
    setDifficultyRating(value)
    if (!isLastIntroStep) {
      persistIntroDifficultyFeedback(value)
    }
  }

  const handleSaveAndCloseIntro = async () => {
    if (!selectedStep || selectedStep.order !== INTRO_STEPS.length) return
    if (!selectedAnswer || difficultyRating == null) return
    if (isSavingAndClosingIntro) return

    setIsSavingAndClosingIntro(true)
    try {
      await Promise.resolve(persistIntroDifficultyFeedback(difficultyRating))
      markCurrentStepAsCompleted()
      setShowFinalScreen(true)
      setSelectedStepId(null)
    } finally {
      setIsSavingAndClosingIntro(false)
    }
  }

  const handleGoToNextStep = () => {
    if (!selectedStep) return
    persistIntroDifficultyFeedback(difficultyRating)
    markCurrentStepAsCompleted()

    const currentIndex = INTRO_STEPS.findIndex((step) => step.id === selectedStep.id)
    if (currentIndex < 0) return

    const nextStep = INTRO_STEPS[currentIndex + 1]
    if (!nextStep) return

    handleOpenStep(nextStep.id)
    scrollToTopOnStepChange()
  }

  if (showFinalScreen) {
    return (
      <section className="exercises intro-exercises">
        <div className="exercise-day-completion intro-completion-card">
          <h2>🎉 Hai completato i tre step "Inizia da qui"!</h2>
          <p></p>
          <p>Ora puoi continuare con il percorso principale in Esercitati.</p>
          <div className="exercise-day-completion__actions">
            <button type="button" className="btn" onClick={() => setShowFinalScreen(false)}>
              Torna al programma
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (selectedStep) {
    const selectedIndex = INTRO_STEPS.findIndex((step) => step.id === selectedStep.id)
    const nextStep = selectedIndex >= 0 ? INTRO_STEPS[selectedIndex + 1] : null
    const isGuidedIntroStep = INTRO_GUIDED_STEP_IDS.has(selectedStep.id)
    const isLastIntroStep = selectedStep.order === INTRO_STEPS.length
    const hasAnswered = isAnswerConfirmed
    const canContinue = hasAnswered && difficultyRating != null
    const canSaveAndCloseIntro = isLastIntroStep && canContinue && !isDifficultyFeedbackLocked

    return (
      <section className="exercises intro-exercises">
        {!canSaveAndCloseIntro && (
          <button type="button" className="btn btn-outline back-to-program" onClick={handleBackToIntroProgram}>
            ← Torna al programma
          </button>
        )}

        <div className="exercise-detail" aria-live="polite">
          <div className="exercise-detail-head">
            <span className="exercise-detail-day">Inizia da qui</span>
            <h1 className="page-title">{selectedStep.title}</h1>
            <span className="exercise-detail-block">{selectedStep.block}</span>
          </div>

          {!isStepC && (
            <div className="exercise-chart-section">
              <h3></h3>
              <div className="exercise-chart">
                {isStepA ? (
                  <img
                    src={introStep0AInitialImage}
                    alt="Grafico iniziale dello Step 0A"
                    loading="lazy"
                  />
                ) : isStepB ? (
                  <img
                    src={introStep0BInitialImage}
                    alt="Grafico iniziale dello Step 0B"
                    loading="lazy"
                  />
                ) : null}
              </div>
            </div>
          )}

          <div className="exercise-section">
            <div className="exercise-question">
              <h3></h3>
              {isStepC ? (
                <div className="intro-practical-explanation">
                  <div className="intro-timeframe-standalone">
                    <h5 className="intro-timeframe-card-title">Timeframe di esempio H4 - si individua trend e zona</h5>
                    <img
                      src={introStep0BTimeframeSupImage}
                      alt="Timeframe superiore nello Step 0C"
                      className="intro-timeframe-image-large"
                      loading="lazy"
                    />
                  </div>

                  {stepCZoneQuestionSection ? (
                    <>
                      {stepCStructureFocusQuestionSection ? (
                        <>
                          {stepCStructureFocusQuestionSection.beforeFocus.trim() && (
                            <p className="intro-feedback-text">
                              {renderIntroTextWithBold(stepCStructureFocusQuestionSection.beforeFocus)}
                            </p>
                          )}
                          <div className="intro-structure-focus">
                            <img
                              src={introStep0BConfermaMassimoImage}
                              alt="Zoom di conferma del massimo strutturale"
                              className="intro-structure-focus-image"
                              loading="lazy"
                            />
                          </div>
                          {stepCStructureFocusQuestionSection.afterFocus.trim() && (
                            <p className="intro-feedback-text">
                              {renderIntroTextWithBold(stepCStructureFocusQuestionSection.afterFocus)}
                            </p>
                          )}
                        </>
                      ) : (
                        stepCZoneQuestionSection.beforeZone.trim() && (
                          <p className="intro-feedback-text">
                            {renderIntroTextWithBold(stepCZoneQuestionSection.beforeZone)}
                          </p>
                        )
                      )}
                      <div className="intro-zone-layout">
                        <div className="intro-zone-copy">
                          <p className="intro-feedback-text">
                            {renderIntroTextWithBold(stepCZoneQuestionSection.zoneSection)}
                          </p>
                        </div>
                        <div className="intro-zone-visual">
                          <img
                            src={introStep0BZoneImage}
                            alt="Esempio grafico della costruzione della zona long"
                            className="intro-zone-image"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      {stepCZoneQuestionSection.afterZone.trim() && (
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepCZoneQuestionSection.afterZone)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="intro-feedback-text">{renderIntroTextWithBold(selectedStep.question)}</p>
                  )}
                </div>
              ) : (
                <p className="intro-question-text">
                  {renderIntroTextWithBold(selectedStep.question)}
                </p>
              )}
            </div>
          </div>

          {!isGuidedIntroStep && (
            <div className="exercise-section">
              <div className="exercise-answers">
                {selectedStep.answers.map((answer) => (
                  <button
                    key={answer.key}
                    type="button"
                    className={`answer-option${(isAnswerConfirmed ? selectedAnswer === answer.key : pendingAnswer === answer.key) ? ' is-selected' : ''}`}
                    onClick={() => {
                      if (isAnswerConfirmed) return
                      setPendingAnswer(answer.key)
                    }}
                    disabled={isAnswerConfirmed}
                  >
                    <span className="answer-key">{answer.key}.</span>
                    <span className="answer-text">{answer.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isAnswerConfirmed && (
            <div className="exercise-detail-actions">
              <button
                type="button"
                className="btn"
                onClick={handleConfirmAnswer}
                disabled={isGuidedIntroStep ? isAnswerConfirmed : (!pendingAnswer || isAnswerConfirmed)}
              >
               Continua ➡️
              </button>
            </div>
          )}

          {hasAnswered && (
            <>
              {!isStepC && (
                <div className="exercise-chart-section">
                  <h3></h3>
                  <div className="exercise-chart">
                    {isStepA ? (
                      <img
                        src={introStep0ASecondImage}
                        alt="Grafico spiegato dello Step 0A"
                        loading="lazy"
                      />
                    ) : isStepB ? (
                      <img
                        src={introStep0BSecondImage}
                        alt="Grafico spiegato dello Step 0B"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                </div>
              )}

              <div className="exercise-feedback is-correct">
                <h3></h3>
                {isStepC && stepCTriggerFeedbackSection ? (
                  <>
                    <div className="intro-timeframe-standalone intro-timeframe-standalone-inferior">
                      <h5 className="intro-timeframe-card-title">Timeframe inferiore - Trigger e gestione dell’operazione</h5>
                      <img
                        src={introStep0BTimeframeInfImage}
                        alt="Timeframe inferiore nello Step 0C"
                        className="intro-timeframe-image-large"
                        loading="lazy"
                      />
                    </div>

                    <div className="intro-practical-explanation">
                      {stepCTriggerFeedbackSection.beforeTrigger.trim() && (
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepCTriggerFeedbackSection.beforeTrigger)}
                        </p>
                      )}

                      {stepCTriggerContentSplit?.intro ? (
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepCTriggerContentSplit.intro)}
                        </p>
                      ) : (
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepCTriggerFeedbackSection.triggerSection)}
                        </p>
                      )}

                      <div className="intro-structure-focus">
                        <img
                          src={introStep0BTriggerImage}
                          alt="Esempio visivo del trigger operativo"
                          className="intro-trigger-image"
                          loading="lazy"
                        />
                      </div>

                      {stepCTriggerContentSplit?.details && (
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepCTriggerContentSplit.details)}
                        </p>
                      )}

                      {stepCFeedbackRiskWinSection ? (
                        stepCFeedbackRiskWinSection.beforeRiskWin.trim() && (
                          <p className="intro-feedback-text">
                            {renderIntroTextWithBold(stepCFeedbackRiskWinSection.beforeRiskWin)}
                          </p>
                        )
                      ) : (
                        stepCTriggerFeedbackSection.afterTrigger.trim() && (
                          <p className="intro-feedback-text">
                            {renderIntroTextWithBold(stepCTriggerFeedbackSection.afterTrigger)}
                          </p>
                        )
                      )}

                      {selectedStep.riskWinSection && (
                        <div className="intro-risk-win-section">
                          <h4 className="intro-risk-win-title">{selectedStep.riskWinSection.title}</h4>
                          <p className="intro-feedback-text">{selectedStep.riskWinSection.intro}</p>

                          <div className="intro-risk-win-cards">
                            <article className="intro-risk-win-card">
                              <h5>{selectedStep.riskWinSection.riskRewardCard.title}</h5>
                              <p className="intro-feedback-text">{selectedStep.riskWinSection.riskRewardCard.text}</p>
                            </article>
                            <article className="intro-risk-win-card">
                              <h5>{selectedStep.riskWinSection.winRatioCard.title}</h5>
                              <p className="intro-feedback-text">{selectedStep.riskWinSection.winRatioCard.text}</p>
                            </article>
                          </div>

                          <h5 className="intro-risk-win-subtitle">{selectedStep.riskWinSection.relationTitle}</h5>
                          <p className="intro-feedback-text">{selectedStep.riskWinSection.relationText}</p>

                          <div className="intro-risk-win-example">
                            <h5>{selectedStep.riskWinSection.exampleTitle}</h5>
                            <p className="intro-feedback-text">{renderIntroTextWithBold(selectedStep.riskWinSection.exampleText)}</p>
                          </div>

                          <p className="intro-feedback-text">{selectedStep.riskWinSection.closingText}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : isStepB && stepBMyfxbookFeedback ? (
                  <>
                    {stepBMyfxbookFeedback.beforeMyfxbook.trim() && (
                      <p className="intro-feedback-text">
                        {renderIntroTextWithBold(stepBMyfxbookFeedback.beforeMyfxbook)}
                      </p>
                    )}
                    <div className="intro-myfxbook-layout">
                      <div className="intro-myfxbook-copy">
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepBMyfxbookFeedback.myfxbookSection)}
                        </p>
                      </div>
                      <div className="intro-myfxbook-visual">
                        <img
                          src={introStep0BMyfxbookImage}
                          alt="Esempio del calcolatore Myfxbook per il dimensionamento della posizione"
                          className="intro-myfxbook-image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </>
                ) : isStepB && stepBLeverageFeedback ? (
                  <>
                    {stepBLeverageFeedback.beforeLeverage.trim() && (
                      <p className="intro-feedback-text">
                        {renderIntroTextWithBold(stepBLeverageFeedback.beforeLeverage)}
                      </p>
                    )}
                    <div className="intro-leverage-layout">
                      <div className="intro-leverage-copy">
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepBLeverageFeedback.leverageSection.trimEnd())}
                        </p>
                      </div>
                      <div className="intro-leverage-visual">
                        <img
                          src={introStep0BLeverageImage}
                          alt="Schema esplicativo del rapporto leva, margine ed esposizione"
                          className="intro-leverage-image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    {stepBLeverageFeedback.afterLeverage.trim() && (
                      <p className="intro-feedback-text">
                        {renderIntroTextWithBold(stepBLeverageFeedback.afterLeverage.trimStart())}
                      </p>
                    )}
                  </>
                ) : isStepA && stepATrendFeedback ? (
                  <>
                    {stepATrendFeedback.beforeTrend.trim() && (
                      <p className="intro-feedback-text">
                        {renderIntroTextWithBold(stepATrendFeedback.beforeTrend)}
                      </p>
                    )}
                    <div className="intro-trend-row">
                      <div className="intro-trend-copy">
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepATrendFeedback.trendUpSection)}
                        </p>
                      </div>
                      <div className="intro-trend-visual">
                        <img
                          src={introStep0ATrendUpImage}
                          alt="Esempio visivo di trend rialzista"
                          className="intro-trend-image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="intro-trend-row">
                      <div className="intro-trend-copy">
                        <p className="intro-feedback-text">
                          {renderIntroTextWithBold(stepATrendFeedback.trendDownSection)}
                        </p>
                      </div>
                      <div className="intro-trend-visual">
                        <img
                          src={introStep0ATrendDownImage}
                          alt="Esempio visivo di trend ribassista"
                          className="intro-trend-image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    {stepATrendFeedback.afterTrend.trim() && (
                      <p className="intro-feedback-text">
                        {renderIntroTextWithBold(stepATrendFeedback.afterTrend)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="intro-feedback-text">{renderIntroTextWithBold(selectedStep.feedback)}</p>
                )}
              </div>

              <div className="exercise-difficulty-rating intro-final-box">
                <h4>Questo per me era:</h4>
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
                        disabled={isDifficultyFeedbackLocked}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <h4>C'è qualcosa che ti è rimasto poco chiaro? (facoltativo)</h4>
                <textarea
                  className="exercise-confirm-modal__textarea"
                  placeholder="Scrivi qui eventuali osservazioni"
                  value={reflectionText}
                  onChange={(event) => {
                    if (isDifficultyFeedbackLocked) return
                    setReflectionText(event.target.value)
                  }}
                  disabled={isDifficultyFeedbackLocked}
                  rows={5}
                />
              </div>
            </>
          )}

          {canContinue && (
            <div className="exercise-detail-actions">
              {canSaveAndCloseIntro ? (
                <button
                  type="button"
                  className="btn btn-action"
                  onClick={handleSaveAndCloseIntro}
                  disabled={isSavingAndClosingIntro}
                >
                  {isSavingAndClosingIntro ? 'Salvataggio...' : 'Salva e chiudi la parte introduttiva'}
                </button>
              ) : (
                <>
                  {nextStep && (
                    <button type="button" className="btn btn-action" onClick={handleGoToNextStep}>
                      Vai al prossimo step 💪🏻
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      persistIntroDifficultyFeedback(difficultyRating)
                      markCurrentStepAsCompleted()
                      handleBackToIntroProgram()
                    }}
                  >
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
    <section className="exercises intro-exercises">
      <header className="exercise-head">
        <span className="eyebrow">Inizia da qui</span>
        <h1 className="page-title">Da dove iniziare</h1>
      </header>

      <div className="exercise-goals-grid intro-goals-grid">
        <div className="exercise-progress" aria-live="polite">
          <p className="exercise-goal-title">🎯 Obiettivo dei tre step — 📶 DA DOVE INIZIARE</p>
          <p className="exercise-goal-line">
            {renderIntroTextWithBold('**• Gli step allenano un modo di ragionare da utilizzare su grafici e tipi di operatività diversi **')}
          </p>
          <p className="exercise-goal-line">
            {renderIntroTextWithBold(' **•** Questi **3 step ti danno le basi pratiche per iniziare**; nello **Step C** segui un **esempio su un grafico**.')}
          </p>
          <p className="exercise-goal-line">
            {renderIntroTextWithBold(' **• Con quanto capitale iniziare?**Allenati in **simulazione**. Poi come riferimento,  **100–300 €**.')}
          </p>
            <p className="exercise-goal-line">
            {renderIntroTextWithBold('')}
          </p>
        </div>
      </div>

      <div className="exercise-list">
        {INTRO_STEPS.map((step) => {
          const isCompleted = completedStepIds.has(step.id)

          return (
            <article key={step.id} className="exercise-card">
              <div className="exercise-card-content">
                <header className="exercise-card-head">
                  <div className="exercise-chip"></div>
                  <span className="exercise-status">{isCompleted ? 'Compreso ✅' : 'Da iniziare'}</span>
                </header>
                <div className="exercise-body">
                  <h2>{step.title}</h2>
                  <div className="exercise-meta" aria-label="Dettagli didattici">
                    <span className="exercise-meta-item"></span>
                    <span className="exercise-meta-item"> </span>
                    <span className="exercise-meta-item"></span>
                  </div>
                </div>
              </div>
              <div className="exercise-card-actions">
                <button type="button" className="btn btn-action" onClick={() => handleOpenStep(step.id)}>
                  {isCompleted ? 'Rivedi' : 'Inizia'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default IntroExercises
