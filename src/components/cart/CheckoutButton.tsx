import { ArrowRight, CircleAlert, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyOrderError, InvalidCodeError } from '../../api/checkout'
import { useCart } from '../../cart/CartContext'
import { DISCOUNT } from '../../data/shop'

type CheckoutError = 'code' | 'empty' | 'unknown'

const ERROR_KEYS: Record<CheckoutError, string> = {
    code: 'checkout.errorCode',
    empty: 'checkout.errorEmpty',
    unknown: 'checkout.errorUnknown',
}

/**
 * Conferma dell'ordine, mockata: l'ordine passa dall'API simulata (src/api/checkout.ts), nessun
 * pagamento e nessun dato inviato. Se va a buon fine il carrello si svuota e mostra la conferma.
 */
export function CheckoutButton() {
    const { t } = useTranslation()
    const { placeOrder } = useCart()
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<CheckoutError | null>(null)

    async function handleClick() {
        if (pending) return
        setPending(true)
        setError(null)
        try {
            await placeOrder()
        } catch (err) {
            if (err instanceof InvalidCodeError) setError('code')
            else if (err instanceof EmptyOrderError) setError('empty')
            else setError('unknown')
        } finally {
            setPending(false)
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                disabled={pending}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-buccia-600 font-semibold text-polpa-50 transition-colors hover:bg-buccia-800 active:translate-y-px disabled:cursor-wait disabled:bg-buccia-800"
            >
                {pending ? (
                    <>
                        <LoaderCircle aria-hidden="true" className="size-4.5 animate-spin motion-reduce:animate-none" />
                        {t('checkout.sending')}
                    </>
                ) : (
                    <>
                        {t('checkout.submit')}
                        <ArrowRight
                            aria-hidden="true"
                            className="size-4.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                        />
                    </>
                )}
            </button>
            <p role="alert" className="text-sm font-medium text-nocciolo-700 empty:hidden">
                {error && (
                    <span className="mt-3 flex items-start gap-1.5">
                        <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                        {t(ERROR_KEYS[error], { code: DISCOUNT.code })}
                    </span>
                )}
            </p>
            <p className="mt-2.5 text-center text-xs text-nocciolo-500">{t('checkout.note')}</p>
        </div>
    )
}
