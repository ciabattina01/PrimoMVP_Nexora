import { useLanguage } from '../i18n/language'
import { getUiCopy } from '../i18n/uiCopy'

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
  const { language } = useLanguage()
  const ui = getUiCopy(language)
  const copy = ui.infoPlan

  return (
    <section className="info-plan info-plan--wide">
      <div className="info-plan-card">
        <span className="info-plan-badge">{copy.badge}</span>
        <h1 className="info-plan-title">
          {copy.title}
        </h1>
        <ul className="info-plan-list">
          {copy.items.map((item) => (
            <li key={item}>{renderInfoPlanTextWithBold(item)}</li>
          ))}
        </ul>
        <div className="info-plan-divider" aria-hidden="true" />
        <p className="info-plan-quote">{renderInfoPlanTextWithBold(copy.quote)}</p>
      </div>

      <div className="info-plan-footer">
        <p className="muted">
          {copy.footer}
        </p>
        <a
          className="btn btn-info-plan"
          href="https://tally.so/r/1A5Eob"
          target="_blank"
          rel="noreferrer"
        >
          {copy.button}
        </a>
      </div>
    </section>
  )
}

export default InfoPlan
