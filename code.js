// Figma Plugin: Prototype Link Generator
// Generates prototype links for selected frames with Fit Width (scaling=contain)

figma.showUI(__html__, {
  width: 380,
  height: 560,
  themeColors: true
});

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Walk up the node tree to find the nearest FRAME ancestor. */
function findParentFrame(node) {
  let current = node.parent;
  while (current && current.type !== 'PAGE' && current.type !== 'DOCUMENT') {
    if (current.type === 'FRAME') return current;
    current = current.parent;
  }
  return null;
}

/**
 * Build the prototype URL for a frame node.
 * Throws 'FILE_KEY_MISSING' if figma.fileKey is unavailable.
 */
function buildProtoLink(frame, scaling = 'contain') {
  const fileKey = figma.fileKey;
  if (!fileKey) throw new Error('FILE_KEY_MISSING');

  const nodeId = frame.id.replace(':', '-');
  
  // Format the document name into a clean slug
  const rawName = figma.root.name || 'Prototype';
  let slug = rawName.trim().replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-');
  if (!slug) slug = 'Prototype';
  slug = encodeURIComponent(slug);

  // Figma's native format encodes page-id with %3A instead of -
  let pageId = '';
  if (figma.currentPage) {
    pageId = figma.currentPage.id.replace(':', '%3A');
  }

  return (
    `https://www.figma.com/proto/${fileKey}/${slug}` +
    `?node-id=${nodeId}` +
    `&scaling=${scaling}` +
    `&content-scaling=fixed` +
    (pageId ? `&page-id=${pageId}` : '') +
    `&starting-point-node-id=${nodeId}`
  );
}

/**
 * Process the current page selection into a deduplicated list of frames.
 * Returns { frames, warnings }.
 */
function processSelection(selection) {
  const seen = new Set();
  const frames = [];
  const warnings = [];

  for (const node of selection) {
    let target = null;

    if (node.type === 'FRAME') {
      target = node;
    } else {
      const parent = findParentFrame(node);
      if (parent) {
        target = parent;
      } else {
        warnings.push(`"${node.name}" is not inside any frame — skipped.`);
        continue;
      }
    }

    if (!seen.has(target.id)) {
      seen.add(target.id);
      frames.push(target);
    }
  }

  return { frames, warnings };
}

// ─── Main handler ─────────────────────────────────────────────────────────────

async function handleGenerateLinks(scaling) {
  // 1. Ensure file key is present (required for URLs)
  if (!figma.fileKey) {
    figma.ui.postMessage({ type: 'file-key-missing' });
    return;
  }

  // 2. Check selection exists
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'no-selection' });
    return;
  }

  // 3. Process frames
  const { frames, warnings } = processSelection(selection);

  if (frames.length === 0) {
    // Determine whether it was purely invalid types or just warnings
    figma.ui.postMessage({
      type: warnings.length > 0 ? 'invalid-selection' : 'no-valid-frames',
      error: warnings.join('\n')
    });
    return;
  }

  // 4. Generate links
  const links = [];
  const errors = [];

  for (const frame of frames) {
    try {
      links.push({
        name: frame.name,
        url: buildProtoLink(frame, scaling)
      });
    } catch (err) {
      if (err.message === 'FILE_KEY_MISSING') {
        figma.ui.postMessage({ type: 'file-key-missing' });
        return;
      }
      errors.push(`"${frame.name}": ${err.message}`);
    }
  }

  // 5. Return results
  figma.ui.postMessage({
    type: 'links-generated',
    data: {
      links,
      frameCount: frames.length,
      errors,
      warnings
    }
  });
}

// ─── Message router ───────────────────────────────────────────────────────────

figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'ui-ready':
        figma.ui.postMessage({
          type: 'plugin-ready',
          data: { fileKeyExists: Boolean(figma.fileKey) }
        });
        break;

      case 'generate-links':
        await handleGenerateLinks(msg.scaling);
        break;

      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (err) {
    console.error('Plugin error:', err);
    figma.ui.postMessage({
      type: 'error',
      error: err.message || 'An unexpected error occurred.'
    });
  }
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────

figma.on('close', () => { /* cleanup if needed */ });

console.log('Prototype Link Generator — loaded');
