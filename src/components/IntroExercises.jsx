import { Fragment, useMemo, useState } from 'react'
import { getIntroStepById, getIntroSteps } from '../data/introExercises'
import {
  getTesterId,
  saveDifficultyRating,
  saveRisposta,
  updateRispostaWithDifficulty,
} from '../utils/dataTracking'
import { useLanguage } from '../i18n/language'
import { getUiCopy } from '../i18n/uiCopy'
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
  const { language } = useLanguage()
  const ui = getUiCopy(language)
  const copy = ui.intro
  const introSteps = useMemo(() => getIntroSteps(language), [language])

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
    () => (selectedStepId ? getIntroStepById(selectedStepId, language) : null),
    [selectedStepId, language],
  )
  const isStepA = selectedStep?.id === INTRO_STEP_A_ID
  const isStepB = selectedStep?.id === INTRO_STEP_B_ID
  const isStepC = selectedStep?.id === INTRO_STEP_C_ID

  const handleOpenStep = (stepId) => {
    const step = getIntroStepById(stepId, language)
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

    const isLastIntroStep = selectedStep.order === introSteps.length
    setDifficultyRating(value)
    if (!isLastIntroStep) {
      persistIntroDifficultyFeedback(value)
    }
  }

  const handleSaveAndCloseIntro = async () => {
    if (!selectedStep || selectedStep.order !== introSteps.length) return
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

    const currentIndex = introSteps.findIndex((step) => step.id === selectedStep.id)
    if (currentIndex < 0) return

    const nextStep = introSteps[currentIndex + 1]
    if (!nextStep) return

    handleOpenStep(nextStep.id)
    scrollToTopOnStepChange()
  }

  if (showFinalScreen) {
    return (
      <section className="exercises intro-exercises">
        <div className="exercise-day-completion intro-completion-card">
          <h2>{copy.completionTitle}</h2>
          <p></p>
          <p>{copy.completionSubtitle}</p>
          <div className="exercise-day-completion__actions">
            <button type="button" className="btn" onClick={() => setShowFinalScreen(false)}>
              {copy.returnProgram}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (selectedStep) {
    const selectedIndex = introSteps.findIndex((step) => step.id === selectedStep.id)
    const nextStep = selectedIndex >= 0 ? introSteps[selectedIndex + 1] : null
    const isGuidedIntroStep = INTRO_GUIDED_STEP_IDS.has(selectedStep.id)
    const isLastIntroStep = selectedStep.order === introSteps.length
    const hasAnswered = isAnswerConfirmed
    const canContinue = hasAnswered && difficultyRating != null
    const canSaveAndCloseIntro = isLastIntroStep && canContinue && !isDifficultyFeedbackLocked

    return (
      <section className="exercises intro-exercises">
        {!canSaveAndCloseIntro && (
          <button type="button" className="btn btn-outline back-to-program" onClick={handleBackToIntroProgram}>
            {copy.backToProgram}
          </button>
        )}

        <div className="exercise-detail" aria-live="polite">
          <div className="exercise-detail-head">
            <span className="exercise-detail-day">{copy.listEyebrow}</span>
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
                    alt={language === 'en' ? 'Initial chart for Step 0A' : 'Grafico iniziale dello Step 0A'}
                    loading="lazy"
                  />
                ) : isStepB ? (
                  <img
                    src={introStep0BInitialImage}
                    alt={language === 'en' ? 'Initial chart for Step 0B' : 'Grafico iniziale dello Step 0B'}
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
                    <h5 className="intro-timeframe-card-title">{copy.timeframeSupTitle}</h5>
                    <img
                      src={introStep0BTimeframeSupImage}
                      alt={language === 'en' ? 'Higher timeframe in Step 0C' : 'Timeframe superiore nello Step 0C'}
                      className="intro-timeframe-image-large"
                      loading="lazy"
                    />
                  </div>
                  <p className="intro-feedback-text">{renderIntroTextWithBold(selectedStep.question)}</p>
                  <div className="intro-zone-layout">
                    <div className="intro-zone-copy" />
                    <div className="intro-zone-visual">
                      <img
                        src={introStep0BZoneImage}
                        alt={language === 'en'
                          ? 'Chart example for long-zone construction'
                          : 'Esempio grafico della costruzione della zona long'}
                        className="intro-zone-image"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="intro-structure-focus">
                    <img
                      src={introStep0BConfermaMassimoImage}
                      alt={language === 'en'
                        ? 'Zoom confirmation of structural high'
                        : 'Zoom di conferma del massimo strutturale'}
                      className="intro-structure-focus-image"
                      loading="lazy"
                    />
                  </div>
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
                {copy.continueButton}
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
                        alt={language === 'en' ? 'Explained chart for Step 0A' : 'Grafico spiegato dello Step 0A'}
                        loading="lazy"
                      />
                    ) : isStepB ? (
                      <img
                        src={introStep0BSecondImage}
                        alt={language === 'en' ? 'Explained chart for Step 0B' : 'Grafico spiegato dello Step 0B'}
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                </div>
              )}

              <div className="exercise-feedback is-correct">
                <h3></h3>
                {isStepC ? (
                  <>
                    <div className="intro-timeframe-standalone intro-timeframe-standalone-inferior">
                      <h5 className="intro-timeframe-card-title">{copy.timeframeInfTitle}</h5>
                      <img
                        src={introStep0BTimeframeInfImage}
                        alt={language === 'en' ? 'Lower timeframe in Step 0C' : 'Timeframe inferiore nello Step 0C'}
                        className="intro-timeframe-image-large"
                        loading="lazy"
                      />
                    </div>

                    <div className="intro-practical-explanation">
                      <p className="intro-feedback-text">{renderIntroTextWithBold(selectedStep.feedback)}</p>

                      <div className="intro-structure-focus">
                        <img
                          src={introStep0BTriggerImage}
                          alt={language === 'en' ? 'Visual example of operational trigger' : 'Esempio visivo del trigger operativo'}
                          className="intro-trigger-image"
                          loading="lazy"
                        />
                      </div>

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
                ) : isStepB ? (
                  <>
                    <p className="intro-feedback-text">{renderIntroTextWithBold(selectedStep.feedback)}</p>
                    <div className="intro-myfxbook-layout">
                      <div className="intro-myfxbook-copy" />
                      <div className="intro-myfxbook-visual">
                        <img
                          src={introStep0BMyfxbookImage}
                          alt={language === 'en'
                            ? 'Myfxbook calculator example for position sizing'
                            : 'Esempio del calcolatore Myfxbook per il dimensionamento della posizione'}
                          className="intro-myfxbook-image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="intro-leverage-layout">
                      <div className="intro-leverage-copy" />
                      <div className="intro-leverage-visual">
                        <img
                          src={introStep0BLeverageImage}
                          alt={language === 'en'
                            ? 'Visual scheme of leverage, margin, and exposure'
                            : 'Schema esplicativo del rapporto leva, margine ed esposizione'}
                          className="intro-leverage-image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </>
                ) : isStepA ? (
                  <>
                    <p className="intro-feedback-text">{renderIntroTextWithBold(selectedStep.feedback)}</p>
                    <div className="intro-trend-row">
                      <div className="intro-trend-copy" />
                      <div className="intro-trend-visual">
                        <img
                          src={introStep0ATrendUpImage}
                          alt={language === 'en' ? 'Visual example of bullish trend' : 'Esempio visivo di trend rialzista'}
                          className="intro-trend-image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="intro-trend-row">
                      <div className="intro-trend-copy" />
                      <div className="intro-trend-visual">
                        <img
                          src={introStep0ATrendDownImage}
                          alt={language === 'en' ? 'Visual example of bearish trend' : 'Esempio visivo di trend ribassista'}
                          className="intro-trend-image"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="intro-feedback-text">{renderIntroTextWithBold(selectedStep.feedback)}</p>
                )}
              </div>

              <div className="exercise-difficulty-rating intro-final-box">
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
                        disabled={isDifficultyFeedbackLocked}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <h4>{copy.reflectionTitle}</h4>
                <textarea
                  className="exercise-confirm-modal__textarea"
                  placeholder={copy.reflectionPlaceholder}
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
                  {isSavingAndClosingIntro ? copy.saving : copy.saveAndClose}
                </button>
              ) : (
                <>
                  {nextStep && (
                    <button type="button" className="btn btn-action" onClick={handleGoToNextStep}>
                      {copy.nextStep}
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
    <section className="exercises intro-exercises">
      <header className="exercise-head">
        <span className="eyebrow">{copy.listEyebrow}</span>
        <h1 className="page-title">{copy.listTitle}</h1>
      </header>

      <div className="exercise-goals-grid intro-goals-grid">
        <div className="exercise-progress" aria-live="polite">
          <p className="exercise-goal-title">{copy.goalsTitle}</p>
          {copy.goalsLines.map((line) => (
            <p key={line} className="exercise-goal-line">
              {renderIntroTextWithBold(line)}
            </p>
          ))}
        </div>
      </div>

      <div className="exercise-list">
        {introSteps.map((step) => {
          const isCompleted = completedStepIds.has(step.id)

          return (
            <article key={step.id} className="exercise-card">
              <div className="exercise-card-content">
                <header className="exercise-card-head">
                  <div className="exercise-chip"></div>
                  <span className="exercise-status">{isCompleted ? copy.statusDone : copy.statusTodo}</span>
                </header>
                <div className="exercise-body">
                  <h2>{step.title}</h2>
                  <div className="exercise-meta" aria-label={copy.exerciseMetaAriaLabel}>
                    <span className="exercise-meta-item">{copy.listSummaryLabel}</span>
                    <span className="exercise-meta-item">{copy.listFocusLabel}</span>
                    <span className="exercise-meta-item">{copy.listDepthLabel}</span>
                  </div>
                </div>
              </div>
              <div className="exercise-card-actions">
                <button type="button" className="btn btn-action" onClick={() => handleOpenStep(step.id)}>
                  {isCompleted ? copy.review : copy.start}
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
