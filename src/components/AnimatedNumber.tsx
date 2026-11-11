import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

interface AnimatedNumberProps {
    value: number
    format?: (value: number) => string
    className?: string
}

/**
 * Numero che, quando cambia, scorre verso l'alto se aumenta e verso il basso se diminuisce.
 * Con reduced motion resta solo la dissolvenza (MotionConfig nel layout).
 */
export function AnimatedNumber({ value, format = String, className = '' }: AnimatedNumberProps) {
    // Direzione rispetto al valore precedente (stato aggiornato durante il render, come
    // suggerisce React per i valori derivati dal prop precedente).
    const [previous, setPrevious] = useState(value)
    const [direction, setDirection] = useState(1)
    if (value !== previous) {
        setPrevious(value)
        setDirection(value > previous ? 1 : -1)
    }

    const text = format(value)

    return (
        <span className={`relative inline-flex overflow-hidden tabular-nums ${className}`}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                    key={text}
                    custom={direction}
                    variants={{
                        enter: (d: number) => ({ y: `${d * 70}%`, opacity: 0 }),
                        center: { y: 0, opacity: 1 },
                        exit: (d: number) => ({ y: `${d * -70}%`, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="inline-block whitespace-nowrap"
                >
                    {text}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}
