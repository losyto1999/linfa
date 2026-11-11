import { CircleAlert, LoaderCircle, Tag } from 'lucide-react'
import { useAnimate, useReducedMotion } from 'motion/react'
import type { FormEvent } from 'react'
import { useId, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { InvalidCodeError } from '../../api/checkout'
import { useCart } from '../../cart/CartContext'
import { DISCOUNT } from '../../data/shop'

/** Errore del campo: resta un dato, il testo si sceglie al render nella lingua attiva. */
type CodeError = { kind: 'empty' } | { kind: 'invalid'; typed: string } | { kind: 'unknown' }

const ERROR_KEYS: Record<CodeError['kind'], string> = {
    empty: 'code.empty',
    invalid: 'code.invalid',
    unknown: 'code.unknown',
}

/** Campo del codice sconto; una volta applicato diventa un'etichetta con «Rimuovi». */
export function DiscountCode() {
    const { t } = useTranslation()
    const { code, applyCode, removeCode } = useCart()
    const [value, setValue] = useState('')
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<CodeError | null>(null)
    const [scope, animate] = useAnimate<HTMLDivElement>()
    const reduce = useReducedMotion()
    const id = useId()

    function reject(next: CodeError) {
        setError(next)
        // Una piccola scossa: il codice è stato letto, ma rifiutato.
        if (!reduce && scope.current) {
            animate(scope.current, { x: [0, -7, 6, -4, 3, 0] }, { duration: 0.38, ease: 'easeOut' })
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (pending) return
        // Il campo vuoto si controlla qui, senza disturbare il server.
        if (!value.trim()) return reject({ kind: 'empty' })
        setPending(true)
        setError(null)
        try {
            await applyCode(value)
            setValue('')
        } catch (err) {
            if (err instanceof InvalidCodeError) reject({ kind: 'invalid', typed: err.typed })
            else reject({ kind: 'unknown' })
        } finally {
            setPending(false)
        }
    }

    if (code) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-polpa-200 px-3.5 py-2.5">
                <p className="flex items-center gap-2 text-sm text-nocciolo-800">
                    <Tag aria-hidden="true" className="size-4 shrink-0" />
                    <span>
                        <strong className="font-semibold tracking-wide">{code}</strong> · −{DISCOUNT.percent}%
                        <span className="sr-only">{t('code.appliedSr')}</span>
                    </span>
                </p>
                <button
                    type="button"
                    onClick={removeCode}
                    className="rounded-md px-1.5 py-1 text-sm font-medium text-nocciolo-800 underline decoration-nocciolo-700/40 decoration-2 underline-offset-4 transition-colors hover:decoration-nocciolo-800"
                >
                    {t('code.remove')}
                    <span className="sr-only">{t('code.removeSr')}</span>
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                <label htmlFor={`${id}-codice`} className="font-semibold text-nocciolo-800">
                    {t('code.label')}
                </label>
                <p id={`${id}-aiuto`} className="text-nocciolo-500">
                    <Trans
                        t={t}
                        i18nKey="code.try"
                        values={{ code: DISCOUNT.code }}
                        components={{ strong: <strong className="font-semibold text-nocciolo-700" /> }}
                    />
                </p>
            </div>
            <div ref={scope} className="mt-2 flex gap-2">
                <input
                    id={`${id}-codice`}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                        if (error) setError(null)
                    }}
                    readOnly={pending}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-errore` : `${id}-aiuto`}
                    placeholder={t('code.placeholder')}
                    className={`h-11 min-w-0 flex-1 rounded-lg bg-polpa-25 px-3 uppercase tracking-wide text-nocciolo-800 ring-1 transition-shadow placeholder:normal-case placeholder:tracking-normal placeholder:text-nocciolo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-buccia-600 ${
                        error ? 'ring-2 ring-nocciolo-700' : 'ring-argilla-300'
                    }`}
                />
                <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-polpa-25 px-4 font-semibold text-buccia-700 ring-1 ring-buccia-600 transition-colors hover:bg-buccia-600 hover:text-polpa-50 disabled:cursor-wait disabled:bg-polpa-25 disabled:text-buccia-700"
                >
                    {pending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />}
                    {pending ? t('code.checking') : t('code.apply')}
                </button>
            </div>
            <p id={`${id}-errore`} role="alert" className="text-sm font-medium text-nocciolo-700 empty:hidden">
                {error && (
                    <span className="mt-2 flex items-start gap-1.5">
                        <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                        {t(ERROR_KEYS[error.kind], {
                            typed: error.kind === 'invalid' ? error.typed : '',
                            code: DISCOUNT.code,
                        })}
                    </span>
                )}
            </p>
        </form>
    )
}
