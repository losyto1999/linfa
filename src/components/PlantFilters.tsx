import { Euro, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Plant } from '../data/plants'
import { levelLabel, LEVEL_KEYS } from '../data/plants'
import type { FilterKey, Filters } from '../useFilters'
import { FILTER_GROUPS, groupLabel, matchesFilters, optionLabel } from '../useFilters'
import { DESKTOP, useMediaQuery } from '../useMediaQuery'
import { AnimatedNumber } from './AnimatedNumber'
import { METER_ICONS } from './meterIcons'
import { Pips } from './PlantMeters'

interface PlantFiltersProps {
    plants: Plant[]
    filters: Filters
    activeCount: number
    visibleCount: number
    onToggle: (key: FilterKey, id: string) => void
    onReset: () => void
    className?: string
}

/**
 * Quattro gruppi di filtri combinabili. Ogni opzione mostra le stesse tacche delle schede (così
 * fa anche da legenda) e quante piante troverebbe con gli altri filtri attivi.
 */
export function PlantFilters({
    plants,
    filters,
    activeCount,
    visibleCount,
    onToggle,
    onReset,
    className = '',
}: PlantFiltersProps) {
    const { t } = useTranslation('linfa')
    const desktop = useMediaQuery(DESKTOP)
    const reduce = useReducedMotion()
    const [open, setOpen] = useState(false)
    const panelId = useId()
    const expanded = desktop || open

    return (
        <section aria-label={t('filters.title')} className={`rounded-2xl bg-polpa-25 p-4 ring-1 ring-argilla-200 sm:p-5 ${className}`}>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="inline-flex h-11 items-center gap-2 rounded-lg px-3.5 font-semibold text-nocciolo-800 ring-1 ring-argilla-300 transition-colors hover:bg-polpa-100 lg:hidden"
                >
                    <SlidersHorizontal aria-hidden="true" className="size-4.5" />
                    {t('filters.title')}
                    {activeCount > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-buccia-600 px-1 text-xs font-bold text-polpa-50">
                            {activeCount}
                        </span>
                    )}
                </button>

                <p className="hidden font-display text-lg font-semibold text-nocciolo-800 lg:block">
                    {t('filters.heading')}
                </p>

                <div className="flex items-center gap-2 sm:gap-4">
                    <p aria-live="polite" className="text-sm sm:text-base">
                        <AnimatedNumber value={visibleCount} className="font-semibold text-nocciolo-800" />{' '}
                        {t('plantWord', { count: visibleCount })} {t('filters.outOf', { total: plants.length })}
                    </p>
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={activeCount === 0}
                        className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-buccia-700 transition-colors hover:bg-buccia-50 disabled:cursor-not-allowed disabled:text-nocciolo-700/40 disabled:hover:bg-transparent"
                    >
                        <RotateCcw aria-hidden="true" className="size-4" />
                        {t('filters.reset')}
                    </button>
                </div>
            </div>

            <motion.div
                id={panelId}
                initial={false}
                animate={expanded ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
                // Chiuso su mobile: fuori dal tab e dagli screen reader.
                inert={!expanded}
            >
                <div className="grid gap-x-6 gap-y-5 pt-5 sm:grid-cols-2">
                    {FILTER_GROUPS.map((group) => {
                        const Icon = group.meter ? METER_ICONS[group.meter] : Euro
                        return (
                            <fieldset key={group.key}>
                                <legend className="flex items-center gap-2 text-sm font-semibold text-nocciolo-800">
                                    <Icon aria-hidden="true" className="size-4 text-foglia-700" />
                                    {groupLabel(group)}
                                </legend>
                                <div className="mt-2 grid grid-cols-3 gap-1.5">
                                    {group.options.map((option) => {
                                        const active = filters[group.key].includes(option.id)
                                        const count = plants.filter(
                                            (p) => matchesFilters(p, filters, group.key) && group.test(p, option.id),
                                        ).length
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                aria-pressed={active}
                                                onClick={() => onToggle(group.key, option.id)}
                                                // Bordo e non ring: il pannello ha overflow-hidden e taglierebbe l'ombra.
                                                className={`flex min-h-16 flex-col justify-between gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition-colors ${
                                                    active
                                                        ? 'border-buccia-600 bg-buccia-600 text-polpa-50 hover:bg-buccia-700'
                                                        : count === 0
                                                          ? 'border-argilla-200 bg-polpa-50 text-nocciolo-500 hover:border-argilla-500'
                                                          : 'border-argilla-300 bg-polpa-50 text-nocciolo-800 hover:border-buccia-600'
                                                }`}
                                            >
                                                <span className="font-semibold leading-tight">{optionLabel(group, option)}</span>
                                                <span className="flex items-center justify-between gap-2">
                                                    <Pips
                                                        level={option.level}
                                                        grow={group.meter === 'size'}
                                                        className={active ? 'text-polpa-300' : 'text-foglia-500'}
                                                    />
                                                    <span className="text-xs tabular-nums">
                                                        {count}
                                                        <span className="sr-only"> {t('plantWord', { count })}</span>
                                                    </span>
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </fieldset>
                        )
                    })}
                </div>
            </motion.div>

            <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-argilla-200 pt-3 text-sm text-nocciolo-500">
                <span>{t('filters.legend')}</span>
                {LEVEL_KEYS.map((key) => {
                    const Icon = METER_ICONS[key]
                    return (
                        <span key={key} className="inline-flex items-center gap-1">
                            <Icon aria-hidden="true" className="size-4 text-foglia-700" />
                            {levelLabel(key).toLowerCase()}
                        </span>
                    )
                })}
            </p>
        </section>
    )
}
