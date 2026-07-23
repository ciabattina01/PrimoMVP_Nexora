import { getExercisesForDay } from '../data/exercises.js'

const isBrowser = typeof window !== 'undefined'
const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV)

function getDebugDayOverride() {
  if (!isBrowser || !isDev) return null
  const raw = window.localStorage.getItem('nexora_debug_day')
  const parsed = Number.parseInt(raw || '', 10)
  return Number.isNaN(parsed) ? null : parsed
}

export function getExerciseNumber(exercise) {
  const id = String(exercise?.id || '')
  const dayMatch = id.match(/day(\d+)-ex(\d+)/)
  if (dayMatch) {
    const day = Number.parseInt(dayMatch[1], 10)
    const exIndex = Number.parseInt(dayMatch[2], 10)
    if (!Number.isNaN(day) && !Number.isNaN(exIndex)) {
      return (day - 1) * 3 + exIndex
    }
  }

  const idMatch = id.match(/ex(\d+)/)
  if (idMatch) {
    const exIndex = Number.parseInt(idMatch[1], 10)
    const day = Number.parseInt(String(exercise?.day || ''), 10)
    if (!Number.isNaN(exIndex)) {
      if (!Number.isNaN(day)) {
        return (day - 1) * 3 + exIndex
      }
      return exIndex
    }
  }

  // Fallback: extract from title if ID doesn't match pattern
  const parsed = Number.parseInt(String(exercise?.title || '').replace(/\D/g, ''), 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

function toLocalDateOnly(date) {
  const source = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(source.getTime())) {
    return null
  }

  return new Date(source.getFullYear(), source.getMonth(), source.getDate())
}

function isAfterNextCalendarDay(completionAt, now) {
  const completionDate = toLocalDateOnly(completionAt)
  const nowDate = toLocalDateOnly(now)

  if (!completionDate || !nowDate) {
    return false
  }

  return nowDate.getTime() > completionDate.getTime()
}

export function getDayMeta(day, risposteByExercise, now = new Date()) {
  const exercises = getExercisesForDay(day)
  const completedResponses = exercises
    .map((exercise) => {
      const exerciseNumber = getExerciseNumber(exercise)
      return risposteByExercise.get(exerciseNumber) || null
    })
    .filter((risposta) => Boolean(risposta?.risposta_scelta))

  const completedCount = completedResponses.length
  const correctCount = completedResponses.filter((risposta) => Boolean(risposta?.risposta_corretta)).length

  let latestTimestamp = null
  completedResponses.forEach((risposta) => {
    if (!risposta?.timestamp) {
      return
    }

    const timestamp = new Date(risposta.timestamp)
    if (Number.isNaN(timestamp.getTime())) {
      return
    }

    if (!latestTimestamp || timestamp.getTime() > latestTimestamp) {
      latestTimestamp = timestamp.getTime()
    }
  })

  const completedAt = latestTimestamp ? new Date(latestTimestamp) : null
  const isCompleted = exercises.length > 0 && completedCount === exercises.length

  const previousDay = day > 1 ? day - 1 : null
  const previousDayMeta = previousDay ? getDayMeta(previousDay, risposteByExercise, now) : null
  const debugDay = getDebugDayOverride()
  const isUnlocked = Boolean(
    day > 1 &&
      previousDayMeta?.isCompleted &&
      previousDayMeta?.completedAt &&
      (debugDay ? debugDay >= day : isAfterNextCalendarDay(previousDayMeta.completedAt, now)),
  )

  return {
    day,
    exercises,
    completedCount,
    correctCount,
    isCompleted,
    isUnlocked,
    completedAt,
    previousDayMeta,
  }
}
