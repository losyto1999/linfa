import { Check, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_QTY } from '../cart/cart'
import { useCart } from '../cart/CartContext'
import type { Plant } from '../data/plants'
import { plantName } from '../data/plants'

const CONFIRM_MS = 1500

/** «Aggiungi» che per un attimo diventa «Aggiunta», così il clic ha una risposta dove lo si fa. */
export function AddToCartButton({ plant }: { plant: Plant }) {
    const { t } = useTranslation('linfa')
    const { add, qtyOf } = useCart()
    // Cambia a ogni clic: fa ripartire la conferma anche con clic ravvicinati.
    const [addedAt, setAddedAt] = useState(0)
    const atMax = qtyOf(plant.slug) >= MAX_QTY

    useEffect(() => {
        if (!addedAt) return
        const id = setTimeout(() => setAddedAt(0), CONFIRM_MS)
        return () => clearTimeout(id)
    }, [addedAt])

    const state = atMax ? 'max' : addedAt ? 'added' : 'idle'

    return (
        <button
            type="button"
            disabled={atMax}
            onClick={() => {
                add(plant.slug)
                setAddedAt(Date.now())
            }}
            className={`relative inline-flex h-11 min-w-34 items-center justify-center overflow-hidden rounded-lg px-4 font-semibold transition-colors active:translate-y-px disabled:cursor-not-allowed ${
                state === 'added'
                    ? 'bg-buccia-800 text-polpa-50'
                    : 'bg-buccia-600 text-polpa-50 hover:bg-buccia-800 disabled:bg-argilla-100 disabled:text-nocciolo-700'
            }`}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={state}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="inline-flex items-center gap-2"
                >
                    {state === 'added' ? (
                        <Check aria-hidden="true" className="size-4.5" strokeWidth={2.6} />
                    ) : state === 'idle' ? (
                        <Plus aria-hidden="true" className="size-4.5" strokeWidth={2.6} />
                    ) : null}
                    {state === 'added' ? t('addToCart.added') : state === 'idle' ? t('addToCart.add') : t('addToCart.max', { max: MAX_QTY })}
                    <span className="sr-only">{t('addToCart.sr', { name: plantName(plant.slug) })}</span>
                </motion.span>
            </AnimatePresence>
        </button>
    )
}
