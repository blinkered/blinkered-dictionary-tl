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

import { createReadStream, readFileSync, readdirSync } from 'node:fs'
import {
  fileDocuments,
  fineweb2Documents,
  gutenbergBody,
  tatoebaDocuments,
  verseDocuments,
  wikiDocuments,
} from '@blinkered/attestation'

const CACHE = new URL('.cache/raw/', import.meta.url).pathname

export const SOURCES = [
  {
    id: 'tlwiki',
    what: 'Tagalog Wikipedia, 49,484 articles',
    documents: () => wikiDocuments(`${CACHE}tlwiki.xml.bz2`),
  },
  {
    id: 'tlwikisource',
    what: 'Tagalog Wikisource — same family as the above, so it corroborates rather than counts',
    documents: () => wikiDocuments(`${CACHE}tlwikisource.xml.bz2`),
  },
  {
    id: 'fw2',
    what: 'FineWeb-2 fil_Latn, modern Filipino web prose, each document citing its own URL',
    documents: () => fineweb2Documents(`${CACHE}fineweb2-fil.parquet`),
  },
  {
    id: 'tat',
    what: 'Tatoeba Tagalog, 79,092 sentences',
    documents: () => tatoebaDocuments(`${CACHE}tgl_sentences.tsv`),
  },
  {
    id: 'ebibletl',
    what: 'Tagalog Unlocked Literal Bible — a family nothing else here belongs to',
    documents: () => verseDocuments(`${CACHE}ebible-tl/tglulb_vpl.txt`),
  },
  {
    id: 'gut',
    what: 'Project Gutenberg Tagalog, 57 books',
    documents: () => {
      const dir = `${CACHE}gutenberg-tl`
      const books = readdirSync(dir)
        .filter((file) => file.endsWith('.txt'))
        .map((file) => ({ locator: file.replace('.txt', ''), path: `${dir}/${file}` }))
      return fileDocuments(books, async (path) => gutenbergBody(readFileSync(path, 'utf8')))
    },
  },
]

/** Carried over from Blinkered's calibration; must be re-measured before anything ships. */
export const COMMON_CUT = 3_540
