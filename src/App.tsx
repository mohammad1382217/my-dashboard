import { LanguageProvider } from './i18n-provider'
import { IconSprite } from './components/Icon'
import { ToastProvider } from './components/ui/Toast/Toast'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <LanguageProvider>
      <IconSprite />
      <ToastProvider>
        <Dashboard />
      </ToastProvider>
    </LanguageProvider>
  )
}

export default App
