function PlaceholderPage({ section, description }) {
  return (
    <section className="placeholder">
      <span className="eyebrow">{section}</span>
      <div className="placeholder-card">
        <h1 className="page-title">{section}</h1>
        <p className="muted">{description}</p>
        <div className="placeholder-outline">
          <p>
            Questa sezione è in fase di progettazione. Qui verranno inseriti esercizi guidati, feedback
            e progressi per i tester.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PlaceholderPage
