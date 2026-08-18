import { STORAGE_KEYS } from '../data/appConfig'

const TEST_STORAGE_KEYS = {
  testerId: 'nexora_tester_id',
  risposte: 'nexora_risposte',
  valutazioni: 'nexora_valutazioni',
}

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

function normalizeExerciseKey(value) {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return value

  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^0[a-c]$/i.test(trimmed)) return trimmed.toUpperCase()

  const parsed = Number.parseInt(trimmed, 10)
  return Number.isNaN(parsed) ? trimmed : parsed
}

function toRispostaSheetPayload(risposta) {
  return {
    tester_id: risposta.tester_id,
    esercizio_id: normalizeExerciseKey(risposta.esercizio_id),
    risposta_scelta: risposta.risposta_scelta,
    risposta_corretta: Boolean(risposta.risposta_corretta),
    timestamp: risposta.timestamp,
  }
}

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

export function saveTesterRemote({ tester_id, filtro, comportamento_blocco_grafico, timestamp }) {
  if (!isBrowser || !tester_id) return
  postToAppsScript('tester', {
    tester_id,
    filtro: filtro || '',
    comportamento_blocco_grafico: comportamento_blocco_grafico || '',
    timestamp: timestamp || new Date().toISOString(),
  })
}

export function upsertRispostaRemote(risposta) {
  if (!isBrowser || !risposta?.tester_id) return
  postToAppsScript('risposta', toRispostaSheetPayload(risposta))
}

export function updateRispostaDifficultyRemote({ tester_id, esercizio_id, difficolta_percepita, cosa_non_chiaro }) {
  if (!isBrowser || !tester_id) return
  postToAppsScript('risposta_difficolta', {
    tester_id,
    esercizio_id: normalizeExerciseKey(esercizio_id),
    difficolta_percepita,
    cosa_non_chiaro: cosa_non_chiaro || '',
  })
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

export function saveRisposta({ esercizio_id, risposta_scelta, risposta_corretta }) {
  const testerId = getTesterId()
  const normalizedExerciseKey = normalizeExerciseKey(esercizio_id)
  const timestamp = new Date().toISOString()
  const risposte = getAllRisposte()
  const preservedRisposta = [...risposte]
    .reverse()
    .find(
      (existing) =>
        existing.tester_id === testerId &&
        normalizeExerciseKey(existing.esercizio_id) === normalizedExerciseKey,
    ) || null
  const risposta = {
    ...(preservedRisposta || {}),
    tester_id: testerId,
    esercizio_id: normalizedExerciseKey,
    esercizio: String(normalizedExerciseKey),
    risposta_scelta,
    risposta: risposta_scelta,
    risposta_corretta,
    corretta: Boolean(risposta_corretta),
    timestamp,
    difficolta_percepita: preservedRisposta?.difficolta_percepita ?? null,
    cosa_non_chiaro: preservedRisposta?.cosa_non_chiaro || '',
  }

  const nextRisposte = risposte.filter(
    (existing) =>
      !(
        existing.tester_id === testerId &&
        normalizeExerciseKey(existing.esercizio_id) === normalizedExerciseKey
      ),
  )
  nextRisposte.push(risposta)
  writeJsonArray(TEST_STORAGE_KEYS.risposte, nextRisposte)
  upsertRispostaRemote(risposta)

  // eslint-disable-next-line no-console
  console.log('RISPOSTA SALVATA', risposta)
}

export function updateRispostaWithDifficulty({ testerId, esercizio_id, difficolta_percepita, cosa_non_chiaro }) {
  if (!isBrowser) return
  
  try {
    const risposte = getAllRisposte()
    const normalizedExerciseKey = normalizeExerciseKey(esercizio_id)
    const existingIndex = risposte.findIndex(
      (risposta) => risposta.tester_id === testerId && risposta.esercizio_id === normalizedExerciseKey,
    )
    
    if (existingIndex >= 0) {
      // Update existing response with difficulty rating (preserve completion timestamp)
      const parsedDifficulty = Number.parseInt(String(difficolta_percepita), 10)
      const hasValidDifficulty = !Number.isNaN(parsedDifficulty)
      if (hasValidDifficulty) {
        risposte[existingIndex].difficolta_percepita = parsedDifficulty
      }

      const trimmedCosaNonChiaro =
        typeof cosa_non_chiaro === 'string' ? cosa_non_chiaro.trim() : ''
      if (trimmedCosaNonChiaro) {
        risposte[existingIndex].cosa_non_chiaro = trimmedCosaNonChiaro
      }

      const finalDifficulty = risposte[existingIndex].difficolta_percepita
      const finalCosaNonChiaro = risposte[existingIndex].cosa_non_chiaro || ''
      risposte[existingIndex].esercizio = String(risposte[existingIndex].esercizio_id)
      risposte[existingIndex].risposta = risposte[existingIndex].risposta_scelta
      risposte[existingIndex].corretta = Boolean(risposte[existingIndex].risposta_corretta)
      
      writeJsonArray(TEST_STORAGE_KEYS.risposte, risposte)
      updateRispostaDifficultyRemote({
        tester_id: testerId,
        esercizio_id: normalizedExerciseKey,
        difficolta_percepita: finalDifficulty,
        cosa_non_chiaro: finalCosaNonChiaro,
      })
      const titoloEsercizio = `Giorno ${risposte[existingIndex].giorno ?? '-'} - Domanda ${esercizio_id}`
      const testoCosaNonEChiaro = finalCosaNonChiaro
      console.log('=== Feedback esercizio ===')
      console.log(`Esercizio: ${titoloEsercizio}`)
      console.log(`Difficoltà percepita: ${finalDifficulty}`)
      console.log('Cosa non è chiaro:')
      console.log(`"${testoCosaNonEChiaro}"`)
      console.log('==========================')
      console.log('RISPOSTA AGGIORNATA CON DIFFICOLTA', risposte[existingIndex])
    } else {
      console.warn('Nessuna risposta trovata per l\'esercizio', esercizio_id)
    }
  } catch (error) {
    console.warn('Impossibile aggiornare la risposta con la difficoltà:', error)
  }
}

export function saveValutazione({ valutazione, feedback_testo }) {
  const testerId = getTesterId()
  const parsedValutazione = Number.parseInt(valutazione, 10)
  const valutazionePayload = {
    tester_id: testerId,
    valutazione: Number.isNaN(parsedValutazione) ? 0 : parsedValutazione,
    feedback_testo: feedback_testo ?? '',
    timestamp: new Date().toISOString(),
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

export function saveDifficultyRating({ testerId, giorno, esercizio_id, difficolta_percepita, cosa_non_chiaro }) {
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
      cosa_non_chiaro: (cosa_non_chiaro ?? '').trim(),
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
