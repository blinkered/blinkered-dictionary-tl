# Blinkered dictionary: Tagalog

The Tagalog word list, and the evidence for every word in it.

Built by [`blinkered-attestation`](../blinkered-attestation). The rule, the evidence format and
the reasoning live there; what lives here is Tagalog.

**Tagalog is the hard case, and it is in this set on purpose.** If attestation can produce a
defensible list for a language whose own corpora are thin, it will work anywhere. The numbers
below are the honest answer to that question, and they are not yet a pass.

## Where it stands

```
                                     kept
  wiki + wikisource + Tatoeba + Gutenberg    3,721  (16.0%)
  + FineWeb-2 fil_Latn                       8,860  (38.0%)
  + Tagalog Bible                            9,247  (39.7%)
```

FineWeb-2 more than doubled it, contributing 1.08 billion tokens and hitting 85% of candidates
on its own. The Bible added 387.

## Why it is stuck, precisely

```
  14,059 dropped, by how many families attest them

  6,248  two families   <- one source short
  4,553  one family
  3,258  none at all

  the dominant pair: tlwiki + fw2, 5,264 words
  ABDOMEN  ABDOMINAL  ABANTE  ABDIKASYON  ABENIDA  ABENTURERO  ABERASYON
```

Those 5,264 are attested in **both** Tagalog Wikipedia and modern Filipino web prose. They are
plainly real. They fail because the third family has to be Tatoeba (6,254 words), Gutenberg
(7,050) or the Bible (4,183), and those are simply too small to contain them.

**Tagalog's problem is a shortage of families, not of volume.** One more genuine family rescues
roughly 5,264 words and takes the list past 60%.

**The 3,258 attested by nothing are the point of the exercise, not a failure.** Six collections
looked and none of them found those words, which is what an `en.wiktionary`-only entry looks
like from the outside. Removing them is the licensing win.

## What was tried and did not work

- **Leipzig**: its only Tagalog packages are Wikipedia-derived, so they repeat `tlwiki` rather
  than corroborate it.
- **CC-100**: 700MB of Tagalog, and not one document id or URL in it. Nothing in it can be
  cited, so nothing in it can attest.
- **OPUS**: TED2020 is 39KB, QED 100KB, GNOME 1.5KB. NLLB has 634MB but is Common-Crawl-derived,
  so it is the same family as FineWeb-2 and adds a collection rather than an opinion.
- **OpenSubtitles**: excluded deliberately. It is where Blinkered's Tagalog candidates came
  from, so attesting against it asks the same corpus the same question.

## Before this ships

The common-tier cut is carried over from Blinkered's calibration against the old list and has to
be re-measured. More pressingly, `everyLanguagePlays` requires every language to deal a board
holding a word of six or more tiles across three seeds, and at 9,247 words Tagalog is the
language most likely to fail it.

## Rebuilding

```sh
pnpm install
pnpm build      # writes ATTESTATIONS.tsv, words.txt, dropped.tsv
pnpm conform    # checks that words.txt says only what ATTESTATIONS.tsv supports
```

Collections are expected under `.cache/raw/`, about 4GB, and are not downloaded automatically.
