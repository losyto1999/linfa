import { ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface BackToPortfolioProps {
    to: string
}

const HINT_DELAY_MS = 800
const HINT_DURATION_MS = 5000

/**
 * Pillola fissa in alto a sinistra per uscire da una demo e tornare al portfolio.
 * Colori e font sono valori fissi, non i token del sito: il CSS della demo, caricato insieme
 * a index.css, potrebbe ridefinire utility come font-mono. Ingombro e classi in px con "!"
 * sono gli stessi di sempre, perché le demo lasciano spazio alla pillola (vedi quadra.css).
 */
export function BackToPortfolio({ to }: BackToPortfolioProps) {
    const { t } = useTranslation()
    const [hintVisible, setHintVisible] = useState(false)
    const reduceMotion = useReducedMotion()

    // Il fumetto compare poco dopo l'ingresso nella demo e sparisce da solo dopo 5 secondi, anche se si passa sul pulsante.
    useEffect(() => {
        const show = setTimeout(() => setHintVisible(true), HINT_DELAY_MS)
        const hide = setTimeout(() => setHintVisible(false), HINT_DELAY_MS + HINT_DURATION_MS)
        return () => {
            clearTimeout(show)
            clearTimeout(hide)
        }
    }, [])

    return (
        <div className="pointer-events-none fixed left-4 top-4 z-50 flex flex-col! items-start! sm:flex-row! sm:items-center!">
            <Link
                to={to}
                aria-label={t('backToPortfolio.label')}
                className="pointer-events-auto inline-flex items-center gap-[6px]! rounded-full bg-[#0b0f14]/90 p-[8px]! text-[#e6edf3] shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] ring-1 ring-[#2b3742] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-[#0b0f14] sm:gap-[8px]! sm:p-[12px]!"
            >
                <span
                    aria-hidden="true"
                    className="grid size-[28px]! place-items-center font-['JetBrains_Mono_Variable',monospace] text-[14px]! leading-none! font-medium text-[#4ade80] sm:size-[36px]! sm:text-[17px]!"
                >
                    ~/
                </span>
                <ArrowLeft className="size-[16px]! sm:size-[20px]!" />
            </Link>
            <AnimatePresence>
                {hintVisible && (
                    <motion.div
                        aria-hidden="true"
                        initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                        transition={{ duration: 0.25 }}
                        className="relative mt-[12px]! ml-0! max-w-[calc(100vw-32px)] sm:mt-0! sm:ml-[12px]! rounded-xl bg-[#4ade80] px-3! py-2! text-[12px]! font-semibold leading-[1.35]! text-[#0b0f14]! shadow-[0_8px_24px_-6px_rgb(0_0_0/0.45)] ring-2 ring-[#0b0f14] sm:max-w-none sm:whitespace-nowrap sm:px-5! sm:py-3! sm:text-[17px]!"
                    >
                        <span className="absolute -top-[4px]! left-[33px]! size-[10px]! -translate-x-1/2 rotate-45 bg-[#4ade80] sm:top-1/2! sm:left-[-4px]! sm:translate-x-0 sm:-translate-y-1/2" />
                        {t('backToPortfolio.hint')}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
