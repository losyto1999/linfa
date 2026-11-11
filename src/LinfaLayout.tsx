import { MotionConfig } from 'motion/react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { BackToPortfolio } from './components/ui/BackToPortfolio'
import { useDemoBundle } from './i18n/demo'
import { CartProvider } from './cart/CartProvider'
import { CartDrawer } from './components/cart/CartDrawer'
import { LinfaFooter } from './components/LinfaFooter'
import { LinfaHeader } from './components/LinfaHeader'
import linfaStylesheetUrl from './linfa.css?url'

const LOCALES = {
    it: () => import('./locales/it.json'),
    en: () => import('./locales/en.json'),
}

export function LinfaLayout() {
    const location = useLocation()
    const navigationType = useNavigationType()
    // Catturata una sola volta all'ingresso: le navigazioni interne (Home <-> Piante)
    // non devono cambiare la pagina flowsi a cui torna il pulsante "indietro".
    const [backTo] = useState(() => (location.state as { from?: string } | null)?.from ?? '/')

    // Stesso schema di PizzeriaLayout: il CSS viene montato/smontato manualmente
    // così il suo @theme non resta caricato tornando a flowsi.
    const [stylesReady, setStylesReady] = useState(false)
    const textsReady = useDemoBundle('linfa', LOCALES)

    useEffect(() => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = linfaStylesheetUrl
        link.onload = () => setStylesReady(true)
        document.head.appendChild(link)
        return () => {
            document.head.removeChild(link)
        }
    }, [])

    // Come in SiteLayout: react-router non riporta in cima la pagina nuova. Solo quando cambia
    // il percorso (anche all'ingresso da flowsi): i filtri del catalogo cambiano la query string
    // e non devono far saltare la pagina. Le ancore le gestisce ogni pagina con useScrollToHash.
    const previousPath = useRef<string | null>(null)
    useEffect(() => {
        if (previousPath.current === location.pathname) return
        previousPath.current = location.pathname
        if (!location.hash && navigationType !== 'POP') window.scrollTo(0, 0)
    }, [location.pathname, location.hash, navigationType])

    // Evita un flash senza stile: la stessa tinta del fallback in App.tsx.
    if (!stylesReady || !textsReady) return <div className="min-h-screen bg-[#f8f6e9]" />

    return (
        // Con reduced motion attivo, motion toglie spostamenti e animazioni di layout
        // e lascia solo le dissolvenze.
        <MotionConfig reducedMotion="user">
            <CartProvider>
                <div className="linfa-root min-h-screen">
                    <BackToPortfolio to={backTo} />
                    <LinfaHeader />
                    <main>
                        {/* Le pagine sono caricate a parte: mentre arriva il codice resta visibile il resto del layout. */}
                        <Suspense fallback={<div className="min-h-screen" />}>
                            <Outlet />
                        </Suspense>
                    </main>
                    <LinfaFooter />
                    <CartDrawer />
                </div>
            </CartProvider>
        </MotionConfig>
    )
}
