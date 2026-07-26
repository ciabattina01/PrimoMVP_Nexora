import { useEffect, useMemo, useState } from 'react'
import { EXERCISE_DAYS, getExercisesForDay } from '../data/exercises'
import { getRisposte } from '../utils/dataTracking'
import { getDayMeta, getExerciseNumber } from '../utils/dayLogic'

const LEARNING_NOTES = {
  1: {
    title: 'Esercizio 1 — Trend',
    subtitle: '📉 Come riconoscere un Trend',
    bullets: [
      'Osserva come si susseguono massimi e minimi in sequenza.',
      '❗Osserva bene: un singolo rialzo o ribasso non è una conferma d un cambio di trend, serve vedere se la nuova struttura  continua per più movimenti consecutivi.',
      'Quando pensi che il trend stia cambiando, prima cerca di capire se il prezzo sta davvero costruendo  una nuova sequenza di massimi e minimi sempre più alti o bassi.',
    ],
  },
  2: {
    title: 'Esercizio 2 — Zone di reazione',
    subtitle: '🔎 Come riconoscere una Zona di reazione',
    bullets: [
      'Osserva sempre cosa succede dopo che il prezzo lascia una zona.',
      'Un movimento deciso che continua il trend indica che in quell’area i compratori (o i venditori) hanno mostrato forza.',
      'È la qualità della reazione successiva a rendere una zona più significativa di un’altra.',
    ],
  },
  3: {
    title: 'Esercizio 3 — Trova il punto d’ingresso',
    subtitle: '🔎 Come riconoscere una ripresa rialzista per trovare il punto d’ingresso',
    bullets: [
      'Concentrati sulla zona in cui il prezzo torna dopo essersi allontanato (ritracciamento).',
      'Scendi su un timeframe più dettagliato per verificare se il mercato sta davvero riprendendo il trend rialzista osservato sul timeframe superiore.',
      'Finché il prezzo continua a costruire una struttura ribassista, non hai ancora una conferma che il trend rialzista osservato sul timeframe superiore stia riprendendo.',
      'Individua il livello che il prezzo deve superare per invalidare quella struttura.',
      'La candela che supera quel livello rappresenta il trigger, cioè il punto di ingresso con la conferma più chiara della ripresa del trend rialzista.',
    ],
    note: '💡 Ricorda: il timeframe principale ti dice dove osservare, quello inferiore ti aiuta a capire quando entrare.',
  },
  4: {
    title: 'Esercizio 4 — Trend ribassista',
    subtitle: '📉 Come individuare l’inizio e la conferma di un trend',
    bullets: [
      'Non confondere il primo segnale di inversione con la conferma del nuovo trend.',
      'Una nuova sequenza di massimi e minimi può indicare un possibile cambiamento, ma da sola non basta.',
      'La conferma arriva quando il mercato rompe un livello chiave che manteneva valida la struttura precedente.',
    ],
  },
  5: {
    title: 'Esercizio 5 — Due zone in un trend ribassista',
    subtitle: `🔎 Trovare una o più zone valide in un trend ribassista

Per riconoscere un massimo valido, segui questo metodo:`,
    bullets: [
      '1. 🔎 Chiediti: questo è l’ultimo massimo prima che riprenda il movimento ribassista?',
      '2. ⚠️ Fai attenzione ai massimi che appartengono ancora alla precedente struttura rialzista: non rappresentano una continuazione del trend ribassista.',
      '3. 📉 Dopo aver individuato l’ultimo massimo, verifica che il trend prosegua effettivamente al ribasso.',
    ],
    note: `Per farlo:

* individua l’ultimo minimo precedente al massimo;
* traccia mentalmente un livello orizzontale da quel minimo;
* attendi la chiusura di una candela sotto quel livello.

Quella chiusura conferma la continuazione del trend ribassista.

In altre parole, dopo quel massimo, i venditori riprendono il controllo del mercato.`,
  },
  6: {
    title: 'Esercizio 6',
    subtitle: '🎯 Come riconoscere una ripresa di un trend ribassista per trovare il punto d’ingresso',
    bullets: [
      'Concentrati sulla zona in cui il prezzo torna dopo essersi allontanato (ritracciamento).',
      'Scendi su un timeframe più dettagliato per cercare una conferma della ripresa del trend osservato sul timeframe superiore (ribassista).',
      'Individua l’ultimo minimo del precedente trend rialzista. Questo minimo identifica il livello di rottura (linea arancione nel grafico)',
      'Quando il prezzo rompe il livello, hai la conferma più chiara della ripresa del trend ribassista.',
      'La candela che rompe quel livello = conferma chiara cambio trend da rialzo a ribasso. Quella candela è il punto di Trigger.',
    ],
    
    note: '💡 Ricorda: il timeframe principale ti dice dove osservare, quello inferiore ti aiuta a capire quando entrare.',
  },
  7: {
    title: 'Esercizio 7 — Passaggio dal trend ribassista al trend rialzista',
    subtitle: `📉 Cambio di struttura = cambio di trend.

Per individuare un cambio di struttura, segui questo procedimento:`,
    bullets: [
      '1. individua l’ultimo minimo, ma appartenente al trend precedente (quindi ribassista);',
      '2. trova il massimo che ha generato quel minimo;',
      '3. traccia mentalmente un livello orizzontale da quel massimo;',
      '4. attendi la prima candela che chiude sopra quel livello (accettazione della rottura).',
    ],
    note: 'Solo allora il cambio di struttura è confermato.',
  },
  8: {
    title: 'Esercizio 8 — Zona che non genera continuazione del trend o cambio strutturale',
    subtitle: `🔎 Una zona può essere valida solo se genera una continuazione del trend oppure un cambio di struttura.
• 🔄 Cambio di struttura-da rialzista a ribassista-

Per individuare dove avviene:`,
    bullets: [
      'individua l’ultimo massimo della precedente struttura rialzista;',
      'individua l’ultimo minimo che ha generato proprio quel massimo;',
      '❗ non confonderlo con un minimo appartenente a un semplice movimento di ritracciamento (come il minimo indicato dalla freccia rossa);',
      'traccia mentalmente un livello orizzontale da quel minimo;',
      'la chiusura di una candela sotto quel livello conferma il cambio di struttura.',
    ],
    note: `• 📉 Continuazione del trend: i compratori o i venditori continuano a battere la controparte?

Se i venditori riprendono il controllo e una candela chiude sotto quel livello, il trend ribassista continua.

💡 Da ricordare: la conferma arriva solo quando una candela chiude sopra o sotto quel livello: questa è l’accettazione della rottura.`,
  },
  9: {
    title: 'Esercizio 9 — Stop Loss e ingresso',
    subtitle: '🎯 Entrata',
    bullets: [
      "Quale punto conferma che il trend rialzista osservato su H4 si stia confermando anche su M15?",
      "Osserva la struttura ribassista che precede il rialzo e individua l'ultimo massimo che la mantiene valida.",
      "Quando una candela chiude al di sopra di quel livello, il rialzo viene confermato anche su M15: questo può rappresentare il trigger di entrata.",
    ],
    secondaryDividerTop: '⸻',
    secondarySubtitle: '🛡️ Stop Loss',
    secondaryBullets: [
      'Fino a quando un trend resta valido? Finché il prezzo non rompe i livelli che ne sostengono la struttura.',
      'In questo esempio, lo Stop Loss è posizionato sotto la Zona A, che sostiene il trend rialzista individuato su H4.',
      '❗ Se il prezzo rompe quella zona, il motivo principale dell’operazione viene meno: la struttura rialzista potrebbe essersi indebolita o aver iniziato un’inversione.',
    ],
    note: '⸻',
  },
}

