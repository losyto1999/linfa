import { RotateCcw } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { spellNumber } from '../i18n/demo'
import { Reveal } from '../components/ui/Reveal'
import { CartSummary } from '../components/cart/CartSummary'
import { MobileCartBar } from '../components/cart/MobileCartBar'
import { PlantArt } from '../components/PlantArt'
import { PlantCard } from '../components/PlantCard'
import { PlantFilters } from '../components/PlantFilters'
import { PLANTS } from '../data/plants'
import { matchesFilters, useFilters } from '../useFilters'
import { useScrollToHash } from '../useScrollToHash'

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export function LinfaPlants() {
    useScrollToHash()
    const { t } = useTranslation('linfa')
    const { filters, activeCount, toggle, reset } = useFilters()
    const reduce = useReducedMotion()
    const visible = PLANTS.filter((plant) => matchesFilters(plant, filters))

    return (
        // Da lg il riepilogo è una colonna a destra che parte dall'alto, così è tutto visibile
        // già all'apertura della pagina e poi resta fisso durante lo scorrimento. Sotto lg lo
        // spazio per la barra del carrello fissa in basso lo lascia LinfaFooter.
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8 lg:px-8 lg:pb-24 lg:pt-14 xl:gap-10">
            <div>
                <Reveal className="max-w-2xl">
                    <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">{t('plantsPage.title')}</h1>
                    <p className="mt-4 text-lg leading-relaxed">
                        {capitalize(t('plantsPage.intro', { number: spellNumber('linfa', PLANTS.length) }))}
                    </p>
                </Reveal>

                <PlantFilters
                    plants={PLANTS}
                    filters={filters}
                    activeCount={activeCount}
                    visibleCount={visible.length}
                    onToggle={toggle}
                    onReset={reset}
                    className="mt-8"
                />

                <section aria-label={t('plantsPage.list')} className="mt-8">
                    <ul className="relative grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {visible.map((plant) => (
                                <motion.li
                                    key={plant.slug}
                                    layout={!reduce}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <PlantCard plant={plant} anchor className="scroll-mt-6" />
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>

                    <AnimatePresence>
                        {visible.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, delay: reduce ? 0 : 0.15 }}
                                className="flex flex-col items-center rounded-2xl border-2 border-dashed border-argilla-300 px-6 py-14 text-center"
                            >
                                <PlantArt art="vuoto" tint="polpa" className="h-40 w-32 overflow-hidden rounded-t-full rounded-b-lg" />
                                <h2 className="mt-6 text-2xl font-semibold">{t('plantsPage.emptyTitle')}</h2>
                                <p className="mt-2 max-w-md leading-relaxed">
                                    {t('plantsPage.emptyText')}
                                </p>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-buccia-600 px-5 font-semibold text-polpa-50 transition-colors hover:bg-buccia-800"
                                >
                                    <RotateCcw aria-hidden="true" className="size-4" />
                                    {t('filters.reset')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            {/* Riepilogo sempre visibile da lg; sotto diventa il pannello a scomparsa. */}
            <aside aria-label={t('plantsPage.basketSummary')} className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col">
                <CartSummary variant="sidebar" />
            </aside>

            <MobileCartBar />
        </div>
    )
}
