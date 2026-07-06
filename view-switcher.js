/* {{CHANNEL_NAME}} — "eye" view-switcher deep-link helper.
 *
 * TEMPLATE NOTE: this repo does NOT bundle its own Cards/Study/Tree grammar
 * viewers — those are served by the main recursive.eco platform itself
 * (`https://recursive.eco/pages/grammar-viewer.html?type=<slug>&id=<uuid>`,
 * `study-viewer.html`, `tree-viewer.html` — see recursive-tarot's/astro's
 * ids.json `_preview_links` for the exact URL shapes). A channel repo only
 * needs to host the views that are genuinely repo-local: Genealogy, Lenses,
 * and the Course. This element's job is just a portable deep-link: visiting
 * any page with `?lens=<view>` redirects to that view (preserving the loaded
 * grammar via `?src=/?id=`), so a link like `index.html?grammar=x&lens=genealogy`
 * works from anywhere. It renders no visible UI (see recursive-tarot's Jun 29
 * 2026 note — the in-page eye menu was unreliable; per-page header nav +
 * this deep-link redirect replaced it).
 *
 * Usage:  <script src="<path>/view-switcher.js"></script>
 *         <view-switcher active="genealogy"></view-switcher>
 */
(function () {
  if (customElements.get('view-switcher')) return;

  // Root-relative from any subdir (pages/), so links work everywhere.
  const root = /\/pages\//.test(location.pathname) ? '../' : '';

  // preserve the loaded grammar across views
  const p = new URLSearchParams(location.search);
  const keep = new URLSearchParams();
  for (const k of ['src', 'github', 'id', 'grammar', 'ref']) if (p.get(k)) keep.set(k, p.get(k));
  const qs = keep.toString() ? '?' + keep.toString() : '';

  // [key, label, href] — only the views this repo hosts locally.
  const VIEWS = [
    ['home',      'Home',       root + 'index.html' + qs],
    ['lenses',    'Lenses',     root + 'lenses.html' + qs],
    ['genealogy', 'Genealogy',  root + 'genealogy.html' + qs],
    ['course',    'Course',     root + 'pages/course-viewer.html' + qs],
  ];
  const VIEW_MAP = Object.fromEntries(VIEWS.map(([k, , href]) => [k, href]));

  function autoActive() {
    const f = (location.pathname.split('/').pop() || '').toLowerCase();
    if (f.startsWith('lenses')) return 'lenses';
    if (f.startsWith('genealogy')) return 'genealogy';
    if (f.startsWith('course')) return 'course';
    return 'home';
  }

  // Portable deep-link: ?lens=<view> redirects to that lens at load (preserving
  // src/grammar via the target href; lens is dropped so there's no loop).
  const wantLens = p.get('lens');
  if (wantLens && wantLens !== autoActive() && VIEW_MAP[wantLens]) {
    location.replace(VIEW_MAP[wantLens]);
    return;
  }

  class ViewSwitcher extends HTMLElement {
    connectedCallback() {
      // Renders nothing — the per-page <site-header> nav already covers view
      // switching; this element only exists for the ?lens= deep-link above.
      this.style.display = 'none';
    }
  }
  customElements.define('view-switcher', ViewSwitcher);
})();
