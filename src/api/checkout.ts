// API di checkout simulata: il progetto non ha un backend.
// Due chiamate, ognuna con una breve attesa per simulare la rete (vedi mock.ts):
// - `validateDiscountCode` controlla un codice sconto;
// - `submitOrder` registra l'ordine. Come farebbe un server vero, non si fida del browser:
//   ricalcola i totali dal catalogo e ricontrolla il codice.
// Gli ordini restano nel localStorage di chi visita il sito.

import type { CartLine, Totals } from '../cart/cart'
import { getTotals } from '../cart/cart'
import { findPlant } from '../data/plants'
import { DELIVERY, DISCOUNT } from '../data/shop'
import { delay, seededRandom, storedList, todayInItaly } from './mock'

export type DiscountCode = typeof DISCOUNT.code

/** Il codice scritto non esiste. */
export class InvalidCodeError extends Error {
    readonly typed: string
    constructor(typed: string) {
        super('invalid-code')
        this.name = 'InvalidCodeError'
        this.typed = typed
    }
}

/** L'ordine non contiene piante (per esempio il carrello è stato svuotato in un'altra scheda). */
export class EmptyOrderError extends Error {
    constructor() {
        super('empty-order')
        this.name = 'EmptyOrderError'
    }
}

export interface OrderRequest {
    lines: CartLine[]
    code: DiscountCode | null
}

export interface Order {
    id: string
    /** Numero da mostrare al cliente, es. `LNF-261111-047`. */
    number: string
    /** Momento dell'ordine, ISO 8601. */
    createdAt: string
    /** Giorno di consegna previsto, `YYYY-MM-DD`. */
    deliveryBy: string
    /** Righe con il prezzo unitario del momento, in centesimi. */
    lines: (CartLine & { price: number })[]
    code: DiscountCode | null
    totals: Totals
}

const orders = storedList<Order>('linfa:ordini')

/** Maiuscole/minuscole e spazi non contano: " benvenuto 10 " vale come "BENVENUTO10". */
function checkCode(input: string): DiscountCode {
    const typed = input.trim()
    if (typed.replace(/\s+/g, '').toUpperCase() !== DISCOUNT.code) throw new InvalidCodeError(typed)
    return DISCOUNT.code
}

/** Giorno `YYYY-MM-DD` spostato di `days` giorni. */
function addDays(day: string, days: number) {
    const date = new Date(`${day}T12:00:00Z`)
    date.setUTCDate(date.getUTCDate() + days)
    return date.toISOString().slice(0, 10)
}

/** Partenza il giorno dopo, poi 48 ore di viaggio; la domenica il corriere non consegna. */
function deliveryDate(day: string) {
    const delivery = addDays(day, DELIVERY.dispatchDays + DELIVERY.transitHours / 24)
    return new Date(`${delivery}T12:00:00Z`).getUTCDay() === 0 ? addDays(delivery, 1) : delivery
}

/**
 * Numero d'ordine progressivo nella giornata. Prima di quelli del visitatore ci sono gli ordini
 * di altri clienti (simulati): da 18 a 57, sempre gli stessi per lo stesso giorno.
 */
function orderNumber(day: string) {
    const others = 18 + Math.floor(seededRandom(day)() * 40)
    const own = orders.read().filter((order) => order.createdAt.startsWith(day)).length
    return `LNF-${day.replaceAll('-', '').slice(2)}-${String(others + own + 1).padStart(3, '0')}`
}

/** Controlla un codice sconto; fallisce con `InvalidCodeError` se non esiste. */
export function validateDiscountCode(input: string): Promise<DiscountCode> {
    return delay(() => checkCode(input))
}

/**
 * Registra l'ordine e restituisce la conferma. Fallisce con `EmptyOrderError` se non ci sono
 * piante valide, con `InvalidCodeError` se il codice non è valido.
 */
export function submitOrder(request: OrderRequest): Promise<Order> {
    return delay(() => {
        const lines = request.lines.flatMap((line) => {
            const plant = findPlant(line.slug)
            return plant && line.qty > 0 ? [{ ...line, price: plant.price }] : []
        })
        if (lines.length === 0) throw new EmptyOrderError()
        const code = request.code ? checkCode(request.code) : null

        const day = todayInItaly()
        const order: Order = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            number: orderNumber(day),
            // Data in ora italiana e orario reale: serve solo a raggruppare gli ordini per giorno.
            createdAt: `${day}T${new Date().toISOString().slice(11)}`,
            deliveryBy: deliveryDate(day),
            lines,
            code,
            totals: getTotals({ lines, code }),
        }
        orders.write([...orders.read(), order])
        return order
    })
}
