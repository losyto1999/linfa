import { ArrowRight, X } from 'lucide-react'
import { AnimatePresence, useAnimate } from 'motion/react'
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SHIPPING } from '../../cart/cart'
import { useCart } from '../../cart/CartContext'
import { formatEuro, plantName } from '../../data/plants'
import { PlantArt } from '../PlantArt'
import { CartLineItem } from './CartLineItem'
import { CartTotals } from './CartTotals'
import { DemoCheckoutButton } from './DemoCheckoutButton'
import { DiscountCode } from './DiscountCode'
import { ShippingProgress } from './ShippingProgress'

interface CartSummaryProps {
    /** `sidebar`: fisso accanto alla griglia del catalogo; `drawer`: dentro il pannello a scomparsa. */
    variant: 'sidebar' | 'drawer'
    onClose?: () => void
}

/** Contenuto del carrello, uguale nella colonna del catalogo e nel pannello a scomparsa. */
export function CartSummary({ variant, onClose }: CartSummaryProps) {
    const { t } = useTranslation('linfa')
    const { lines, totals, removed, undoRemove, summaryPing } = useCart()
    const titleId = useId()
    const titleRef = useRef<HTMLHeadingElement>(null)
    const [scope, animate] = useAnimate<HTMLElement>()

    // Clic sull'icona dell'header quando il riepilogo è già in pagina: lo indica con un alone
    // (solo colore) e ci porta il focus.
    useEffect(() => {
        if (variant !== 'sidebar' || !summaryPing || !scope.current) return
        titleRef.current?.focus({ preventScroll: true })
        animate(
            scope.current,
            { outlineColor: ['rgba(107, 140, 33, 0.8)', 'rgba(107, 140, 33, 0)'] },
            { duration: 1.2, ease: 'easeOut' },
        )
    }, [variant, summaryPing, animate, scope])

    const empty = lines.length === 0

    return (
        <section
            ref={scope}
            aria-labelledby={titleId}
            className={`flex min-h-0 flex-col ${
                variant === 'sidebar'
                    ? 'max-h-[calc(100dvh-7.5rem)] rounded-2xl bg-polpa-25 p-5 shadow-vaso ring-1 ring-argilla-200 outline-4 outline-offset-4 outline-transparent'
                    : 'h-full p-5'
            }`}
        >
            <header className="flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-3">
                    <h2 id={titleId} ref={titleRef} tabIndex={-1} className="text-2xl font-semibold focus:outline-none">
                        {t('cart.title')}
                    </h2>
                    {!empty && (
                        <span className="text-sm text-nocciolo-500">
                            {t('plantCount', { count: totals.count })}
                        </span>
                    )}
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('cart.close')}
                        className="grid size-10 place-items-center rounded-lg text-nocciolo-800 transition-colors hover:bg-polpa-100"
                    >
                        <X aria-hidden="true" className="size-5" />
                    </button>
                )}
            </header>

            {removed && (
                <p className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-argilla-50 px-3 py-2 text-sm">
                    <span>{t('cart.removed', { name: plantName(removed.line.slug) })}</span>
                    <button
                        type="button"
                        onClick={undoRemove}
                        className="rounded-md px-1.5 py-0.5 font-semibold text-buccia-700 underline decoration-2 underline-offset-4"
                    >
                        {t('cart.undo')}
                    </button>
                </p>
            )}

            {empty ? (
                <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                    <PlantArt art="vuoto" tint="polpa" className="h-32 w-26 overflow-hidden rounded-t-full rounded-b-lg" />
                    <p className="mt-5 font-display text-xl font-semibold text-nocciolo-800">{t('cart.emptyTitle')}</p>
                    <p className="mt-2 max-w-64 text-sm leading-relaxed">
                        {t('cart.emptyText', { freeFrom: formatEuro(SHIPPING.freeFrom) })}
                    </p>
                    {variant === 'drawer' && (
                        <Link
                            to="/linfa/piante"
                            onClick={onClose}
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-buccia-600 px-5 font-semibold text-polpa-50 transition-colors hover:bg-buccia-800"
                        >
                            {t('cart.browse')}
                            <ArrowRight aria-hidden="true" className="size-4.5" />
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="mt-4">
                        <ShippingProgress subtotal={totals.subtotal} />
                    </div>

                    {/* Dalla più recente: chi ha appena aggiunto una pianta la trova in cima. */}
                    <ul className="-mx-2 mt-2 min-h-28 flex-1 overflow-y-auto overscroll-contain">
                        <AnimatePresence initial={false}>
                            {[...lines].reverse().map((line) => (
                                <CartLineItem key={line.slug} line={line} />
                            ))}
                        </AnimatePresence>
                    </ul>

                    <div className="mt-3 space-y-5 border-t border-argilla-200 pt-5">
                        <DiscountCode />
                        <CartTotals />
                        <DemoCheckoutButton />
                    </div>
                </>
            )}
        </section>
    )
}
