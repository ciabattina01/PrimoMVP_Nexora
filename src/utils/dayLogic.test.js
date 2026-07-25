import test, { beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  getDayMeta,
  getDayStartedAtStorageKey,
  markDayStarted,
  readDayStartedAt,
} from './dayLogic.js'

class LocalStorageMock {
  constructor() {
    this.store = new Map()
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null
  }

  setItem(key, value) {
    this.store.set(key, String(value))
  }

  removeItem(key) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}

beforeEach(() => {
  globalThis.window = {
    localStorage: new LocalStorageMock(),
  }
})

afterEach(() => {
  delete globalThis.window
})

function setDayStartedAt(day, date) {
  window.localStorage.setItem(getDayStartedAtStorageKey(day), date.toISOString())
}

function buildResponses(exerciseNumbers) {
  return new Map(
    exerciseNumbers.map((exerciseNumber) => [
      exerciseNumber,
      {
        esercizio_id: exerciseNumber,
        risposta_scelta: 'A',
        risposta_corretta: true,
        timestamp: new Date(2026, 6, 9, 12, exerciseNumber).toISOString(),
      },
    ]),
  )
}

test('sblocca Giorno 2 quando Giorno 1 e completato ed e iniziato il giorno calendario successivo', () => {
  setDayStartedAt(1, new Date(2026, 6, 9, 10, 0))
  const risposteByExercise = buildResponses([1, 2, 3])

  const day2Meta = getDayMeta(2, risposteByExercise, new Date(2026, 6, 10, 0, 0))

  assert.equal(day2Meta.isUnlocked, true)
  assert.equal(day2Meta.isBlockedByPreviousDay, false)
  assert.equal(day2Meta.isBlockedByDate, false)
})

test('sblocca Giorno 3 quando Giorno 2 e completato ed e iniziato il giorno calendario successivo', () => {
  setDayStartedAt(2, new Date(2026, 6, 10, 9, 0))
  const risposteByExercise = buildResponses([4, 5, 6])

  const day3Meta = getDayMeta(3, risposteByExercise, new Date(2026, 6, 11, 0, 0))

  assert.equal(day3Meta.isUnlocked, true)
  assert.equal(day3Meta.isBlockedByPreviousDay, false)
  assert.equal(day3Meta.isBlockedByDate, false)
})

test('considera raggiunto il vincolo temporale esattamente dalla mezzanotte locale successiva', () => {
  setDayStartedAt(1, new Date(2026, 6, 9, 23, 30))
  const risposteByExercise = buildResponses([1, 2, 3])

  const beforeMidnight = getDayMeta(2, risposteByExercise, new Date(2026, 6, 9, 23, 59))
  const atMidnight = getDayMeta(2, risposteByExercise, new Date(2026, 6, 10, 0, 0))

  assert.equal(beforeMidnight.isUnlocked, false)
  assert.equal(beforeMidnight.isBlockedByDate, true)
  assert.equal(atMidnight.isUnlocked, true)
  assert.equal(atMidnight.isBlockedByDate, false)
})

test('mantiene bloccato il giorno successivo se la data e raggiunta ma il giorno precedente e incompleto', () => {
  setDayStartedAt(1, new Date(2026, 6, 9, 10, 0))
  const risposteByExercise = buildResponses([1, 2])

  const day2Meta = getDayMeta(2, risposteByExercise, new Date(2026, 6, 10, 9, 0))

  assert.equal(day2Meta.isUnlocked, false)
  assert.equal(day2Meta.isBlockedByPreviousDay, true)
  assert.equal(day2Meta.isBlockedByDate, false)
})

test('mantiene bloccato il giorno successivo se il giorno precedente e completo ma la data non e raggiunta', () => {
  setDayStartedAt(1, new Date(2026, 6, 9, 10, 0))
  const risposteByExercise = buildResponses([1, 2, 3])

  const day2Meta = getDayMeta(2, risposteByExercise, new Date(2026, 6, 9, 22, 0))

  assert.equal(day2Meta.isUnlocked, false)
  assert.equal(day2Meta.isBlockedByPreviousDay, false)
  assert.equal(day2Meta.isBlockedByDate, true)
})

test('nexora_debug_day bypassa solo il vincolo temporale senza creare o modificare le date reali', () => {
  window.localStorage.setItem('nexora_debug_day', '3')
  const risposteByExercise = buildResponses([4, 5, 6])

  const day3Meta = getDayMeta(3, risposteByExercise, new Date(2026, 6, 9, 10, 0))

  assert.equal(day3Meta.isUnlocked, true)
  assert.equal(day3Meta.isBlockedByPreviousDay, false)
  assert.equal(day3Meta.isBlockedByDate, false)
  assert.equal(readDayStartedAt(1), null)
  assert.equal(readDayStartedAt(2), null)
  assert.equal(readDayStartedAt(3), null)
})

test('nexora_debug_day non sblocca Giorno 3 se Giorno 2 e incompleto', () => {
  window.localStorage.setItem('nexora_debug_day', '3')
  const risposteByExercise = buildResponses([4, 5])

  const day3Meta = getDayMeta(3, risposteByExercise, new Date(2026, 6, 9, 10, 0))

  assert.equal(day3Meta.isUnlocked, false)
  assert.equal(day3Meta.isBlockedByPreviousDay, true)
  assert.equal(day3Meta.isBlockedByDate, false)
})

test('markDayStarted persiste startedAt una sola volta senza sovrascriverlo', () => {
  const firstStart = new Date(2026, 6, 9, 10, 0)
  const secondStart = new Date(2026, 6, 10, 10, 0)

  const firstSaved = markDayStarted(1, firstStart)
  const secondSaved = markDayStarted(1, secondStart)
  const stored = window.localStorage.getItem(getDayStartedAtStorageKey(1))

  assert.equal(firstSaved.toISOString(), firstStart.toISOString())
  assert.equal(secondSaved.toISOString(), firstStart.toISOString())
  assert.equal(stored, firstStart.toISOString())
})
