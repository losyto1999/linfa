// Regole del carrello di Linfa: funzioni pure, senza React. Tutti gli importi sono in centesimi.
// Il carrello resta nel browser (come quello di un ospite in un negozio vero); il controllo del
// codice sconto e l'invio dell'ordine passano invece dalle API simulate in src/api/.
import { findPlant } from '../data/plants'
import { DISCOUNT, SHIPPING } from '../data/shop'

/** Chiave in localStorage: il prefisso "linfa:" evita conflitti con altri siti sullo stesso dominio. */
export const STORAGE_KEY = 'linfa:carrello'

export const MAX_QTY = 10

export interface CartLine {
    slug: string
    qty: number
}

export interface CartState {
    lines: CartLine[]
    code: typeof DISCOUNT.code | null
}

export type CartAction =
    | { type: 'add'; slug: string }
    | { type: 'setQty'; slug: string; qty: number }
    | { type: 'remove'; slug: string }
    | { type: 'restore'; line: CartLine; index: number }
    | { type: 'applyCode' }
    | { type: 'removeCode' }
    | { type: 'replace'; state: CartState }
    | { type: 'clear' }

const clampQty = (qty: number) => Math.min(MAX_QTY, Math.max(1, Math.round(qty)))

export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'add': {
            const line = state.lines.find((l) => l.slug === action.slug)
            if (!line) return { ...state, lines: [...state.lines, { slug: action.slug, qty: 1 }] }
            if (line.qty >= MAX_QTY) return state
            return {
                ...state,
                lines: state.lines.map((l) => (l.slug === action.slug ? { ...l, qty: l.qty + 1 } : l)),
            }
        }
        case 'setQty':
            return {
                ...state,
                lines: state.lines.map((l) =>
                    l.slug === action.slug ? { ...l, qty: clampQty(action.qty) } : l,
                ),
            }
        case 'remove':
            return { ...state, lines: state.lines.filter((l) => l.slug !== action.slug) }
        case 'restore': {
            if (state.lines.some((l) => l.slug === action.line.slug)) return state
            const lines = [...state.lines]
            lines.splice(Math.min(action.index, lines.length), 0, action.line)
            return { ...state, lines }
        }
        case 'applyCode':
            return { ...state, code: DISCOUNT.code }
        case 'removeCode':
            return { ...state, code: null }
        case 'replace':
            return action.state
        case 'clear':
            return EMPTY
    }
}

export interface Totals {
    /** Numero di piante (somma delle quantità). */
    count: number
    subtotal: number
    discount: number
    /** 0 se il carrello è vuoto o se la spedizione è gratuita. */
    shipping: number
    total: number
}

export function getTotals(state: Pick<CartState, 'lines' | 'code'>): Totals {
    let count = 0
    let subtotal = 0
    for (const line of state.lines) {
        const plant = findPlant(line.slug)
        if (!plant) continue
        count += line.qty
        subtotal += plant.price * line.qty
    }

    const discount = state.code ? Math.round((subtotal * DISCOUNT.percent) / 100) : 0
    const shipping = count === 0 || subtotal >= SHIPPING.freeFrom ? 0 : SHIPPING.cost

    return { count, subtotal, discount, shipping, total: subtotal - discount + shipping }
}

export const EMPTY: CartState = { lines: [], code: null }

// Copia in memoria: se il localStorage non è disponibile (navigazione privata, storage bloccato)
// il carrello sopravvive almeno ai cambi di pagina, fino al ricaricamento.
let memoryCopy: string | null = null

/**
 * Legge il carrello salvato e lo ripulisce: scarta le piante che non sono più in catalogo,
 * riporta le quantità tra 1 e MAX_QTY e tiene il codice solo se è quello valido.
 */
export function loadCart(): CartState {
    let raw = memoryCopy
    try {
        raw = localStorage.getItem(STORAGE_KEY) ?? memoryCopy
    } catch {
        // localStorage non disponibile: resta la copia in memoria.
    }
    try {
        if (!raw) return EMPTY
        const data = JSON.parse(raw) as { lines?: unknown; code?: unknown }

        const lines: CartLine[] = []
        if (Array.isArray(data.lines)) {
            for (const item of data.lines as Partial<CartLine>[]) {
                if (typeof item?.slug !== 'string' || typeof item.qty !== 'number') continue
                if (!findPlant(item.slug) || lines.some((l) => l.slug === item.slug)) continue
                lines.push({ slug: item.slug, qty: clampQty(item.qty) })
            }
        }

        return { lines, code: data.code === DISCOUNT.code ? DISCOUNT.code : null }
    } catch {
        return EMPTY
    }
}

export function saveCart(state: CartState) {
    memoryCopy = JSON.stringify({ v: 1, ...state })
    try {
        localStorage.setItem(STORAGE_KEY, memoryCopy)
    } catch {
        // Storage pieno o disabilitato (es. navigazione privata): il carrello resta in memoria.
    }
}
