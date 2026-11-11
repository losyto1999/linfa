import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Level, LevelKey, Plant } from './data/plants'
import { levelLabel, levelShort, PRICE_BANDS, priceBandLabel } from './data/plants'
import { demoT } from './i18n/demo'

// I filtri del catalogo vivono nella query string (?luce=1&cura=1&cura=2): il link dalla
// guida alla luce apre il catalogo già filtrato e la scelta sopravvive al tasto indietro.

export type FilterKey = 'luce' | 'cura' | 'dimensione' | 'prezzo'

export interface FilterOption {
    id: string
    /** Tacche da mostrare accanto all'etichetta (per il prezzo: fascia 1, 2 o 3). */
    level: Level
}

export interface FilterGroup {
    key: FilterKey
    /** Indicatore delle schede a cui corrisponde il gruppo; il prezzo non ne ha uno. */
    meter?: LevelKey
    options: FilterOption[]
    test: (plant: Plant, id: string) => boolean
}

const levelGroup = (key: FilterKey, meter: LevelKey): FilterGroup => ({
    key,
    meter,
    options: ([1, 2, 3] as const).map((level) => ({ id: String(level), level })),
    test: (plant, id) => String(plant[meter]) === id,
})

export const FILTER_GROUPS: FilterGroup[] = [
    levelGroup('luce', 'light'),
    levelGroup('cura', 'care'),
    levelGroup('dimensione', 'size'),
    {
        key: 'prezzo',
        options: PRICE_BANDS.map((band, i) => ({ id: band.id, level: (i + 1) as Level })),
        test: (plant, id) => {
            const band = PRICE_BANDS.find((b) => b.id === id)
            return !!band && plant.price >= band.min && plant.price <= band.max
        },
    },
]

/** Testi dei gruppi e delle opzioni, nella lingua attiva. */
export const groupLabel = (group: FilterGroup) => (group.meter ? levelLabel(group.meter) : demoT('linfa')('filters.price'))
export const optionLabel = (group: FilterGroup, option: FilterOption) =>
    group.meter ? levelShort(group.meter, option.level) : priceBandLabel(option.id)

export type Filters = Record<FilterKey, string[]>

/**
 * Dentro un gruppo basta una delle opzioni scelte, tra gruppi diversi devono valere tutte.
 * `skip` ignora un gruppo: serve a contare cosa troverebbe ciascuna sua opzione.
 */
export function matchesFilters(plant: Plant, filters: Filters, skip?: FilterKey) {
    return FILTER_GROUPS.every(
        (group) =>
            group.key === skip ||
            filters[group.key].length === 0 ||
            filters[group.key].some((id) => group.test(plant, id)),
    )
}

export function useFilters() {
    const [params, setParams] = useSearchParams()

    const filters = useMemo(() => {
        const entries = FILTER_GROUPS.map((group) => {
            const chosen = params.getAll(group.key)
            // Solo valori noti, nell'ordine delle opzioni e senza doppioni.
            return [group.key, group.options.map((o) => o.id).filter((id) => chosen.includes(id))]
        })
        return Object.fromEntries(entries) as Filters
    }, [params])

    const activeCount = FILTER_GROUPS.reduce((n, group) => n + filters[group.key].length, 0)

    function toggle(key: FilterKey, id: string) {
        // Si parte dall'URL attuale e non da `params`: react-router aggiorna la pagina in una
        // transizione, e con due clic ravvicinati il secondo cancellerebbe il primo.
        const next = new URLSearchParams(window.location.search)
        const current = next.getAll(key)
        const values = current.includes(id) ? current.filter((v) => v !== id) : [...current, id]
        next.delete(key)
        for (const option of FILTER_GROUPS.find((g) => g.key === key)?.options ?? []) {
            if (values.includes(option.id)) next.append(key, option.id)
        }
        setParams(next, { replace: true })
    }

    function reset() {
        setParams({}, { replace: true })
    }

    return { filters, activeCount, toggle, reset }
}
