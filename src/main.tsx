import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './linfa.css'
import './i18n'
import './portfolio/fromPortfolio'
import App from './App.tsx'

// Su GitHub Pages il sito vive in un sottopercorso (`/linfa/`): il router lo riceve da Vite.
// Senza la barra finale, così funziona anche `/linfa` oltre a `/linfa/`.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename={basename}>
            <App />
        </BrowserRouter>
    </StrictMode>,
)
