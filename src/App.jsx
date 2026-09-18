import { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout'
import Home from './components/Home'
import IntroExercises from './components/IntroExercises'
import Exercises from './components/Exercises'
import Feedback from './components/Feedback'
import Profile from './components/Profile'
import Progress from './components/Progress'
import InfoPlan from './components/InfoPlan'
import ArticleTriggerEntry from './components/ArticleTriggerEntry'
import LanguageGate from './components/LanguageGate'
import { NAV_ITEMS, STORAGE_KEYS } from './data/appConfig'
import { clearLocalTestData } from './utils/dataTracking'
import { trackEvent } from './utils/tracking'
import { useLanguage } from './i18n/language'
import './App.css'

const DEFAULT_PAGE = NAV_ITEMS[0]?.id || 'home'
const STORAGE_VERSION_KEY = 'nexora_storage_version'
const REQUIRED_STORAGE_VERSION = 'beta_2026_08_18_v1'
const ARTICLE_ENTRY_QUERY = 'entry=chart-exercise'
const DAY1_COMPLETION_KEY = 'nexora_day1_completion_date'
const QUESTIONNAIRE_COMPLETED_KEY = 'nexora_initial_questionnaire_completed'
const TRIGGER_ARTICLE_PATHS = [
  '/chart-exercise',
  '/articolo/come-capire-quando-entrare-trading',
]

function normalizePathname(pathname) {
  const normalized = String(pathname || '/').replace(/\/+$/, '')
  return normalized || '/'
}

function isTriggerArticleRoute() {
  if (typeof window === 'undefined') return false
  return TRIGGER_ARTICLE_PATHS.includes(normalizePathname(window.location.pathname))
}

function isArticleEntryRequested() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).toString().includes(ARTICLE_ENTRY_QUERY)
}

function hasStoredQuestionnaire() {
  if (typeof window === 'undefined' || !window.localStorage) return false
  return window.localStorage.getItem(QUESTIONNAIRE_COMPLETED_KEY) === 'true'
}

function hasCompletedDayOne() {
  if (typeof window === 'undefined' || !window.localStorage) return false
  return Boolean(window.localStorage.getItem(DAY1_COMPLETION_KEY))
}

function ensureRequiredStorageVersion() {
  if (typeof window === 'undefined' || !window.localStorage) return

  try {
    const currentStorageVersion = window.localStorage.getItem(STORAGE_VERSION_KEY)
    if (currentStorageVersion === REQUIRED_STORAGE_VERSION) return

    clearLocalTestData()
    window.localStorage.setItem(STORAGE_VERSION_KEY, REQUIRED_STORAGE_VERSION)
  } catch (error) {
    console.warn('Impossibile applicare il reset versionato dello storage', error)
  }
}

function readProfileName() {
  if (typeof window === 'undefined' || !window.localStorage) return ''
  try {
    const testerId = window.localStorage.getItem('nexora_tester_id')
    if (testerId) return testerId

    const rawProfile = window.localStorage.getItem(STORAGE_KEYS.profile)
    if (!rawProfile) return ''
    const parsed = JSON.parse(rawProfile)
    const name = (parsed?.name || '').trim()
    if (name) {
      window.localStorage.setItem('nexora_tester_id', name)
    }
    return name
  } catch (error) {
    console.warn('Impossibile leggere il tester_id salvato', error)
    return ''
  }
}

function App() {
  ensureRequiredStorageVersion()
  const showTriggerArticlePage = isTriggerArticleRoute()
  const [articleFlow, setArticleFlow] = useState(() => isArticleEntryRequested())
  const { isLanguageConfirmed } = useLanguage()

  const [profileName, setProfileName] = useState(() => readProfileName())
  const [activePage, setActivePage] = useState(() => {
    const savedProfile = readProfileName()
    if (isArticleEntryRequested() && savedProfile && hasCompletedDayOne() && !hasStoredQuestionnaire()) {
      return 'profile'
    }
    if (isArticleEntryRequested() && savedProfile) return 'exercises'
    if (isArticleEntryRequested()) return 'profile'
    return savedProfile ? DEFAULT_PAGE : 'profile'
  })
  const [progressInitialDay, setProgressInitialDay] = useState(null)

  const testerId = useMemo(() => profileName.trim() || null, [profileName])

  useEffect(() => {
    if (!testerId && activePage !== 'profile') {
      setActivePage('profile')
    }
  }, [testerId, activePage])

  const navigateTo = (pageId) => {
    if (!testerId && pageId !== 'profile') {
      setActivePage('profile')
      return
    }

    if (pageId !== 'progress') {
      setProgressInitialDay(null)
    }

    if (pageId === activePage) return

    setActivePage(pageId)
    trackEvent({ type: 'navigation', destination: pageId, tester_id: testerId })
  }

  const handleNavigateToProgress = (day) => {
    if (day) {
      setProgressInitialDay(day)
    }
    navigateTo('progress')
  }

  const handleProfileSaved = (name) => {
    const normalizedName = (name || '').trim()
    if (!normalizedName) {
      return
    }

    setProfileName(normalizedName)
    setActivePage(articleFlow ? 'exercises' : 'home')
    trackEvent({ type: 'navigation', destination: 'home', tester_id: normalizedName })
  }

  const handleQuestionnaireSaved = (name) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(QUESTIONNAIRE_COMPLETED_KEY, 'true')
    }
    setProfileName(name || profileName)
    setArticleFlow(false)
    setActivePage('exercises')
  }

  const handleDay1Completed = () => {
    if (articleFlow && !hasStoredQuestionnaire()) {
      setActivePage('profile')
    }
  }

  const handleProfileDeleted = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.values(STORAGE_KEYS).forEach((key) => {
        try {
          window.localStorage.removeItem(key)
        } catch (error) {
          console.warn('Impossibile rimuovere i dati locali', error)
        }
      })
    }

    clearLocalTestData()

    setProfileName('')
    setArticleFlow(false)
    setActivePage('profile')
  }

  if (showTriggerArticlePage) {
    return <ArticleTriggerEntry />
  }

  if (!isLanguageConfirmed) {
    return <LanguageGate />
  }

  if (!testerId) {
    return (
      <div className="welcome-screen">
        <Profile
          onSave={handleProfileSaved}
          articleNameEntry={articleFlow}
          onDelete={handleProfileDeleted}
        />
      </div>
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            onStartIntro={() => navigateTo('intro-exercises')}
            onStartExercises={() => navigateTo('exercises')}
          />
        )
      case 'intro-exercises':
        return <IntroExercises />
      case 'exercises':
        return (
          <Exercises
            testerId={testerId}
            onNavigateToProgress={handleNavigateToProgress}
            onReturnToProgram={() => navigateTo('exercises')}
            onDay1Completed={handleDay1Completed}
          />
        )
      case 'progress':
        return <Progress initialOpenDay={progressInitialDay} />
      case 'feedback':
        return <Feedback testerId={testerId} />
      case 'profile':
        return (
          <Profile
            onSave={handleProfileSaved}
            articleNameEntry={articleFlow && !profileName}
            articleQuestionnaire={articleFlow && Boolean(profileName) && hasCompletedDayOne() && !hasStoredQuestionnaire()}
            onQuestionnaireSaved={handleQuestionnaireSaved}
            onDelete={handleProfileDeleted}
          />
        )
      case 'info-plan':
        return <InfoPlan />
      default:
        return null
    }
  }

  return (
    <Layout
      navItems={NAV_ITEMS}
      activeItem={activePage}
      onSelectNav={navigateTo}
      profileName={profileName}
      showSidebar={false}
    >
      {renderPage()}
    </Layout>
  )
}

export default App
