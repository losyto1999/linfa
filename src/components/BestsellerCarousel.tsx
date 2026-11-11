import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '../components/ui/Reveal'
import { plantName, PLANTS } from '../data/plants'
import { PlantCard } from './PlantCard'

const BESTSELLERS = PLANTS.filter((plant) => plant.bestseller)

// --edge è il margine sinistro del contenitore della pagina (max-w-7xl): la striscia parte
// allineata al testo ed esce dal bordo destro, così si intravede la scheda successiva. Il 100%
// si riferisce alla larghezza della striscia, non al viewport: niente sfasamenti per la barra
// di scorrimento.
const EDGE = '[--edge:1rem] sm:[--edge:1.5rem] lg:[--edge:max(2rem,calc((100%-80rem)/2+2rem))]'

const FADE =
    'pointer-events-none absolute inset-y-0 z-[5] w-12 from-polpa-50 to-transparent transition-opacity duration-300 motion-reduce:transition-none sm:w-20 lg:w-28'

// Solo la freccia, senza pulsante disegnato, dentro la sfumatura: più marcata quando il mouse
// è sul carosello. L'area cliccabile è alta il doppio della larghezza (h-24), così non serve
// puntare proprio sulla freccia. Su touch non c'è: si scorre con lo swipe.
const ARROW =
    'absolute top-[32%] z-10 grid h-24 w-12 -translate-y-1/2 place-items-center rounded-lg text-nocciolo-800/45 transition-[opacity,color] duration-300 group-hover:text-nocciolo-800 hover:text-buccia-700! disabled:pointer-events-none disabled:opacity-0 motion-reduce:transition-none pointer-coarse:hidden'

/**
 * «Le più scelte»: carosello a scorrimento nativo (swipe, trackpad), senza autoplay. La
 * sfumatura sul lato dove ci sono altre piante dice che si può scorrere; a fine corsa sparisce
 * insieme alla freccia.
 */
export function BestsellerCarousel() {
    const { t } = useTranslation()
    const trackRef = useRef<HTMLUListElement>(null)
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)
    const trackId = useId()
    const reduce = useReducedMotion()
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)
    // Quota della striscia visibile: larghezza dell'indicatore di avanzamento.
    const [visible, setVisible] = useState(1)

    const { scrollXProgress } = useScroll({ container: trackRef })
    const thumbX = useTransform(scrollXProgress, (p) => `${(p * (1 - visible) * 100) / visible}%`)

    const measure = useCallback(() => {
        const track = trackRef.current
        if (!track) return
        setAtStart(track.scrollLeft <= 2)
        setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2)
        setVisible(Math.min(1, track.clientWidth / track.scrollWidth))
    }, [])

    useEffect(() => {
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [measure])

    // A fine corsa la freccia si disattiva e sparisce: se aveva il focus, passa all'altra.
    useEffect(() => {
        if (atEnd && document.activeElement === nextRef.current) prevRef.current?.focus()
        if (atStart && document.activeElement === prevRef.current) nextRef.current?.focus()
    }, [atStart, atEnd])

    function step(direction: 1 | -1) {
        const track = trackRef.current
        const card = track?.firstElementChild as HTMLElement | null
        if (!track || !card) return
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0
        track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduce ? 'auto' : 'smooth' })
    }

    return (
        <section
            id="piu-scelte"
            aria-roledescription={t('bestsellers.carousel')}
            aria-labelledby={`${trackId}-titolo`}
            className="py-20 lg:py-28"
        >
            <Reveal className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 id={`${trackId}-titolo`} className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {t('bestsellers.title')}
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed">
                    {t('bestsellers.text')}
                </p>
            </Reveal>

            <div className={`group relative mt-10 ${EDGE}`}>
                <ul
                    id={trackId}
                    ref={trackRef}
                    onScroll={measure}
                    // relative: i testi sr-only (position: absolute) delle schede restano dentro la
                    // striscia; altrimenti sfuggono al ritaglio e allargano la pagina.
                    className="no-scrollbar relative flex snap-x snap-mandatory scroll-px-(--edge) gap-5 overflow-x-auto px-(--edge) py-2"
                >
                    {BESTSELLERS.map((plant, i) => (
                        <li
                            key={plant.slug}
                            aria-roledescription={t('bestsellers.slide')}
                            aria-label={t('bestsellers.slideLabel', { index: i + 1, total: BESTSELLERS.length, name: plantName(plant.slug) })}
                            className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
                        >
                            <PlantCard plant={plant} />
                        </li>
                    ))}
                </ul>

                <div aria-hidden="true" className={`${FADE} left-0 bg-linear-to-r ${atStart ? 'opacity-0' : ''}`} />
                <div aria-hidden="true" className={`${FADE} right-0 bg-linear-to-l ${atEnd ? 'opacity-0' : ''}`} />

                <button
                    ref={prevRef}
                    type="button"
                    onClick={() => step(-1)}
                    disabled={atStart}
                    aria-controls={trackId}
                    aria-label={t('bestsellers.previous')}
                    className={`${ARROW} left-1 sm:left-3`}
                >
                    <ChevronLeft aria-hidden="true" className="size-9 stroke-[1.75]" />
                </button>
                <button
                    ref={nextRef}
                    type="button"
                    onClick={() => step(1)}
                    disabled={atEnd}
                    aria-controls={trackId}
                    aria-label={t('bestsellers.next')}
                    className={`${ARROW} right-1 sm:right-3`}
                >
                    <ChevronRight aria-hidden="true" className="size-9 stroke-[1.75]" />
                </button>
            </div>

            <div aria-hidden="true" className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="h-1 overflow-hidden rounded-full bg-argilla-200">
                    <motion.div
                        className="h-full rounded-full bg-buccia-600"
                        style={{ width: `${visible * 100}%`, x: thumbX }}
                    />
                </div>
            </div>
        </section>
    )
}
