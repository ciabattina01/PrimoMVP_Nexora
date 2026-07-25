import { getExercisesForDay } from '../data/exercises.js'

const DAY_STARTED_AT_KEY_PREFIX = 'nexora_day_started_at_'

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function parseDateValue(value) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function getDayStartedAtStorageKey(day) {
  const parsedDay = Number.parseInt(day, 10)
  return `${DAY_STARTED_AT_KEY_PREFIX}${Number.isNaN(parsedDay) ? 0 : parsedDay}`
}

export function readDayStartedAt(day) {
  if (!hasLocalStorage()) return null
  const raw = window.localStorage.getItem(getDayStartedAtStorageKey(day))
  return parseDateValue(raw)
}

export function markDayStarted(day, at = new Date()) {
  if (!hasLocalStorage()) return null

  const existingDate = readDayStartedAt(day)
  if (existingDate) {
    return existingDate
  }

  const normalizedDate = parseDateValue(at) || new Date()
  window.localStorage.setItem(getDayStartedAtStorageKey(day), normalizedDate.toISOString())
  return normalizedDate
}

function getDebugDayOverride() {
  if (!hasLocalStorage()) return null
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

function hasReachedNextCalendarDay(startedAt, now) {
  const startedDate = toLocalDateOnly(startedAt)
  const nowDate = toLocalDateOnly(now)

  if (!startedDate || !nowDate) {
    return false
  }

  return nowDate.getTime() > startedDate.getTime()
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

  const startedAt = readDayStartedAt(day)
  const completedAt = latestTimestamp ? new Date(latestTimestamp) : null
  const isCompleted = exercises.length > 0 && completedCount === exercises.length

  const previousDay = day > 1 ? day - 1 : null
  const previousDayMeta = previousDay ? getDayMeta(previousDay, risposteByExercise, now) : null
  const hasCompletedPreviousDay = Boolean(previousDayMeta?.isCompleted)
  const debugDay = getDebugDayOverride()
  const hasReachedDebugDay = Boolean(debugDay && debugDay >= day)
  const hasReachedUnlockDate = Boolean(
    hasReachedDebugDay ||
      (previousDayMeta?.startedAt && hasReachedNextCalendarDay(previousDayMeta.startedAt, now)),
  )
  const isUnlocked = Boolean(
    day === 1 ||
      (day > 1 && hasCompletedPreviousDay && hasReachedUnlockDate),
  )
  const isBlockedByPreviousDay = Boolean(day > 1 && !hasCompletedPreviousDay)
  const isBlockedByDate = Boolean(
    day > 1 &&
      hasCompletedPreviousDay &&
      !hasReachedUnlockDate,
  )

  return {
    day,
    exercises,
    completedCount,
    correctCount,
    startedAt,
    isCompleted,
    isUnlocked,
    isBlockedByPreviousDay,
    isBlockedByDate,
    completedAt,
    previousDayMeta,
  }
}
