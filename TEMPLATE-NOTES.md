# TEMPLATE-NOTES.md — provenance of this template

This file documents every KEEP / DELETE / TEMPLATIZE decision made when `recursive-starter` was
built from [recursive-tarot](https://github.com/PlayfulProcess/recursive-tarot) (the pattern
source, most mature channel repo) and
[recursive-astrology](https://github.com/PlayfulProcess/Recursive-astrology) (a second, cleaner
example — astro is intentionally more data-driven in several places, having been built as a
deliberate "take the method home to a new domain" exercise). Read this if you're wondering why a
file looks the way it does, or whether something you need was dropped on purpose.

## Kept, adapted with placeholders

| File | Source | Why |
|---|---|---|
| `theme.css` | tarot (identical in astro — verified byte-for-byte, this file didn't drift between the two live channels) | The single design-token source. Kept nearly verbatim; added a TEMPLATE NOTE pointing at `--gold` as the one color worth changing per-channel. |
| `style.css` | tarot only (astro doesn't have a separate style.css — its pages are self-contained `<style>` blocks instead) | Reusable classes (`.deck`, `.cards`, `.pill`) built on theme.css tokens. Kept as a shared utility layer any additional pages can opt into. |
| `icons.js` | tarot, trimmed | Kept the UI-chrome icon set (eye, pencil, link, cards, tree, github, …) verbatim. **Dropped** the "eight voices" icon set (scale/contrast/leaf/sun/trident/snail/spiral/triangle) — those were named for tarot's specific interpretive traditions (Kant, Jung, DBT, Golden Dawn, …) and have no generic meaning. Left a TEMPLATE NOTE inviting new domain-specific glyphs. |
| `loader.js` | tarot | Genericized: `OWNER`/`REPO` are placeholders, the hardcoded `tarot/` folder became `grammars/`, and `_eco_ids.json`/`_collection.json` references became `ids.json` (astro's flatter naming). |
| `view-switcher.js` | tarot, heavily trimmed | Tarot's version lists 9 views across two "card-level"/"grammar-level" families, most pointing at viewer files this template does NOT bundle (see "Deliberately not ported" below). Kept the *mechanism* (the `?lens=` deep-link redirect) and the inert-by-default rendering (tarot itself retired the visible eye-menu Jun 29 2026 — "the in-page controls were unreliable"), trimmed the view list to the four pages this template actually hosts: Home, Lenses, Genealogy, Course. |
| `auth-widget.js` | tarot, nearly verbatim | Already fully generic (reads the shared recursive.eco Supabase session; no tarot-specific logic at all). Only comments/branding genericized. The Supabase URL + anon key are **intentionally kept as literal values, not placeholders** — they're shared platform infrastructure (see the file's own TEMPLATE NOTE), not a per-channel secret. |
| `site-header.js` | astro (simpler/shorter than tarot's — 199 vs 318 lines, no game/shop/print tabs to carry) | Tabs trimmed to Lenses/Genealogy/Course (this template's actual pages); `GRAMMAR_MENU` and the GitHub link URL are placeholders/hand-maintained lists documented in `CLAUDE.md` Step 1. |
| `site-footer.js` | astro, nearly verbatim | Newsletter signup + "under construction" spiral. Genericized the branding paragraph and `subscribed_from` (now `{{CHANNEL_SLUG}}` instead of a hardcoded string) so newsletter signups are attributable per channel. Same shared-Supabase-project rationale as auth-widget.js. |
| `GRAMMAR_FORMAT.md` | astro (byte-identical to tarot's except astro prepends a "copied into this starter" note) | The canonical grammar shape — unchanged, since drift here breaks the actual contract with the recursive.eco app. Kept astro's framing note as-is; it already says the right thing. |
| `check.py` | astro, nearly verbatim | Already generic, zero-dependency, and explicitly wrote itself as "a starter site" checker. Only the docstring's `python check.py` → `python3 check.py` (matches the rest of this template's invocations) changed. |
| `recursive-eco.json` | astro's shape (flatter: `grammars/*/grammar.json`, `id_map: "ids.json"` at repo root) preferred over tarot's (`tarot/*/grammar.json`, `id_map: "tarot/_eco_ids.json"`, an `exclude` list of 4 generated meta-grammars) | astro's shape needs zero special-casing for a fresh repo with no generated meta-grammars yet. All values templatized. |
| `ids.json` | astro's shape (root-level, `ids`/`preview_links`/`_public_now` keys) | Same reasoning as recursive-eco.json — flatter, no legacy `_eco_ids.json` naming. One `example-grammar` entry seeded with `{{UUID_FROM_RECURSIVE_ECO}}`. |
| `index.html` | astro, genericized further | astro's own "Browse every grammar" gallery already fetches per-grammar JSON client-side — genuinely data-driven at the card level. **Improved for the template**: the SLUG LIST itself was astro's one remaining hardcoded piece (`MAIN_SLUGS`/`CASTING_SLUGS` arrays) — this version derives the slug list from `Object.keys(ids.json's "ids")` instead, so adding a grammar means editing `ids.json` only, zero HTML changes. Astro's "castings" grouping/wheel-viewer CTA (astrology-specific) was dropped. |
| `lenses.html` | astro's page kept as the interaction pattern, but the MATCHING LOGIC was rebuilt generic | astro's lenses hardcodes 4 specific grammar slugs and matches by house-number/planet-name — astrology-specific. This version fetches every grammar listed in `ids.json` and builds a generic name→items index, so "lenses" (grammars sharing an item name) emerge from whatever grammars exist, with zero per-channel code. |
| `genealogy.html` | tarot (astro has no equivalent page — see below) | Kept the Cytoscape.js rendering + date/tier/function colour-mode interaction. **Replaced the data source**: tarot's version reads a generated "meta grammar" (`tarot/all-decks-many-lenses/grammar.json`, itself built by `scripts/build_meta_grammar.py`) — that whole pipeline is tarot-specific tooling and out of scope for a starter. This version reads small hand-authored `NODES`/`EDGES` arrays inlined in the page instead, with REPLACE-ME placeholders and instructions in `CLAUDE.md` Step 4. |
| `course/manifest.json` + `pages/course.html` + `pages/course-viewer.html` | Rebuilt, inspired by tarot's two-tier course.html→course-viewer.html split | See "Deliberately not ported" below for why tarot's actual course-viewer.html wasn't copied. This template's `course-viewer.html` is a from-scratch, ~150-line, fully generic manifest-driven TOC + markdown reader (fetches `course/manifest.json` for the chapter list, fetches each chapter's plain-markdown `.mdx`, renders with marked.js) — no tarot-specific embed logic. `course.html` keeps tarot's small "forward to course-viewer, or render one arbitrary `?src=` file" shim, genericized. |
| `.github/workflows/validate-grammar.yml` | tarot's *shape*, not its content | Tarot's workflow calls `node scripts/validate-grammar.mjs`, a Node script this template doesn't include. Rewrote to call `python3 check.py` instead — zero new dependency, same gate. |

## Deliberately not ported

**Tarot's `viewers/` directory (cards.html, explorer.html, tree-viewer.html, timeline.html,
sequence.html, etc.) was NOT copied**, despite the task brief's initial expectation that some of
these might qualify as "generic." Three findings drove this:

1. **The main recursive.eco platform already hosts these viewers.** `ids.json`'s
   `_preview_links` template (present in both tarot and astro) points Cards/Study/Tree links at
   `https://recursive.eco/pages/grammar-viewer.html?type=<slug>&id=<uuid>` — i.e. the platform
   itself renders any public grammar generically, by UUID. A channel repo doesn't need to
   duplicate that.
2. **astro — the cleaner, more data-driven second example — already validates this simpler
   approach.** It never built a local `viewers/` directory at all; it only hosts one genuinely
   domain-specific tool (`viewer/astrology-viewer.html`, a chart-casting calculator with no
   generic equivalent) plus the pages this template DOES port (index/lenses; astro has no
   genealogy or course).
3. **Tarot's `viewers/cards.html` alone is ~5,300 lines and deeply hardwired to the `tarot/`
   folder, an oracle-drawing/reversed-card selection flow, and a hardcoded `COMMUNITY_FOLDERS`
   list (`['tarot', 'iching', 'sequences', 'astrology', 'custom', 'classics']`).** Genericizing
   it correctly would be a multi-session rewrite, not a template-stripping exercise, and would
   duplicate work the platform's own viewer pages already do generically.

Also not ported, all tarot- or astrology-specific with no generic equivalent: `print/` +
`print-products.json` + `print_codes.json` + `pages/print-viewer.html` (print-on-demand),
`pages/shop.html` + `pages/wishlist.html` (commerce), `pages/games/` + `spread-builder.html`
(tarot game mechanics), `recording/` + `research/` (tarot's own evidence-dossier content),
`historian.html` / `logo-studies.html` / `manifesto.html` / `sources.html` / `contribute.html` /
`deck.html` (tarot-specific pages with no generic counterpart), `CNAME` (each channel sets its
own domain — see `CLAUDE.md` Step 6), all tarot card/deck images, `voices.json` (tarot's specific
8-voice interpretive-tradition roster — a real channel may want an equivalent "creed" file, but
its *content* can't be templatized, only its *existence* as a pattern is worth knowing about —
see `docs/CHANGELOG.md`-style project files in tarot/astro if you want that pattern later),
`course/*.mdx` content (tarot's actual course chapters — kept the manifest MACHINERY, replaced
the content with one placeholder chapter).

## What changed from either source, on purpose (improvements, not just stripping)

- **The homepage gallery's grammar list is derived from `ids.json`, not hand-maintained.** Both
  tarot and astro hardcode a slug array in the gallery script that has to be kept in sync with
  `ids.json` by hand. This template derives it (`Object.keys(ids.json's "ids")`), so adding a
  grammar is one JSON edit, not a JSON edit *and* an HTML edit that can drift out of sync.
- **Lenses matching is generic (by shared item name across ALL grammars), not hardcoded to 4
  specific slugs with domain-specific matching logic** (astro's house-number/planet-name
  matching). This means lenses "just work" the moment two grammars share an item name, with zero
  code change — a template needs to work before the author has written any domain-specific
  matching rules.
- **Genealogy needs no build pipeline.** Tarot's version depends on a generated meta-grammar;
  this template's reads a small inline data array so the page works on day one with zero
  grammars-worth-of-tooling.

## A note on `document_type`/`grammar_type`

Per the parent recursive.eco platform's own `CLAUDE.md`: `grammar_type` is being treated as a
*hint*, not a *runtime contract*, platform-wide. This template follows the same discipline —
`check.py` validates `grammar_type` is one of the known values (so grammars stay well-formed),
but nothing in `index.html`/`lenses.html`/`genealogy.html` branches rendering behavior on it.
Keep it that way as you extend this template: infer behavior from what an item's data actually
contains (does it have `number` + `binary`? it's hexagram-shaped), not from a type stamp.
