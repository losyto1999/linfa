import { ArrowRight, CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Order } from '../../api/checkout'
import { formatEuro } from '../../data/plants'
import { useLocale } from '../../i18n/locale'

interface OrderConfirmationProps {
    order: Order
    /** Nel pannello a scomparsa: chiude il pannello e porta al catalogo. */
    onContinue?: () => void
    onDismiss: () => void
}

/** Conferma dell'ordine simulato, al posto del carrello vuoto. */
export function OrderConfirmation({ order, onContinue, onDismiss }: OrderConfirmationProps) {
    const { t } = useTranslation()
    const { locale } = useLocale()
    const delivery = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC',
    }).format(new Date(`${order.deliveryBy}T12:00:00Z`))
    const count = order.lines.reduce((n, line) => n + line.qty, 0)

    return (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <CircleCheck aria-hidden="true" className="size-12 text-buccia-600" strokeWidth={1.75} />
            <p className="mt-4 font-display text-2xl font-semibold text-nocciolo-800 [font-variation-settings:'SOFT'_100]">
                {t('order.title')}
            </p>
            <p className="mt-1 text-sm text-nocciolo-500">
                {t('order.number')} <strong className="font-semibold tracking-wide text-nocciolo-800">{order.number}</strong>
            </p>
            <dl className="mt-5 w-full max-w-72 space-y-1.5 rounded-xl bg-polpa-100 px-4 py-3 text-left text-sm">
                <div className="flex justify-between gap-4">
                    <dt>{t('order.items')}</dt>
                    <dd className="font-semibold text-nocciolo-800">{t('plantCount', { count })}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt>{t('order.total')}</dt>
                    <dd className="font-semibold tabular-nums text-nocciolo-800">{formatEuro(order.totals.total)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt>{t('order.delivery')}</dt>
                    <dd className="text-right font-semibold text-nocciolo-800">{delivery}</dd>
                </div>
            </dl>
            <p className="mt-4 max-w-72 text-sm leading-relaxed">{t('order.demoNote')}</p>
            {onContinue ? (
                <Link
                    to="/piante"
                    onClick={onContinue}
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-buccia-600 px-5 font-semibold text-polpa-50 transition-colors hover:bg-buccia-800"
                >
                    {t('order.continue')}
                    <ArrowRight aria-hidden="true" className="size-4.5" />
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg px-4 font-semibold text-buccia-700 ring-1 ring-buccia-600 transition-colors hover:bg-buccia-600 hover:text-polpa-50"
                >
                    {t('order.close')}
                </button>
            )}
        </div>
    )
}
