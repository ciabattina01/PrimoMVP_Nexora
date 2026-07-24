const HERO_CARDS = [
  {
    step: '1',
    title: 'Esercizio sul Trend',
    description: 'Capisci se il prezzo si sta muovendo in una direzione chiara oppure no.',
  },
  {
    step: '2',
    title: 'Esercizio sulle Zone',
    description: 'Osserva dove il prezzo si è fermato o ha reagito in passato.',
  },
  {
    step: '3',
    title: 'Esercizio sul Trigger e il Rischio',
    description: 'Capisci quando entrare e quanto rischiare.',
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

function Home({ onStartExercises }) {
  return (
    <div className="home">
      <section className="hero hero-home">
        <span className="eyebrow">Home</span>
        <div className="hero-grid">
          <div className="hero-main">
            <h1 className="home-title">
              Inizia ad applicare <span className="gradient-text">i concetti sul grafico</span>
            </h1>
            <p className="lead hero-lead">
              <strong>Ogni giorno hai 3 esercizi.</strong> <strong>Ogni esercizio:</strong>•📉Grafico reale •⌚7-10min.
            </p>
            <h2 className="daily-goal-title">Obiettivo giornaliero</h2>
            <div className="hero-highlights" aria-label="Punti chiave del percorso">
              {HERO_CARDS.map((card) => (
                <div key={card.title} className="hero-highlight">
                  <span className="highlight-index">{card.step}</span>
                  <div className="highlight-text">
                    <span className="highlight-title">{card.title}</span>
                    {card.description ? (
                      <span className="highlight-desc">{card.description}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary btn-primary--soft" onClick={onStartExercises}>
                Esercitati
              </button>
            </div>
          </div>

          <aside className="weekly-goal-card" aria-labelledby="weekly-goal-title">
            <h2 id="weekly-goal-title">OBIETTIVO – Cosa alleni</h2>
            <p>
              Ogni giorno ti allenerai a ragionare direttamente sul grafico attraverso tre esercizi:
            </p>
            <ul className="weekly-goal-list">
              <li>Riconoscere i trend e i cambi di struttura.</li>
              <li>Individuare le zone in cui il prezzo ha reagito.</li>
              <li>Riconoscere i possibili punti di entrata (Trigger) e dove posizionare lo Stop Loss.</li>
            </ul>
            <p className="weekly-goal-note">
              Questa versione non è ancora definitiva: è un primo test per capire quale metodo di apprendimento risulta più chiaro ed efficace.
            </p>
          </aside>
        </div>
      </section>

      <section className="home-structure">
        <div className="structure-head">
          <h2>La struttura di ogni esercizio</h2>
          <p className="muted">
            Ogni esercizio è un percorso guidato, progressivo e strutturato in <strong>3 fasi</strong>:
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
