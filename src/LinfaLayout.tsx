import { MotionConfig } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { CartProvider } from './cart/CartProvider'
import { CartDrawer } from './components/cart/CartDrawer'
import { LinfaFooter } from './components/LinfaFooter'
import { LinfaHeader } from './components/LinfaHeader'

/** Header, pagina, footer e carrello a scomparsa, comuni a tutte le pagine. */
export function LinfaLayout() {
    const location = useLocation()
    const navigationType = useNavigationType()

    // react-router non riporta in cima la pagina nuova: lo facciamo qui, ma solo quando cambia
    // il percorso. I filtri del catalogo cambiano la query string e non devono far saltare la
    // pagina; le ancore le gestisce ogni pagina con useScrollToHash.
    const previousPath = useRef<string | null>(null)
    useEffect(() => {
        if (previousPath.current === location.pathname) return
        previousPath.current = location.pathname
        if (!location.hash && navigationType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' })
    }, [location.pathname, location.hash, navigationType])

    return (
        // Con reduced motion attivo, motion toglie spostamenti e animazioni di layout
        // e lascia solo le dissolvenze.
        <MotionConfig reducedMotion="user">
            <CartProvider>
                <div className="linfa-root min-h-screen">
                    <LinfaHeader />
                    <main>
                        <Outlet />
                    </main>
                    <LinfaFooter />
                    <CartDrawer />
                </div>
            </CartProvider>
        </MotionConfig>
    )
}
