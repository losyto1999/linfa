import { motion } from 'motion/react'
import { useState } from 'react'

interface CountBadgeProps {
    count: number
    /** Colori per il pulsante verde della barra mobile invece che per il fondo chiaro. */
    onDark?: boolean
}

/** Numero di piante sull'icona del carrello: fa un piccolo salto quando cambia. */
export function CountBadge({ count, onDark = false }: CountBadgeProps) {
    // Niente salto al primo render (es. carrello ripreso da localStorage), solo ai cambi:
    // ogni cambio rimonta lo span con una chiave nuova.
    const [previous, setPrevious] = useState(count)
    const [changes, setChanges] = useState(0)
    if (count !== previous) {
        setPrevious(count)
        setChanges((n) => n + 1)
    }

    if (count === 0) return null

    return (
        <motion.span
            key={changes}
            aria-hidden="true"
            initial={changes > 0 ? { scale: 1.6 } : false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 15 }}
            className={`absolute -right-2.5 -top-2 grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold tabular-nums ${
                onDark ? 'bg-polpa-300 text-nocciolo-900' : 'bg-buccia-600 text-polpa-50'
            }`}
        >
            {count}
        </motion.span>
    )
}
