# Plan — The Recursive I Ching becomes a real channel

Builder direction (Jul 2026), for the next session(s).

## Who this is for — a strategic correction
Not vibe coders. **Domain experts** — the person who knows the I Ching (or a deck, or a
tradition) and has content, not code. The playbook + this repo exist so a domain expert
brings knowledge and the mechanisms carry it. All docs, prompts, and the eventual "make
your own site" course speak to that reader. MCP/recursive.eco infrastructure help =
lowering *their* friction: the publish loop as clicks, the grammar shape as a fill-in
document, the AI as the one who runs terminals.

## 1. Content: lift everything that already exists
- Sweep BOTH sources for I Ching grammars: the recursive.eco app (user_documents — the
  canonical iching book the Journal oracle uses, plus any others) and
  recursive.eco-schemas (more grammars + **Python visualizers that are I Ching-specific
  — port `schemas/iching/` tooling into this repo's scripts/**, they only make sense here).
- Fill the empty three-lenses chapter sections from these sources where they overlap.

## 2. Grammars by the AGE of the one book (stratigraphy — the idiosyncratic structure)
No structure fits all; **the repo is where idiosyncrasies live**. The I Ching's own shape
is layers of one book across ~3000 years, so the grammars follow the strata, not a template:
- **zhouyi-core** — the oldest divination text (Western Zhou): hexagram + judgment + line
  statements, terse, oracular, pre-Confucian. (PD translations: Legge 1882; Wilhelm is NOT PD.)
- **ten-wings** — the Confucian commentarial layer (Great Commentary etc.) as its OWN grammar,
  so the reader can SEE the moralizing layer as an addition, not the origin.
- **contemplative-daoist reading** — Dao De Jing resonances + the contemplative stream, as an
  owned lens ("my reading, sourced"), per the nara charter.
- Contextual texts (Dao De Jing chapters etc.) as grammars **playable in the tarot oracle /
  as cards** — any public grammar ID loads in any oracle; the caller picks the rules. Draw a
  hexagram like a card; draw a DDJ chapter as a contemplation card.

## 3. The course — "The History of the I Ching"
Anchored in Dao De Jing + contemplative Asian traditions. Thesis to research honestly (it is
historically defensible, with real scholarship — Shaughnessy, Rutt, Redmond & Hon): the Zhouyi
began as divination, arguably closer to a contemplative/oracular practice; the Confucian
canonization (Ten Wings, Han classicization) ADDED the moral-philosophical frame that now
reads as "the" I Ching. Course = that story, era by era, each layer in its own words
(HOW-TO-WRITE-A-COURSE method; ✔/○/◆ discipline; the stratigraphy grammars as companions).

## 4. Channel activation (the publish loop, per REPLICATE-THE-PATTERN §4)
recursive-eco.json (channel slug + id_map) → import/insert rows (public) → tools rows →
ids.json UUIDs → webhook binding → verify a touch-push reindexes. Then Pages domain.

## 5. Astro enrichment lane (parked, noted)
Astro is much richer than currently expressed: **aspects and significators/dignities**
deserve their own commented grammars (each aspect as an item with tradition-sourced
commentary; dignities/rulerships as a lens grammar). Same PD-source discipline.
