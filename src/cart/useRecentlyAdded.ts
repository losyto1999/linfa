import { useEffect, useState } from 'react'
import { useCart } from './CartContext'

/**
 * L'ultima aggiunta al carrello per `ms` millisecondi, poi null. Le aggiunte fatte prima che
 * il componente comparisse (es. su un'altra pagina) non vengono mostrate.
 */
export function useRecentlyAdded(ms: number) {
    const { lastAdded } = useCart()
    const [seenId, setSeenId] = useState(() => lastAdded?.id ?? 0)

    useEffect(() => {
        if (!lastAdded || lastAdded.id === seenId) return
        const id = setTimeout(() => setSeenId(lastAdded.id), ms)
        return () => clearTimeout(id)
    }, [lastAdded, seenId, ms])

    return {
        recent: lastAdded && lastAdded.id !== seenId ? lastAdded : null,
        dismiss: () => setSeenId(lastAdded?.id ?? 0),
    }
}
