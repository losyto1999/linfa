import type { ReactNode } from 'react'
import type { PlantArtKind, Tint } from '../data/plants'

// Illustrazioni segnaposto delle piante: forme semplici con i soli colori della palette.
// Tutte stanno in un riquadro 200×250 con il vaso in basso al centro; il contenitore
// (di solito un arco) decide dimensioni e sfondo.

const C = {
    dark: 'var(--color-buccia-800)',
    leaf: 'var(--color-buccia-600)',
    mid: 'var(--color-buccia-700)',
    fresh: 'var(--color-foglia-500)',
    light: 'var(--color-foglia-300)',
    vein: 'var(--color-polpa-100)',
    gold: 'var(--color-polpa-300)',
    trunk: 'var(--color-nocciolo-700)',
    soil: 'var(--color-nocciolo-800)',
}

const BACKGROUND: Record<Tint, { className: string; fill: string; pot: string; rim: string }> = {
    polpa: {
        className: 'bg-polpa-200',
        fill: 'var(--color-polpa-200)',
        pot: 'var(--color-argilla-300)',
        rim: 'var(--color-argilla-500)',
    },
    argilla: {
        className: 'bg-argilla-100',
        fill: 'var(--color-argilla-100)',
        pot: 'var(--color-polpa-25)',
        rim: 'var(--color-polpa-200)',
    },
    buccia: {
        className: 'bg-buccia-100',
        fill: 'var(--color-buccia-100)',
        pot: 'var(--color-argilla-300)',
        rim: 'var(--color-argilla-500)',
    },
    foglia: {
        className: 'bg-foglia-100',
        fill: 'var(--color-foglia-100)',
        pot: 'var(--color-nocciolo-700)',
        rim: 'var(--color-nocciolo-800)',
    },
}

type Pt = [number, number]

const r = (n: number) => Math.round(n * 10) / 10
const at = (x: number, y: number, angle = 0) => `translate(${r(x)} ${r(y)}) rotate(${r(angle)})`

/** Punto e direzione (0° = verso l'alto, positivo in senso orario) su una curva quadratica. */
function onCurve([x0, y0]: Pt, [x1, y1]: Pt, [x2, y2]: Pt, t: number) {
    const u = 1 - t
    const x = u * u * x0 + 2 * u * t * x1 + t * t * x2
    const y = u * u * y0 + 2 * u * t * y1 + t * t * y2
    const dx = 2 * u * (x1 - x0) + 2 * t * (x2 - x1)
    const dy = 2 * u * (y1 - y0) + 2 * t * (y2 - y1)
    return { x, y, angle: (Math.atan2(dx, -dy) * 180) / Math.PI }
}

const curve = ([x0, y0]: Pt, [x1, y1]: Pt, [x2, y2]: Pt) => `M${x0} ${y0}Q${x1} ${y1} ${x2} ${y2}`

/** Foglia appuntita con la base nell'origine e la punta verso l'alto. */
function leaf(l: number, w: number) {
    const h = w / 2
    return `M0 0C${r(h * 1.1)} ${r(-l * 0.12)} ${r(h * 1.2)} ${r(-l * 0.62)} 0 ${-l}C${r(-h * 1.2)} ${r(-l * 0.62)} ${r(-h * 1.1)} ${r(-l * 0.12)} 0 0Z`
}

/** Foglia a cuore: l'origine è l'attacco del picciolo, i lobi scendono un poco sotto. */
function heart(l: number, w: number) {
    const h = w / 2
    return `M0 0C${r(h * 0.5)} ${r(l * 0.14)} ${r(h * 1.15)} ${r(l * 0.04)} ${r(h)} ${r(-l * 0.3)}C${r(h * 0.9)} ${r(-l * 0.62)} ${r(h * 0.35)} ${r(-l * 0.86)} 0 ${-l}C${r(-h * 0.35)} ${r(-l * 0.86)} ${r(-h * 0.9)} ${r(-l * 0.62)} ${r(-h)} ${r(-l * 0.3)}C${r(-h * 1.15)} ${r(l * 0.04)} ${r(-h * 0.5)} ${r(l * 0.14)} 0 0Z`
}

/** Foglia a violino (ficus lyrata): larga in alto, stretta a metà. */
function violin(l: number, w: number) {
    const h = w / 2
    return `M0 0C${r(h * 0.9)} ${r(-l * 0.08)} ${r(h * 0.5)} ${r(-l * 0.45)} ${r(h * 0.85)} ${r(-l * 0.7)}C${r(h * 1.1)} ${r(-l * 0.95)} ${r(-h * 1.1)} ${r(-l * 0.95)} ${r(-h * 0.85)} ${r(-l * 0.7)}C${r(-h * 0.5)} ${r(-l * 0.45)} ${r(-h * 0.9)} ${r(-l * 0.08)} 0 0Z`
}

