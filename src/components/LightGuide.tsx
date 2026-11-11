import { ArrowRight, Sun } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui/Reveal'
import type { Level } from '../data/plants'
import { formatEuro, levelLong, plantName, PLANTS } from '../data/plants'
import { PlantArt } from './PlantArt'
import { Pips } from './PlantMeters'

const LEVELS: Level[] = [1, 2, 3]

/** «Quanta luce ha la tua stanza?»: tre fermate dall'ombra al sole e le piante adatte. */
export function LightGuide() {
    const { t } = useTranslation()
    const [level, setLevel] = useState<Level>(2)
    const name = useId()
    const matches = PLANTS.filter((plant) => plant.light === level)

    return (
        <section id="luce" className="bg-polpa-300 py-20 lg:py-28">
            {/* Padding dentro il max-w-7xl, come header e carosello: i bordi del testo restano allineati. */}
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="max-w-2xl">
                    <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        {t('lightGuide.title')}
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed">
                        {t('lightGuide.text')}
                    </p>
                </Reveal>

                <Reveal delay={0.06}>
                    <fieldset className="mt-10">
                        <legend className="sr-only">{t('lightGuide.legend')}</legend>
                        {/* La barra va dall'ombra (argilla) al sole (quasi bianco). */}
                        <LayoutGroup id={name}>
                            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-linear-to-r from-argilla-200 via-polpa-200 to-polpa-25 p-1.5 ring-1 ring-nocciolo-700/15">
                                {LEVELS.map((optLevel) => {
                                    const selected = optLevel === level
                                    return (
                                        <label
                                            key={optLevel}
                                            className="relative cursor-pointer rounded-xl px-2 py-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-buccia-600 sm:px-5 sm:py-5"
                                        >
                                            <input
                                                type="radio"
                                                name={name}
                                                value={optLevel}
                                                checked={selected}
                                                onChange={() => setLevel(optLevel)}
                                                className="sr-only"
                                            />
                                            {selected && (
                                                <motion.span
                                                    layoutId="indicatore"
                                                    aria-hidden="true"
                                                    className="absolute inset-0 rounded-xl bg-polpa-25 shadow-vaso"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                                                />
                                            )}
                                            <span className="relative flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
                                                <span className="flex items-center gap-1.5 text-foglia-700 sm:mt-1.5">
                                                    <Sun aria-hidden="true" className="size-5" />
                                                    <Pips level={optLevel} />
                                                </span>
                                                <span>
                                                    <span className="block font-display text-base font-semibold text-nocciolo-800 sm:text-xl">
                                                        {levelLong('light', optLevel)}
                                                    </span>
                                                    <span className="mt-1 hidden text-sm leading-snug text-nocciolo-700 sm:block">
                                                        {t(`lightGuide.options.${optLevel}.rooms`)}
                                                    </span>
                                                </span>
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        </LayoutGroup>
                    </fieldset>
                    <p className="mt-3 text-sm sm:hidden">{t(`lightGuide.options.${level}.rooms`)}</p>
                </Reveal>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={level}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="mt-10"
                    >
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                            {matches.map((plant) => (
                                <li key={plant.slug}>
                                    <Link
                                        to={`/piante#${plant.slug}`}
                                        className="flex h-full items-center gap-3 rounded-xl bg-polpa-100 p-2.5 ring-1 ring-nocciolo-700/10 transition-colors hover:bg-polpa-25"
                                    >
                                        <PlantArt
                                            art={plant.art}
                                            tint={plant.tint}
                                            image={plant.image}
                                            className="h-18 w-14 shrink-0 overflow-hidden rounded-t-full rounded-b-md"
                                        />
                                        <span className="min-w-0">
                                            <span className="block font-display font-semibold leading-tight text-nocciolo-800">
                                                {plantName(plant.slug)}
                                            </span>
                                            <span className="mt-0.5 block text-sm tabular-nums">
                                                {formatEuro(plant.price)}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link
                            to={`/piante?luce=${level}`}
                            className="group mt-8 inline-flex items-center gap-2 font-semibold text-nocciolo-800 underline decoration-nocciolo-700/50 decoration-2 underline-offset-[0.4em] transition-colors hover:decoration-nocciolo-800"
                        >
                            {t(`lightGuide.see.${level}`, { n: matches.length })}
                            <ArrowRight
                                aria-hidden="true"
                                className="size-4.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                            />
                        </Link>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}
