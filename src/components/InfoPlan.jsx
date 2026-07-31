function InfoPlan() {
  return (
    <section className="info-plan info-plan--wide">
      <div className="info-plan-card">
        <span className="info-plan-badge">Percorso personalizzato</span>
        <h1 className="info-plan-title">
          Piano Allenati — prova 7 giorni gratis
        </h1>
        <ul className="info-plan-list">
          <li>Capisci dove sbagli e perché, ogni volta</li>
          <li>Scenari illimitati in tutti i percorsi</li>
          <li>Report errori dall'inizio del percorso</li>
          <li>Percorsi adattati ai tuoi progressi reali</li>
          <li>Per chi vuole migliorare, non solo provare</li>
        </ul>
        <div className="info-plan-divider" aria-hidden="true" />
        <p className="info-plan-quote">Per chi vuole migliorare attivamente</p>
      </div>

      <div className="info-plan-footer">
        <p className="muted">
          Il piano Allenati è in sviluppo. Se sei interessato/a, lascia l'email al form per
          aggiornarti:
        </p>
        <a
          className="btn btn-info-plan"
          href="https://tally.so/r/1A5Eob"
          target="_blank"
          rel="noreferrer"
        >
          Lascia l'email
        </a>
      </div>
    </section>
  )
}

export default InfoPlan