function Pot({ pot, rim }: { pot: string; rim: string }) {
    return (
        <g>
            <path d="M60 200h80l-9 44a4 4 0 0 1-4 3H73a4 4 0 0 1-4-3Z" fill={pot} />
            <rect x="54" y="190" width="92" height="14" rx="3" fill={rim} />
        </g>
    )
}

function Soil() {
    return <ellipse cx="100" cy="191" rx="40" ry="4" fill={C.soil} />
}

interface DrawProps {
    bg: string
}

function Monstera({ bg }: DrawProps) {
    const leaves: [number, number, number, number, string][] = [
        // x, y, angolo, lunghezza, colore
        [100, 188, -58, 78, C.mid],
        [100, 188, 52, 82, C.leaf],
        [100, 188, -22, 96, C.leaf],
        [100, 188, 18, 100, C.dark],
        [100, 188, -2, 70, C.fresh],
    ]
    return (
        <g>
            {leaves.map(([x, y, a, len, color], i) => {
                const rad = (a * Math.PI) / 180
                const end: Pt = [x + Math.sin(rad) * len, y - Math.cos(rad) * len * 0.9]
                const size = len * 0.72
                return (
                    <g key={i}>
                        <path
                            d={curve([x, y], [x, y - len * 0.6], end)}
                            stroke={C.mid}
                            strokeWidth="3"
                            fill="none"
                        />
                        <g transform={at(end[0], end[1], a * 1.3)}>
                            <path d={heart(size, size * 0.95)} fill={color} />
                            <path d={`M0 0V${r(-size * 0.92)}`} stroke={C.vein} strokeWidth="1.6" opacity="0.7" />
                            {[0.25, 0.45, 0.65].flatMap((t) =>
                                [1, -1].map((side) => (
                                    <path
                                        key={`${t}${side}`}
                                        d={`M${r(side * size * 0.5)} ${r(-size * (t + 0.05))}L${r(side * size * 0.16)} ${r(-size * (t + 0.12))}`}
                                        stroke={bg}
                                        strokeWidth="3.4"
                                        strokeLinecap="round"
                                    />
                                )),
                            )}
                            <ellipse cx={r(size * 0.12)} cy={r(-size * 0.3)} rx="2.6" ry="4.2" fill={bg} />
                            <ellipse cx={r(-size * 0.12)} cy={r(-size * 0.52)} rx="2.4" ry="4" fill={bg} />
                        </g>
                    </g>
                )
            })}
        </g>
    )
}

function Pothos() {
    const vines: [Pt, Pt, Pt][] = [
        [[80, 192], [30, 190], [34, 246]],
        [[118, 192], [172, 186], [166, 240]],
        [[96, 192], [70, 176], [58, 150]],
        [[106, 192], [134, 170], [150, 152]],
        [[100, 192], [100, 160], [96, 128]],
    ]
    return (
        <g>
            {vines.map((points, v) => (
                <g key={v}>
                    <path d={curve(...points)} stroke={C.mid} strokeWidth="2.4" fill="none" />
                    {[0.3, 0.55, 0.8, 1].map((t, i) => {
                        const p = onCurve(...points, t)
                        const side = i % 2 === 0 ? 1 : -1
                        const size = 22 - i * 1.5
                        return (
                            <g key={t} transform={at(p.x, p.y, p.angle + side * 55)}>
                                <path d={heart(size, size * 0.85)} fill={(v + i) % 3 === 0 ? C.fresh : C.leaf} />
                                <path
                                    d={`M${r(size * 0.1)} ${r(-size * 0.2)}Q${r(size * 0.25)} ${r(-size * 0.55)} 0 ${r(-size * 0.85)}`}
                                    stroke={C.gold}
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </g>
                        )
                    })}
                </g>
            ))}
        </g>
    )
}