function Progress({ initialOpenDay = null }) {
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

  const activeDayExercises = getExercisesForDay(currentDay)
  
  // Today's data
  const todayCompletedCount = activeDayExercises.filter((exercise) =>
    risposteByExercise.has(getExerciseNumber(exercise)),
  ).length
  const todayCorrectCount = activeDayExercises.filter((exercise) => {
    const risposta = risposteByExercise.get(getExerciseNumber(exercise))
    return Boolean(risposta?.risposta_corretta)
  }).length
  
  // Total from beginning
  const totalCompletedCount = risposteByExercise.size
  const totalCorrectCount = Array.from(risposteByExercise.values()).filter(risposta => 
    Boolean(risposta?.risposta_corretta)
  ).length
  const totalCorrectLabel = totalCorrectCount === 1
    ? 'Totale: 1 esercizio compreso dall\'inizio'
    : `Totale: ${totalCorrectCount} esercizi compresi dall'inizio`
  
  return (
    <section className="progress">
      <header className="progress-head">
        <span className="eyebrow">Progressi</span>
        <h1 className="page-title">Cosa capire da ogni scenario </h1>
        <p className="muted">
          
        </p>
      </header>

      <div className="progress-summary" aria-label="Riepilogo progressi">
        <div className="progress-summary-card">
          <span className="progress-summary-label">Esercizi completati</span>
          <span className="progress-summary-value">
            {todayCompletedCount}/{activeDayExercises.length} oggi
          </span>
          <span className="progress-summary-total">
            Totale: {totalCompletedCount} esercizi completati dall'inizio
          </span>
        </div>
        <div className="progress-summary-card">
          <span className="progress-summary-label">Esercizi compresi</span>
          <span className="progress-summary-value">
            {todayCorrectCount}/{activeDayExercises.length} oggi
          </span>
          <span className="progress-summary-total">
            {totalCorrectLabel}
          </span>
        </div>
      </div>

      <div className="progress-days-list">
        {EXERCISE_DAYS.map((day) => {
          const status = dayStatuses.find((item) => item.day === day)
          const dayExercises = getExercisesForDay(day)
          const isOpen = openDays.has(day)
          const isCompleted = status?.isCompleted
          const isLocked = day > 1 && !status?.isUnlocked
          const isNotStarted = !isLocked && status?.completedCount === 0
          const summaryLabel = `${status?.correctCount ?? 0}/${dayExercises.length} corretti`
          const summarySubtitle = isCompleted ? 'Giorno completato' : 'Rivedi il ragionamento'
          const lockCopy = status?.isBlockedByDate
            ? 'Disponibile dal giorno successivo.'
            : 'Termina prima il giorno precedente.'

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
                <h2>Giorno {day}</h2>
                {isCompleted && !isLocked && (
                  <button
                    type="button"
                    className={isOpen ? "btn btn-outline btn-sm" : "btn btn-review btn-sm"}
                    onClick={toggleDay}
                  >
                    {isOpen ? 'Chiudi' : 'Rivedi tutto'}
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
                    const statusLabel = isCorrect ? 'Completato' : 'Da rivedere'
                    const statusClass = isCorrect ? 'is-complete' : 'is-review'
                    const learningNote = LEARNING_NOTES[exerciseNumber] || null
                    const displayTitle = learningNote?.title || exercise.title

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
                          <div className="progress-learning">
                            {learningNote ? (
                              <>
                                {learningNote.subtitle && (
                                  <p className="progress-learning-subtitle">{learningNote.subtitle}</p>
                                )}
                                <ul className="progress-learning-list">
                                  {learningNote.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                  ))}
                                </ul>
                                {learningNote.secondaryDividerTop && (
                                  <p className="progress-learning-note">{learningNote.secondaryDividerTop}</p>
                                )}
                                {learningNote.secondarySubtitle && (
                                  <p className="progress-learning-subtitle">{learningNote.secondarySubtitle}</p>
                                )}
                                {learningNote.secondaryBullets?.length > 0 && (
                                  <ul className="progress-learning-list">
                                    {learningNote.secondaryBullets.map((bullet) => (
                                      <li key={bullet}>{bullet}</li>
                                    ))}
                                  </ul>
                                )}
                                {learningNote.note && (
                                  <p className="progress-learning-note">{learningNote.note}</p>
                                )}
                              </>
                            ) : (
                              <p>Sintesi disponibile a breve.</p>
                            )}
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
                      <span className="exercise-day-summary-score">🔒 Bloccato</span>
                      <span className="exercise-day-summary-copy">{lockCopy}</span>
                    </div>
                  ) : isNotStarted ? (
                    <div className="exercise-day-summary-card">
                      <span className="exercise-day-summary-score">Sbloccato</span>
                      <span className="exercise-day-summary-copy">Disponibile per iniziare gli esercizi.</span>
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
