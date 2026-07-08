# Changelog — The Recursive I Ching

## July 8, 2026 — The Path Caster: the site's own instrument (`viewers/caster.html`)

Built per `docs/DESIGN-path-caster.md` (the builder's design) — the I Ching site's
site-specific instrument, analogue of astro's chart wheel and tarot's Spread Caster.
Three modes, all sharing one pure-logic engine:

- **Explore** — cast or pick an origin + destiny hexagram, tap any of the 6 lines on
  the current hexagram to flip it (any line, not just a differing one — a detour is
  allowed, loops are legitimate per the design doc's own correction). The stack grows
  one hexagram per tap; Undo pops it; a distance-remaining counter tracks progress;
  reaching the destiny completes the path.
- **Cast the Path** — one tap casts a full path at a chosen step budget. Intermediate
  steps flip a differing line (direct style) or any line with a bias toward closing
  (wandering style); the final step always flips whatever single line still differs,
  guaranteeing arrival.
- **Sequential Caster** — the same casting, revealed one step at a time (tap Next, or
  auto-advance every 2.2s).

Every hexagram in the stack renders through `grammars/i-ching-summarized/grammar.json`
(Judgment, Image, all six line texts, symbol/pinyin/Chinese name) with
`grammars/three-lenses-64/grammar.json` layered in as a secondary "also read as" voice
(Human Design gate name + keywords) where its name differs from the flagship's. Each
transition shows the changing line's text from the **origin side** of that specific
step — what the tradition says a changing line means. "Save this path" downloads the
journey as a sequence grammar JSON (items = the path's hexagrams in order, metadata =
the flipped line per step) — static-site style, no backend. Honesty chrome throughout:
a "casting, not a prediction" kicker + an explicit synthesis note that one transition
is classical, the multi-step journey is this project's own extension.

- **The load-bearing fix: the King Wen ↔ binary table.** The design doc flagged this as
  the one risk to get right — and it was right to. `grammars/i-ching-summarized/grammar.json`'s
  own `metadata.binary` field turned out to have **5 real bugs** (hexagrams 15, 16, 46,
  63, 64 — the 63/64 binaries were literally swapped with each other), caught by
  cross-checking that field against the same grammar's own `metadata.trigram_above`/
  `trigram_below` fields using the standard trigram-to-3-bit mapping (confirmed via
  WebSearch against general I Ching reference material: Qian/Kun/Zhen/Kan/Gen/Xun/Li/Dui
  = 111/000/100/010/001/011/101/110, bottom-to-top). Rather than patch the buggy field,
  **`scripts/hexagram-binary.json`** was built fresh by recomputing binary from the
  (independently verified) trigram fields for all 64 hexagrams — verified as a full
  bijection onto 0–63, cross-referenced by name+binary against the independent
  `adamblvck/iching-wilhelm-dataset` (GitHub) for hexagrams 1–15 (13/15 binaries matched
  directly, the 2 exceptions being exactly the two already-flagged-buggy entries), and
  landmark-checked per the design doc's own request (hexagram 1 = six yang, hexagram 2 =
  six yin, hexagrams 11/12 are exact bitwise complements). Full method and sources are
  documented in the file's own `_meta` block. Wikipedia's King Wen sequence article was
  unreachable (403 from this sandbox) — the verification route above was used instead.
- **`viewers/caster-engine.js`** — the pure hypercube math (Hamming distance, line-flip,
  path generation, coin/yarrow line-casting), shared between the browser page and
  `scripts/determinism-check.js` (no DOM dependency, so the hardest logic isn't
  duplicated or drifting between a browser copy and a test copy).
- **Determinism proof** (design doc's own §Verify requirement): `scripts/determinism-check.js`
  runs 50 random origin/destiny/step-budget/style trials and asserts the final hexagram
  always equals the chosen destiny with every intermediate step a single-line flip —
  passed 50/50, plus a separate explicit check of the d=0 (origin equals destiny, a pure
  "loop" journey) edge case at budgets 0/2/4/6.
- **Wired in beside the ported set** (never replacing it): `site-header.js`'s Views menu
  gained an "Instrument" section (Path Caster), `index.html`'s gallery gained a card, and
  `viewers/tree-viewer.html`'s "Get a Reading" button — hidden since the initial port
  because no local casting instrument existed yet (`docs/PLAYBOOK-FIELD-REPORT.md` §7) —
  now points at `caster.html` instead of staying hidden.
- **Verified with Playwright** at 390×844 and 1280×900 against a local static server:
  cast completes and lands on the chosen destiny in all three modes, Explore's flip/undo
  cycle, Sequential's step-by-step advance, the header/index/tree-viewer wiring, the
  "Save this path" download, and zero page errors throughout (the external assistant
  widget's script load fails in this offline sandbox, as expected — not a page error).

## July 7, 2026 — Site built from scratch, following `recursive-tarot/docs/REPLICATE-THE-PATTERN.md`

This is the third site in the family (tarot → astrology → I Ching), and the first one
built as a deliberate **test of the playbook itself**: follow the doc as the only
process authority, change nothing it doesn't call for, and write down everywhere it was
ambiguous or wrong. Full account in `docs/PLAYBOOK-FIELD-REPORT.md`.

- **Wiped the old scaffold.** This repo previously held an unrelated Next.js auth
  starter app; everything except `.git` was deleted per the builder's instruction and
  rebuilt as a static site, mirroring `recursive-tarot`'s and `recursive-astrology`'s
  shape (root-level `index.html`, `viewers/`, `pages/`, `grammars/`, `scripts/`,
  `course/`).
- **Content lifted, not authored.** Three grammars, all sourced from
  `recursive.eco-schemas` with only mechanical conversion (never hand-written
  interpretation):
  - `grammars/i-ching-summarized/grammar.json` — the flagship: all 64 hexagrams
    (Judgment, Image, all six line texts, a short interpretation gloss), converted
    from `recursive.eco-schemas/iching/iching-hexagrams.json` (a non-canonical
    `hexagrams[]` shape) into the canonical `items[]`/`sections{}` shape, with
    `symbol` (the unicode hexagram glyph) merged in by hexagram number from
    `iching/i-ching-chinese-original-with-brief-translation/grammar.json`. Flagged
    honestly in its own `_grammar_commons.license`: the source file carried zero
    attribution metadata, so the translation lineage reads as Wilhelm/Baynes-adjacent
    but is unverified.
  - `grammars/repair-iching/grammar.json` — copied verbatim from
    `recursive.eco-schemas/grammars/repair-iching/` (14 hexagrams read as a
    contemplative repair practice, real content, no changes needed).
  - `grammars/three-lenses-64/grammar.json` — renamed from
    `i-ching-hd-meta-categories-three-lenses-for-viewing-the-64-hexagrams-my-version`
    per the brief. One real fix applied: `grammar_type` was `"tarot"` in the source
    (copy-paste residue on a 94-item hexagram/sign/chakra/trigram grammar with zero
    tarot structure) — corrected to `"custom"`. **Not fixed** (see field report): all
    94 items have empty `sections` and `level: 1` regardless of their intended
    hexagram/sign/chakra/trigram/meta-category tier — the source grammar is a naming
    skeleton, not populated content. Lifted as-is per the "don't author content"
    constraint.
  - `scripts/build_collection.py` (ported from `recursive-astrology`'s script of the
    same name) generates `grammars/_collection.json` — 3 grammars, 3 branches
    (primary-sources / synthesis / readings — no `castings` branch, this repo has no
    spread-grammars).
- **Chrome ported from the family**, cinnabar-retoned (`#9c3b2a` / `#7a2d20` per the
  brief) instead of tarot's gold or astro's blue: `site-header.js`, `site-footer.js`,
  `theme.css`, `view-switcher.js`, `icons.js`, `assistant.js`. `viewers/cards.html` and
  `viewers/tree-viewer.html` are copied byte-identical in structure from
  `recursive-astrology` (which itself carried them byte-identical from
  `recursive-tarot` — both are already grammar-type-generic, confirmed by diffing all
  three repos' copies before editing). `viewers/explorer.html` and
  `viewers/timeline.html` are based on astro's already-de-tarot-ified versions
  (BRANCH_COLOR trimmed to this repo's 3 branches). `viewers/lenses.html` — see the
  field report for why this one needed a real logic fix, not just a re-skin: its
  cross-grammar entity-matching key (astro matched by normalized item NAME) doesn't
  transfer to I Ching, so `entityKey()` now prefers `metadata.number` /
  `metadata.hexagram_number` (the two different field names the two hexagram-bearing
  grammars happen to use) and falls back to name only for the non-hexagram lens items.
- **Two known-missing links found and removed** rather than left pointing at 404s:
  `viewers/cards.html`'s lens-menu "View as Genealogy" option and
  `viewers/tree-viewer.html`'s "Get a Reading" button both pointed at pages this repo
  doesn't ship (`genealogy.html`, `caster.html` — no deck-lineage content and no local
  casting instrument exist for a 3-grammar I Ching collection). `view-switcher.js`'s
  dead `?lens=genealogy` deep-link target was removed for the same reason.
- **Course**: `pages/course-viewer.html` copied from
  `recursive-astrology/pages/course-viewer.html` (the multi-course, manifest-driven
  pattern) per the brief, re-pointed to a single course. `course/three-lenses.manifest.json`
  reads its chapters live from `grammars/three-lenses-64/grammar.json`:
  `chapterIdPrefix: "hex-"` (the 64 hexagram-gate items) as the main throughline,
  `appendixIdPrefix: "l3-"` (the 3 meta-category syntheses) as the closing appendix.
  The `sign-*` / `chakra-*` / `trigram-*` items (27 of the 94) are deliberately not
  surfaced as chapters or appendix — a course needs one throughline, and those items
  don't have one; an honest omission, not a hidden fallback. **Because the source
  grammar's items have empty `sections`, every chapter body currently renders empty**
  (title + keywords only) — flagged in-page and in the field report, not silently
  shipped.
- **`recursive-eco.json` + `ids.json`** written to the pattern (channel slug
  `iching`, `grammars.paths: ["grammars/*/grammar.json"]`, `id_map: "ids.json"`).
  `ids.json` is an intentional skeleton (`{"ids":{}, "_public_now":[]}`) — none of
  these three grammars have been imported into recursive.eco yet; publishing is a
  separate step the playbook itself calls out as part of "the eco binding," not
  something this session did.
- **`.github/workflows/build-collection.yml`** added (this repo had no GitHub Actions
  before): rebuilds `grammars/_collection.json` and deploys to Pages on push to
  `main`. Not verified against the actual push branch — this session could not run
  `git` (write-files-only constraint) — flagged in the workflow file's own comment.
- **Verified with Playwright** (chromium, local static server, 390px and 1280px):
  every page returns 200 with zero same-origin 404s; the header dropdown gap-hover fix
  (inherited via astro from tarot's commit 84934e6) survives the cursor actually
  crossing the gap; the homepage's dynamic grammar/course galleries and the header's
  live Grammars menu all populate correctly from `grammars/_collection.json`; the
  course TOC renders all 64 hexagram chapters plus the 3-item appendix. Google Fonts,
  recursive.eco, and Wikimedia Commons images all fail to load in this sandbox
  (`ERR_TUNNEL_CONNECTION_FAILED` / `ERR_CONNECTION_RESET`), same as both sibling
  repos' own verification notes — a sandbox network restriction, not a new bug; needs
  a real network (GitHub Pages or an unblocked preview) to confirm the fully-dressed
  visual pass. `viewers/timeline.html`'s d3-driven chart is one casualty of that same
  block (`d3 is not defined`, CDN unreachable) — page chrome around it still renders.
- **No `research/` dossiers, no `caster`/coin-cast instrument** — out of scope for this
  session; the brief asked for the ported mechanisms + lifted content + one course, not
  new research writing or a new site-specific instrument.
