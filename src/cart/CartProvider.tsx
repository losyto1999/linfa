import type { ReactNode } from 'react'
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { demoT } from '../i18n/demo'
import { plantName } from '../data/plants'
import { cartReducer, checkCode, DISCOUNT, getTotals, loadCart, MAX_QTY, saveCart, STORAGE_KEY } from './cart'
import type { CartContextValue, RemovedLine } from './CartContext'
import { CartContext } from './CartContext'

const UNDO_MS = 6000

// Le frasi per gli screen reader si costruiscono al momento dell'azione, nella lingua attiva.
const t = (key: string, options?: Record<string, unknown>) => demoT('linfa')(key, options)

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, undefined, loadCart)
    const [removed, setRemoved] = useState<RemovedLine | null>(null)
    const [lastAdded, setLastAdded] = useState<CartContextValue['lastAdded']>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [summaryPing, setSummaryPing] = useState(0)
    // Testo letto dagli screen reader a ogni modifica (regione aria-live qui sotto).
    const [announcement, setAnnouncement] = useState('')
    const addCounter = useRef(0)

    const totals = useMemo(() => getTotals(state), [state])

    useEffect(() => saveCart(state), [state])

    // Due schede aperte sulla demo restano allineate.
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) dispatch({ type: 'replace', state: loadCart() })
        }
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    useEffect(() => {
        if (!removed) return
        const id = setTimeout(() => setRemoved(null), UNDO_MS)
        return () => clearTimeout(id)
    }, [removed])

    const value = useMemo<CartContextValue>(() => {
        const qtyOf = (slug: string) => state.lines.find((l) => l.slug === slug)?.qty ?? 0

        return {
            lines: state.lines,
            code: state.code,
            totals,
            qtyOf,
            add(slug) {
                dispatch({ type: 'add', slug })
                addCounter.current += 1
                setLastAdded({ slug, id: addCounter.current })
                const count = qtyOf(slug) < MAX_QTY ? totals.count + 1 : totals.count
                setAnnouncement(t('announce.added', { name: plantName(slug), plants: t('plantCount', { count }) }))
            },
            setQty(slug, qty) {
                dispatch({ type: 'setQty', slug, qty })
                setAnnouncement(t('announce.quantity', { name: plantName(slug), qty }))
            },
            remove(slug) {
                const index = state.lines.findIndex((l) => l.slug === slug)
                if (index === -1) return
                dispatch({ type: 'remove', slug })
                setRemoved({ line: state.lines[index], index })
                setAnnouncement(t('announce.removed', { name: plantName(slug) }))
            },
            removed,
            undoRemove() {
                if (!removed) return
                dispatch({ type: 'restore', line: removed.line, index: removed.index })
                setAnnouncement(t('announce.restored', { name: plantName(removed.line.slug) }))
                setRemoved(null)
            },
            applyCode(input) {
                const result = checkCode(input)
                if (result.ok) {
                    dispatch({ type: 'applyCode' })
                    setAnnouncement(t('announce.codeApplied', { code: DISCOUNT.code, percent: DISCOUNT.percent }))
                }
                return result
            },
            removeCode() {
                dispatch({ type: 'removeCode' })
                setAnnouncement(t('announce.codeRemoved'))
            },
            lastAdded,
            isOpen,
            openCart: () => setIsOpen(true),
            closeCart: () => setIsOpen(false),
            summaryPing,
            pingSummary: () => setSummaryPing((n) => n + 1),
        }
    }, [state, totals, removed, lastAdded, isOpen, summaryPing])

    return (
        <CartContext.Provider value={value}>
            {children}
            <p aria-live="polite" className="sr-only">
                {announcement}
            </p>
        </CartContext.Provider>
    )
}
