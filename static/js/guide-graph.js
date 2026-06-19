(() => {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const isMobile = () => window.matchMedia('(max-width: 640px)').matches;
  const edgeKey = (from, to) => `${from}:${to}`;
  const parseList = (value) => (value || '').split(/\s+/).filter(Boolean);

  document.querySelectorAll('[data-guide-graph]').forEach((graph) => {
    const svg = graph.querySelector('.guide-graph-lines');
    const lineElements = [...svg.querySelectorAll('line[data-from][data-to]')];
    const nodeElements = [...graph.querySelectorAll('[data-node]')];
    const states = new Map();
    const neighbors = new Map();
    let active = null;
    let previewState = null;
    let graphRect = graph.getBoundingClientRect();
    let lastTime = performance.now();
    const preview = document.createElement('div');

    preview.className = 'guide-preview';
    preview.setAttribute('aria-hidden', 'true');
    preview.innerHTML = `
      <img class="guide-preview-cover" alt="">
      <div class="guide-preview-copy">
        <span class="guide-preview-kicker"></span>
        <strong class="guide-preview-title"></strong>
        <p class="guide-preview-summary"></p>
      </div>
    `;
    graph.append(preview);

    const previewCover = preview.querySelector('.guide-preview-cover');
    const previewKicker = preview.querySelector('.guide-preview-kicker');
    const previewTitle = preview.querySelector('.guide-preview-title');
    const previewSummary = preview.querySelector('.guide-preview-summary');

    const readPercent = (node, property, fallback) => {
      const value = node.style.getPropertyValue(property).trim();
      return value.endsWith('%') ? Number.parseFloat(value) / 100 : fallback;
    };

    const refreshBounds = () => {
      graphRect = graph.getBoundingClientRect();
    };

    const seedStates = () => {
      refreshBounds();
      nodeElements.forEach((node) => {
        const px = readPercent(node, '--x', 0.5);
        const py = readPercent(node, '--y', 0.5);
        states.set(node.dataset.node, {
          node,
          x: graphRect.width * px,
          y: graphRect.height * py,
          vx: 0,
          vy: 0,
          homeX: graphRect.width * px,
          homeY: graphRect.height * py,
        });
        neighbors.set(node.dataset.node, new Set([node.dataset.node]));
      });

      lineElements.forEach((line) => {
        neighbors.get(line.dataset.from)?.add(line.dataset.to);
        neighbors.get(line.dataset.to)?.add(line.dataset.from);
      });
    };

    const writeNode = (state) => {
      state.node.style.setProperty('--x', `${(state.x / graphRect.width) * 100}%`);
      state.node.style.setProperty('--y', `${(state.y / graphRect.height) * 100}%`);
    };

    const updateLines = () => {
      const viewBox = svg.viewBox.baseVal;
      lineElements.forEach((line) => {
        const from = states.get(line.dataset.from);
        const to = states.get(line.dataset.to);
        line.setAttribute('x1', (from.x / graphRect.width) * viewBox.width);
        line.setAttribute('y1', (from.y / graphRect.height) * viewBox.height);
        line.setAttribute('x2', (to.x / graphRect.width) * viewBox.width);
        line.setAttribute('y2', (to.y / graphRect.height) * viewBox.height);
      });
    };

    const placePreview = () => {
      if (!previewState || isMobile()) return;
      const width = preview.offsetWidth || 260;
      const margin = 18;
      const dockLeft = previewState.x > graphRect.width * 0.58;
      const x = dockLeft ? margin : graphRect.width - width - margin;
      const y = margin;
      preview.style.setProperty('--preview-x', `${x}px`);
      preview.style.setProperty('--preview-y', `${y}px`);
    };

    const showPreview = (state) => {
      if (isMobile()) return;
      previewState = state;
      previewCover.src = state.node.dataset.previewCover || '';
      previewCover.alt = `${state.node.dataset.previewTitle || 'Guide'} cover`;
      previewKicker.textContent = state.node.dataset.previewKicker || '';
      previewTitle.textContent = state.node.dataset.previewTitle || state.node.textContent.trim();
      previewSummary.textContent = state.node.dataset.previewSummary || '';
      preview.classList.add('is-visible');
      placePreview();
    };

    const hidePreview = () => {
      previewState = null;
      preview.classList.remove('is-visible');
    };

    const applyForces = (dt, now) => {
      const values = [...states.values()];

      values.forEach((state) => {
        if (active?.state === state) return;

        const floatX = Math.sin(now / 1500 + state.homeX * 0.01) * 0.9;
        const floatY = Math.cos(now / 1700 + state.homeY * 0.01) * 0.9;
        state.vx += (state.homeX + floatX - state.x) * 0.018 * dt;
        state.vy += (state.homeY + floatY - state.y) * 0.018 * dt;
      });

      for (let i = 0; i < values.length; i += 1) {
        for (let j = i + 1; j < values.length; j += 1) {
          const a = values[i];
          const b = values[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const force = Math.min(0.28, 1500 / (dist * dist));
          const fx = (dx / dist) * force * dt;
          const fy = (dy / dist) * force * dt;
          if (active?.state !== a) {
            a.vx -= fx;
            a.vy -= fy;
          }
          if (active?.state !== b) {
            b.vx += fx;
            b.vy += fy;
          }
        }
      }

      lineElements.forEach((line) => {
        const a = states.get(line.dataset.from);
        const b = states.get(line.dataset.to);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const target = graphRect.width * 0.34;
        const pull = (dist - target) * 0.0009 * dt;
        const fx = (dx / dist) * pull;
        const fy = (dy / dist) * pull;
        if (active?.state !== a) {
          a.vx += fx;
          a.vy += fy;
        }
        if (active?.state !== b) {
          b.vx -= fx;
          b.vy -= fy;
        }
      });

      values.forEach((state) => {
        if (active?.state === state) return;
        state.vx *= 0.9;
        state.vy *= 0.9;
        state.x += state.vx * dt;
        state.y += state.vy * dt;
        state.x = clamp(state.x, 82, graphRect.width - 82);
        state.y = clamp(state.y, 82, graphRect.height - 82);
      });
    };

    const frame = (now) => {
      const dt = Math.min(2, (now - lastTime) / 16.67);
      lastTime = now;

      if (!isMobile()) {
        applyForces(dt, now);
        states.forEach(writeNode);
        updateLines();
        placePreview();
      }

      requestAnimationFrame(frame);
    };

    const startDrag = (state, event) => {
      if (isMobile()) return;
      refreshBounds();
      active = {
        state,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        moved: false,
      };
      state.vx = 0;
      state.vy = 0;
      state.node.classList.add('is-dragging');
      state.node.setPointerCapture(event.pointerId);
    };

    const moveDrag = (state, event) => {
      if (!active || active.state !== state) return;
      const previousX = state.x;
      const previousY = state.y;
      state.x = clamp(event.clientX - graphRect.left, 82, graphRect.width - 82);
      state.y = clamp(event.clientY - graphRect.top, 82, graphRect.height - 82);
      state.vx = (state.x - previousX) * 0.35;
      state.vy = (state.y - previousY) * 0.35;
      state.homeX += (state.x - state.homeX) * 0.025;
      state.homeY += (state.y - state.homeY) * 0.025;
      if (Math.hypot(event.clientX - active.startX, event.clientY - active.startY) > 4) {
        active.moved = true;
        state.node.dataset.dragged = 'true';
      }
      active.lastX = event.clientX;
      active.lastY = event.clientY;
      writeNode(state);
      updateLines();
    };

    const endDrag = (state, event) => {
      if (!active || active.state !== state) return;
      state.node.releasePointerCapture(event.pointerId);
      state.node.classList.remove('is-dragging');
      if (!active.moved) {
        delete state.node.dataset.dragged;
      }
      active = null;
    };

    const emphasize = (nodeId) => {
      const focusState = states.get(nodeId);
      const focusNodes = new Set(parseList(focusState?.node.dataset.focusNodes));
      const focusEdges = new Set(parseList(focusState?.node.dataset.focusEdges));
      const related = focusNodes.size ? focusNodes : (neighbors.get(nodeId) || new Set([nodeId]));
      graph.classList.add('is-emphasizing');

      states.forEach((state, id) => {
        state.node.classList.toggle('is-related', related.has(id));
        state.node.classList.toggle('is-muted', !related.has(id));
      });

      lineElements.forEach((line) => {
        const forwardKey = edgeKey(line.dataset.from, line.dataset.to);
        const reverseKey = edgeKey(line.dataset.to, line.dataset.from);
        const isRelated = focusEdges.size
          ? focusEdges.has(forwardKey) || focusEdges.has(reverseKey)
          : line.dataset.from === nodeId || line.dataset.to === nodeId;
        line.classList.toggle('is-related', isRelated);
        line.classList.toggle('is-muted', !isRelated);
      });
    };

    const clearEmphasis = () => {
      graph.classList.remove('is-emphasizing');
      states.forEach((state) => {
        state.node.classList.remove('is-related', 'is-muted');
      });
      lineElements.forEach((line) => {
        line.classList.remove('is-related', 'is-muted');
      });
    };

    seedStates();

    states.forEach((state) => {
      state.node.addEventListener('pointerdown', (event) => startDrag(state, event));
      state.node.addEventListener('pointermove', (event) => moveDrag(state, event));
      state.node.addEventListener('pointerup', (event) => endDrag(state, event));
      state.node.addEventListener('pointercancel', (event) => endDrag(state, event));
      state.node.addEventListener('pointerenter', () => emphasize(state.node.dataset.node));
      state.node.addEventListener('pointerenter', () => showPreview(state));
      state.node.addEventListener('pointerleave', () => {
        if (!active) clearEmphasis();
        if (!active) hidePreview();
      });
      state.node.addEventListener('focus', () => emphasize(state.node.dataset.node));
      state.node.addEventListener('focus', () => showPreview(state));
      state.node.addEventListener('blur', () => {
        clearEmphasis();
        hidePreview();
      });
      state.node.addEventListener('click', (event) => {
        if (state.node.dataset.dragged === 'true') {
          event.preventDefault();
          delete state.node.dataset.dragged;
        }
      });
    });

    window.addEventListener('resize', () => {
      const oldWidth = graphRect.width || 1;
      const oldHeight = graphRect.height || 1;
      refreshBounds();
      states.forEach((state) => {
        const scaleX = graphRect.width / oldWidth;
        const scaleY = graphRect.height / oldHeight;
        state.x *= scaleX;
        state.y *= scaleY;
        state.homeX *= scaleX;
        state.homeY *= scaleY;
        writeNode(state);
      });
      updateLines();
    });

    updateLines();
    requestAnimationFrame(frame);
  });
})();
