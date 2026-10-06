# Dictionary cleanup

Reviewed on 6 October 2026. The runtime dictionary was reduced from 7,145 rows to 7,091 unique entries.

## Changes

- Removed 47 entries containing vulgar slang, explicit sexual senses, slurs or other offensive language.
- Removed six unreliable scraped entries and merged two copies of `AGBERO`.
- Repaired 2,201 meanings, including truncated sentences, definitions assigned to the wrong headword, spelling mistakes, escaped text and unusable scraped examples.
- Corrected ten language tags while preserving existing difficulty ratings and the six-column CSV format.
- Replaced eight excluded level targets. Also corrected `ABERO` to `AGBERO` and replaced `BELL` with `BALE` in level 132 to keep its wheel within eight letters.
- Synchronized 135 target entries with their revised words or meanings.

The review covered every headword, Pidgin/slang meanings, and English definitions flagged for damage. It does not claim an independent scholarly verification of every sense or regional spelling. Ordinary words with harmless meanings, such as `BOOBY` (a seabird), `PUSS` (a cat), `COWBELL` and `SAMBA`, were retained with appropriate definitions. Words describing identity were not treated as profanity.

## Removed entries

Excluded offensive or explicit entries:

```text
ACATA ACATAY AGARACHA AGRO AKATA BANZA CHINCO CHINKO CONJI COPULATE
CUCKOLD DOUCHE EKULEKU ERECTILE FAG FAP FRAKPAS FUCKONSO GIMP HUSSY
HYMEN IKEBAY INKEBE IWERE JACKASS KEZAYA KGB LINGAM MALO NYARSH
OKPEKE OKPO ORGIES OXLADE SHEGE SHITTOR SPLARO SQUAW TEAGUE TEWE
UKPA UKWU WENCH WILLY YAMIRI YASH YASHMAN
```

Unreliable scraped entries: `DEMAIN`, `EHMYCOOL`, `GON`, `KOLOMBI`, `MIMI`, `PADIWISE`. Their old meanings were incomplete, promotional or inconsistent with their language tags; no definition was invented to keep them.

`AGBERO` remains once, with the reviewed meaning “A street tout or motor-park worker.” The spelling correction already present in the CSV was preserved and applied to the level that still used `ABERO`.

## Changed target sets

| Level | Replacement |
| --- | --- |
| 34 | TEWE → EWO |
| 36 | MALO → LAMA |
| 57 | OKPO → GIST |
| 132 | ABERO → AGBERO; BELL → BALE |
| 140 | ACATA → ANODA |
| 153 | KGB → KOBO |
| 235 | UKWU → SEW |
| 245 | AGRO → AGBO |
| 256 | YASH → YARN |

All 300 levels retain unique word sets and connected, playable grids. Earlier target sets remain in `LEGACY_LEVEL_WORDS` for save migration. Removed bonus words cannot reappear in active lists after resume; historical discoveries, balances and earned rewards are preserved.

## Definition sources

1,613 entries identify definitions adapted from [Princeton WordNet 3.1](https://wordnet.princeton.edu/). The [full license](../assets/data/WordNet-LICENSE.txt) is also embedded in the CSV notes so it accompanies the dictionary when bundled. The source archive was `https://wordnetcode.princeton.edu/wn3.1.dict.tar.gz` (SHA-256 `3f7d8be8ef6ecc7167d39b10d66954ec734280b5bdcd57f7d9eafe429d11c22a`). Adapted senses were reviewed, with manual replacements where the automated selection was obscure or inappropriate.

Selected regional and uncommon meanings were checked against [Naija Guru](https://naija.guru/en/w/kolobi/), [Hausa Dictionary](https://hausadictionary.com/magani), [Nkọwa Okwu](https://nkowaokwu.com/word?word=uche), [Nigerian recipe references](https://www.allnigerianrecipes.com/breakfast-recipes/make-agidi-eko/), [African Music Library](https://www.africanmusiclibrary.org/genre/Makossa), [Webster’s historical dictionary](https://www.gutenberg.org/files/664/664-h/664-h.htm) and [Merriam-Webster](https://www.merriam-webster.com/dictionary/mungo). The offensive use of `AKATA` was corroborated by [published sociological research](https://archive.nyu.edu/bitstream/2451/64396/2/Imoagene_Broken_Bridges.pdf).

## Verification

- `npm run validate:levels`: checks all dictionary rows and variants, excluded headwords, damaged meanings, embedded attribution, matching level clues, wheel limits and grid connectivity.
- `npm test`: tests actual CSV lookup, retained harmless words, retired bonus words in saved games, and solving all 300 levels through the game rules.
- `npm run typecheck`: checks the affected TypeScript.

The exclusion list uses exact words and variants. It avoids substring filtering that would incorrectly reject words such as `CANAL`, `SPARSE` and `GRAPE`. It covers the reviewed exclusions and common profanity, rather than claiming to recognize every future slang spelling automatically.
