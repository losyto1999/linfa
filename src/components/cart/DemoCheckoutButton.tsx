import { ArrowRight, Info } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const NOTICE_MS = 7000

/** Pulsante di checkout dimostrativo: non porta da nessuna parte, spiega che è una demo. */
export function DemoCheckoutButton() {
    const { t } = useTranslation('linfa')
    const [shownAt, setShownAt] = useState(0)

    useEffect(() => {
        if (!shownAt) return
        const id = setTimeout(() => setShownAt(0), NOTICE_MS)
        return () => clearTimeout(id)
    }, [shownAt])

    return (
        <div>
            {/* Mockato: progetto dimostrativo, nessun ordine viene inviato. */}
            <button
                type="button"
                onClick={() => setShownAt(Date.now())}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-buccia-600 font-semibold text-polpa-50 transition-colors hover:bg-buccia-800 active:translate-y-px"
            >
                {t('cart.checkout')}
                <ArrowRight
                    aria-hidden="true"
                    className="size-4.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
            </button>
            <div role="status">
                <AnimatePresence>
                    {shownAt > 0 && (
                        <motion.p
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 flex gap-2.5 rounded-xl bg-polpa-200 px-3.5 py-3 text-sm leading-snug text-nocciolo-800"
                        >
                            <Info aria-hidden="true" className="mt-px size-4 shrink-0" />
                            <span>{t('cart.demoNote')}</span>
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
