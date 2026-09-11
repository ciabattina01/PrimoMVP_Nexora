import { Fragment, useState } from 'react'
import { useLanguage } from '../i18n/language'
import { getUiCopy } from '../i18n/uiCopy'

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
  const { language } = useLanguage()
  const ui = getUiCopy(language)
  const copy = ui.home

  return (
    <div className="home">
      <section className="hero hero-home">
        <span className="eyebrow">{copy.eyebrow}</span>
        <div className="hero-grid">
          <div className="hero-main">
            <h1 className="home-title">
              <span className="gradient-text">{copy.title}</span>
            </h1>
            <div className="home-intro-entry" aria-label={copy.challengeAriaLabel}>
              <h2 className="home-intro-entry-title">{copy.challengeTitle}</h2>
              <p className="home-intro-entry-copy">
                {copy.challengeCopy}
              </p>
              <a className="btn btn-primary btn-primary--intro" href="/chart-exercise">
                {copy.challengeButton}
              </a>
            </div>
            <div className="home-intro-entry" aria-label={copy.introCardAriaLabel}>
              <h2 className="home-intro-entry-title">{copy.introCardTitle}</h2>
              <p className="home-intro-entry-copy">
                {copy.introCardCopy}
              </p>
              <button type="button" className="btn btn-primary btn-primary--intro" onClick={onStartIntro}>
                {copy.introCardButton}
              </button>
            </div>
 
            <h2 className="daily-goal-title">{copy.dailyGoalTitle}</h2>
            <div className="hero-highlights" aria-label={copy.heroCardsAriaLabel}>
              {copy.heroCards.map((card) => (
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
                {copy.exercisesButton}
              </button>
            </div>
          </div>

          <aside className="weekly-goal-card" aria-labelledby="weekly-goal-title">
            <h2 id="weekly-goal-title">{copy.weeklyGoalTitle}</h2>
            <p>
              {renderHomeObjectiveTextWithBold(copy.weeklyGoalLine1)}
            </p>
            <p>
              {renderHomeObjectiveTextWithBold(copy.weeklyGoalLine2)}
            </p>
             <p>
              {renderHomeObjectiveTextWithBold(copy.weeklyGoalLine3)}
            </p>
            <p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCapitalInfoOpen((prev) => !prev)}
                aria-expanded={isCapitalInfoOpen}
              >
                {copy.capitalToggle}
              </button>
            </p>
            {isCapitalInfoOpen && (
              <>
                {copy.capitalDetails.map((line) => (
                  <p key={line}>{renderHomeObjectiveTextWithBold(line)}</p>
                ))}
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="home-structure">
        <div className="structure-head">
          <h2>{copy.structureTitle}</h2>
          <p className="muted">
            {renderHomeObjectiveTextWithBold(copy.structureSubtitle)}
          </p>
        </div>
        <div className="structure-grid">
          {copy.structureCards.map((card) => (
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
          <h2>{renderHomeObjectiveTextWithBold(copy.levelsTitle)}</h2>
          <p className="muted">
            {copy.levelsText}
          </p>
        </div>
        <div className="levels-grid">
          <article className="level-card level-available">
            <div className="level-card-header">
              <h3>{copy.levelCurrentTitle}</h3>
              <span className="level-badge level-badge-available">{copy.levelCurrentBadge}</span>
            </div>
            <p className="level-card-text">
              {copy.levelCurrentText}
            </p>
          </article>

          <article className="level-card level-development">
            <div className="level-card-header">
              <h3>2.</h3>
              <span className="level-badge level-badge-development">{copy.levelInDevelopment}</span>
            </div>
          </article>

          <article className="level-card level-development">
            <div className="level-card-header">
              <h3>3.</h3>
              <span className="level-badge level-badge-development">{copy.levelInDevelopment}</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

export default Home
