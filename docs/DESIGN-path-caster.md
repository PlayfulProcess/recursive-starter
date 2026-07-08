# Design — The Path Caster (the I Ching site's own instrument)

Builder's design (Jul 2026), written down and built on. This is the I Ching site's
site-specific instrument per the playbook (§3: additions beside the ported set) — the
analogue of astro's chart wheel and tarot's caster. **Not built in flow**: it lives here,
in the static site, client-side. (A cast path may later be *saved as a grammar* and offered
to the app — the object travels, the instrument stays.)

## The idea, in her words (near-verbatim)

Two hexagrams are cast, and the user can play around with all the ways through — different
combinations of changing lines, different paths through intermediate hexagrams — to get from
one to the other. Or the user can cast the path itself. And a **sequential caster**: cast one
hexagram at a time, shown in a **stacked sequence with changing lines as intermediaries** —
cast the two ends, then recast intermediates in order until the destiny hexagram is reached,
with a **setting for how many steps**, and **the last step deterministic** so the journey
always arrives.

## Why this is deeply canonical (and where it's ours)

The engine of the I Ching *is* transformation: a cast hexagram's **changing lines** produce
the resulting hexagram (之卦, the "going-to" hexagram), and the line texts are read precisely
for the lines that change. One transition is classical. **A journey of transitions — a path
through intermediate hexagrams — is our extension**, held honestly as PlayfulProcess's
synthesis (owned-lens rule): the classical mechanism, iterated.

## The structure underneath (what makes it buildable)

A hexagram is 6 lines = a 6-bit string; a changing line = one bit flip. So the 64 hexagrams
are the vertices of the **6-dimensional hypercube (Q6)**, and every path between two hexagrams
is a walk on it:

- **Distance** between origin A and destiny B = number of differing lines (Hamming, 0–6).
- **Direct paths** = orderings of the differing-line flips: `d!` minimal routes (up to 720).
  Every intermediate is itself a real hexagram with its own name and text — the path IS a story.
- **Builder's correction (Jul 2026): the walk space is far larger than the minimal routes.**
  Paths are DIRECTED — going from the Receptive to the Creative is a different journey than
  Creative to Receptive, even though the flip-set is symmetric: each step's reading comes from
  the ORIGIN side's changing-line text, so direction changes every word of the story. And
  nothing prevents LOOPS — a path may revisit hexagrams, circle, double back; the space of
  journeys is unbounded. The `d!` count describes only the shortest routes, never the whole
  territory. The explorer must allow (and the cast modes may occasionally produce) returns
  and loops — a journey that circles before arriving is a legitimate reading, not an error.
- **Wandering paths** = allow lines to flip and flip back: any step budget ≥ d with the same
  parity (each detour costs 2). This grounds the "how many steps" setting honestly:
  the UI offers valid budgets only (d, d+2, d+4 …), so the promise "the last step is
  deterministic" is always keepable.

## The three modes

1. **EXPLORE (play)** — cast (or pick) origin + destiny. The differing lines are highlighted.
   Tap any line on the current hexagram to flip it: the stack grows one hexagram per flip,
   with the changed line marked between each pair (the intermediary). A small counter shows
   "distance remaining"; reaching the destiny completes the path. Undo = pop the stack.
   This is the "play around all the ways through" mode — hands on the lines.
2. **CAST THE PATH** — one tap: the site casts a full path at the chosen step budget.
   Each intermediate step flips one line chosen at random *from the still-differing lines*
   (direct mode) or from all six with a bias toward closing (wandering mode);
   **the final step deterministically flips whatever still differs**, so the destiny always
   lands. Traditional randomizers for the two END hexagrams (three-coin method by default;
   yarrow probabilities as a setting — same honest-randomness note the tarot caster carries).
3. **SEQUENTIAL CASTER** — the ritual version of 2: intermediates are cast one at a time,
   each appearing in the stack with its changing line, user taps to advance (or auto-advance
   slowly). Same step-budget setting; same deterministic last step. This is the mode she
   described most concretely — the slow, stacked unfolding.

## Reading layer (the point of it)

Every hexagram in the stack renders through the site's voice grammars (three-lenses-64 now;
zhouyi-core / ten-wings when the stratigraphy grammars land — see PLAN-iching-channel.md §2).
For each transition, show the **line text of the changing line** from the origin-side hexagram
— which is exactly what the tradition says a changing line is for. A completed path reads as:
*origin (where I am) → each changed line (what moves, in the text's own words) → destiny
(where this is going)*. "Save this path" → download/share as a grammar JSON (a sequence
grammar: items = the path's hexagrams, metadata = the flipped line per step) — the
save-reading-as-grammar philosophy, static-site style.

## Build notes

- One page: `caster.html` (the header's Views menu already anticipates instruments).
  Pure client JS; hexagram data from `grammars/_collection.json` + the flagship grammar
  (items keyed by hexagram number — the site's matching key). No backend, no flow changes.
- Stacked layout = vertical card list (the family's reading-card style), line diagrams as
  simple 6-row glyphs (solid/broken + a change marker); mobile-first at 390px.
- Settings: step budget (valid parities only), coin/yarrow randomness, direct vs wandering.
- Honesty chrome (family contract): "a casting, not a prediction" kicker; the synthesis
  note ("one transition is classical; the journey is ours").
- Verify per playbook §6 (Playwright at 390/1280: cast, explore-flip, sequential advance,
  deterministic arrival — assert the last hexagram equals the destiny across 50 random runs).
