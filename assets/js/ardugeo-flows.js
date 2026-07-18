(() => {
  const flows = [...document.querySelectorAll('[data-code-flow]')];
  if (!flows.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  flows.forEach((root) => {
    const diagram = root.querySelector('[data-flow-diagram]');
    const nodes = [...root.querySelectorAll('[data-flow-node]')];
    const cards = [...root.querySelectorAll('[data-flow-card]')];
    const viewButtons = [...root.querySelectorAll('[data-flow-view]')];
    const inspector = root.querySelector('[data-flow-inspector]');
    const inspectorLink = root.querySelector('[data-flow-inspector-link]');
    const status = root.querySelector('[data-flow-status]');
    const flowId = root.dataset.codeFlow;
    let activeNodeId = '';
    let activeView = 'all';
    let viewAnimation = 0;

    const cardFor = (id) => root.querySelector('[data-flow-card="' + CSS.escape(id) + '"]');
    const nodeFor = (id) => root.querySelector('[data-flow-node="' + CSS.escape(id) + '"]');
    const buttonFor = (name) => viewButtons.find((button) => button.dataset.flowView === name);
    const labelFor = (name) => buttonFor(name)?.dataset.viewLabel || name;
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
        if (progress < 1) viewAnimation = window.requestAnimationFrame(step);
      };

      viewAnimation = window.requestAnimationFrame(step);
    };

    const updateStatus = (message) => {
      if (status) status.textContent = message;
    };

    const setView = (name, shouldAnimate = true) => {
      const button = buttonFor(name);
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

      if (shouldAnimate) {
        animateViewBox(button.dataset.viewbox);
      } else if (diagram) {
        diagram.setAttribute('viewBox', button.dataset.viewbox);
      }

      const count = name === 'all'
        ? cards.length
        : cards.filter((card) => card.dataset.group === name).length;
      updateStatus(
        labelFor(name) + ' · ' + count + ' source-linked step' + (count === 1 ? '' : 's')
      );
    };

    const updateInspector = (id) => {
      const card = cardFor(id);
      if (!card || !inspector) return;
      const symbol = card.querySelector('.code-lab-source-symbol code');
      const excerpt = card.querySelector('.code-lab-source-excerpt pre code');
      const inspectorSymbol = inspector.querySelector('[data-flow-inspector-symbol]');
      const inspectorCode = inspector.querySelector('[data-flow-inspector-code]');
      const inspectorCopy = inspector.querySelector('[data-flow-inspector-copy]');
      inspector.querySelector('[data-flow-inspector-index]').textContent = card.dataset.index;
      inspector.querySelector('[data-flow-inspector-group]').textContent = labelFor(card.dataset.group);
      inspector.querySelector('[data-flow-inspector-label]').textContent = card.dataset.label;
      inspector.querySelector('[data-flow-inspector-description]').textContent = card.dataset.description;
      inspector.querySelector('[data-flow-inspector-file]').textContent = card.dataset.sourceRef;
      if (inspectorSymbol) inspectorSymbol.textContent = symbol?.textContent.trim() || '—';
      if (inspectorCode) inspectorCode.textContent = excerpt?.textContent.trim() || 'Source excerpt unavailable.';
      if (inspectorCopy) inspectorCopy.dataset.flowCopy = card.dataset.sourceRef;
      if (inspectorLink) inspectorLink.href = '#' + card.id;
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
      if (updateHash) window.history.pushState(null, '', '#' + flowId + '-inspect-' + id);

      if (scroll) {
        window.requestAnimationFrame(() => {
          card.scrollIntoView({
            behavior: instant || reduceMotion.matches ? 'auto' : 'smooth',
            block: 'start',
          });
          window.setTimeout(() => {
            try {
              card.focus({ preventScroll: true });
            } catch (_error) {
              card.focus();
            }
          }, reduceMotion.matches || instant ? 0 : 380);
        });
      }
    };

    viewButtons.forEach((button) => {
      button.addEventListener('click', () => setView(button.dataset.flowView));
    });

    nodes.forEach((node) => {
      const id = node.dataset.flowNode;
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
        if (card.open) selectNode(card.dataset.flowCard);
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

    root.querySelectorAll('[data-flow-back]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const id = link.dataset.flowBack;
        const card = cardFor(id);
        setView(card.dataset.group);
        selectNode(id);
        window.history.pushState(null, '', '#' + flowId + '-flow');
        root.scrollIntoView({
          behavior: reduceMotion.matches ? 'auto' : 'smooth',
          block: 'start',
        });
        window.setTimeout(() => nodeFor(id)?.focus(), reduceMotion.matches ? 0 : 380);
      });
    });

    root.querySelectorAll('[data-flow-copy]').forEach((button) => {
      const defaultLabel = button.textContent.trim();
      button.addEventListener('click', async () => {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(button.dataset.flowCopy);
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = button.dataset.flowCopy;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
          }
          button.textContent = 'Copied';
          updateStatus('Copied ' + button.dataset.flowCopy);
        } catch (_error) {
          button.textContent = 'Copy failed';
        }
        window.setTimeout(() => { button.textContent = defaultLabel; }, 1600);
      });
    });

    const selectFromHash = (shouldScroll = false) => {
      const inspectPrefix = '#' + flowId + '-inspect-';
      const inspectId = window.location.hash.startsWith(inspectPrefix)
        ? window.location.hash.slice(inspectPrefix.length)
        : '';
      const card = inspectId
        ? cardFor(inspectId)
        : cards.find((item) => '#' + item.id === window.location.hash);
      if (!card) return false;
      if (!inspectId) {
        window.history.replaceState(null, '', inspectPrefix + card.dataset.flowCard);
      }
      setView(card.dataset.group, false);
      selectNode(card.dataset.flowCard);
      if (shouldScroll) {
        window.requestAnimationFrame(() => {
          root.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      }
      return true;
    };

    window.addEventListener('hashchange', () => selectFromHash(true));
    root.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && activeView !== 'all') {
        event.preventDefault();
        setView('all');
      }
    });

    if (!selectFromHash(true)) {
      if (nodes[0]) selectNode(nodes[0].dataset.flowNode);
      setView('all', false);
    }
  });
})();
