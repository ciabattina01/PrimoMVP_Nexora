import { Fragment, useState } from 'react'

const HERO_CARDS = [
  {
    step: '1',
    title: 'Step sul Trend',
    description: 'Capisci **cosa osservare**: direzione',
  },
  {
    step: '2',
    title: 'Step sulle Zone',
    description: 'Capisci **dove osservare**:individua la zona interessante',
  },
  {
    step: '3',
    title: 'Step sul Trigger e il Rischio',
    description: 'Capisci **cosa aspettare prima di valutare l\'ingresso**',
  },
]

const STRUCTURE_CARDS = [
  {
    step: 'Fase 01',
    bullets: [
      { text: 'Osserva il ', strong: 'grafico reale' },
      { text: 'Leggi lo ', strong: 'spunto di riflessione' },
    ],
  },
  {
    step: 'Fase 02',
    bullets: [
      { text: 'Scegli una risposta' },
      { text: 'Conferma solo dopo averci ', strong: 'pensato' },
      { text: 'Spiega ', strong: 'in breve cosa hai osservato' },
    ],
  },
  {
    step: 'Fase 03',
    bullets: [
      { text: 'Guarda il ', strong: 'grafico spiegato' },
      { text: 'Leggi il ', strong: 'ragionamento', suffix: ' guidato' },
      { text: 'Porta a casa i ', strong: 'concetti chiave' },
    ],
  },
]

function renderHomeObjectiveTextWithBold(text) {
  const source = String(text ?? '')
  const parts = source.split(/(\*\*[\s\S]+?\*\*)/g)

  return parts.map((part, index) => {
    const match = part.match(/^\*\*([\s\S]+)\*\*$/)
    if (match) {
      return <strong key={`home-objective-bold-${index}`}>{match[1]}</strong>
    }

    return <Fragment key={`home-objective-text-${index}`}>{part}</Fragment>
  })
}

function Home({ onStartIntro, onStartExercises }) {
  const [isCapitalInfoOpen, setIsCapitalInfoOpen] = useState(false)

  return (
    <div className="home">
      <section className="hero hero-home">
        <span className="eyebrow">Home</span>
        <div className="hero-grid">
          <div className="hero-main">
            <h1 className="home-title">
              Non sai  <span className="gradient-text">da dove iniziare?</span>
            </h1>
            <p className="lead hero-lead">
              <strong></strong> 
            </p>

            <div className="home-intro-entry" aria-label="Accesso Parte introduttiva">
              <h2 className="home-intro-entry-title">1. Inizia dalle basi</h2>
              <p className="home-intro-entry-copy">
                 3 step per avere le basi necessarie. 
              </p>
              <button type="button" className="btn btn-primary btn-primary--intro" onClick={onStartIntro}>
               1. Inizia dalle basi
              </button>
            </div>
 
            <h2 className="daily-goal-title">2. Esercitati con gli step. Ogni giorno • 3 step <strong> </strong>   Obiettivo giornaliero:</h2>
            <div className="hero-highlights" aria-label="Punti chiave del percorso">
              {HERO_CARDS.map((card) => (
                <div key={card.title} className="hero-highlight">
                  <span className="highlight-index">{card.step}</span>
                  <div className="highlight-text">
                    <span className="highlight-title">{card.title}</span>
                    {card.description ? (
                      <span className="highlight-desc">{renderHomeObjectiveTextWithBold(card.description)}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary btn-primary--soft" onClick={onStartExercises}>
                2. Esercitati
              </button>
            </div>
          </div>

          <aside className="weekly-goal-card" aria-labelledby="weekly-goal-title">
            <h2 id="weekly-goal-title">OBIETTIVO </h2>
            <p>
              {renderHomeObjectiveTextWithBold(`**3 step per avere le basi necessarie**`)}
            </p>
            <p>
              {renderHomeObjectiveTextWithBold(`Gli step **allenano un modo di ragionare da utilizzare su timeframe e tipi di operatività diversi**`)}
            </p>
             <p>
              {renderHomeObjectiveTextWithBold(`**Prima di pensare con quanto capitale iniziare, serve capire il ragionamento.**`)}
            </p>
            <p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCapitalInfoOpen((prev) => !prev)}
                aria-expanded={isCapitalInfoOpen}
              >
                Con quanto capitale iniziare?
              </button>
            </p>
            {isCapitalInfoOpen && (
              <>
                <p>{renderHomeObjectiveTextWithBold('Per iniziare **non serve conoscere già tutta l’analisi tecnica, volumetrica o memorizzare i termini.**')}</p>
                <p>{renderHomeObjectiveTextWithBold(' Serve prima avere delle** basi chiare e imparare, passo dopo passo, a leggere il grafico** e poi approfondire.')}</p>
                <p>{renderHomeObjectiveTextWithBold('Non esiste una cifra ideale. Se sei all’inizio, la prima cosa non è decidere quanti soldi utilizzare.')}</p>
                <p>{renderHomeObjectiveTextWithBold('1-Prima impara a **guardare un grafico**.')}</p>
                <p>{renderHomeObjectiveTextWithBold('2-Poi applica ciò che hai imparato **in simulazione**.')}</p>
                <p>{renderHomeObjectiveTextWithBold('3-Poi potrai valutare di partire con una cifra che puoi permetterti di perdere, come riferimento indicativo **100-300 €**.')}</p>
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="home-structure">
        <div className="structure-head">
          <h2>Ogni step:</h2>
          <p className="muted">
            Ogni step è un percorso guidato, progressivo e strutturato in <strong>3 fasi</strong>:
          </p>
        </div>
        <div className="structure-grid">
          {STRUCTURE_CARDS.map((card) => (
            <article key={card.step} className="structure-card">
              <span className="structure-step">{card.step}</span>
              <ul className="structure-card-list">
                {card.bullets.map((bullet, index) => (
                  <li key={`${card.step}-${index}`}>
                    {bullet.text}
                    {bullet.strong ? <strong>{bullet.strong}</strong> : null}
                    {bullet.suffix ? bullet.suffix : null}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="home-levels">
        <div className="levels-head">
          <h2><strong>Progetto in evoluzione - incluso nel piano GRATUITO</strong></h2>
          <p className="muted">
            3 percorsi graduali. Percorso attuale di test: 1. Lettura guidata del grafico.
            In sviluppo: Mentor AI che guiderà il ragionamento.
          </p>
        </div>
        <div className="levels-grid">
          <article className="level-card level-available">
            <div className="level-card-header">
              <h3>1. Lettura guidata del grafico</h3>
              <span className="level-badge level-badge-available">PERCORSO ATTUALE</span>
            </div>
            <p className="level-card-text">
              Grafici semplici per analizzare Trend, Zone, Trigger e Rischio.
            </p>
          </article>

          <article className="level-card level-development">
            <div className="level-card-header">
              <h3>2.</h3>
              <span className="level-badge level-badge-development">In sviluppo</span>
            </div>
          </article>

          <article className="level-card level-development">
            <div className="level-card-header">
              <h3>3.</h3>
              <span className="level-badge level-badge-development">In sviluppo</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

export default Home
