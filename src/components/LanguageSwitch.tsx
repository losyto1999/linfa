import { useTranslation } from 'react-i18next'
import type { Lang } from '../i18n/locale'
import { useLocale } from '../i18n/locale'

const LANGS: Lang[] = ['it', 'en']

/** Selettore IT/EN: la scelta resta salvata nel browser (vedi i18n/index.ts). */
export function LanguageSwitch() {
    const { t, i18n } = useTranslation()
    const { lang } = useLocale()

    function choose(next: Lang) {
        if (next === lang) return
        i18n.changeLanguage(next)
        // Toglie un eventuale ?lng= dall'URL, altrimenti al ricaricamento avrebbe la precedenza sulla scelta.
        const url = new URL(window.location.href)
        if (url.searchParams.has('lng')) {
            url.searchParams.delete('lng')
            window.history.replaceState(window.history.state, '', url)
        }
    }

    return (
        <div
            role="group"
            aria-label={t('header.language')}
            className="flex shrink-0 rounded-lg bg-polpa-25 p-0.5 ring-1 ring-argilla-300"
        >
            {LANGS.map((l) => (
                <button
                    key={l}
                    type="button"
                    lang={l}
                    aria-pressed={lang === l}
                    onClick={() => choose(l)}
                    className={`rounded-md px-2 py-1 text-xs font-bold uppercase transition-colors sm:px-2.5 ${
                        lang === l ? 'bg-buccia-600 text-polpa-50' : 'text-nocciolo-700 hover:text-nocciolo-900'
                    }`}
                >
                    {l}
                </button>
            ))}
        </div>
    )
}
