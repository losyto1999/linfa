import { createContext, useContext } from 'react'
import type { CartLine, CartState, CodeCheck, Totals } from './cart'

export interface RemovedLine {
    line: CartLine
    index: number
}

export interface CartContextValue {
    lines: CartLine[]
    code: CartState['code']
    totals: Totals
    qtyOf: (slug: string) => number
    add: (slug: string) => void
    setQty: (slug: string, qty: number) => void
    remove: (slug: string) => void
    /** Ultima riga rimossa, recuperabile con undoRemove per qualche secondo. */
    removed: RemovedLine | null
    undoRemove: () => void
    applyCode: (input: string) => CodeCheck
    removeCode: () => void
    /** Cambia a ogni aggiunta (anche della stessa pianta): fa partire i feedback visivi. */
    lastAdded: { slug: string; id: number } | null
    /** Pannello a scomparsa del carrello. */
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
    /** Richiamo visivo del riepilogo fisso, quando è già in pagina (catalogo su desktop). */
    summaryPing: number
    pingSummary: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
    const cart = useContext(CartContext)
    if (!cart) throw new Error('useCart va usato dentro <CartProvider>')
    return cart
}
