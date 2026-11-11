# Linfa — progetto mockato

E-commerce dimostrativo di un negozio di piante da appartamento: home (`/linfa`) e catalogo (`/linfa/piante`). Nessun backend: il carrello vive nel browser e i pulsanti di checkout mostrano solo un avviso che si tratta di una demo. La funzionalità da mostrare è il carrello.

## Direzione visiva: «La serra»

La forma ricorrente è l'arco, come la finestra di una serra o la sagoma di un vaso: le immagini stanno dentro archi, gli indicatori di luce/cura/dimensione imitano i cartellini infilati nei vasi. Fondo crema-avocado, bordi sottili color argilla, pulsanti rettangolari con angoli di 8 px.

Da evitare (per restare diversa da Pala e Fuoco e Bottega del Taglio): hero testo+pulsanti a sinistra e foto a destra, griglie di tre card uguali con icona, alternanza testo/immagine, pulsanti a pillola, corsivi nei titoli, etichette numerate o in maiuscolo sopra i titoli.

## Palette (`linfa.css`, `@theme`)

Solo i cinque colori del brief (in maiuscolo nel CSS) e loro variazioni di luminosità.

| Token | Base | Uso | Contrasto |
|---|---|---|---|
| `nocciolo-*` | `#704012` | testo (`700`), titoli (`800`), testo secondario (`500`) | `700` 7,96:1 sul fondo; `500` solo su `polpa-25/50/100` (≥ 4,6:1) |
| `buccia-*` | `#4A7337` | pulsanti primari (`600`, hover `800`), fascia «Consegna», link | `polpa-50` su `600` 5,09:1 |
| `foglia-*` | `#6B8C21` | tacche degli indicatori, barra spedizione (`500`, solo grafica); testo in `700` | `500` 3,58:1 (grafica); `700` 5,73:1 |
| `polpa-*` | `#DDD48F` | fondo pagina (`50`), schede (`25`), fascia «Luce» (`300`), evidenziazioni | `nocciolo-700` su `300` 5,71:1 |
| `argilla-*` | `#CDA989` | bordi, vasi delle illustrazioni, footer (`100`) | niente testo su `300`: 3,96:1 |

`#6B8C21` non si usa come fondo dei pulsanti: con testo chiaro scende a 3,89:1.

## Font

- `font-display`: **Fraunces** (`full.css`, asse `opsz` automatico) con `SOFT` 100, impostato in `linfa.css` sui titoli e a mano sul marchio e sulle domande frequenti.
- `font-sans`: **Figtree** per testo e interfaccia.

## Carrello (`cart/`)

- `cart.ts`: regole pure (reducer, totali, codice, lettura/scrittura). Importi in centesimi.
- Salvato in localStorage sotto `linfa:carrello` (`{ v, lines, code }`): solo slug e quantità, prezzi e nomi si leggono sempre dal catalogo. In lettura si scartano piante sconosciute e si riportano le quantità tra 1 e 10. L'evento `storage` tiene allineate due schede.
- Codice: l'unico valido è `BENVENUTO10` (10% sul subtotale), maiuscole e spazi non contano. È mostrato nella striscia in cima a ogni pagina e sopra il campo del codice.
- Spedizione: 7,99 €, gratuita da 49,99 € di **subtotale** (prima dello sconto, così il codice non fa mai pagare di più). Barra di avanzamento nel carrello.
- Totale = subtotale − sconto + spedizione.
- `CartProvider` annuncia ogni modifica in una regione `aria-live`.

## Struttura

- `data/plants.ts`: le 12 piante (prezzi in centesimi, livelli 1–3 di luce/cura/dimensione, sagoma e tinta dell'illustrazione, `image?` per una foto vera), etichette dei livelli e fasce di prezzo.
- `components/PlantArt.tsx`: illustrazioni SVG segnaposto, una sagoma per pianta.
- `components/PlantMeters.tsx`: le tacche (`Pips`) e i cartellini delle schede, riusati dai filtri e dalla guida alla luce.
- `useFilters.ts`: filtri nella query string (`?luce=1&cura=1&cura=2`); OR dentro un gruppo, AND tra gruppi.
- `components/cart/`: riepilogo (colonna fissa del catalogo da `lg`, pannello `<dialog>` altrove), barra mobile, contatore, avviso di aggiunta.
- `useScrollToHash.ts`: copia di quello di Pala e Fuoco, per le ancore (`#luce`, `#monstera`…).

## Animazioni

Poche e legate a un'azione: conferma sul pulsante «Aggiungi», salto del contatore, riga del carrello che si illumina, cifre dei totali che scorrono, barra della spedizione, card che si riordinano coi filtri, carosello, indicatore della guida alla luce, ingresso delle sezioni (`Reveal`). Tutto il layout è in `<MotionConfig reducedMotion="user">`; le transizioni di altezza e quelle CSS si azzerano a mano con reduced motion.

## Logo e icona

Tutte le immagini della demo stanno in `assets/`. Convertite con sharp (`npx sharp-cli`, non è una dipendenza del progetto):

- **Logo del sito** (header e footer della demo): `assets/logo.webp`, ricavato dall'originale `assets-src/linfa/logo.png` (2000×2000, fondo bianco) togliendo il fondo e ritagliando sul simbolo.
- **Icona dell'app** (card del portfolio, importata da `src/data/projects.ts`): `assets/icon.webp`, 320×320, ritagliata sul riquadro verde del disegno originale (1254×1254, il PNG non è stato conservato) con angoli trasparenti di raggio 26,5%, appena più largo di quello del disegno: gli angoli bianchi restano fuori anche senza il `rounded-[28%]` del portfolio.

## Testi

Tono discorsivo: "noi" (il negozio) che parla al cliente col "tu". Per ora Linfa non mostra indirizzo né telefono; se servono, si usano quelli veri del proprietario (vedi `src/projects/CLAUDE.md`), come nelle altre demo.

## Lingua

La demo segue la lingua scelta su flowsi (italiano o inglese): nessun selettore dentro la demo. I testi stanno in `locales/it.json` e `locales/en.json` (namespace `linfa`), caricati da `LinfaLayout` insieme al foglio di stile. `data/plants.ts` tiene solo i dati (slug, prezzo, livelli, illustrazione) e il nome latino; nome comune e descrizione sono alla chiave `plants.<slug>`, e le etichette dei livelli e delle fasce di prezzo in `levels.*` e `priceBands.*` (si leggono con `plantName`, `levelLong`, `priceBandLabel`…). Slug, parametri dei filtri (`?luce=1`), ancore e il codice `BENVENUTO10` restano gli stessi in tutte le lingue. I messaggi per gli screen reader del carrello si costruiscono al momento dell'azione (`announce.*`), e `checkCode()` restituisce un codice di errore, non un testo.
