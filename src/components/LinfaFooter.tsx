import { Mail, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useMatch } from 'react-router-dom'
import logo from '../assets/logo.webp'
import { CONTACTS } from '../data/contacts'
import { formatEuro } from '../data/plants'
import { SHIPPING } from '../data/shop'

const YEAR = new Date().getFullYear()

const LINKS = [
    { to: '/piante', key: 'footer.allPlants' },
    { to: '/#piu-scelte', key: 'footer.bestsellers' },
    { to: '/#luce', key: 'footer.lightGuide' },
    { to: '/#consegna', key: 'footer.delivery' },
    { to: '/#domande', key: 'footer.faq' },
]

export function LinfaFooter() {
    const { t } = useTranslation()
    const onCatalog = useMatch('/piante')

    return (
        // Nel catalogo, sotto lg, la barra fissa del carrello (MobileCartBar) copre il fondo della
        // pagina: il footer si allunga quanto lei, così l'ultima riga resta visibile.
        <footer
            className={`bg-argilla-100 text-nocciolo-700 ${
                onCatalog ? 'max-lg:pb-[calc(5rem+env(safe-area-inset-bottom))]' : ''
            }`}
        >
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3 rounded-lg">
                    <img src={logo} alt="" width={194} height={256} className="h-16 w-auto" />
                    <span className="font-display text-4xl font-semibold tracking-tight text-nocciolo-800 [font-variation-settings:'SOFT'_100]">
                        Linfa
                    </span>
                </Link>
                <p className="mt-4 max-w-md leading-relaxed">
                    {t('footer.tagline')}
                </p>

                {/* Contatti fittizi (src/data/contacts.ts): testo semplice, non link per scrivere o chiamare. */}
                <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold text-nocciolo-800">
                    <li className="inline-flex items-center gap-2">
                        <Mail aria-hidden="true" className="size-4" />
                        <span className="sr-only">{t('footer.email')}</span>
                        {CONTACTS.email}
                    </li>
                    <li className="inline-flex items-center gap-2">
                        <Phone aria-hidden="true" className="size-4" />
                        <span className="sr-only">{t('footer.phone')}</span>
                        {CONTACTS.phone}
                    </li>
                </ul>

                <ul className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3">
                    {LINKS.map((link) => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className="font-semibold text-nocciolo-800 underline decoration-argilla-500 decoration-2 underline-offset-[0.4em] transition-colors hover:decoration-nocciolo-800"
                            >
                                {t(link.key)}
                            </Link>
                        </li>
                    ))}
                </ul>

                <p className="mt-10 border-t border-argilla-300 pt-6 text-sm">
                    {t('footer.legal', {
                        cost: formatEuro(SHIPPING.cost),
                        freeFrom: formatEuro(SHIPPING.freeFrom),
                        year: YEAR,
                    })}
                </p>
            </div>
        </footer>
    )
}
