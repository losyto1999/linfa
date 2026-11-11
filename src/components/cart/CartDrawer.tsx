import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../cart/CartContext'
import { CartSummary } from './CartSummary'

/**
 * Carrello a scomparsa: foglio dal basso su mobile, pannello da destra da lg in su.
 * È un <dialog> modale: focus intrappolato, Esc per chiudere e ritorno del focus al pulsante
 * li gestisce il browser. Entrata e uscita sono transizioni CSS (@starting-style).
 */
export function CartDrawer() {
    const { t } = useTranslation('linfa')
    const { isOpen, closeCart } = useCart()
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        if (isOpen && !dialog.open) dialog.showModal()
        if (!isOpen && dialog.open) dialog.close()
    }, [isOpen])

    return (
        <dialog
            ref={ref}
            aria-label={t('cart.label')}
            onClose={closeCart}
            // Il contenuto riempie tutto il dialog: un clic sul dialog stesso è un clic sullo sfondo.
            onClick={(e) => {
                if (e.target === e.currentTarget) closeCart()
            }}
            className="linfa-drawer fixed inset-x-0 top-auto bottom-0 m-0 h-[88dvh] max-h-none w-full max-w-none translate-y-full rounded-t-2xl bg-polpa-25 text-nocciolo-700 shadow-vaso transition-[translate,display,overlay] transition-discrete duration-300 ease-out backdrop:bg-nocciolo-900/40 backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-300 open:translate-y-0 open:backdrop:opacity-100 starting:open:translate-y-full starting:open:backdrop:opacity-0 motion-reduce:transition-none motion-reduce:backdrop:transition-none lg:top-0 lg:right-0 lg:left-auto lg:h-dvh lg:w-[27rem] lg:translate-x-full lg:translate-y-0 lg:rounded-none lg:rounded-l-2xl lg:open:translate-x-0 lg:starting:open:translate-x-full lg:starting:open:translate-y-0"
        >
            <div className="flex h-full flex-col">
                <CartSummary variant="drawer" onClose={closeCart} />
            </div>
        </dialog>
    )
}
