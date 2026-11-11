import type { Level, Plant } from '../data/plants'
import { describeLevel, LEVEL_KEYS } from '../data/plants'
import { METER_ICONS } from './meterIcons'

interface PipsProps {
    level: Level
    /** Tacche crescenti in altezza, come piante piccole, medie e grandi. */
    grow?: boolean
    className?: string
}

/** Tre tacche piene fino al livello, nel colore del testo (currentColor). */
export function Pips({ level, grow = false, className = '' }: PipsProps) {
    return (
        <span aria-hidden="true" className={`inline-flex h-3 items-end gap-[3px] ${className}`}>
            {([1, 2, 3] as const).map((n) => (
                <span
                    key={n}
                    className={`w-[5px] rounded-[1.5px] bg-current ${n <= level ? '' : 'opacity-25'}`}
                    style={{ height: grow ? 3 + n * 3 : 12 }}
                />
            ))}
        </span>
    )
}

/** Cartellini di luce, cura e dimensione di una pianta: icona + tacche, testo solo per screen reader. */
export function PlantMeters({ plant, className = '' }: { plant: Plant; className?: string }) {
    return (
        <ul className={`flex flex-wrap gap-1.5 ${className}`}>
            {LEVEL_KEYS.map((key) => {
                const Icon = METER_ICONS[key]
                const text = describeLevel(plant, key)
                return (
                    <li
                        key={key}
                        title={text}
                        className="relative inline-flex items-center gap-1.5 rounded-md bg-polpa-100 px-2 py-1.5 text-foglia-500"
                    >
                        <Icon aria-hidden="true" className="size-4 text-foglia-700" />
                        <Pips level={plant[key]} grow={key === 'size'} />
                        <span className="sr-only">{text}</span>
                    </li>
                )
            })}
        </ul>
    )
}
