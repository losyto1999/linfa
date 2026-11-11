import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, NavLink, useMatch } from 'react-router-dom'
import logo from '../assets/logo.webp'
import { DISCOUNT } from '../data/shop'
import { AddedToast } from './cart/AddedToast'
import { CartButton } from './cart/CartButton'
import { LanguageSwitch } from './LanguageSwitch'

const LINKS = [
    { to: '/piante', key: 'header.plants' },
    { to: '/#luce', key: 'header.lightGuide' },
    { to: '/#domande', key: 'header.faq' },
]

const linkClass =
    'font-semibold text-nocciolo-800 underline-offset-[0.45em] decoration-2 decoration-foglia-500 transition-colors hover:text-buccia-700'

/** Striscia in cima a ogni pagina: il codice sconto di prova, con «Copia». */
function PromoStrip() {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return
        const id = setTimeout(() => setCopied(false), 2000)
        return () => clearTimeout(id)
    }, [copied])

    async function copy() {
        try {
            await navigator.clipboard.writeText(DISCOUNT.code)
            setCopied(true)
        } catch {
            // Appunti non disponibili (permessi o contesto non sicuro): il codice resta leggibile.
        }
    }

    return (
        <div className="bg-buccia-600 text-polpa-50">
            <div className="mx-auto flex min-h-10 w-full max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-4 py-1.5 text-sm sm:px-6 lg:px-8">
                <p className="text-center sm:hidden">
                    <Trans
                        t={t}
                        i18nKey="header.promoShort"
                        values={{ percent: DISCOUNT.percent, code: DISCOUNT.code }}
                        components={{ code: <strong className="font-bold tracking-wide" /> }}
                    />
                </p>
                <p className="hidden text-center sm:block">
                    <Trans
                        t={t}
                        i18nKey="header.promoLong"
                        values={{ percent: DISCOUNT.percent, code: DISCOUNT.code }}
                        components={{ code: <strong className="font-bold tracking-wide" /> }}
                    />
                    <span className="hidden md:inline">{t('header.promoMore')}</span>.
                </p>
                <button
                    type="button"
                    onClick={copy}
                    className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-semibold underline decoration-polpa-300 decoration-2 underline-offset-4 transition-colors hover:bg-buccia-800 focus-visible:outline-polpa-50"
                >
                    {copied ? (
                        <Check aria-hidden="true" className="size-4" strokeWidth={2.6} />
                    ) : (
                        <Copy aria-hidden="true" className="size-4" />
                    )}
                    <span aria-live="polite">{copied ? t('header.copied') : t('header.copy')}</span>
                    <span className="sr-only">{t('header.copySr')}</span>
                </button>
            </div>
        </div>
    )
}

export function LinfaHeader() {
    const { t } = useTranslation()
    const onCatalog = useMatch('/piante')

    return (
        <>
            <PromoStrip />
            <header className="sticky top-0 z-40 border-b border-argilla-200 bg-polpa-50/95 backdrop-blur-md">
                {/* Da lg tre colonne: link, logo al centro, lingua e carrello. Sotto lg i link
                    spariscono e il logo va a sinistra: centrato non lascerebbe spazio a destra. */}
                <nav
                    aria-label={t('header.nav')}
                    className="mx-auto grid h-20 w-full max-w-7xl grid-cols-[auto_1fr] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8"
                >
                    <ul className="hidden items-center gap-7 lg:flex">
                        {LINKS.map((link) => (
                            <li key={link.to}>
                                {/* Solo «Piante» è una pagina: le ancore della home non vanno segnate come attive. */}
                                {link.to.includes('#') ? (
                                    <Link to={link.to} className={linkClass}>
                                        {t(link.key)}
                                    </Link>
                                ) : (
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) => `${linkClass} ${isActive ? 'underline' : ''}`}
                                    >
                                        {t(link.key)}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>

                    <Link to="/" className="flex items-center gap-2 rounded-lg lg:col-start-2">
                        <img src={logo} alt="" width={194} height={256} className="h-12 w-auto" />
                        <span className="font-display text-[1.75rem] font-semibold tracking-tight text-nocciolo-800 [font-variation-settings:'SOFT'_100]">
                            Linfa
                        </span>
                    </Link>

                    <div className="flex items-center justify-self-end gap-1.5 sm:gap-2 lg:col-start-3">
                        <NavLink
                            to="/piante"
                            className={({ isActive }) =>
                                `${linkClass} px-2 max-[374px]:hidden lg:hidden ${isActive ? 'underline' : ''}`
                            }
                        >
                            {t('header.plants')}
                        </NavLink>
                        <LanguageSwitch />
                        <div className="relative">
                            <CartButton />
                            {!onCatalog && <AddedToast />}
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}
