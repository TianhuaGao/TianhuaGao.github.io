(() => {
  const init = () => {
    const toc = document.querySelector('.hb-toc');
    if (!toc) return;

    const tocScroller = toc.querySelector('.hb-scrollbar') || toc;
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    if (!links.length) return;

    const linkById = new Map();
    links.forEach((link) => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      if (id) linkById.set(id, link);
    });

    const headings = [...document.querySelectorAll('main h2[id], main h3[id], article h2[id], article h3[id]')]
      .filter((heading) => linkById.has(heading.id));
    if (!headings.length) return;

    let activeId = '';

    const setActive = (id) => {
      if (!id || id === activeId) return;
      activeId = id;

      links.forEach((link) => {
        const isActive = link === linkById.get(id);
        link.classList.toggle('toc-scrollspy-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      const activeLink = linkById.get(id);
      if (!activeLink) return;

      const linkTop = activeLink.offsetTop;
      const targetTop = Math.max(0, linkTop - tocScroller.clientHeight * 0.38);
      tocScroller.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    };

    const currentHeadingId = () => {
      const marker = window.scrollY + window.innerHeight * 0.28;
      let current = headings[0].id;

      headings.forEach((heading) => {
        if (heading.offsetTop <= marker) {
          current = heading.id;
        }
      });

      return current;
    };

    let ticking = false;
    const update = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setActive(currentHeadingId());
        ticking = false;
      });
    };

    links.forEach((link) => {
      link.addEventListener('click', () => {
        const id = decodeURIComponent(link.getAttribute('href').slice(1));
        setActive(id);
      });
    });

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
