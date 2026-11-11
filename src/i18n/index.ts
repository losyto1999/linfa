import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import it from './it.json'

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { it: { translation: it }, en: { translation: en } },
        supportedLngs: ['it', 'en'],
        nonExplicitSupportedLngs: true,
        fallbackLng: 'it',
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

const syncHtmlLang = (lng: string) => {
    document.documentElement.lang = lng.slice(0, 2)
}
syncHtmlLang(i18n.resolvedLanguage ?? 'it')
i18n.on('languageChanged', syncHtmlLang)
