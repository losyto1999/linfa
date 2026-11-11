import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DISCOUNT } from '../../data/shop'
import { useCart } from '../../cart/CartContext'
import { formatEuro } from '../../data/plants'
import { AnimatedNumber } from '../AnimatedNumber'

function Row({ label, children, className = '' }: { label: ReactNode; children: ReactNode; className?: string }) {
    return (
        <div className={`flex items-baseline justify-between gap-4 ${className}`}>
            <dt>{label}</dt>
            <dd>{children}</dd>
        </div>
    )
}

/** Subtotale, sconto, spedizione e totale: le cifre scorrono quando cambiano. */
export function CartTotals() {
    const { t } = useTranslation()
    const { totals, code } = useCart()
    const reduce = useReducedMotion()

    return (
        <div>
            <dl className="space-y-1.5 text-[0.95rem]">
                <Row label={t('cart.subtotal')}>
                    <AnimatedNumber value={totals.subtotal} format={formatEuro} />
                </Row>
                <AnimatePresence initial={false}>
                    {code && (
                        // La riga stessa (div con dt/dd) si apre in altezza: il dl resta valido.
                        <motion.div
                            key="sconto"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
                            className="flex items-baseline justify-between gap-4 overflow-hidden font-medium text-foglia-700"
                        >
                            <dt>
                                {t('cart.discount', { code: DISCOUNT.code, percent: DISCOUNT.percent })}
                            </dt>
                            <dd>
                                <AnimatedNumber value={totals.discount} format={(cents) => `−${formatEuro(cents)}`} />
                            </dd>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Row label={t('cart.shipping')}>
                    {totals.shipping === 0 ? (
                        <span className="font-medium text-buccia-700">{t('cart.free')}</span>
                    ) : (
                        <AnimatedNumber value={totals.shipping} format={formatEuro} />
                    )}
                </Row>
                <Row
                    label={
                        <>
                            {t('cart.total')}{' '}
                            <span className="font-sans text-xs font-normal text-nocciolo-500">{t('cart.vat')}</span>
                        </>
                    }
                    className="mt-3! border-t border-argilla-200 pt-3 font-display text-xl font-semibold text-nocciolo-800"
                >
                    <AnimatedNumber value={totals.total} format={formatEuro} />
                </Row>
            </dl>
        </div>
    )
}
