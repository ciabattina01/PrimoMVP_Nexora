import { STORAGE_KEYS } from '../data/appConfig';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function readEvents(key) {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn(`Unable to parse events from storage key "${key}".`, error);
    return [];
  }
}

function writeEvents(key, events) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(events));
  } catch (error) {
    console.warn(`Unable to persist events to storage key "${key}".`, error);
  }
}

function appendEvent(key, event) {
  const events = readEvents(key);
  events.push(event);
  writeEvents(key, events);
}

export function trackEvent(event) {
  const payload = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.log('[trackEvent]', payload);

  appendEvent(STORAGE_KEYS.genericEvents, payload);
}

export function trackAnswerEvent({ tester_id, esercizio_id, risposta_scelta, risposta_corretta }) {
  const payload = {
    type: 'answer',
    tester_id: tester_id || null,
    esercizio_id,
    risposta_scelta,
    risposta_corretta: Boolean(risposta_corretta),
    timestamp: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.log('[trackAnswerEvent]', payload);

  appendEvent(STORAGE_KEYS.answers, payload);
}

export function trackEvaluationEvent({ tester_id, valutazione, feedback_testo, esercizio_completato }) {
  const payload = {
    type: 'evaluation',
    tester_id: tester_id || null,
    valutazione: Number.parseInt(valutazione, 10),
    feedback_testo: feedback_testo || null,
    esercizio_completato: Boolean(esercizio_completato),
    timestamp: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.log('[trackEvaluationEvent]', payload);

  appendEvent(STORAGE_KEYS.evaluations, payload);
}

export { STORAGE_KEYS as TRACKING_STORAGE_KEYS };
