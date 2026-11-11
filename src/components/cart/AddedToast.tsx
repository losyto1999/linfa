import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../cart/CartContext'
import { useRecentlyAdded } from '../../cart/useRecentlyAdded'
import { findPlant, plantName } from '../../data/plants'
import { PlantArt } from '../PlantArt'

/**
 * Avviso sotto l'icona del carrello dopo un'aggiunta, nelle pagine dove il riepilogo non si
 * vede (la home). Il testo per gli screen reader lo legge già CartProvider.
 */
export function AddedToast() {
    const { t } = useTranslation()
    const { openCart } = useCart()
    const { recent, dismiss } = useRecentlyAdded(3500)
    const plant = recent ? findPlant(recent.slug) : undefined

    return (
        <AnimatePresence>
            {plant && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-polpa-25 p-3 shadow-vaso ring-1 ring-argilla-200"
                >
                    <div className="flex items-center gap-3">
                        <PlantArt
                            art={plant.art}
                            tint={plant.tint}
                            image={plant.image}
                            className="h-15 w-12 shrink-0 overflow-hidden rounded-t-full rounded-b-md"
                        />
                        <p className="text-sm leading-snug">
                            <span className="flex items-center gap-1.5 font-semibold text-buccia-700">
                                <Check aria-hidden="true" className="size-4" strokeWidth={2.6} />
                                {t('cart.added')}
                            </span>
                            <span className="font-display text-base font-semibold text-nocciolo-800">{plantName(plant.slug)}</span>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            dismiss()
                            openCart()
                        }}
                        className="mt-3 h-10 w-full rounded-lg bg-buccia-600 text-sm font-semibold text-polpa-50 transition-colors hover:bg-buccia-800"
                    >
                        {t('cart.view')}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
