import { APP_META } from '../data/appConfig'

const INSTAGRAM_URL = 'https://www.instagram.com/percep_progetto'
const DISCORD_URL = 'https://discord.gg/VVJCRzGXr'

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path
        d="M4.5 11.5 12 5l7.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.75V20h11V10.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  exercises: (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="6.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 6v4l2.5 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  intro: (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path
        d="M6 5.5h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8.25 9h7.5M8.25 12h7.5M8.25 15h4.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  progress: (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path
        d="M4 17.5 9.5 12l3 3 7-7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 6.5V18H20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  'progress-bars': (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path
        d="M5 18V14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 18V11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 18V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 18V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3.5 18h17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  feedback: (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path
        d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5h-5.5L9 20.5V16.5H5A1.5 1.5 0 0 1 3.5 15V6.5A1.5 1.5 0 0 1 5 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <circle
        cx="12"
        cy="8"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6.5 19c0-2.5 2.2-4.5 5.5-4.5s5.5 2 5.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 10.5v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" />
    </svg>
  ),
}

function resolveIcon(iconKey) {
  return ICONS[iconKey] || ICONS.info
}

function renderFeedbackBrand(className) {
  return (
    <span className={className}>
      {APP_META.name}{' '}Instagram{' '}
      <a className="brand-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
        @percep_progetto
      </a>
      {' · '}
      <a className="brand-link" href={DISCORD_URL} target="_blank" rel="noreferrer">
        Discord
      </a>
    </span>
  )
}

function Layout({ navItems, activeItem, onSelectNav, profileName, showSidebar, children }) {
  const renderNavButtons = (variant) =>
    navItems.map((item) => {
      const isActive = activeItem === item.id
      const baseClass = variant === 'top' ? 'top-nav-item' : 'nav-item'
      const iconClass = variant === 'top' ? 'nav-icon top-nav-icon' : 'nav-icon'
      const labelClass = variant === 'top' ? 'top-nav-label' : 'nav-label'

      return (
        <button
          key={item.id}
          type="button"
          className={`${baseClass}${isActive ? ' is-active' : ''}`}
          onClick={() => onSelectNav(item.id)}
        >
          <span className={iconClass} aria-hidden="true">
            {resolveIcon(item.icon)}
          </span>
          <span className={labelClass}>{item.label}</span>
        </button>
      )
    })

  if (showSidebar) {
    const appClassName = `app app--sidebar${activeItem === 'home' ? ' app--home' : ''}`
    return (
      <div className={appClassName}>
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-logo" aria-hidden="true">
              <span className="logo-dot" />
            </div>
            <div className="brand-text">
              {renderFeedbackBrand('brand-title')}
              <span className="brand-subtitle">Prototipo guidato</span>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Navigazione principale">
            {renderNavButtons('sidebar')}
          </nav>

          <div className="sidebar-plan" aria-label="Dettagli piano">
            <div className="profile-chip">
              <span className="chip-plan">PIANO ESPLORA ATTUALE - GRATUITO</span>
              <span className="chip-meta">Nome: {profileName || 'non impostato'}</span>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="main-inner">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app app--topnav">
      <header className="top-nav-header">
        <div className="top-nav-brand" aria-label="Nexora">
          <span className="top-logo-dot" />
          {renderFeedbackBrand('top-brand-text')}
        </div>
        <nav className="top-nav" aria-label="Navigazione principale">
          {renderNavButtons('top')}
        </nav>
        <div className="top-nav-profile" aria-label="Dettagli piano">
          <div className="profile-chip profile-chip--top">
            <span className="chip-plan">IL TUO PIANO: GRATUITO</span>
            <span className="chip-meta">Nome: {profileName || 'non impostato'}</span>
          </div>
        </div>
      </header>

      <div className="main main--topnav">
        <div className="main-inner main-inner--topnav">{children}</div>
      </div>
    </div>
  )
}

export default Layout

