import test from 'node:test'
import assert from 'node:assert/strict'
import { getDayMeta } from './dayLogic.js'

test('sblocca il giorno successivo solo dopo il giorno calendario successivo quando il giorno precedente è completato', () => {
  const risposteByExercise = new Map([
    [1, { esercizio_id: 1, risposta_scelta: 'A', risposta_corretta: true, timestamp: '2026-07-09T21:30:00.000Z' }],
    [2, { esercizio_id: 2, risposta_scelta: 'B', risposta_corretta: false, timestamp: '2026-07-09T21:35:00.000Z' }],
    [3, { esercizio_id: 3, risposta_scelta: 'C', risposta_corretta: false, timestamp: '2026-07-09T21:40:00.000Z' }],
  ])

  const day1Meta = getDayMeta(1, risposteByExercise, new Date(2026, 6, 9, 22, 0))
  assert.equal(day1Meta.isCompleted, true)
  assert.equal(day1Meta.correctCount, 1)

  const day2Meta = getDayMeta(2, risposteByExercise, new Date(2026, 6, 10, 0, 0))
  assert.equal(day2Meta.isUnlocked, true)
})

test('non sblocca il giorno successivo nello stesso giorno calendario', () => {
  const risposteByExercise = new Map([
    [1, { esercizio_id: 1, risposta_scelta: 'A', risposta_corretta: true, timestamp: '2026-07-09T21:30:00.000Z' }],
    [2, { esercizio_id: 2, risposta_scelta: 'B', risposta_corretta: false, timestamp: '2026-07-09T21:35:00.000Z' }],
    [3, { esercizio_id: 3, risposta_scelta: 'C', risposta_corretta: false, timestamp: '2026-07-09T21:40:00.000Z' }],
  ])

  const day2Meta = getDayMeta(2, risposteByExercise, new Date(2026, 6, 9, 23, 0))
  assert.equal(day2Meta.isUnlocked, false)
})
