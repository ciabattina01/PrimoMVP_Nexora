import { Fragment, useEffect, useMemo, useState } from 'react'
import { EXERCISE_DAYS, getExercisesForDay } from '../data/exercises'
import { getProgressContentByExercise } from '../data/progressContent'
import { getRisposte } from '../utils/dataTracking'
import { getDayMeta, getExerciseNumber } from '../utils/dayLogic'
import { useLanguage } from '../i18n/language'
import { getUiCopy } from '../i18n/uiCopy'

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

function renderProgressTextWithBold(text, keyPrefix = 'progress-text') {
  const source = String(text ?? '')
  const parts = source.split(/(\*\*[\s\S]+?\*\*)/g)

  return parts.map((part, index) => {
    const match = part.match(/^\*\*([\s\S]+)\*\*$/)
    if (match) {
      return <strong key={`${keyPrefix}-bold-${index}`}>{match[1]}</strong>
    }

    return <Fragment key={`${keyPrefix}-plain-${index}`}>{part}</Fragment>
  })
}

function renderProgressRichText(text, keyPrefix = 'progress-rich') {
  const blocks = buildRichTextBlocks(text)

  return blocks.map((block, index) => {
    if (block.type === 'ul') {
      return (
        <ul key={`${keyPrefix}-ul-${index}`} className="progress-learning-list">
          {block.items.map((item, itemIndex) => (
            <li key={`${keyPrefix}-li-${index}-${itemIndex}`}>
              {renderProgressTextWithBold(item, `${keyPrefix}-li-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <p key={`${keyPrefix}-p-${index}`}>
        {renderProgressTextWithBold(block.text, `${keyPrefix}-p-${index}`)}
      </p>
    )
  })
}

function Progress({ initialOpenDay = null }) {
  const { language } = useLanguage()
  const ui = getUiCopy(language)
  const copy = ui.progress

  const [hasInteractedWithDays, setHasInteractedWithDays] = useState(() => initialOpenDay != null)
  const [openDays, setOpenDays] = useState(() => new Set([initialOpenDay || 1]))
  const risposte = useMemo(() => getRisposte(), [])

  const risposteByExercise = useMemo(() => {
    const map = new Map()
    risposte.forEach((risposta) => {
      if (risposta?.esercizio_id != null) {
        map.set(risposta.esercizio_id, risposta)
      }
    })
    return map
  }, [risposte])

  const dayStatuses = useMemo(
    () => EXERCISE_DAYS.map((day) => getDayMeta(day, risposteByExercise)),
    [risposteByExercise],
  )
  const day1Status = dayStatuses.find((status) => status.day === 1)
  const day2Status = dayStatuses.find((status) => status.day === 2)

  useEffect(() => {
    if (hasInteractedWithDays) {
      return
    }

    const defaultOpenDays = new Set([1])
    if (day1Status?.isCompleted && day2Status?.isUnlocked) {
      defaultOpenDays.add(2)
    }
    setOpenDays(defaultOpenDays)
  }, [day1Status, day2Status, hasInteractedWithDays])

  const currentDay = useMemo(() => {
    const unlockedDays = EXERCISE_DAYS.filter((day) => {
      if (day === 1) return true
      const status = dayStatuses.find((item) => item.day === day)
      return Boolean(status?.isUnlocked)
    })
    return unlockedDays.length ? unlockedDays[unlockedDays.length - 1] : 1
  }, [dayStatuses])

  return (
    <section className="progress">
      <header className="progress-head">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1 className="page-title">{copy.title}</h1>
        <p className="muted">{copy.subtitle}</p>
      </header>

      <div className="progress-days-list">
        {EXERCISE_DAYS.map((day) => {
          const status = dayStatuses.find((item) => item.day === day)
          const dayExercises = getExercisesForDay(day, language)
          const isOpen = openDays.has(day)
          const isCompleted = status?.isCompleted
          const isLocked = day > 1 && !status?.isUnlocked
          const isNotStarted = !isLocked && status?.completedCount === 0
          const summaryLabel = `${status?.correctCount ?? 0}/${dayExercises.length} ${language === 'en' ? 'correct' : 'corretti'}`
          const summarySubtitle = isCompleted ? copy.dayCompleted : copy.reviewReasoning
          const lockCopy = status?.isBlockedByDate
            ? copy.lockByDate
            : copy.lockByPrevious

          const toggleDay = () => {
            const newOpenDays = new Set(openDays)
            if (newOpenDays.has(day)) {
              newOpenDays.delete(day)
            } else {
              newOpenDays.add(day)
            }
            setOpenDays(newOpenDays)
            setHasInteractedWithDays(true)
          }

          return (
            <section key={day} className={`progress-day-section ${isOpen ? 'is-open' : 'is-collapsed'}`}>
              <header className="progress-day-head">
                <h2>{copy.day} {day}</h2>
                {isCompleted && !isLocked && (
                  <button
                    type="button"
                    className={isOpen ? "btn btn-outline btn-sm" : "btn btn-review btn-sm"}
                    onClick={toggleDay}
                  >
                    {isOpen ? copy.close : copy.reviewAll}
                  </button>
                )}
              </header>

              {isOpen ? (
                <div className="progress-exercise-grid">
                  {dayExercises.map((exercise) => {
                    const exerciseNumber = getExerciseNumber(exercise)
                    const risposta = risposteByExercise.get(exerciseNumber)
                    const hasAnswered = Boolean(risposta?.risposta_scelta)
                    if (!hasAnswered) {
                      return null
                    }

                    const isCorrect = Boolean(risposta?.risposta_corretta)
                    const statusLabel = isCorrect ? copy.statusDone : copy.statusReview
                    const statusClass = isCorrect ? 'is-complete' : 'is-review'
                    const displayTitle = `Step ${exerciseNumber}`
                    const consolidationContent = getProgressContentByExercise(exerciseNumber, language)

                    return (
                      <article key={exercise.id} className="progress-exercise">
                        <div className="progress-exercise-head">
                          <div>
                            <h3>{displayTitle}</h3>
                            <span className="progress-block">{exercise.block}</span>
                          </div>
                          <span className={`progress-status ${statusClass}`}>{statusLabel}</span>
                        </div>

                        {hasAnswered && (
                          <div className="progress-learning progress-consolidation">
                            <div className="progress-consolidation-block">
                              <h4>{copy.takeAwayTitle}</h4>
                              {renderProgressRichText(consolidationContent.takeAway, `${exercise.id}-takeaway`)}
                            </div>

                            <div className="progress-consolidation-block">
                              <h4>{copy.reflectionTitle}</h4>
                              <ul className="progress-learning-list">
                                {consolidationContent.reflectionQuestions.map((question, questionIndex) => (
                                  <li key={`${exercise.id}-reflection-${questionIndex}`}>
                                    {renderProgressTextWithBold(question, `${exercise.id}-reflection-${questionIndex}`)}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="progress-consolidation-block">
                              <h4>{copy.practicalRuleTitle}</h4>
                              {renderProgressRichText(consolidationContent.practicalRule, `${exercise.id}-rule`)}
                            </div>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="exercise-day-summary">
                  {isLocked ? (
                    <div className="exercise-day-summary-card">
                      <span className="exercise-day-summary-score">{copy.locked}</span>
                      <span className="exercise-day-summary-copy">{lockCopy}</span>
                    </div>
                  ) : isNotStarted ? (
                    <div className="exercise-day-summary-card">
                      <span className="exercise-day-summary-score">{copy.unlocked}</span>
                      <span className="exercise-day-summary-copy">{copy.availableToStart}</span>
                    </div>
                  ) : (
                    <div className="exercise-day-summary-card">
                      <span className="exercise-day-summary-score">{summaryLabel}</span>
                      <span className="exercise-day-summary-copy">{summarySubtitle}</span>
                    </div>
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

export default Progress
