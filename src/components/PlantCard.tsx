import { useTranslation } from 'react-i18next'
import { useCart } from '../cart/CartContext'
import type { Plant } from '../data/plants'
import { formatEuro, plantDescription, plantName } from '../data/plants'
import { AddToCartButton } from './AddToCartButton'
import { PlantArt } from './PlantArt'
import { PlantMeters } from './PlantMeters'

interface PlantCardProps {
    plant: Plant
    /** L'id serve come ancora (#monstera) solo nella pagina del catalogo. */
    anchor?: boolean
    className?: string
}

/** Scheda di una pianta: immagine ad arco, prezzo, cartellini di luce/cura/dimensione e «Aggiungi». */
export function PlantCard({ plant, anchor = false, className = '' }: PlantCardProps) {
    const { t } = useTranslation()
    const { qtyOf } = useCart()
    const qty = qtyOf(plant.slug)

    return (
        <article
            id={anchor ? plant.slug : undefined}
            className={`flex h-full flex-col rounded-2xl bg-polpa-25 p-3 ring-1 ring-argilla-200 ${className}`}
        >
            <div className="relative">
                <PlantArt
                    art={plant.art}
                    tint={plant.tint}
                    image={plant.image}
                    alt={plantName(plant.slug)}
                    className="aspect-4/5 w-full overflow-hidden rounded-t-full rounded-b-lg"
                />
                {plant.bestseller && (
                    <span className="absolute bottom-3 left-3 rounded-md bg-polpa-300 px-2 py-1 text-xs font-semibold text-nocciolo-800">
                        {t('card.bestseller')}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-4">
                <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-semibold leading-tight">{plantName(plant.slug)}</h3>
                    <p className="whitespace-nowrap font-display text-lg font-semibold tabular-nums text-nocciolo-800">
                        {formatEuro(plant.price)}
                    </p>
                </div>
                <p className="mt-0.5 text-sm text-nocciolo-500">{plant.botanical}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed">{plantDescription(plant.slug)}</p>

                <PlantMeters plant={plant} className="mt-4" />

                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-5">
                    <AddToCartButton plant={plant} />
                    {qty > 0 && (
                        <span className="text-sm font-medium text-buccia-700">
                            {t('card.inBasket', { qty })}
                        </span>
                    )}
                </div>
            </div>
        </article>
    )
}
