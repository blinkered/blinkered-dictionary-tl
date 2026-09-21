/**
 * The collections that attest Tagalog, and where each comes from.
 *
 * Tagalog is the hard case in the set, and the reason is visible in this file's length. Its own
 * Leipzig packages are Wikipedia-derived, so they would repeat the wiki rather than corroborate
 * it; CC-100 has Tagalog in volume but ships no document ids or URLs at all, so nothing in it
 * can be cited; and OpenSubtitles is where Blinkered's Tagalog candidates came from in the first
 * place, so attesting against it would be asking the same corpus the same question twice.
 *
 * What is left divides into three families, which is exactly the minimum the rule demands and
 * leaves no room for a word one of them happens to miss. FineWeb-2 is the fourth.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import {
  fileDocuments,
  fineweb2Documents,
  gutenbergBody,
  harvestDocuments,
  tatoebaDocuments,
  verseDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

export const LANGUAGE = 'tl'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

const ALL = [
  {
    id: 'wiki:tl',
    what: 'Tagalog Wikipedia, 49,484 articles',
    needs: `${CACHE}tlwiki.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}tlwiki.xml.bz2`),
  },
  {
    id: 'wikisource:tl',
    what: 'Tagalog Wikisource — same Wikimedia family, so it corroborates rather than counts',
    needs: `${CACHE}tlwikisource.xml.bz2`,
    documents: () => wikiDocuments(`${CACHE}tlwikisource.xml.bz2`),
  },
  {
    id: 'fw2',
    // Where it came from, so a half-finished download is caught before it is read.
    from: 'https://huggingface.co/datasets/HuggingFaceFW/fineweb-2/resolve/main/data/fil_Latn/train/000_00000.parquet',
    what: 'FineWeb-2 fil_Latn, modern Filipino web prose, each document citing its own URL',
    needs: `${CACHE}fineweb2-fil.parquet`,
    documents: () => fineweb2Documents(`${CACHE}fineweb2-fil.parquet`),
  },
  {
    id: 'tat',
    from: 'https://downloads.tatoeba.org/exports/per_language/tgl/tgl_sentences.tsv.bz2',
    what: 'Tatoeba Tagalog, 79,092 sentences',
    needs: `${CACHE}tgl_sentences.tsv`,
    documents: () => tatoebaDocuments(`${CACHE}tgl_sentences.tsv`),
  },
  {
    id: 'ebible:tglulb',
    from: 'https://ebible.org/Scriptures/tglulb_vpl.zip',
    what: 'Tagalog Unlocked Literal Bible — a family nothing else here belongs to',
    needs: `${CACHE}ebible-tl/tglulb_vpl.txt`,
    documents: () => verseDocuments(`${CACHE}ebible-tl/tglulb_vpl.txt`),
  },
  {
    id: 'gut',
    from: 'https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv',
    what: 'Project Gutenberg Tagalog, 57 books',
    needs: `${CACHE}gutenberg-tl`,
    documents: () => {
      const dir = `${CACHE}gutenberg-tl`
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => ({ locator: file.replace('.txt', ''), path: `${dir}/${file}` }))
      return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
    },
  },
  {
    id: 'ia',
    // Scanned books are OCR, and OCR fails in a way that looks like text. Clean Gutenberg scores
    // a median 52% known words and never below 36%; the worst of these scored 1%, an English
    // book read as Cyrillic. Below this floor a book is not legible enough to attest anything.
    // It also throws out books in the wrong language whole, which matters more here than
    // anywhere: `booksbylanguage_tagalog` holds 227 items, so the shelf had to be gathered by
    // language field instead, and that field is what an uploader typed.
    legible: 0.35,
    what: 'Internet Archive Tagalog books — literature, and the register a newspaper never reaches',
    needs: `${CACHE}archive-tl`,
    from: 'https://archive.org/search?query=mediatype%3Atexts+AND+language%3A%22Tagalog%22',
    documents: () => {
      const dir = `${CACHE}archive-tl`
      // A locator names the text, not the item: the catalogue page holds no word of the book.
      // `files.tsv` maps an item to the file we read; a book with no recorded name is skipped
      // rather than cited at a page that cannot support it.
      const named = new Map(
        readFileSync(`${dir}/files.tsv`, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => line.split('\t')),
      )
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => file.replace('.txt', ''))
        .filter((id) => named.has(id))
        // The filename is percent-encoded: two thirds of them contain spaces, and a locator with
        // a space in it would split into two locators, because the evidence format spends spaces
        // as separators. Encoding is also what the URL needs.
        .map((id) => ({
          locator: `${id}/${encodeURIComponent(named.get(id))}`,
          path: `${dir}/${id}.txt`,
        }))
      return fileDocuments(books, async (path) => readFileSync(path, 'utf8'))
    },
  },
]

export const SOURCES = ALL.filter((source) => {
  if (existsSync(source.needs)) return true
  process.stderr.write(`  (skipping ${source.id}: ${source.needs} is not in .cache/raw)\n`)
  return false
})

/**
 * Filipino publishers, each its own family.
 *
 * **Chosen for the language they publish in, not their circulation.** A harvest attests whatever
 * text it fetches, and it has no idea what language that text is in — so a Philippine site that
 * publishes mostly in English would attest English words against Tagalog candidates, and the two
 * lists overlap enough that nobody would notice. These are the papers, broadcasters and agencies
 * that write in Filipino: the tabloids, the Tagalog editions of the broadsheets, the government's
 * own Filipino-language service, and the language commission itself.
 */
export const DOMAINS = [
  // Tagalog-language dailies and tabloids
  'abante.com.ph', 'remate.ph', 'bulgar.com.ph', 'balita.net.ph', 'pilipinostarngayon.com',
  'hataw.com.ph', 'saksingayon.com', 'ngayon.com.ph',
  // Broadsheets and broadcasters with Filipino desks
  'inquirer.net', 'gmanetwork.com', 'abs-cbn.com', 'rappler.com', 'untvweb.com',
  'tribune.net.ph', 'journal.com.ph', 'manilatoday.net',
  // Government, which publishes in Filipino by law, and the language commission itself
  'pia.gov.ph', 'kwf.gov.ph', 'officialgazette.gov.ph', 'senate.gov.ph',
  // Literature and the left press, for a register the dailies do not reach
  'panitikan.ph', 'pinoyweekly.org', 'bulatlat.com',
]

export const HARVEST = existsSync(new URL('searched.tsv', import.meta.url).pathname)
  ? () => harvestDocuments(new URL('searched.tsv', import.meta.url).pathname)
  : undefined

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 3_540
