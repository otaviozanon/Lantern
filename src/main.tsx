import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GameProvider } from './hooks/useGame'
import { LanguageProvider } from './hooks/useLanguage'
import { TooltipProvider } from './hooks/useTooltips'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <TooltipProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </TooltipProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
