import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Porta in vista l'elemento indicato dall'hash dell'URL, anche arrivando dall'altra pagina.
 * Lo spazio per la nav sticky (h-20) lo lascia già lo `scroll-padding-top: 5rem` di `html`
 * definito in src/index.css. Stesso hook di Pala e Fuoco: ogni demo resta autonoma.
 */
export function useScrollToHash() {
    const { hash, key } = useLocation()

    useEffect(() => {
        if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    }, [hash, key])
}
