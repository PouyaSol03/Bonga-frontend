import { useState } from 'react'
import { AppRouter } from './router/AppRouter'
import { SplashScreen } from '../features/splash/SplashScreen'

const SPLASH_SESSION_KEY = 'bonga_splash_shown'

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem(SPLASH_SESSION_KEY)
    } catch {
      return true
    }
  })

  const handleSplashFinish = () => {
    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, 'true')
    } catch {
      // Ignore storage errors in private browsing/sandboxed environments
    }
    setShowSplash(false)
  }

  return (
    <>
      <AppRouter />
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </>
  )
}

export default App
