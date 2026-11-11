import { ArrowRight, Plus } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatList } from '../i18n/locale'
import { Reveal } from '../components/ui/Reveal'
import { DELIVERY, DISCOUNT, GUARANTEE_DAYS, SHIPPING } from '../data/shop'
import { BestsellerCarousel } from '../components/BestsellerCarousel'
import { LightGuide } from '../components/LightGuide'
import { PlantArt } from '../components/PlantArt'
import { findPlant, formatEuro, plantName } from '../data/plants'
import { useScrollToHash } from '../useScrollToHash'

// Facciata della serra: cinque archi, il più alto al centro. Su mobile restano i tre centrali.
const ARCHES = [
    { slug: 'pilea', height: 'h-[62%]', outer: true },
    { slug: 'sansevieria', height: 'h-[82%]', outer: false },
    { slug: 'ficus-lyrata', height: 'h-full', outer: false },
    { slug: 'monstera', height: 'h-[82%]', outer: false },
    { slug: 'pothos', height: 'h-[62%]', outer: true },
]

type Step = { when: string; text: string }
type FaqItem = { q: string; a: string }

export function LinfaHome() {
    useScrollToHash()
    const { t } = useTranslation()
    const reduce = useReducedMotion()
    const cost = formatEuro(SHIPPING.cost)
    const freeFrom = formatEuro(SHIPPING.freeFrom)
    const steps = t('home.steps', {
        returnObjects: true,
        hours: DELIVERY.transitHours,
        days: GUARANTEE_DAYS,
    }) as Step[]
    // I nomi nelle risposte sulla sicurezza arrivano dal catalogo, così restano uguali a quelli delle schede.
    const names = (slugs: string[]) => slugs.map(plantName)
    const faq = t('home.faq', {
        returnObjects: true,
        cost,
        freeFrom,
        code: DISCOUNT.code,
        days: GUARANTEE_DAYS,
        safe: formatList(names(['pilea', 'calathea', 'felce', 'kentia'])),
        others: names(['monstera', 'pothos', 'aloe']).join(', '),
    }) as FaqItem[]

    return (
        <>
            {/* overflow-hidden: tiene dentro il bancone, che sporge ai lati, e maschera gli archi
                mentre salgono. pb-8: lascia spazio sotto a bordo e ombra dei cartellini, che
                stanno appena fuori dal loro riquadro e altrimenti verrebbero tagliati. */}
            <section className="overflow-hidden px-4 pb-8 pt-14 sm:px-6 sm:pt-20 lg:px-8">
                <Reveal className="mx-auto max-w-4xl text-center">
                    <h1 className="text-[2.7rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                        {t('home.title')}
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed">
                        {t('home.intro')}
                    </p>
                    <Link
                        to="/piante"
                        className="group mt-9 inline-flex h-13 items-center gap-2.5 rounded-lg bg-buccia-600 px-7 text-lg font-semibold text-polpa-50 transition-colors hover:bg-buccia-800 active:translate-y-px"
                    >
                        {t('home.cta')}
                        <ArrowRight
                            aria-hidden="true"
                            className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                    </Link>
                </Reveal>

                <div className="relative mx-auto mt-14 max-w-5xl lg:mt-16">
                    {/* Il bancone su cui poggiano gli archi, dietro ai cartellini. */}
                    <div aria-hidden="true" className="absolute -inset-x-4 bottom-3 h-3 rounded-sm bg-argilla-300 sm:-inset-x-10" />
                    <ul className="relative flex h-72 items-end justify-center gap-3 sm:h-96 sm:gap-4 lg:h-[28rem] lg:gap-6">
                        {ARCHES.map((arch, i) => {
                            const plant = findPlant(arch.slug)
                            if (!plant) return null
                            return (
                                <motion.li
                                    key={arch.slug}
                                    // Come Reveal: con reduced motion gli archi ci sono già, senza entrata.
                                    initial={reduce ? false : { opacity: 0, y: 48 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    // Dal centro verso i lati.
                                    transition={{ duration: 0.7, delay: 0.2 + Math.abs(i - 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
                                    className={`${arch.height} w-[31%] sm:w-[19%] ${arch.outer ? 'hidden sm:block' : ''}`}
                                >
                                    <Link
                                        to={`/piante#${plant.slug}`}
                                        className="group relative flex h-full flex-col items-center rounded-t-full"
                                    >
                                        <PlantArt
                                            art={plant.art}
                                            tint={plant.tint}
                                            image={plant.image}
                                            className="w-full flex-1 overflow-hidden rounded-t-full ring-1 ring-nocciolo-700/10 transition-transform duration-500 group-hover:-translate-y-1.5 motion-reduce:transition-none"
                                        />
                                        {/* Cartellino col nome, appoggiato sul bordo dell'arco. */}
                                        <span className="relative -mt-4 rounded-md bg-polpa-25 px-2.5 py-1 text-sm font-semibold text-nocciolo-800 shadow-vaso ring-1 ring-argilla-200 sm:px-3 sm:text-base">
                                            {plantName(plant.slug)}
                                        </span>
                                    </Link>
                                </motion.li>
                            )
                        })}
                    </ul>
                </div>
            </section>

            <BestsellerCarousel />

            <LightGuide />

            <section id="consegna" className="bg-buccia-600 py-20 text-polpa-100 lg:py-28">
                {/* Padding dentro il max-w-7xl, come header e carosello: i bordi del testo restano allineati. */}
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="max-w-2xl">
                        <h2 className="text-4xl font-semibold tracking-tight text-polpa-50 sm:text-5xl">
                            {t('home.deliveryTitle')}
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed">
                            {t('home.deliveryText', { cost, freeFrom })}
                        </p>
                    </Reveal>

                    {/* Linea del tempo: verticale su mobile, orizzontale da lg. */}
                    <ol className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-8">
                        <span
                            aria-hidden="true"
                            className="absolute bottom-3 left-[7px] top-3 w-0.5 bg-polpa-300/45 lg:inset-x-0 lg:bottom-auto lg:top-[7px] lg:h-0.5 lg:w-auto"
                        />
                        {steps.map((step, i) => (
                            <li key={step.when} className="relative pl-10 lg:pl-0 lg:pt-11">
                                <span
                                    aria-hidden="true"
                                    className="absolute left-0 top-1.5 size-4 rounded-full bg-polpa-300 ring-4 ring-buccia-600 lg:top-0"
                                />
                                <Reveal delay={i * 0.08}>
                                    <h3 className="text-xl font-semibold text-polpa-50 sm:text-2xl">{step.when}</h3>
                                    <p className="mt-2 max-w-sm leading-relaxed">{step.text}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section id="domande" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="mx-auto w-full max-w-3xl">
                    <Reveal>
                        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t('home.faqTitle')}</h2>
                        <p className="mt-4 text-lg leading-relaxed">{t('home.faqIntro')}</p>
                    </Reveal>

                    <Reveal delay={0.06} className="mt-10 divide-y divide-argilla-200 border-y border-argilla-200">
                        {faq.map((item) => (
                            <details key={item.q} className="group">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-md py-5 font-display text-lg font-semibold text-nocciolo-800 [font-variation-settings:'SOFT'_100] sm:text-xl [&::-webkit-details-marker]:hidden">
                                    {item.q}
                                    <Plus
                                        aria-hidden="true"
                                        className="size-5 shrink-0 text-buccia-600 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                                    />
                                </summary>
                                <p className="max-w-2xl pb-6 leading-relaxed">{item.a}</p>
                            </details>
                        ))}
                    </Reveal>
                </div>
            </section>
        </>
    )
}
