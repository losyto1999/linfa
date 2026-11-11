import { currentLocale, demoT } from '../i18n/demo'

// Catalogo del negozio. I prezzi sono in centesimi, così i totali del carrello restano esatti.

/** Scala a tre tacche usata da luce, cura e dimensione. */
export type Level = 1 | 2 | 3

/** Sagoma dell'illustrazione segnaposto (vedi components/PlantArt.tsx). */
export type PlantArtKind =
    | 'traforata'
    | 'ricadente'
    | 'lame'
    | 'rametti'
    | 'monete'
    | 'fronde'
    | 'rosetta'
    | 'ovali'
    | 'frecce'
    | 'alberello'
    | 'pale'
    | 'palma'
    | 'vuoto'

export type Tint = 'polpa' | 'argilla' | 'buccia' | 'foglia'

export interface Plant {
    slug: string
    /** Nome comune e descrizione stanno in locales/*.json, alla chiave `plants.<slug>`. */
    botanical: string
    price: number
    /** 1 poca luce, 2 luce indiretta, 3 sole diretto. */
    light: Level
    /** 1 facile, 2 qualche attenzione, 3 per esperti. */
    care: Level
    /** 1 fino a 30 cm, 2 da 30 a 80 cm, 3 oltre 80 cm. Deve restare coerente con heightCm. */
    size: Level
    heightCm: number
    art: PlantArtKind
    tint: Tint
    bestseller?: boolean
    /** Foto vera: se c'è, prende il posto dell'illustrazione. */
    image?: string
}

export const PLANTS: Plant[] = [
    {
        slug: 'monstera',
        botanical: 'Monstera deliciosa',
        price: 3499,
        light: 2,
        care: 1,
        size: 3,
        heightCm: 90,
        art: 'traforata',
        tint: 'polpa',
        bestseller: true,
    },
    {
        slug: 'pothos',
        botanical: 'Epipremnum aureum',
        price: 1499,
        light: 1,
        care: 1,
        size: 1,
        heightCm: 25,
        art: 'ricadente',
        tint: 'buccia',
        bestseller: true,
    },
    {
        slug: 'sansevieria',
        botanical: 'Dracaena trifasciata',
        price: 2499,
        light: 1,
        care: 1,
        size: 2,
        heightCm: 60,
        art: 'lame',
        tint: 'argilla',
        bestseller: true,
    },
    {
        slug: 'zamioculcas',
        botanical: 'Zamioculcas zamiifolia',
        price: 2999,
        light: 1,
        care: 1,
        size: 2,
        heightCm: 55,
        art: 'rametti',
        tint: 'foglia',
    },
    {
        slug: 'pilea',
        botanical: 'Pilea peperomioides',
        price: 1299,
        light: 2,
        care: 1,
        size: 1,
        heightCm: 25,
        art: 'monete',
        tint: 'polpa',
        bestseller: true,
    },
    {
        slug: 'felce',
        botanical: 'Nephrolepis exaltata',
        price: 1899,
        light: 2,
        care: 2,
        size: 2,
        heightCm: 50,
        art: 'fronde',
        tint: 'buccia',
    },
    {
        slug: 'aloe',
        botanical: 'Aloe vera',
        price: 1199,
        light: 3,
        care: 1,
        size: 1,
        heightCm: 30,
        art: 'rosetta',
        tint: 'argilla',
    },
    {
        slug: 'calathea',
        botanical: 'Calathea orbifolia',
        price: 3299,
        light: 2,
        care: 3,
        size: 2,
        heightCm: 55,
        art: 'ovali',
        tint: 'foglia',
    },
    {
        slug: 'alocasia',
        botanical: 'Alocasia zebrina',
        price: 3999,
        light: 2,
        care: 3,
        size: 2,
        heightCm: 70,
        art: 'frecce',
        tint: 'polpa',
    },
    {
        slug: 'ficus-lyrata',
        botanical: 'Ficus lyrata',
        price: 5499,
        light: 3,
        care: 3,
        size: 3,
        heightCm: 120,
        art: 'alberello',
        tint: 'argilla',
        bestseller: true,
    },
    {
        slug: 'strelitzia',
        botanical: 'Strelitzia nicolai',
        price: 6499,
        light: 3,
        care: 2,
        size: 3,
        heightCm: 130,
        art: 'pale',
        tint: 'buccia',
    },
    {
        slug: 'kentia',
        botanical: 'Howea forsteriana',
        price: 4999,
        light: 1,
        care: 2,
        size: 3,
        heightCm: 110,
        art: 'palma',
        tint: 'foglia',
    },
]

export const findPlant = (slug: string) => PLANTS.find((plant) => plant.slug === slug)

export type LevelKey = 'light' | 'care' | 'size'

export const LEVEL_KEYS: LevelKey[] = ['light', 'care', 'size']

const t = (key: string, options?: Record<string, unknown>) => demoT('linfa')(key, options)

/** Nome comune della pianta nella lingua attiva. */
export const plantName = (slug: string) => t(`plants.${slug}.name`)

export const plantDescription = (slug: string) => t(`plants.${slug}.description`)

/** Nome del gruppo di livelli ("Luce"). */
export const levelLabel = (key: LevelKey) => t(`levels.${key}.label`)

/** Etichette dei tre livelli (1-2-3): `long` nelle schede, `short` nei filtri. */
export const levelLong = (key: LevelKey, level: Level) => t(`levels.${key}.long.${level - 1}`)
export const levelShort = (key: LevelKey, level: Level) => t(`levels.${key}.short.${level - 1}`)

/** Frase breve per un indicatore della scheda, es. "Luce indiretta" o "Grande, 90 cm". */
export function describeLevel(plant: Plant, key: LevelKey) {
    const label = levelLong(key, plant[key])
    return key === 'size' ? t('levels.withHeight', { label, height: plant.heightCm }) : label
}

/** Fasce di prezzo dei filtri, in euro (il simbolo sta nel titolo del gruppo). */
export const PRICE_BANDS = [
    { id: 'fino-20', min: 0, max: 2000 },
    { id: '20-40', min: 2001, max: 4000 },
    { id: 'oltre-40', min: 4001, max: Infinity },
] as const

export const priceBandLabel = (id: string) => t(`priceBands.${id}`)

const euroFormats = new Map<string, Intl.NumberFormat>()

/** Centesimi -> "34,99 €" / "€34.99". */
export function formatEuro(cents: number) {
    const locale = currentLocale()
    let format = euroFormats.get(locale)
    if (!format) {
        format = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })
        euroFormats.set(locale, format)
    }
    return format.format(cents / 100)
}
