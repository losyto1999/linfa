import { useCallback, useSyncExternalStore } from 'react'

/** true finché la media query corrisponde; si aggiorna al ridimensionamento. */
export function useMediaQuery(query: string) {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const list = window.matchMedia(query)
            list.addEventListener('change', onChange)
            return () => list.removeEventListener('change', onChange)
        },
        [query],
    )

    return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}

/** Da qui in su il riepilogo del carrello sta fisso accanto alla griglia (lg di Tailwind). */
export const DESKTOP = '(min-width: 64rem)'
