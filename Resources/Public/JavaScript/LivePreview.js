const FIELD_NAMES = [
  'target_url',
  'style_preset',
  'fg_color',
  'bg_color',
  'error_correction',
  'size',
  'margin',
  'dot_style',
  'dot_intensity',
  'rounded_modules',
  'eye_style',
  'eye_radius',
  'fg_gradient_from',
  'fg_gradient_to',
  'fg_gradient_angle',
  'logo_file',
  'logo_scale',
  'drop_shadow',
  'logo_bg',
  'logo_bg_color',
  'logo_bg_radius',
  'logo_bg_padding',
];

const PRESET_CONTROLLED_FIELDS = new Set([
  'fg_color',
  'bg_color',
  'error_correction',
  'margin',
  'rounded_modules',
  'dot_style',
  'dot_intensity',
  'eye_style',
  'eye_radius',
  'fg_gradient_from',
  'fg_gradient_to',
  'fg_gradient_angle',
  'drop_shadow',
  'logo_bg',
  'logo_bg_color',
]);

const selectorVariants = (field) => [
  `[name$="[${field}]"]`,
  `[data-formengine-input-name$="[${field}]"]`,
];

const findCandidates = (field) => {
  const candidates = [];
  selectorVariants(field).forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => candidates.push(element));
  });
  return [...new Set(candidates)];
};

const findPreferredFieldElement = (field) => {
  const candidates = findCandidates(field);
  if (candidates.length === 0) {
    return null;
  }

  return candidates.find((element) => !(element instanceof HTMLInputElement && element.type === 'hidden')) ?? candidates[0];
};

const readValue = (field) => {
  const candidates = findCandidates(field);
  if (candidates.length === 0) {
    return '';
  }

  const checkbox = candidates.find((element) => element instanceof HTMLInputElement && element.type === 'checkbox');
  if (checkbox) {
    return checkbox.checked ? '1' : '';
  }

  const preferred = candidates.find((element) => !(element instanceof HTMLInputElement && element.type === 'hidden')) ?? candidates[0];
  return preferred.value ?? '';
};

const encodeSvg = (svg) => 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));

const waitForElement = (selector, attempts = 40) => new Promise((resolve) => {
  const find = (remaining) => {
    const element = document.querySelector(selector);
    if (element || remaining <= 0) {
      resolve(element ?? null);
      return;
    }
    window.setTimeout(() => find(remaining - 1), 100);
  };

  find(attempts);
});

const findDesignTabPane = (image) => image.closest('.tab-pane, [role="tabpanel"], .tabpanel');

const getTopLevelSections = (container) => {
  const sections = [...container.querySelectorAll('.form-section')];
  return sections.filter((section) => !section.parentElement?.closest('.form-section'));
};

const getPreviewSection = (image, container) => {
  return image.closest('.form-section')
    ?? image.closest('.formengine-field-item')
    ?? container.querySelector('.form-section');
};

const getPreviewFieldItem = (image) => image.closest('.formengine-field-item');

const getTopLevelFieldItems = (container) => {
  const items = [...container.querySelectorAll('.formengine-field-item')];
  return items.filter((item) => !item.parentElement?.closest('.formengine-field-item'));
};

const ensureStickyInner = (rightColumn) => {
  if (!rightColumn) {
    return null;
  }

  let stickyInner = rightColumn.querySelector('[data-dynamic-qr-design-sticky="1"]');
  if (!stickyInner) {
    stickyInner = document.createElement('div');
    stickyInner.dataset.dynamicQrDesignSticky = '1';
    stickyInner.style.position = 'sticky';
    stickyInner.style.top = 'calc(var(--module-docheader-height, 86px) + 24px)';

    const existingChildren = [...rightColumn.childNodes];
    existingChildren.forEach((child) => stickyInner.appendChild(child));
    rightColumn.appendChild(stickyInner);
  }

  return stickyInner;
};