function Sansevieria() {
    const blades: [number, number, number, number][] = [
        // x alla base, angolo, lunghezza, larghezza
        [84, -16, 120, 24],
        [116, 14, 130, 24],
        [94, -5, 168, 28],
        [106, 6, 150, 26],
        [100, -1, 110, 22],
    ]
    return (
        <g>
            {blades.map(([x, a, l, w], i) => (
                <g key={i} transform={at(x, 194, a)}>
                    <path d={leaf(l, w)} fill={i % 2 ? C.mid : C.dark} stroke={C.gold} strokeWidth="2.2" />
                    <path
                        d={`M0 -6V${-l + 20}`}
                        stroke={C.light}
                        strokeWidth={w * 0.5}
                        strokeDasharray="3 9"
                        opacity="0.55"
                    />
                </g>
            ))}
        </g>
    )
}

function Zamioculcas() {
    const stems: [Pt, Pt, Pt][] = [
        [[92, 192], [70, 140], [42, 96]],
        [[108, 192], [130, 140], [160, 100]],
        [[98, 192], [90, 120], [82, 40]],
        [[102, 192], [116, 110], [126, 56]],
    ]
    return (
        <g>
            {stems.map((points, s) => (
                <g key={s}>
                    <path d={curve(...points)} stroke={C.mid} strokeWidth="3.4" fill="none" strokeLinecap="round" />
                    {[0.4, 0.52, 0.64, 0.76, 0.88].flatMap((t) =>
                        [1, -1].map((side) => {
                            const p = onCurve(...points, t)
                            return (
                                <path
                                    key={`${t}${side}`}
                                    d={leaf(26, 13)}
                                    transform={at(p.x, p.y, p.angle + side * 48)}
                                    fill={side === 1 ? C.leaf : C.dark}
                                />
                            )
                        }),
                    )}
                    {(() => {
                        const tip = onCurve(...points, 1)
                        return <path d={leaf(24, 12)} transform={at(tip.x, tip.y, tip.angle)} fill={C.leaf} />
                    })()}
                </g>
            ))}
        </g>
    )
}

function Pilea() {
    const coins: [number, number, number][] = [
        // x, y, raggio
        [58, 120, 17],
        [142, 116, 18],
        [80, 88, 19],
        [122, 80, 20],
        [100, 56, 17],
        [46, 158, 14],
        [154, 156, 15],
        [100, 112, 16],
        [72, 142, 13],
        [128, 142, 13],
    ]
    return (
        <g>
            <path d="M100 192V120" stroke={C.mid} strokeWidth="4" strokeLinecap="round" />
            {coins.map(([x, y, radius], i) => (
                <g key={i}>
                    <path
                        d={curve([100, 168 - (i % 4) * 12], [(100 + x) / 2, y + 20], [x, y])}
                        stroke={C.mid}
                        strokeWidth="1.6"
                        fill="none"
                    />
                    <circle cx={x} cy={y} r={radius} fill={i % 3 === 0 ? C.fresh : C.leaf} />
                    <circle cx={x} cy={y} r="1.8" fill={C.vein} />
                </g>
            ))}
        </g>
    )
}

function Fern() {
    const fronds: [Pt, Pt, Pt][] = [
        [[98, 190], [40, 150], [16, 200]],
        [[102, 190], [160, 150], [184, 200]],
        [[98, 190], [44, 100], [28, 120]],
        [[102, 190], [156, 100], [172, 118]],
        [[99, 190], [72, 70], [60, 44]],
        [[101, 190], [128, 70], [142, 40]],
        [[100, 190], [98, 90], [100, 30]],
    ]
    return (
        <g>
            {fronds.map((points, f) => (
                <g key={f}>
                    <path d={curve(...points)} stroke={C.mid} strokeWidth="2" fill="none" />
                    {Array.from({ length: 13 }, (_, i) => {
                        const t = 0.18 + i * 0.065
                        const p = onCurve(...points, t)
                        const len = 16 * (1 - t * 0.7)
                        return [1, -1].map((side) => (
                            <path
                                key={`${i}${side}`}
                                d={leaf(len, 5.5)}
                                transform={at(p.x, p.y, p.angle + side * 70)}
                                fill={f % 2 ? C.fresh : C.leaf}
                            />
                        ))
                    })}
                </g>
            ))}
        </g>
    )
}

function Aloe() {
    const leaves: [number, number, number][] = [
        // angolo, lunghezza, larghezza
        [-78, 72, 20],
        [78, 74, 20],
        [-55, 92, 22],
        [55, 90, 22],
        [-30, 108, 24],
        [30, 104, 24],
        [-10, 118, 24],
        [12, 112, 22],
    ]
    return (
        <g>
            {leaves.map(([a, l, w], i) => (
                <g key={i} transform={at(100, 190, a)}>
                    <path d={leaf(l, w)} fill={i % 2 ? C.light : C.fresh} stroke={C.mid} strokeWidth="1.4" />
                    {[0.3, 0.45, 0.6].map((t) => (
                        <circle key={t} cx={r((t - 0.45) * 6)} cy={r(-l * t)} r="1.6" fill={C.vein} />
                    ))}
                </g>
            ))}
        </g>
    )
}

