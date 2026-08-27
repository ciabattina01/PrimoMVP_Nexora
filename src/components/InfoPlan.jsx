function renderInfoPlanTextWithBold(text) {
  const source = String(text ?? '')
  const parts = source.split(/(\*\*[\s\S]+?\*\*)/g)

  return parts.map((part, index) => {
    const match = part.match(/^\*\*([\s\S]+)\*\*$/)
    if (match) {
      return <strong key={`info-plan-bold-${index}`}>{match[1]}</strong>
    }

    return part
  })
}

function InfoPlan() {
  return (
    <section className="info-plan info-plan--wide">
      <div className="info-plan-card">
        <span className="info-plan-badge">Hai studiato, ma sul grafico non sai cosa e dove guardare?</span>
        <h1 className="info-plan-title">
          Piano Allenati — prova 7 giorni gratis
        </h1>
        <ul className="info-plan-list">
          <li>{renderInfoPlanTextWithBold('**Teoria e allenamento pratico collegati, direttamente sul grafico - passo dopo passo**')}</li>
          <li>{renderInfoPlanTextWithBold('**Step illimitati**')}</li>
          <li>{renderInfoPlanTextWithBold('Percorso passo dopo passo adattato ai tuoi **progressi**')}</li>
        </ul>
        <div className="info-plan-divider" aria-hidden="true" />
        <p className="info-plan-quote">{renderInfoPlanTextWithBold('Per chi ha studiato, ma non sa **cosa e dove guardare sul grafico**')}</p>
      </div>

      <div className="info-plan-footer">
        <p className="muted">
       Il prezzo è da definire: lascia la tua email e proponi quanto pagheresti.
        </p>
        <a
          className="btn btn-info-plan"
          href="https://tally.so/r/1A5Eob"
          target="_blank"
          rel="noreferrer"
        >
          Lascia l'email - proponi un prezzo
        </a>
      </div>
    </section>
  )
}

export default InfoPlan
