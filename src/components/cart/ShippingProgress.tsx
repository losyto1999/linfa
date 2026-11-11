import { Check, Truck } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Trans, useTranslation } from 'react-i18next'
import { SHIPPING } from '../../cart/cart'
import { formatEuro } from '../../data/plants'

/** Barra da 0 a 49,99 €: quanto manca alla spedizione gratuita (misurata sul subtotale). */
export function ShippingProgress({ subtotal }: { subtotal: number }) {
    const { t } = useTranslation('linfa')
    const reduce = useReducedMotion()
    const reached = Math.min(subtotal, SHIPPING.freeFrom)
    const missing = SHIPPING.freeFrom - reached

    return (
        <div className="rounded-xl bg-polpa-100 px-3.5 pb-3.5 pt-3">
            <p className="flex items-start gap-2 text-sm leading-snug">
                {missing > 0 ? (
                    <>
                        <Truck aria-hidden="true" className="mt-px size-4 shrink-0 text-foglia-700" />
                        <span>
                            <Trans
                                t={t}
                                i18nKey="cart.shippingMissing"
                                values={{ missing: formatEuro(missing), freeFrom: formatEuro(SHIPPING.freeFrom) }}
                                components={{ strong: <strong className="font-semibold tabular-nums" /> }}
                            />
                        </span>
                    </>
                ) : (
                    <>
                        <Check aria-hidden="true" className="mt-px size-4 shrink-0 text-buccia-700" strokeWidth={2.6} />
                        <span className="font-semibold text-buccia-700">{t('cart.shippingReached')}</span>
                    </>
                )}
            </p>
            <div
                role="progressbar"
                aria-label={t('cart.shippingLabel')}
                aria-valuemin={0}
                aria-valuemax={SHIPPING.freeFrom / 100}
                aria-valuenow={reached / 100}
                aria-valuetext={t('cart.shippingValue', { reached: formatEuro(reached), freeFrom: formatEuro(SHIPPING.freeFrom) })}
                className="mt-2.5 h-2 overflow-hidden rounded-full bg-argilla-200"
            >
                <motion.div
                    className="h-full rounded-full bg-foglia-500"
                    initial={false}
                    animate={{ width: `${(reached / SHIPPING.freeFrom) * 100}%` }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 24 }}
                />
            </div>
        </div>
    )
}
