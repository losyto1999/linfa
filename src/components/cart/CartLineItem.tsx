import { Minus, Plus } from 'lucide-react'
import { motion, useAnimate, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { CartLine } from '../../cart/cart'
import { MAX_QTY } from '../../cart/cart'
import { useCart } from '../../cart/CartContext'
import { findPlant, formatEuro, plantName } from '../../data/plants'
import { PlantArt } from '../PlantArt'
import { AnimatedNumber } from '../AnimatedNumber'

const STEP =
    'grid size-9 place-items-center text-nocciolo-700 transition-colors hover:bg-polpa-100 disabled:cursor-not-allowed disabled:text-nocciolo-700/35 disabled:hover:bg-transparent'

/** Riga del carrello: entra e esce in altezza, e si illumina quando la stessa pianta viene aggiunta. */
export function CartLineItem({ line }: { line: CartLine }) {
    const { t } = useTranslation('linfa')
    const { setQty, remove, lastAdded } = useCart()
    const reduce = useReducedMotion()
    const [scope, animate] = useAnimate<HTMLDivElement>()
    const plant = findPlant(line.slug)
    const name = plantName(line.slug)

    const flashId = lastAdded?.slug === line.slug ? lastAdded.id : 0
    useEffect(() => {
        if (!flashId || !scope.current) return
        // Solo colore, niente movimento: resta anche con reduced motion.
        animate(
            scope.current,
            // polpa-300 che sfuma nella stessa tinta trasparente (niente grigio a metà strada).
            { backgroundColor: ['rgba(221, 212, 143, 1)', 'rgba(221, 212, 143, 0)'] },
            { duration: 1.4, ease: 'easeOut' },
        )
    }, [flashId, animate, scope])

    if (!plant) return null

    return (
        <motion.li
            layout={!reduce}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
        >
            <div ref={scope} className="flex gap-3 rounded-xl p-2">
                <PlantArt
                    art={plant.art}
                    tint={plant.tint}
                    image={plant.image}
                    className="h-18 w-14 shrink-0 overflow-hidden rounded-t-full rounded-b-md"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate font-display font-semibold text-nocciolo-800">{name}</p>
                        <AnimatedNumber
                            value={plant.price * line.qty}
                            format={formatEuro}
                            className="font-semibold text-nocciolo-800"
                        />
                    </div>
                    <p className="text-sm text-nocciolo-500">{t('cart.each', { price: formatEuro(plant.price) })}</p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center overflow-hidden rounded-lg ring-1 ring-argilla-300">
                            <button
                                type="button"
                                onClick={() => setQty(line.slug, line.qty - 1)}
                                disabled={line.qty <= 1}
                                aria-label={t('cart.decrease', { name })}
                                className={STEP}
                            >
                                <Minus aria-hidden="true" className="size-4" />
                            </button>
                            <span className="w-8 text-center font-semibold tabular-nums">
                                <span className="sr-only">{t('cart.quantity')}</span>
                                {line.qty}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQty(line.slug, line.qty + 1)}
                                disabled={line.qty >= MAX_QTY}
                                aria-label={t('cart.increase', { name })}
                                className={STEP}
                            >
                                <Plus aria-hidden="true" className="size-4" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(line.slug)}
                            className="rounded-md px-1.5 py-1 text-sm font-medium text-nocciolo-700 underline decoration-argilla-300 decoration-2 underline-offset-4 transition-colors hover:decoration-nocciolo-700"
                        >
                            {t('cart.remove')}
                            <span className="sr-only">{t('cart.removeSr', { name })}</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.li>
    )
}
