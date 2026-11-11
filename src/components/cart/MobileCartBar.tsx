import { ShoppingBasket } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../cart/CartContext'
import { useRecentlyAdded } from '../../cart/useRecentlyAdded'
import { findPlant, formatEuro, plantName } from '../../data/plants'
import { AnimatedNumber } from '../AnimatedNumber'
import { CountBadge } from './CountBadge'

/** Barra fissa in basso nel catalogo su mobile: numero di piante, totale, apre il carrello. */
export function MobileCartBar() {
    const { t } = useTranslation()
    const { totals, openCart } = useCart()
    const { recent } = useRecentlyAdded(2200)
    const added = recent ? findPlant(recent.slug) : undefined

    const label = added
        ? t('cart.addedBar', { name: plantName(added.slug) })
        : totals.count === 0
          ? t('cart.emptyTitle')
          : t('cart.view')

    return (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-argilla-200 bg-polpa-50/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
            <button
                type="button"
                onClick={openCart}
                className="flex h-13 w-full items-center gap-4 rounded-xl bg-buccia-600 px-4 text-polpa-50 transition-colors active:bg-buccia-800"
            >
                <span className="relative">
                    <ShoppingBasket aria-hidden="true" className="size-6" />
                    <CountBadge count={totals.count} onDark />
                </span>
                <span className="min-w-0 flex-1 overflow-hidden text-left font-semibold">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.16 }}
                            className="block truncate"
                        >
                            {label}
                        </motion.span>
                    </AnimatePresence>
                    <span className="sr-only">{t('cart.barSr', { plants: t('plantCount', { count: totals.count }) })}</span>
                </span>
                {totals.count > 0 && <AnimatedNumber value={totals.total} format={formatEuro} className="font-semibold" />}
            </button>
        </div>
    )
}
