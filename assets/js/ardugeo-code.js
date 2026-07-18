(() => {
  const root = document.querySelector('[data-ardugeo-code]');
  if (!root) return;

  const diagram = root.querySelector('[data-code-diagram]');
  const nodes = [...root.querySelectorAll('[data-code-node]')];
  const cards = [...root.querySelectorAll('[data-source-card]')];
  const viewButtons = [...root.querySelectorAll('[data-code-view]')];
  const inspector = root.querySelector('[data-code-inspector]');
  const inspectorLink = root.querySelector('[data-inspector-link]');
  const architecture = root.querySelector('#architecture');
  const architectureLink = root.querySelector('[data-scroll-architecture]');
  const status = root.querySelector('[data-code-status]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const groupLabels = {
    all: 'Overview',
    guided: 'Guided front end',
    loiter: 'Loiter front end',
    cascade: 'PID cascade',
    safety: 'Safety + output',
    evidence: 'Compatibility + evidence',
  };

  let activeNodeId = '';
  let activeView = 'all';
  let viewAnimation = 0;

  const cardFor = (id) => root.querySelector('[data-source-card="' + CSS.escape(id) + '"]');
  const nodeFor = (id) => root.querySelector('[data-code-node="' + CSS.escape(id) + '"]');

  const parseViewBox = (value) => value.trim().split(/\s+/).map(Number);

  const animateViewBox = (targetValue) => {
    if (!diagram) return;
    const target = parseViewBox(targetValue);
    const current = parseViewBox(diagram.getAttribute('viewBox'));
    window.cancelAnimationFrame(viewAnimation);

    if (reduceMotion.matches || current.length !== 4 || target.length !== 4) {
      diagram.setAttribute('viewBox', target.join(' '));
      return;
    }

    const startedAt = performance.now();
    const duration = 360;
    const ease = (value) => 1 - Math.pow(1 - value, 3);

    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = ease(progress);
      const frame = current.map((value, index) => (
        value + (target[index] - value) * eased
      ));
      diagram.setAttribute('viewBox', frame.join(' '));
      if (progress < 1) {
        viewAnimation = window.requestAnimationFrame(step);
      }
    };

    viewAnimation = window.requestAnimationFrame(step);
  };

  const updateStatus = (message) => {
    if (status) status.textContent = message;
  };

  const setView = (name, shouldAnimate = true) => {
    const button = viewButtons.find((item) => item.dataset.codeView === name);
    if (!button) return;

    activeView = name;
    viewButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    nodes.forEach((node) => {
      const related = name === 'all' || node.dataset.group === name;
      node.classList.toggle('is-in-view', name !== 'all' && related);
      node.classList.toggle('is-muted', name !== 'all' && !related);
    });

    cards.forEach((card) => {
      card.hidden = name !== 'all' && card.dataset.group !== name;
    });

    if (diagram) {
      if (shouldAnimate) {
        animateViewBox(button.dataset.viewbox);
      } else {
        diagram.setAttribute('viewBox', button.dataset.viewbox);
      }
    }

    const visibleCount = name === 'all'
      ? cards.length
      : cards.filter((card) => card.dataset.group === name).length;
    updateStatus(
      groupLabels[name] + ' · ' + visibleCount + ' source-linked block' +
      (visibleCount === 1 ? '' : 's')
    );
  };

  const updateInspector = (id) => {
    const card = cardFor(id);
    if (!card || !inspector) return;

    const symbol = card.querySelector('.code-lab-source-symbol code');
    const excerpt = card.querySelector('.code-lab-source-excerpt pre code');
    const inspectorSymbol = inspector.querySelector('[data-inspector-symbol]');
    const inspectorCode = inspector.querySelector('[data-inspector-code]');
    const inspectorCopy = inspector.querySelector('[data-inspector-copy]');

    inspector.querySelector('[data-inspector-index]').textContent = card.dataset.index;
    inspector.querySelector('[data-inspector-group]').textContent = groupLabels[card.dataset.group];
    inspector.querySelector('[data-inspector-label]').textContent = card.dataset.label;
    inspector.querySelector('[data-inspector-description]').textContent = card.dataset.description;
    inspector.querySelector('[data-inspector-file]').textContent = card.dataset.sourceRef;
    if (inspectorSymbol) inspectorSymbol.textContent = symbol?.textContent.trim() || '—';
    if (inspectorCode) inspectorCode.textContent = excerpt?.textContent.trim() || 'Source excerpt unavailable.';
    if (inspectorCopy) inspectorCopy.dataset.copySource = card.dataset.sourceRef;
    if (inspectorLink) inspectorLink.href = '#source-' + id;
  };

  const selectNode = (id, options = {}) => {
    const {
      open = false,
      scroll = false,
      updateHash = false,
      instant = false,
    } = options;
    const node = nodeFor(id);
    const card = cardFor(id);
    if (!node || !card) return;

    activeNodeId = id;
    nodes.forEach((item) => item.classList.toggle('is-active', item === node));
    cards.forEach((item) => item.classList.toggle('is-active', item === card));
    updateInspector(id);
    updateStatus(card.dataset.label + ' · source shown in the side inspector');

    if (open) card.open = true;

    if (updateHash) {
      window.history.pushState(null, '', '#inspect-' + id);
    }

    if (scroll) {
      window.requestAnimationFrame(() => {
        card.scrollIntoView({
          behavior: instant ? 'instant' : (reduceMotion.matches ? 'auto' : 'smooth'),
          block: 'start',
        });
        window.setTimeout(() => {
          try {
            card.focus({ preventScroll: true });
          } catch (_error) {
            card.focus();
          }
        }, reduceMotion.matches ? 0 : 380);
      });
    }
  };

  const scrollToArchitecture = (updateHash = false, instant = false) => {
    if (!architecture) return;
    if (updateHash) {
      window.history.pushState(null, '', '#architecture');
    }
    window.requestAnimationFrame(() => {
      architecture.scrollIntoView({
        behavior: instant ? 'instant' : (reduceMotion.matches ? 'auto' : 'smooth'),
        block: 'start',
      });
    });
  };

  if (architectureLink) {
    architectureLink.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToArchitecture(true);
    });
  }

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setView(button.dataset.codeView);
    });
  });

  nodes.forEach((node) => {
    const id = node.dataset.codeNode;

    node.addEventListener('focus', () => {
      selectNode(id);
      updateStatus(cardFor(id).dataset.label + ' · press Enter to show source at right');
    });
    node.addEventListener('click', (event) => {
      event.preventDefault();
      const card = cardFor(id);
      if (card.hidden) setView(card.dataset.group);
      selectNode(id, { updateHash: true });
    });
  });

  cards.forEach((card) => {
    card.addEventListener('toggle', () => {
      if (card.open) selectNode(card.dataset.sourceCard);
    });
  });

  if (inspectorLink) {
    inspectorLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (!activeNodeId) return;
      const card = cardFor(activeNodeId);
      if (card.hidden) setView(card.dataset.group);
      selectNode(activeNodeId, { open: true, scroll: true, updateHash: true });
    });
  }

  root.querySelectorAll('[data-back-to-node]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = link.dataset.backToNode;
      const card = cardFor(id);
      setView(card.dataset.group);
      selectNode(id);
      window.history.pushState(null, '', '#architecture');
      root.querySelector('#architecture').scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });
      window.setTimeout(() => {
        const node = nodeFor(id);
        if (node) node.focus();
      }, reduceMotion.matches ? 0 : 380);
    });
  });

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  };

  root.querySelectorAll('[data-copy-source]').forEach((button) => {
    const defaultLabel = button.textContent.trim();
    button.addEventListener('click', async () => {
      try {
        await copyText(button.dataset.copySource);
        button.textContent = 'Copied';
        updateStatus('Copied ' + button.dataset.copySource);
      } catch (_error) {
        button.textContent = 'Copy failed';
      }
      window.setTimeout(() => {
        button.textContent = defaultLabel;
      }, 1600);
    });
  });

  const selectFromHash = (shouldScroll = false) => {
    const match = window.location.hash.match(/^#(?:inspect|source)-(.+)$/);
    if (!match || !cardFor(match[1])) return false;
    const id = match[1];
    const card = cardFor(id);
    if (window.location.hash.startsWith('#source-')) {
      window.history.replaceState(null, '', '#inspect-' + id);
    }
    setView(card.dataset.group, false);
    selectNode(id);
    if (shouldScroll) scrollToArchitecture(false, true);
    return true;
  };

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#architecture') {
      scrollToArchitecture(false, true);
      return;
    }
    selectFromHash(true);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeView !== 'all') {
      event.preventDefault();
      setView('all');
    }
  });

  if (!selectFromHash(true)) {
    selectNode('selector');
    setView('all', false);
    if (window.location.hash === '#architecture') {
      scrollToArchitecture(false, true);
    }
  }
})();