function Calathea() {
    const leaves: [number, number, number][] = [
        // angolo, lunghezza picciolo, dimensione foglia
        [-52, 46, 66],
        [50, 44, 64],
        [-18, 70, 72],
        [20, 64, 70],
        [0, 30, 58],
    ]
    return (
        <g>
            {leaves.map(([a, stem, size], i) => {
                const rad = (a * Math.PI) / 180
                const x = 100 + Math.sin(rad) * stem
                const y = 190 - Math.cos(rad) * stem
                return (
                    <g key={i}>
                        <path d={`M100 190L${r(x)} ${r(y)}`} stroke={C.mid} strokeWidth="3" />
                        <g transform={at(x, y, a * 1.2)}>
                            <ellipse cx="0" cy={r(-size / 2)} rx={r(size * 0.42)} ry={r(size / 2)} fill={i % 2 ? C.dark : C.leaf} />
                            <path d={`M0 -2V${r(-size + 4)}`} stroke={C.light} strokeWidth="1.6" />
                            {[0.2, 0.34, 0.48, 0.62, 0.76].flatMap((t) => {
                                const half = Math.sqrt(1 - (t * 2 - 1) ** 2) * size * 0.34
                                return [1, -1].map((side) => (
                                    <path
                                        key={`${t}${side}`}
                                        d={`M0 ${r(-size * t)}L${r(side * half)} ${r(-size * (t + 0.08))}`}
                                        stroke={C.light}
                                        strokeWidth="2.6"
                                        strokeLinecap="round"
                                    />
                                ))
                            })}
                        </g>
                    </g>
                )
            })}
        </g>
    )
}

function Alocasia() {
    const stems: [Pt, Pt, Pt, number][] = [
        [[94, 192], [80, 140], [52, 96], -70],
        [[106, 192], [122, 136], [150, 92], 70],
        [[100, 192], [96, 110], [88, 52], -40],
        [[102, 192], [112, 120], [118, 70], 38],
    ]
    return (
        <g>
            {stems.map(([p0, p1, p2, a], i) => (
                <g key={i}>
                    <path d={curve(p0, p1, p2)} stroke={C.light} strokeWidth="4" fill="none" />
                    <path d={curve(p0, p1, p2)} stroke={C.mid} strokeWidth="4" strokeDasharray="3 4" fill="none" />
                    <g transform={at(p2[0], p2[1], a)}>
                        <path d={heart(62, 40)} fill={C.dark} />
                        <path d="M0 0V-56" stroke={C.vein} strokeWidth="1.6" />
                        {[0.2, 0.4, 0.6].flatMap((t) =>
                            [1, -1].map((side) => (
                                <path
                                    key={`${t}${side}`}
                                    d={`M0 ${r(-62 * t)}Q${r(side * 8)} ${r(-62 * t - 4)} ${r(side * 14)} ${r(-62 * t - 12)}`}
                                    stroke={C.vein}
                                    strokeWidth="1.2"
                                    fill="none"
                                />
                            )),
                        )}
                    </g>
                </g>
            ))}
        </g>
    )
}

function Ficus() {
    const leaves: [number, number, number][] = [
        // y sul fusto, angolo, lunghezza
        [150, -62, 40],
        [134, 60, 42],
        [116, -50, 46],
        [98, 48, 48],
        [80, -40, 48],
        [62, 36, 46],
        [46, -26, 44],
        [34, 18, 40],
        [26, -6, 38],
    ]
    return (
        <g>
            <path d="M100 192Q97 120 101 30" stroke={C.trunk} strokeWidth="5" fill="none" strokeLinecap="round" />
            {leaves.map(([y, a, l], i) => (
                <g key={i} transform={at(100, y, a)}>
                    <path d={violin(l, l * 0.7)} fill={i % 2 ? C.leaf : C.mid} />
                    <path d={`M0 0V${r(-l * 0.85)}`} stroke={C.light} strokeWidth="1.4" />
                </g>
            ))}
        </g>
    )
}

