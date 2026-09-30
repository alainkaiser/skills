/*
 * Compare rendered geometry with Figma metadata.
 *
 * Load this file into the page under test (Playwright: page.addScriptTag({ path });
 * DevTools or a browser tool: evaluate its source), then call:
 *
 *   measureAgainstFigma({ root, metadata, map, tolerance })
 *
 * root       CSS selector of the element that renders the metadata's root node.
 * metadata   The XML string returned by get_metadata for that node.
 * map        Optional { "<figma node id>": "<CSS selector inside root>" }. Without it,
 *            nodes are matched by data-node-id attributes when the page carries them.
 * tolerance  Allowed delta in CSS pixels. Default 0.5.
 *
 * Returns { ok, tolerance, rows, fonts }. Each row compares one node's box relative to
 * the root; text rows add computed typography and the line count in Figma and the DOM.
 * fonts lists every font face the document knows, with its load status.
 */
(function () {
  function parseMetadata(metadata) {
    const start = metadata.indexOf('<');
    const end = metadata.lastIndexOf('>');
    if (start === -1 || end === -1) throw new Error('metadata contains no XML');
    const doc = new DOMParser().parseFromString(metadata.slice(start, end + 1), 'application/xml');
    const error = doc.querySelector('parsererror');
    if (error) throw new Error('metadata is not valid XML: ' + error.textContent);
    return doc.documentElement;
  }

  function collectBoxes(figmaRoot) {
    const boxes = new Map();
    const walk = (node, parentX, parentY, isRoot) => {
      const x = isRoot ? 0 : parentX + Number(node.getAttribute('x'));
      const y = isRoot ? 0 : parentY + Number(node.getAttribute('y'));
      boxes.set(node.getAttribute('id'), {
        name: node.getAttribute('name'),
        type: node.tagName,
        x,
        y,
        width: Number(node.getAttribute('width')),
        height: Number(node.getAttribute('height')),
      });
      for (const child of node.children) walk(child, x, y, false);
    };
    walk(figmaRoot, 0, 0, true);
    return boxes;
  }

  const round = (box) =>
    Object.fromEntries(Object.entries(box).map(([k, v]) => [k, Math.round(v * 100) / 100]));

  function typography(el, figmaHeight, domHeight) {
    const s = getComputedStyle(el);
    const lineHeight = parseFloat(s.lineHeight);
    return {
      fontFamily: s.fontFamily,
      fontWeight: s.fontWeight,
      fontStyle: s.fontStyle,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
      textTransform: s.textTransform,
      color: s.color,
      lines: lineHeight
        ? { figma: Math.round(figmaHeight / lineHeight), dom: Math.round(domHeight / lineHeight) }
        : null,
    };
  }

  function measureAgainstFigma({ root, metadata, map, tolerance = 0.5 }) {
    const rootEl = document.querySelector(root);
    if (!rootEl) throw new Error('root selector matched nothing: ' + root);
    const figmaRoot = parseMetadata(metadata);
    const boxes = collectBoxes(figmaRoot);
    const rootId = figmaRoot.getAttribute('id');

    const targets = new Map([[rootId, rootEl]]);
    const rows = [];
    if (map) {
      for (const [id, selector] of Object.entries(map)) {
        const el = rootEl.querySelector(selector);
        if (el) targets.set(id, el);
        else rows.push({ id, ok: false, error: 'selector matched nothing: ' + selector });
      }
    } else {
      for (const id of boxes.keys()) {
        const el = rootEl.querySelector('[data-node-id="' + CSS.escape(id) + '"]');
        if (el && el !== rootEl) targets.set(id, el);
      }
    }

    const origin = rootEl.getBoundingClientRect();
    for (const [id, el] of targets) {
      const figma = boxes.get(id);
      if (!figma) {
        rows.push({ id, ok: false, error: 'node id not in metadata' });
        continue;
      }
      const r = el.getBoundingClientRect();
      const dom = { x: r.left - origin.left, y: r.top - origin.top, width: r.width, height: r.height };
      const delta = {
        x: dom.x - figma.x,
        y: dom.y - figma.y,
        width: dom.width - figma.width,
        height: dom.height - figma.height,
      };
      const row = {
        id,
        name: figma.name,
        ok: Object.values(delta).every((d) => Math.abs(d) <= tolerance),
        figma: round({ x: figma.x, y: figma.y, width: figma.width, height: figma.height }),
        dom: round(dom),
        delta: round(delta),
      };
      if (figma.type === 'text') row.text = typography(el, figma.height, r.height);
      rows.push(row);
    }

    const fonts = [...document.fonts].map((f) => ({
      family: f.family,
      weight: f.weight,
      style: f.style,
      status: f.status,
    }));
    return { ok: rows.every((r) => r.ok), tolerance, rows, fonts };
  }

  globalThis.measureAgainstFigma = measureAgainstFigma;
})();