const ensureDesignLayout = (image) => {
  const tabPane = findDesignTabPane(image);
  const previewSection = tabPane ? getPreviewSection(image, tabPane) : null;
  if (!previewSection || !tabPane) {
    return null;
  }

  let layout = tabPane.querySelector('[data-dynamic-qr-design-layout]');
  let leftColumn;
  let rightColumn;

  if (!layout) {
    layout = document.createElement('div');
    layout.dataset.dynamicQrDesignLayout = '1';
    layout.style.display = 'grid';
    layout.style.gridTemplateColumns = 'minmax(0, 1fr) minmax(0, 1fr)';
    layout.style.gap = '24px';
    layout.style.alignItems = 'start';
    layout.style.overflow = 'visible';

    leftColumn = document.createElement('div');
    leftColumn.dataset.dynamicQrDesignColumn = 'left';
    leftColumn.style.minWidth = '0';
    leftColumn.style.overflow = 'visible';

    rightColumn = document.createElement('div');
    rightColumn.dataset.dynamicQrDesignColumn = 'right';
    rightColumn.style.minWidth = '0';
    rightColumn.style.alignSelf = 'start';
    rightColumn.style.overflow = 'visible';

    const stickyInner = ensureStickyInner(rightColumn);
    rightColumn.appendChild(stickyInner);
    layout.append(leftColumn, rightColumn);

    const sections = getTopLevelSections(tabPane);
    if (sections.length >= 2) {
      tabPane.insertBefore(layout, sections[0]);

      sections.forEach((section) => {
        if (section === previewSection) {
          stickyInner.appendChild(section);
        } else {
          leftColumn.appendChild(section);
        }
      });
    } else {
      const previewFieldItem = getPreviewFieldItem(image);
      const fieldItems = getTopLevelFieldItems(tabPane);
      if (!previewFieldItem || fieldItems.length < 2) {
        return null;
      }

      const anchorItem = fieldItems[0];
      tabPane.insertBefore(layout, anchorItem);

      fieldItems.forEach((item) => {
        if (item === previewFieldItem) {
          stickyInner.appendChild(item);
        } else {
          leftColumn.appendChild(item);
        }
      });
    }
  } else {
    leftColumn = layout.querySelector('[data-dynamic-qr-design-column="left"]');
    rightColumn = layout.querySelector('[data-dynamic-qr-design-column="right"]');
    ensureStickyInner(rightColumn);
  }

  const syncLayout = () => {
    const stacked = window.matchMedia('(max-width: 768px)').matches;
    const stickyInner = rightColumn?.querySelector('[data-dynamic-qr-design-sticky="1"]');
    layout.style.gridTemplateColumns = stacked ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)';
    rightColumn.style.position = stacked ? 'static' : 'sticky';
    rightColumn.style.top = stacked ? '0' : 'calc(var(--module-docheader-height, 86px) + 24px)';
    if (stickyInner) {
      stickyInner.style.position = 'static';
      stickyInner.style.top = '0';
    }
  };

  syncLayout();
  window.addEventListener('resize', syncLayout);

  return {
    sync: syncLayout,
  };
};

const mount = (image, endpoint, uid) => {
  if (image.dataset.dynamicQrInitialized === '1') {
    return;
  }
  image.dataset.dynamicQrInitialized = '1';

  const designLayout = ensureDesignLayout(image);

  let timer = null;
  const queuePreview = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(async () => {
      const body = new URLSearchParams();
      body.set('uid', String(uid));
      FIELD_NAMES.forEach((field) => body.set(field, readValue(field)));

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          body: body.toString(),
          credentials: 'same-origin',
        });
        if (!response.ok) {
          return;
        }
        image.src = encodeSvg(await response.text());
      } catch (error) {
        console.warn('Dynamic QR live preview failed', error);
      }
    }, 200);
  };

  FIELD_NAMES.forEach((field) => {
    findCandidates(field).forEach((element) => {
      if (field !== 'style_preset' && PRESET_CONTROLLED_FIELDS.has(field)) {
        element.addEventListener('input', () => {
          const presetField = findPreferredFieldElement('style_preset');
          if (presetField && presetField.value !== 'custom') {
            presetField.value = 'custom';
            presetField.dispatchEvent(new Event('change', {bubbles: true}));
          }
        });
        element.addEventListener('change', () => {
          const presetField = findPreferredFieldElement('style_preset');
          if (presetField && presetField.value !== 'custom') {
            presetField.value = 'custom';
            presetField.dispatchEvent(new Event('change', {bubbles: true}));
          }
        });
      }

      element.addEventListener('input', queuePreview);
      element.addEventListener('change', queuePreview);
    });
  });

  designLayout?.sync();
};

const initialize = async (imageSelector, endpoint, uid) => {
  const image = await waitForElement(imageSelector);
  if (!image) {
    console.warn('Dynamic QR live preview image not found', imageSelector);
    return;
  }

  mount(image, endpoint, uid);
};

export {initialize};
export default {initialize};
