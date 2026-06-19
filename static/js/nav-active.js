(() => {
  const nav = document.getElementById('nav-menu');
  if (!nav) return;

  const links = [...nav.querySelectorAll('.nav-link[href]')];
  const homePath = '/';
  const sectionIds = ['news', 'papers', 'events'];
  const scrollSectionIds = ['papers', 'events'];
  const sectionLinks = new Map();

  links.forEach((link) => {
    const hash = new URL(link.href, window.location.origin).hash.slice(1);
    if (sectionIds.includes(hash)) {
      sectionLinks.set(hash, link);
    }
  });

  const normalizePath = (path) => {
    if (!path || path === '/') return homePath;
    return path.endsWith('/') ? path : `${path}/`;
  };

  const setActive = (activeLink) => {
    links.forEach((link) => {
      link.classList.toggle('active', link === activeLink);
      if (link === activeLink) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const linkForLocation = () => {
    const path = normalizePath(window.location.pathname);
    const hash = window.location.hash.slice(1);

    if (path === homePath && sectionLinks.has(hash)) {
      return sectionLinks.get(hash);
    }

    return links.find((link) => {
      const url = new URL(link.href, window.location.origin);
      return normalizePath(url.pathname) === path && !url.hash;
    });
  };

  const setActiveForLocation = () => {
    const activeLink = linkForLocation();
    if (activeLink) setActive(activeLink);
  };

  const activeSectionFromScroll = () => {
    if (normalizePath(window.location.pathname) !== homePath) return null;

    const marker = window.scrollY + window.innerHeight * 0.35;
    let activeId = null;

    scrollSectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.offsetTop <= marker) {
        activeId = id;
      }
    });

    return activeId;
  };

  const setActiveForScroll = () => {
    const activeId = activeSectionFromScroll();
    if (activeId && sectionLinks.has(activeId)) {
      setActive(sectionLinks.get(activeId));
      return;
    }

    if (normalizePath(window.location.pathname) === homePath && window.scrollY < window.innerHeight * 0.28) {
      setActiveForLocation();
    }
  };

  let ticking = false;
  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      setActiveForScroll();
      ticking = false;
    });
  };

  links.forEach((link) => {
    link.addEventListener('click', () => {
      setActive(link);
    });
  });

  window.addEventListener('hashchange', setActiveForLocation);
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('load', setActiveForScroll);
  setActiveForLocation();
})();
