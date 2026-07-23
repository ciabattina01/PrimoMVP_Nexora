import { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout'
import Home from './components/Home'
import Exercises from './components/Exercises'
import Feedback from './components/Feedback'
import Profile from './components/Profile'
import Progress from './components/Progress'
import InfoPlan from './components/InfoPlan'
import { NAV_ITEMS, STORAGE_KEYS } from './data/appConfig'
import { clearLocalTestData } from './utils/dataTracking'
import { trackEvent } from './utils/tracking'
import './App.css'

const DEFAULT_PAGE = NAV_ITEMS[0]?.id || 'home'

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
  const [profileName, setProfileName] = useState(() => readProfileName())
  const [activePage, setActivePage] = useState(() => {
    const savedProfile = readProfileName()
    return savedProfile ? DEFAULT_PAGE : 'profile'
  })

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

    if (pageId === activePage) return

    setActivePage(pageId)
    trackEvent({ type: 'navigation', destination: pageId, tester_id: testerId })
  }

  const handleProfileSaved = (name) => {
    const normalizedName = (name || '').trim()
    if (!normalizedName) {
      return
    }

    setProfileName(normalizedName)
    setActivePage('home')
    trackEvent({ type: 'navigation', destination: 'home', tester_id: normalizedName })
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
    setActivePage('profile')
  }

  if (!testerId) {
    return (
      <div className="welcome-screen">
        <Profile
          onSave={handleProfileSaved}
          onDelete={handleProfileDeleted}
        />
      </div>
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onStartExercises={() => navigateTo('exercises')} />
      case 'exercises':
        return (
          <Exercises
            testerId={testerId}
            onNavigateToProgress={() => navigateTo('progress')}
            onReturnToProgram={() => navigateTo('exercises')}
          />
        )
      case 'progress':
        return <Progress />
      case 'feedback':
        return <Feedback testerId={testerId} />
      case 'profile':
        return (
          <Profile
            onSave={handleProfileSaved}
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
