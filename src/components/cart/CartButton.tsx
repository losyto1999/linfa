import { ShoppingBasket } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMatch } from 'react-router-dom'
import { useCart } from '../../cart/CartContext'
import { DESKTOP, useMediaQuery } from '../../useMediaQuery'
import { CountBadge } from './CountBadge'

/**
 * Carrello nell'header. Apre il pannello a scomparsa, tranne nel catalogo su desktop, dove
 * il riepilogo è già accanto alla griglia: lì lo indica.
 */
export function CartButton() {
    const { t } = useTranslation('linfa')
    const { totals, openCart, pingSummary } = useCart()
    const onCatalog = useMatch('/linfa/piante')
    const desktop = useMediaQuery(DESKTOP)
    const summaryInPage = Boolean(onCatalog) && desktop

    return (
        <button
            type="button"
            onClick={summaryInPage ? pingSummary : openCart}
            aria-label={t('cart.basketWithCount', { plants: t('plantCount', { count: totals.count }) })}
            className="inline-flex h-11 items-center gap-3.5 rounded-lg px-2.5 font-semibold text-nocciolo-800 transition-colors hover:bg-polpa-100 sm:px-3"
        >
            <span className="relative">
                <ShoppingBasket aria-hidden="true" className="size-6" />
                <CountBadge count={totals.count} />
            </span>
            <span className="hidden sm:inline">{t('cart.label')}</span>
        </button>
    )
}
