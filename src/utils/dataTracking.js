import { STORAGE_KEYS } from '../data/appConfig'

const TEST_STORAGE_KEYS = {
  testerId: 'nexora_tester_id',
  risposte: 'nexora_risposte',
  valutazioni: 'nexora_valutazioni',
}

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

function postToAppsScript(action, payload) {
  if (!isBrowser) return
  if (!APPS_SCRIPT_URL) {
    console.warn('Google Apps Script: URL mancante (VITE_APPS_SCRIPT_URL)')
    return
  }

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload }),
  })
    .then(async (response) => {
      const rawText = await response.text().catch(() => '')
      let data = null
      if (rawText) {
        try {
          data = JSON.parse(rawText)
        } catch (error) {
          data = null
        }
      }

      if (!response.ok) {
        console.warn('Google Apps Script: richiesta fallita', response.status, data?.error || rawText || response.statusText)
        return
      }

      if (data?.error) {
        console.warn('Google Apps Script: errore', data.error)
      }
    })
    .catch((error) => {
      console.warn('Google Apps Script: richiesta fallita', error)
    })
}

export function saveTesterRemote({ tester_id }) {
  if (!isBrowser || !tester_id) return
  postToAppsScript('tester', { tester_id })
}

export function upsertRispostaRemote(risposta) {
  if (!isBrowser || !risposta?.tester_id) return
  postToAppsScript('risposta', risposta)
}

export function updateRispostaDifficultyRemote({ tester_id, esercizio_id, difficolta_percepita }) {
  if (!isBrowser || !tester_id) return
  postToAppsScript('risposta_difficolta', { tester_id, esercizio_id, difficolta_percepita })
}

export function upsertValutazioneRemote(valutazionePayload) {
  if (!isBrowser || !valutazionePayload?.tester_id) return
  postToAppsScript('valutazione', valutazionePayload)
}

function readJsonArray(key) {
  if (!isBrowser) return []
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.warn(`Impossibile leggere ${key} da localStorage`, error)
    return []
  }
}

