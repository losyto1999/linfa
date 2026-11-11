import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'

export type Lang = 'it' | 'en'

type Bundle = { default: Record<string, unknown> }
export type BundleLoaders = Record<Lang, () => Promise<Bundle>>

const LOCALES: Record<Lang, string> = { it: 'it-IT', en: 'en-GB' }

/** Lingua attiva, ridotta a it/en (`i18n.language` può essere anche `en-US`). */
export const currentLang = (): Lang => (i18n.resolvedLanguage === 'en' ? 'en' : 'it')

/** Locale per `Intl`: italiano o inglese britannico (stesso ordine giorno-mese). */
export const currentLocale = () => LOCALES[currentLang()]

/** Traduttore per codice fuori da React (dati, provider): legge la lingua al momento della chiamata. */
export const demoT = (ns: string) => i18n.getFixedT(currentLang(), ns)

/** Numero scritto a parole ("dodici") se il namespace lo prevede alla chiave `numbers.<n>`, altrimenti in cifre. */
export const spellNumber = (ns: string, n: number) => demoT(ns)(`numbers.${n}`, { defaultValue: String(n) })

/** Elenco con la congiunzione della lingua ("a, b e c" / "a, b and c"). */
export const formatList = (items: string[]) =>
    new Intl.ListFormat(currentLocale(), { type: 'conjunction' }).format(items)

/** Lingua e locale `Intl` per i componenti: si ri-renderizzano se la lingua cambia. */
export function useLocale() {
    const { i18n: instance } = useTranslation()
    const lang: Lang = instance.resolvedLanguage === 'en' ? 'en' : 'it'
    return { lang, locale: LOCALES[lang] }
}

/**
 * Carica nel namespace della demo i testi della lingua attiva, insieme al chunk della demo.
 * Restituisce true quando sono disponibili: i layout lo aspettano prima di mostrare la pagina.
 */
export function useDemoBundle(ns: string, loaders: BundleLoaders) {
    const { lang } = useLocale()
    const [, setTick] = useState(0)
    const ready = i18n.hasResourceBundle(lang, ns)

    useEffect(() => {
        if (i18n.hasResourceBundle(lang, ns)) return
        let cancelled = false
        loaders[lang]().then((bundle) => {
            i18n.addResourceBundle(lang, ns, bundle.default, true, true)
            if (!cancelled) setTick((n) => n + 1)
        })
        return () => {
            cancelled = true
        }
        // I loader sono costanti di modulo della demo.
    }, [lang, ns, loaders])

    return ready
}
