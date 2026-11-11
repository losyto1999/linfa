// Regole del negozio: unica fonte per carrello, API simulate e testi che le citano
// (striscia promozionale, footer, domande frequenti, tappe della consegna).

/** Codice di benvenuto: 10% sul subtotale. */
export const DISCOUNT = { code: 'BENVENUTO10', percent: 10 } as const

/**
 * Spedizione gratuita da 49,99 € di subtotale, altrimenti 7,99 € (importi in centesimi). La soglia
 * si misura prima dello sconto: così applicare il codice non fa mai pagare di più.
 */
export const SHIPPING = { cost: 799, freeFrom: 4999 } as const

/** Tempi di consegna: la pianta parte il giorno dopo l'ordine e arriva entro 48 ore. */
export const DELIVERY = { dispatchDays: 1, transitHours: 48 } as const

/** Giorni entro cui si può chiedere una pianta sostitutiva o il rimborso. */
export const GUARANTEE_DAYS = 30
