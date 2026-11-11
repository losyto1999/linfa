// Strumenti comuni delle API simulate: il progetto non ha un backend e non fa chiamate di rete.
// I dati restano nel localStorage del browser di chi visita il sito (o in memoria, se il
// localStorage non è disponibile): nessun dato lascia il browser.

const MOCK_LATENCY_MS = 600

/** Risolve con il valore calcolato dopo una breve attesa, come una chiamata di rete; se il calcolo lancia, rifiuta. */
export const delay = <T>(value: () => T) =>
    new Promise<T>((resolve, reject) =>
        setTimeout(() => {
            try {
                resolve(value())
            } catch (error) {
                reject(error)
            }
        }, MOCK_LATENCY_MS),
    )

/** Lista salvata nel localStorage sotto `key`, con una copia in memoria come ripiego. */
export function storedList<T>(key: string) {
    let memory: T[] = []
    return {
        read(): T[] {
            try {
                const raw = localStorage.getItem(key)
                return raw ? (JSON.parse(raw) as T[]) : memory
            } catch {
                return memory
            }
        },
        write(items: T[]) {
            memory = items
            try {
                localStorage.setItem(key, JSON.stringify(items))
            } catch {
                // localStorage non disponibile (navigazione privata, storage bloccato): resta in memoria.
            }
        },
    }
}

/** Generatore pseudocasuale (mulberry32) con un seme ricavato da un testo: stessa sequenza a ogni visita. */
export function seededRandom(seedText: string) {
    let seed = 0
    for (const char of seedText) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) | 0
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/** Data di oggi `YYYY-MM-DD` in ora italiana (il negozio è in Italia, il visitatore forse no). */
export const todayInItaly = () =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date())
