document.addEventListener("DOMContentLoaded", () => {
  const page = document.querySelector(".sanm-paper-page");
  if (!page) return;

  const video = page.querySelector(".sanm-paper-hero video");
  const motionButton = page.querySelector(".sanm-paper-motion");
  const motionLabel = motionButton?.querySelector("[data-sanm-motion-label]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let heroVisible = true;
  let manuallyPaused = reducedMotion.matches;

  const renderMotion = () => {
    if (!video || !motionButton || !motionLabel) return;
    const shouldPlay = heroVisible && !manuallyPaused && !reducedMotion.matches;

    if (shouldPlay) video.play().catch(() => {});
    else video.pause();

    motionButton.classList.toggle("is-paused", !shouldPlay);
    motionButton.setAttribute("aria-pressed", String(!shouldPlay));
    motionButton.setAttribute("aria-label", shouldPlay ? "Pause background video" : "Play background video");
    motionLabel.textContent = shouldPlay ? "Pause motion" : "Play motion";
  };

  motionButton?.addEventListener("click", () => {
    manuallyPaused = !video?.paused;
    renderMotion();
  });

  if (video) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting && entry.intersectionRatio > 0.18;
      renderMotion();
    }, { threshold: [0, 0.18, 0.55] });
    heroObserver.observe(page.querySelector(".sanm-paper-hero"));
  }

  const handleMotionPreference = () => {
    manuallyPaused = reducedMotion.matches;
    renderMotion();
  };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", handleMotionPreference);
  else reducedMotion.addListener(handleMotionPreference);
  renderMotion();

  const progress = page.querySelector(".sanm-paper-progress span");
  const navLinks = [...page.querySelectorAll(".sanm-paper-nav-links a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateReadingState = () => {
    const articleTop = page.offsetTop;
    const scrollable = Math.max(page.scrollHeight - window.innerHeight, 1);
    const ratio = Math.min(Math.max((window.scrollY - articleTop) / scrollable, 0), 1);
    if (progress) progress.style.transform = `scaleX(${ratio})`;

    let current = sections[0]?.id;
    const activationLine = window.scrollY + Math.min(window.innerHeight * 0.35, 280);
    sections.forEach((section) => {
      if (section.offsetTop <= activationLine) current = section.id;
    });

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateReadingState();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener("resize", updateReadingState, { passive: true });
  updateReadingState();
});