function Strelitzia({ bg }: DrawProps) {
    const stems: [number, number, number][] = [
        // angolo, lunghezza picciolo, lunghezza foglia
        [-40, 70, 86],
        [36, 76, 82],
        [-12, 96, 84],
        [14, 88, 80],
    ]
    return (
        <g>
            {stems.map(([a, stem, l], i) => {
                const rad = (a * Math.PI) / 180
                const x = 100 + Math.sin(rad) * stem
                const y = 192 - Math.cos(rad) * stem
                return (
                    <g key={i}>
                        <path d={`M100 192L${r(x)} ${r(y)}`} stroke={C.mid} strokeWidth="3.2" />
                        <g transform={at(x, y, a * 1.15)}>
                            <path d={leaf(l, l * 0.42)} fill={i % 2 ? C.leaf : C.dark} />
                            <path d={`M0 0V${r(-l * 0.95)}`} stroke={C.light} strokeWidth="1.6" />
                            {[0.35, 0.6].map((t, j) => {
                                const side = (i + j) % 2 ? 1 : -1
                                return (
                                    <path
                                        key={t}
                                        d={`M${r(side * l * 0.23)} ${r(-l * t)}L${r(side * 2)} ${r(-l * (t + 0.12))}`}
                                        stroke={bg}
                                        strokeWidth="2.6"
                                    />
                                )
                            })}
                        </g>
                    </g>
                )
            })}
        </g>
    )
}

function Kentia() {
    const fronds: [Pt, Pt, Pt][] = [
        [[98, 190], [50, 120], [14, 140]],
        [[102, 190], [150, 120], [186, 140]],
        [[98, 190], [60, 70], [40, 64]],
        [[102, 190], [140, 70], [160, 60]],
        [[100, 190], [96, 70], [104, 20]],
    ]
    return (
        <g>
            {fronds.map((points, f) => (
                <g key={f}>
                    <path d={curve(...points)} stroke={C.mid} strokeWidth="2.6" fill="none" />
                    {Array.from({ length: 11 }, (_, i) => {
                        const t = 0.3 + i * 0.065
                        const p = onCurve(...points, t)
                        const len = 34 * (1 - t * 0.55)
                        return [1, -1].map((side) => (
                            <path
                                key={`${i}${side}`}
                                d={leaf(len, 5)}
                                transform={at(p.x, p.y, p.angle + side * 58 + (p.angle > 0 ? 18 : -18))}
                                fill={f % 2 ? C.leaf : C.fresh}
                            />
                        ))
                    })}
                </g>
            ))}
        </g>
    )
}

function Sprout() {
    return (
        <g>
            <path d="M100 191Q99 176 100 166" stroke={C.mid} strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d={leaf(18, 11)} transform={at(100, 170, -55)} fill={C.fresh} />
            <path d={leaf(20, 12)} transform={at(100, 167, 50)} fill={C.leaf} />
        </g>
    )
}

const DRAWINGS: Record<PlantArtKind, (props: DrawProps) => ReactNode> = {
    traforata: Monstera,
    ricadente: Pothos,
    lame: Sansevieria,
    rametti: Zamioculcas,
    monete: Pilea,
    fronde: Fern,
    rosetta: Aloe,
    ovali: Calathea,
    frecce: Alocasia,
    alberello: Ficus,
    pale: Strelitzia,
    palma: Kentia,
    vuoto: Sprout,
}

// Le piante ricadenti coprono il vaso: il vaso va disegnato prima.
const POT_BEHIND: PlantArtKind[] = ['ricadente']

interface PlantArtProps {
    art: PlantArtKind
    tint: Tint
    /** Foto vera: se presente sostituisce l'illustrazione. */
    image?: string
    /** Testo alternativo della foto; l'illustrazione è decorativa. */
    alt?: string
    className?: string
}

export function PlantArt({ art, tint, image, alt = '', className = '' }: PlantArtProps) {
    const bg = BACKGROUND[tint]
    const Draw = DRAWINGS[art]
    const potBehind = POT_BEHIND.includes(art)

    if (image) {
        return (
            <div className={`${bg.className} ${className}`}>
                <img src={image} alt={alt} className="size-full object-cover" loading="lazy" />
            </div>
        )
    }

    return (
        <div className={`${bg.className} ${className}`}>
            {/* xMidYMax: il vaso resta appoggiato in basso, qualunque sia la forma del contenitore. */}
            <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMax meet" aria-hidden="true" className="size-full">
                {potBehind && <Pot pot={bg.pot} rim={bg.rim} />}
                {!potBehind && <Soil />}
                <Draw bg={bg.fill} />
                {!potBehind && <Pot pot={bg.pot} rim={bg.rim} />}
            </svg>
        </div>
    )
}
