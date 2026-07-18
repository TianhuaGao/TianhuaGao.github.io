(() => {
  const flows = [...document.querySelectorAll('[data-code-flow]')];
  if (!flows.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  flows.forEach((root) => {
    const diagram = root.querySelector('[data-flow-diagram]');
    const nodes = [...root.querySelectorAll('[data-flow-node]')];
    const records = [...root.querySelectorAll('[data-flow-record]')];
    const viewButtons = [...root.querySelectorAll('[data-flow-view]')];
    const inspector = root.querySelector('[data-flow-inspector]');
    const status = root.querySelector('[data-flow-status]');
    const flowId = root.dataset.codeFlow;
    let activeView = 'all';
    let viewAnimation = 0;

    const recordFor = (id) => root.querySelector('[data-flow-record="' + CSS.escape(id) + '"]');
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

      if (shouldAnimate) {
        animateViewBox(button.dataset.viewbox);
      } else if (diagram) {
        diagram.setAttribute('viewBox', button.dataset.viewbox);
      }

      const count = name === 'all'
        ? records.length
        : records.filter((record) => record.dataset.group === name).length;
      updateStatus(
        labelFor(name) + ' · ' + count + ' source-linked step' + (count === 1 ? '' : 's')
      );
    };

    const updateInspector = (id) => {
      const record = recordFor(id);
      if (!record || !inspector) return;
      const symbol = record.querySelector('[data-flow-record-symbol]');
      const excerpt = record.querySelector('[data-flow-record-excerpt]');
      const inspectorSymbol = inspector.querySelector('[data-flow-inspector-symbol]');
      const inspectorCode = inspector.querySelector('[data-flow-inspector-code]');
      const inspectorCopy = inspector.querySelector('[data-flow-inspector-copy]');
      const inspectorSourceLink = inspector.querySelector('[data-flow-inspector-source-link]');
      inspector.querySelector('[data-flow-inspector-index]').textContent = record.dataset.index;
      inspector.querySelector('[data-flow-inspector-group]').textContent = labelFor(record.dataset.group);
      inspector.querySelector('[data-flow-inspector-label]').textContent = record.dataset.label;
      inspector.querySelector('[data-flow-inspector-description]').textContent = record.dataset.description;
      inspector.querySelector('[data-flow-inspector-file]').textContent = record.dataset.sourceRef;
      if (inspectorSymbol) inspectorSymbol.textContent = symbol?.textContent.trim() || '—';
      if (inspectorCode) inspectorCode.textContent = excerpt?.textContent.trim() || 'Source excerpt unavailable.';
      if (inspectorCopy) inspectorCopy.dataset.flowCopy = record.dataset.sourceRef;
      if (inspectorSourceLink) inspectorSourceLink.href = record.dataset.sourceUrl;
    };

    const selectNode = (id, options = {}) => {
      const { updateHash = false } = options;
      const node = nodeFor(id);
      const record = recordFor(id);
      if (!node || !record) return;

      nodes.forEach((item) => item.classList.toggle('is-active', item === node));
      updateInspector(id);
      updateStatus(record.dataset.label + ' · source shown in the side inspector');
      if (updateHash) window.history.pushState(null, '', '#' + flowId + '-inspect-' + id);
    };

    viewButtons.forEach((button) => {
      button.addEventListener('click', () => setView(button.dataset.flowView));
    });

    nodes.forEach((node) => {
      const id = node.dataset.flowNode;
      node.addEventListener('focus', () => {
        selectNode(id);
        updateStatus(recordFor(id).dataset.label + ' · press Enter to show source at right');
      });
      node.addEventListener('click', (event) => {
        event.preventDefault();
        const record = recordFor(id);
        if (activeView !== 'all' && activeView !== record.dataset.group) setView(record.dataset.group);
        selectNode(id, { updateHash: true });
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
      const legacyPrefix = '#' + flowId + '-source-';
      const inspectId = window.location.hash.startsWith(inspectPrefix)
        ? window.location.hash.slice(inspectPrefix.length)
        : '';
      const legacyId = window.location.hash.startsWith(legacyPrefix)
        ? window.location.hash.slice(legacyPrefix.length)
        : '';
      const id = inspectId || legacyId;
      const record = id ? recordFor(id) : null;
      if (!record) return false;
      if (legacyId) {
        window.history.replaceState(null, '', inspectPrefix + id);
      }
      setView(record.dataset.group, false);
      selectNode(id);
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
