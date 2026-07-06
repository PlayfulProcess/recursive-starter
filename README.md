# recursive-starter

A template for building your own **grammar site** — a small, free, self-hosted website that
turns a folder of JSON files into a browsable library of tarot decks, I Ching hexagrams,
astrology charts, story sequences, prompt libraries, or any other symbolic system people use
to make sense of things. It plugs straight into [recursive.eco](https://recursive.eco) — the
"tree" that these "fruit sites" grow from — but it also works entirely on its own: no backend,
no build step, no framework. Plain HTML, one CSS file, and JSON.

This is the same template used to build [The Recursive Tarot](https://tarot.recursive.eco) and
The Recursive Astrology — copied, stripped of everything tarot/astrology-specific, and turned
into placeholders (`{{CHANNEL_NAME}}` and friends) so a new domain starts from a clean, working
site instead of a blank page.

## What you get

- **A homepage** that reads any grammar's JSON and renders it as browsable cards — click a
  card, read its sections.
- **Lenses** — pick one item name and see how every grammar in your repo that has an item by
  that name treats it, side by side.
- **Genealogy** — a visual graph of how your grammars relate to one another (by date, by
  lineage, by function).
- **A course** — a guided, chapter-by-chapter read-through, driven by a simple manifest file so
  adding a chapter is "write markdown, add one line" — no code.
- **Shared site chrome** — a header, footer, icon set, and a sign-in widget that (if you want)
  shares a session with recursive.eco, so a signed-in visitor stays signed in across sites.
- **A validator** (`check.py`) that catches the mistakes that stop a grammar from loading, with
  zero installed dependencies — just Python.
- **One example grammar** (`grammars/example-grammar/`) showing the exact JSON shape to copy.

## How to start

1. Click **"Use this template"** on GitHub (or clone this repo).
2. Open the new repo in an editor with an AI coding assistant (Claude Code, Cursor, etc.) —
   or just open it yourself.
3. Read **[`CLAUDE.md`](CLAUDE.md)**. It's written as a step-by-step walkthrough for filling in
   this template with a real domain — picking a name, writing your first grammars, wiring the
   manifest files, and (optionally) connecting to recursive.eco. It includes a worked example
   using the I Ching as the sample domain, so you can see exactly what "done" looks like before
   you start on your own.
4. If you're not a developer, that's the point: describe what you want to your AI assistant
   ("I want a site for my collection of oracle cards called Wildwood") and let it work through
   `CLAUDE.md`'s steps with you.

No npm install, no server to run in production — GitHub Pages serves the repo root as-is. For
local preview: `python3 -m http.server 8000` in the repo folder, then visit
`http://localhost:8000/`.

## What's a grammar?

A **grammar** is one JSON file describing a symbolic system: a name, a description, and a list
of **items** (cards, hexagrams, songs, chapters — whatever your domain's units are), each with
its own **sections** (named blocks of prose: an interpretation, a history note, a symbol
reading). See **[`GRAMMAR_FORMAT.md`](GRAMMAR_FORMAT.md)** for the full, canonical shape, and
`grammars/example-grammar/grammar.json` for a minimal worked example.

## Provenance

This template is a stripped, templatized copy of
[recursive-tarot](https://github.com/PlayfulProcess/recursive-tarot)'s platform machinery (with
some pieces — `lenses.html`, the course manifest pattern — taken from
[recursive-astrology](https://github.com/PlayfulProcess/Recursive-astrology)'s cleaner, more
data-driven ports of the same ideas). See **[`TEMPLATE-NOTES.md`](TEMPLATE-NOTES.md)** for the
full keep/drop/templatize decision log, if you're curious what didn't make the cut and why.

## License / status

Private-by-default philosophy: **share the grammar format and the site code, not necessarily
your content.** What you publish under `grammars/` is up to you. This repo itself is offered as
a template — fork it, strip the `{{PLACEHOLDERS}}`, make it yours.
