/* {{CHANNEL_NAME}} — tiny static loader.
   Loads grammar JSON from a local repo path (?file=), or from a GitHub branch
   (?path=grammars/<slug>&ref=<branch>). No dependencies. */
(function (g) {
  'use strict';

  var OWNER = '{{GITHUB_OWNER}}', REPO = '{{GITHUB_REPO}}';

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  // Resolve where to fetch a grammar from, based on URL params.
  function grammarUrl() {
    var file = qs('file');                 // e.g. grammars/<slug>/grammar.json
    if (file) return rel(file);
    var path = qs('path'), ref = qs('ref'); // e.g. path=grammars/<slug> ref=my-branch
    if (path) {
      if (!/grammar\.json$/.test(path)) path = path.replace(/\/$/, '') + '/grammar.json';
      return 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' +
             (ref || 'main') + '/' + path;
    }
    return null;
  }

  // The viewer pages live at the repo root, alongside the grammars/ data folder,
  // so a repo-relative path is used as-is.
  function rel(p) {
    return p;
  }

  function idsUrl() {
    var ref = qs('ref');
    if (ref) return 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' + ref + '/ids.json';
    return rel('ids.json');
  }

  async function fetchJson(url) {
    var r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error('Could not load ' + url + ' (' + r.status + ')');
    return r.json();
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Render markdown-ish inline: **bold**, *italic*, and an ![](url) image → just strip to text/url.
  function md(s) {
    s = esc(s);
    s = s.replace(/!\[[^\]]*\]\(([^)]+)\)/g, '');           // drop inline images (shown separately)
    s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/\*([^*]+)\*/g, '<i>$1</i>');
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  function grammarHref(slug) {
    var ref = qs('ref');
    return 'index.html?grammar=' + encodeURIComponent(slug) + (ref ? '&ref=' + encodeURIComponent(ref) : '');
  }

  g.RT = { qs: qs, grammarUrl: grammarUrl, idsUrl: idsUrl, fetchJson: fetchJson,
           esc: esc, md: md, grammarHref: grammarHref, rel: rel };
})(window);