function writeJsonArray(key, value) {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Impossibile salvare ${key} su localStorage`, error)
  }
}

function getAllRisposte() {
  return readJsonArray(TEST_STORAGE_KEYS.risposte)
}

function getAllValutazioni() {
  return readJsonArray(TEST_STORAGE_KEYS.valutazioni)
}

export function getTesterId() {
  if (!isBrowser) return ''
  const storedTesterId = window.localStorage.getItem(TEST_STORAGE_KEYS.testerId)
  if (storedTesterId) return storedTesterId

  try {
    const rawProfile = window.localStorage.getItem(STORAGE_KEYS.profile)
    if (!rawProfile) return ''
    const parsed = JSON.parse(rawProfile)
    const name = (parsed?.name || '').trim()
    if (name) {
      window.localStorage.setItem(TEST_STORAGE_KEYS.testerId, name)
    }
    return name
  } catch (error) {
    console.warn('Impossibile leggere tester_id dal profilo', error)
    return ''
  }
}

export function getRisposte() {
  const risposte = getAllRisposte()
  const testerId = getTesterId()
  if (!testerId) return risposte
  return risposte.filter((risposta) => risposta?.tester_id === testerId)
}

export function getValutazioni() {
  const valutazioni = getAllValutazioni()
  const testerId = getTesterId()
  if (!testerId) return valutazioni
  return valutazioni.filter((valutazione) => valutazione?.tester_id === testerId)
}

export function saveRisposta({ esercizio_id, risposta_scelta, risposta_corretta, motivazione_utente }) {
  const testerId = getTesterId()
  const parsedExerciseId = Number.parseInt(esercizio_id, 10)
  const risposta = {
    tester_id: testerId,
    esercizio_id: Number.isNaN(parsedExerciseId) ? 0 : parsedExerciseId,
    risposta_scelta,
    risposta_corretta,
    motivazione_utente: motivazione_utente || '',
    timestamp: new Date().toISOString(),
  }

  const risposte = getAllRisposte()
  risposte.push(risposta)
  writeJsonArray(TEST_STORAGE_KEYS.risposte, risposte)
  upsertRispostaRemote(risposta)

  // eslint-disable-next-line no-console
  console.log('RISPOSTA SALVATA', risposta)
}

export function updateRispostaWithDifficulty({ testerId, esercizio_id, difficolta_percepita }) {
  if (!isBrowser) return
  
  try {
    const risposte = getAllRisposte()
    const existingIndex = risposte.findIndex(
      risposta => risposta.tester_id === testerId && risposta.esercizio_id === esercizio_id
    )
    
    if (existingIndex >= 0) {
      // Update existing response with difficulty rating (preserve completion timestamp)
      risposte[existingIndex].difficolta_percepita = difficolta_percepita
      
      writeJsonArray(TEST_STORAGE_KEYS.risposte, risposte)
      updateRispostaDifficultyRemote({
        tester_id: testerId,
        esercizio_id,
        difficolta_percepita,
      })
      console.log('RISPOSTA AGGIORNATA CON DIFFICOLTA', risposte[existingIndex])
    } else {
      console.warn('Nessuna risposta trovata per l\'esercizio', esercizio_id)
    }
  } catch (error) {
    console.warn('Impossibile aggiornare la risposta con la difficoltà:', error)
  }
}

export function saveValutazione({ giorno, valutazione, feedback_testo, esercizio_completato }) {
  const testerId = getTesterId()
  const parsedDay = Number.parseInt(giorno, 10)
  const parsedValutazione = Number.parseInt(valutazione, 10)
  const valutazionePayload = {
    tester_id: testerId,
    giorno: Number.isNaN(parsedDay) ? 0 : parsedDay,
    valutazione: Number.isNaN(parsedValutazione) ? 0 : parsedValutazione,
    feedback_testo: feedback_testo ?? '',
    timestamp: new Date().toISOString(),
    esercizio_completato: Boolean(esercizio_completato),
  }

  const valutazioni = getAllValutazioni()
  valutazioni.push(valutazionePayload)
  writeJsonArray(TEST_STORAGE_KEYS.valutazioni, valutazioni)
  upsertValutazioneRemote(valutazionePayload)

  // eslint-disable-next-line no-console
  console.log('VALUTAZIONE SALVATA', valutazionePayload)
}

// Difficulty rating functions
export function getDifficultyRatings() {
  if (!isBrowser) return []
  try {
    const stored = window.localStorage.getItem('nexora_difficolta_esercizi')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.warn('Impossibile leggere le valutazioni di difficoltà:', error)
    return []
  }
}

export function saveDifficultyRating({ testerId, giorno, esercizio_id, difficolta_percepita }) {
  if (!isBrowser) return
  
  try {
    const existingRatings = getDifficultyRatings()
    const timestamp = new Date().toISOString()
    
    // Find existing rating for this tester and exercise
    const existingIndex = existingRatings.findIndex(
      rating => rating.tester_id === testerId && rating.esercizio_id === esercizio_id
    )
    
    const newRating = {
      tester_id: testerId,
      giorno,
      esercizio_id,
      difficolta_percepita,
      timestamp
    }
    
    if (existingIndex >= 0) {
      // Update existing rating
      existingRatings[existingIndex] = newRating
    } else {
      // Add new rating
      existingRatings.push(newRating)
    }
    
    window.localStorage.setItem('nexora_difficolta_esercizi', JSON.stringify(existingRatings))
  } catch (error) {
    console.warn('Impossibile salvare la valutazione di difficoltà:', error)
  }
}

export function getDifficultyRatingForExercise(testerId, esercizio_id) {
  if (!isBrowser) return null
  try {
    const ratings = getDifficultyRatings()
    return ratings.find(
      rating => rating.tester_id === testerId && rating.esercizio_id === esercizio_id
    ) || null
  } catch (error) {
    console.warn('Impossibile leggere la valutazione di difficoltà per l\'esercizio:', error)
    return null
  }
}

export function clearLocalTestData() {
  if (!isBrowser) return

  const localKeysToRemove = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (key && key.startsWith('nexora_')) {
      localKeysToRemove.push(key)
    }
  }
  localKeysToRemove.forEach((key) => window.localStorage.removeItem(key))

  if (typeof window.sessionStorage !== 'undefined') {
    const sessionKeysToRemove = []
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index)
      if (key && key.startsWith('nexora_')) {
        sessionKeysToRemove.push(key)
      }
    }
    sessionKeysToRemove.forEach((key) => window.sessionStorage.removeItem(key))
  }
}
