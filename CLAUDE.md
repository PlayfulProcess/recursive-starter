# CLAUDE.md — recursive-starter

*Read this file first. It is written for a Claude (or any AI coding assistant) session that has
just been handed this template and a new domain to fill it with — say, "build me a site for
[X]" where X is tarot, I Ching, astrology, tea ceremony, a family of oracle decks, whatever. The
builder using this template is very likely NOT a developer. Don't wait for permission at each
step — work through the numbered steps below in order, make reasonable calls, and only stop to
ask when something is genuinely ambiguous (the domain itself, a real name/slug choice, or
anything that needs the builder's own credentials).*

## What this repo is

A static, backend-free website that turns a folder of JSON "grammar" files into a browsable
library — the same pattern used by [recursive-tarot](https://github.com/PlayfulProcess/recursive-tarot)
(tarot) and [recursive-astrology](https://github.com/PlayfulProcess/Recursive-astrology)
(astrology), stripped down and templatized so it can become a **new** domain instead. Every
place a real channel would have a specific name, slug, domain, or description, this template has
an obvious `{{PLACEHOLDER}}` instead. Your job in this session is to replace those, author real
grammars, and get the site live.

See `TEMPLATE-NOTES.md` if you want the full "why does this file look the way it does"
provenance — every KEEP/DELETE/templatize decision made when this template was built from
recursive-tarot + recursive-astrology.

---

## Step 1 — Pick the channel identity, sweep the placeholders

Before writing any content, nail down four things (ask the builder if any of these is genuinely
undecided — they're creative/identity choices, not technical ones):

| Placeholder | What it is | Example (I Ching) |
|---|---|---|
| `{{CHANNEL_NAME}}` | Display name, shown in the header/footer/titles | "The Recursive I Ching" |
| `{{CHANNEL_SLUG}}` | Lowercase, hyphenated, used in `recursive-eco.json` + URLs | `iching` |
| `{{CHANNEL_DOMAIN}}` | The eventual custom domain (can be a placeholder-of-a-placeholder if undecided yet — a `.github.io` URL works fine to start) | `iching.recursive.eco` |
| `{{CHANNEL_DESCRIPTION}}` | One sentence, used in the manifest + meta description + footer | "The 64 hexagrams of the I Ching, read as a mirror, not an oracle." |
| `{{GITHUB_OWNER}}` | The GitHub username/org this repo lives under | `PlayfulProcess` |
| `{{GITHUB_REPO}}` | This repo's actual name after you rename it from the template | `recursive-iching` |
| `{{UUID_FROM_RECURSIVE_ECO}}` | Filled in LATER, in Step 7 — leave as-is for now | — |

Once you have real values for the first six, **sweep every file** — every placeholder appears
in multiple files (theme.css, style.css, icons.js, loader.js, view-switcher.js, auth-widget.js,
site-header.js, site-footer.js, index.html, lenses.html, genealogy.html, check.py,
recursive-eco.json, ids.json, course/manifest.json, course/welcome.mdx, README.md). A
find-and-replace across the whole repo is the fastest way — e.g.:

```bash
grep -rl '{{CHANNEL_NAME}}' --include='*.html' --include='*.js' --include='*.json' --include='*.css' --include='*.md' --include='*.mdx' --include='*.py' . \
  | xargs sed -i 's/{{CHANNEL_NAME}}/The Recursive I Ching/g'
```

Repeat for each placeholder. Do NOT touch `{{UUID_FROM_RECURSIVE_ECO}}` in `ids.json` yet — that
one only gets filled in once a grammar has actually been imported to recursive.eco (Step 7).

**Also update `site-header.js`'s `GRAMMAR_MENU` array** (near the top of the file) — it's a
small hand-maintained list of `[slug, label]` pairs for the "Grammars" dropdown, separate from
the placeholder sweep because it needs real content, not a find-and-replace. Add one entry per
grammar you create in Step 2. `theme.css`'s `--gold` accent color is also worth revisiting here
(see the TEMPLATE NOTE at its top) — pick a color that fits the new domain, or leave the warm
gold default if you don't have a strong preference yet.

---

## Step 2 — Author your grammars

Grammars live at `grammars/<slug>/grammar.json`, one folder per grammar. **Read
[`GRAMMAR_FORMAT.md`](GRAMMAR_FORMAT.md) in full before writing your first one** — it's the
canonical, authoritative shape (shared verbatim with recursive-tarot and recursive-astrology; if
you're ever unsure whether something will render, that file is the answer).

The shape, briefly:

- **Top level**: `name`, `description`, `grammar_type` (must be one of the types listed in
  `GRAMMAR_FORMAT.md` — use `"custom"` if nothing else fits), `items[]`.
- **Each item**: `id` (pattern: `<category>-<name>`, e.g. `hexagram-1-the-creative`), `name`,
  `sections` (an object of named prose blocks — you choose the section names; keep them
  consistent across sibling items in the same grammar so viewers read cleanly).
- **Composite items** (a chapter that groups hexagrams, a suit that groups cards, a pattern that
  groups views) use `composite_of: [id1, id2, ...]` instead of an image — there is NO separate
  top-level `emergences` array; composites live in `items[]` alongside leaves.
- **Images**: use a real, working **public-domain** URL via Wikimedia's stable file-resolution
  pattern: `https://commons.wikimedia.org/wiki/Special:FilePath/<Exact File Name.ext>`. Search
  [Wikimedia Commons](https://commons.wikimedia.org) for the actual filename of a public-domain
  image before using this pattern — don't guess a filename. If you can't verify an image is
  public domain, leave `image_url` off rather than risk a licensing problem.
- **Delete or keep `grammars/example-grammar/`**: it's a working, valid 3-item grammar that
  demonstrates the shape (including a composite item). Once you've authored your own first real
  grammar, either delete the example folder or leave it as a live reference — your call. If you
  keep it, remove it from `ids.json` / the header dropdown / the homepage gallery so it doesn't
  show up as real content.

**Author using the recursive.eco MCP if you have it available** (grammar-building tools like
`create_grammar` / `add_items`) — it's faster and less error-prone than hand-writing JSON. If
you don't have MCP access this session, hand-authoring is completely fine; just run `check.py`
often (Step 5) to catch mistakes early rather than after writing 60 items.

---

## Step 3 — Wire the manifest files

Two files describe this repo to recursive.eco and to itself:

1. **`recursive-eco.json`** — the channel manifest. After the Step 1 sweep this should already
   have your real `channel.slug`, `channel.name`, `channel.description`, `landing_url`. Fill in
   `channel.icon` (a single emoji — this is the one place an emoji is fine, it's channel
   branding metadata, not in-app UI) and `channel.hero.body_md` (one or two REPLACE-ME
   paragraphs — see the file for what's expected). `grammars.paths` (`["grammars/*/grammar.json"]`)
   almost never needs to change; add to `grammars.exclude` only if you build a generated
   meta/reference grammar you don't want imported as a channel member.
2. **`ids.json`** — the slug → recursive.eco UUID map. Add one entry per grammar under `ids` —
   value is `"{{UUID_FROM_RECURSIVE_ECO}}"` (still a placeholder) until you complete Step 7,
   which replaces it with a real UUID. Also add a matching entry under `preview_links` (mirrors
   the `_preview_links` template documented at the top of the file) so the homepage gallery has
   a "Raw JSON" link even before the grammar has a UUID.

---

## Step 4 — Wire the pages to your grammars

- **`index.html`**: the homepage gallery is **fully data-driven from `ids.json`** — its slug
  list comes from `Object.keys(ids.json's "ids" object)`, so once Step 3 is done, new cards
  appear automatically. Nothing to hand-edit here for a new grammar. The single-grammar reader
  (`index.html?grammar=<slug>`) defaults to `example-grammar`; change the default slug in the
  `<script>` block near the bottom once you have a real flagship grammar.
- **`lenses.html`**: also fully data-driven — it reads every grammar via `ids.json` and indexes
  items by name, so "lenses" (grammars sharing an item name) appear automatically once you have
  2+ grammars with overlapping item names (e.g. two different hexagram-1 grammars, two decks
  that both have a card called "The Fool"). Nothing to hand-edit unless you want to change the
  matching rule (currently: exact name match, case-insensitive).
- **`genealogy.html`**: **hand-author the `NODES` / `EDGES` arrays** near the top of the
  `<script>` block. This is the one page that isn't auto-derived (see `TEMPLATE-NOTES.md` for
  why — the original tarot version needs a generated "meta grammar" build script that's out of
  scope for a starter). Add one `NODES` entry per grammar (or notable item) you want on the map,
  with a `tier` (root / ancestral / descendant / cousin), a rough `date`, and optionally a
  `slug` linking back to the real grammar. Add `EDGES` connecting related nodes. Small and
  hand-curated is fine — this is a map, not a database.
- **`course/manifest.json` + `course/*.mdx`**: replace the placeholder `welcome.mdx` chapter (or
  keep it as chapter 1 and add more after it) — write plain markdown files under `course/`, add
  one manifest entry per chapter (`slug`, `title`, `summary`, `file`). `pages/course-viewer.html`
  renders the sidebar + content from the manifest; no code change needed to add a chapter.

---

## Step 5 — Validate

Run the checker until it's green:

```bash
python3 check.py
```

It should end with `OK: all checks passed (<N> grammars)`. It catches: invalid JSON, missing
required fields, an invalid `grammar_type`, a stray top-level `emergences` array (should be
`composite_of` inside `items[]` instead), `composite_of` referencing an id that doesn't exist,
and `metadata.video_id` (should be `youtube_video_id`). Run it again after every grammar edit —
it's instant and has zero dependencies.

Also sanity-check the pages render: serve the repo locally —

```bash
python3 -m http.server 8000
```

— then visit `http://localhost:8000/`, `/lenses.html`, `/genealogy.html`, and
`/pages/course.html`. All four should load without a console error and without the "could not
load" fallback message (that message specifically means you opened the file directly via
`file://` instead of through the local server — browsers block those fetches).

---

## Step 6 — Publish to GitHub Pages

Once the site works locally:

1. **Push this repo to GitHub** (if you haven't already — the builder will have created the
   repo from this template; make sure your commits are pushed to `main`).
2. Go to **`https://github.com/{{GITHUB_OWNER}}/{{GITHUB_REPO}}/settings/pages`**.
3. Under **"Build and deployment"**, set **Source** to **"Deploy from a branch"**.
4. Set **Branch** to **`main`** and the folder to **`/ (root)`**, then click **Save**.
5. Wait a minute or two, then the same Pages settings page will show a green box with your live
   URL: `https://{{GITHUB_OWNER}}.github.io/{{GITHUB_REPO}}/`.
6. **Custom domain (optional)**: if `{{CHANNEL_DOMAIN}}` is a real domain you control, add it in
   the same Pages settings page's "Custom domain" field, and create a `CNAME` file at the repo
   root containing just that domain (one line, no protocol — e.g. `iching.recursive.eco`). Then
   add a CNAME DNS record at your domain registrar pointing `{{CHANNEL_DOMAIN}}` at
   `{{GITHUB_OWNER}}.github.io`. This step needs access to DNS settings, so it's one only the
   domain owner (the builder, usually) can complete — hand it to them as a clear, numbered,
   click-by-click walkthrough with the exact DNS record type/name/value if you don't have DNS
   access yourself.

---

## Step 7 — Connect to recursive.eco (optional but recommended)

This makes your grammars playable as live oracles/readers on recursive.eco itself (AI-assisted
readings, community editing, the Cards/Study/Tree viewers), on top of the standalone static site
from Steps 1–6.

1. **Someone with recursive.eco access creates the channel** — this is a step only the platform
   owner (or someone they've given access) can do; if that's not you this session, hand this off
   clearly rather than guessing at it.
2. **Import the grammars**: recursive.eco reads `recursive-eco.json` from
   `https://raw.githubusercontent.com/{{GITHUB_OWNER}}/{{GITHUB_REPO}}/main/recursive-eco.json`
   to discover the channel + its grammar paths, and imports each `grammars/*/grammar.json` as a
   `user_documents` row.
3. **Fill in the real UUIDs**: once imported, each grammar gets a UUID on recursive.eco. Copy
   those UUIDs into this repo's `ids.json` — replace `{{UUID_FROM_RECURSIVE_ECO}}` with the real
   value for each slug under `ids`, and update the matching `preview_links` entries (`cards` /
   `study` / `tree` / `play` URLs — see the `_preview_links` template string at the top of
   `ids.json` for the exact URL shapes to fill in). Commit and push — the homepage gallery and
   header dropdown will immediately start showing working Cards/Study/Tree/Open-in-app links
   because they're driven off `ids.json`, no other code changes needed.
4. **Add a repo webhook** so future pushes automatically notify recursive.eco:
   - Go to **`https://github.com/{{GITHUB_OWNER}}/{{GITHUB_REPO}}/settings/hooks/new`**.
   - **Payload URL**: `https://flow.recursive.eco/api/github/webhook`
   - **Content type**: `application/json`
   - **Secret**: get this value from the recursive.eco platform owner — it's a shared secret
     used to verify the webhook came from GitHub, not something you invent yourself.
   - **Which events**: choose "Let me select individual events" → check **"Pushes"** only.
   - Click **"Add webhook"**. GitHub will send a test ping; check back on this same page (it
     lists recent deliveries) to confirm it shows a green checkmark, not a red X.

If any of steps 1 or 4's secret is blocked on someone else, say so explicitly and give the
builder the exact next thing THEY need to do (per this template's own house style — see
`TEMPLATE-NOTES.md` if curious why) rather than leaving the chain to silently stall.

---

## Worked micro-example: I Ching

To make the above concrete, here's what filling in this template for an **I Ching** channel
looks like (the builder's father is expected to test with I Ching next, so this is a real
worked path, not a hypothetical):

**Step 1 values:**
- `{{CHANNEL_NAME}}` → "The Recursive I Ching"
- `{{CHANNEL_SLUG}}` → `iching`
- `{{CHANNEL_DOMAIN}}` → `iching.recursive.eco`
- `{{CHANNEL_DESCRIPTION}}` → "The 64 hexagrams of the I Ching, read as a mirror for reflection,
  never a fortune to obey."

**Step 2 — grammar sketch** (`grammars/wilhelm-baynes-iching/grammar.json`, `grammar_type:
"iching"`; only the first two hexagrams shown — a real grammar has all 64):

```jsonc
{
  "name": "I Ching — Wilhelm/Baynes (public domain lineage)",
  "description": "The 64 hexagrams, translation lineage in the Wilhelm/Baynes tradition.",
  "grammar_type": "iching",
  "items": [
    {
      "id": "hexagram-1-the-creative",
      "name": "The Creative",
      "category": "hexagram",
      "metadata": { "number": 1, "binary": "111111", "unicode": "䷀" },
      "sections": {
        "Judgment": "REPLACE-ME: the hexagram's core reading.",
        "Image": "REPLACE-ME: the natural image associated with this hexagram.",
        "Lines": "REPLACE-ME: notes on the changing lines, if you're modeling them per-line."
      }
    },
    {
      "id": "hexagram-2-the-receptive",
      "name": "The Receptive",
      "category": "hexagram",
      "metadata": { "number": 2, "binary": "000000", "unicode": "䷁" },
      "sections": {
        "Judgment": "REPLACE-ME",
        "Image": "REPLACE-ME"
      }
    }
    /* … hexagrams 3–64 … */
  ]
}
```

(`metadata.number` 1–64 + `metadata.binary`/`unicode` is what lets the platform's oracle
recognize this as I Ching-shaped and apply hexagram selection rules — see the parent platform's
own `CLAUDE.md` "Grammar types are dead code" section: it infers hexagram-ness from the item
DATA shape, not from `grammar_type` alone, so keep `number`/`binary` on every hexagram item.)

**Step 3**: `recursive-eco.json` → `channel.slug: "iching"`; `ids.json` → `"ids": {
"wilhelm-baynes-iching": "{{UUID_FROM_RECURSIVE_ECO}}" }`.

**Step 4 — genealogy sketch**: one `NODES` entry (`{ node_id: 'n1', label: 'Wilhelm/Baynes
I Ching', date: '1950', tier: 'root', slug: 'wilhelm-baynes-iching', count: 64 }`), no edges yet
until a second translation/lineage grammar exists to relate it to.

Everything else — Step 5 (`check.py`), Step 6 (GitHub Pages), Step 7 (connect to recursive.eco)
— proceeds exactly as written above, no I Ching-specific deviation needed.

---

## House rules while working in this repo

- **Fix the grammar, not the app** — if a grammar looks wrong in a viewer, the fix is almost
  always correcting the grammar JSON to match `GRAMMAR_FORMAT.md`, not adding app code that
  tolerates a variant shape. This mirrors the parent recursive.eco platform's own rule.
- **Don't branch app code on `grammar_type`** outside the editor/authoring step. Infer behavior
  from the item's own data (does it have `number` 1–64 + `binary`? treat as I Ching-shaped).
  `grammar_type` is mostly a hint for humans and for `check.py`'s validation, not a runtime gate.
- **SVG icons, never emoji** in on-page UI (the one exception: `recursive-eco.json`'s
  `channel.icon`, which is metadata, not UI). Add new glyphs to `icons.js` rather than reaching
  for an emoji.
- **All colour lives in `theme.css`.** Never redeclare a colour token locally, never add a
  dark-mode block — this site is light-only by design (see `theme.css`'s header comment).
- **Never invent a citation, quote, or URL** when authoring grammar content that makes
  historical or textual claims. Hedge uncertain claims, attribute paraphrases as paraphrases,
  and prefer omitting a fact over fabricating one.
- **Reuse the canonical interaction** rather than inventing a new one — before adding a new UI
  control, check if `lenses.html` / `genealogy.html` / the course pattern already covers the
  need.
