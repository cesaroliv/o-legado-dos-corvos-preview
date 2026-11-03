(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('.site-header');
  const progress = $('#read-progress');
  const updateScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 35);
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${distance > 0 ? Math.min(100, window.scrollY / distance * 100) : 0}%`;
  };
  document.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Footer scroll bypasses fixed header anchoring.
  document.querySelectorAll('[data-scroll-top]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReduced.matches ? 'instant' : 'smooth' });
    if (location.hash && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }));
  const menuBtn = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  const closeMenu = () => { mobileNav.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir menu'); };
  menuBtn.addEventListener('click', () => {
    const opening = !mobileNav.hidden;
    mobileNav.hidden = opening;
    menuBtn.setAttribute('aria-expanded', String(!opening));
    menuBtn.setAttribute('aria-label', opening ? 'Abrir menu' : 'Fechar menu');
  });
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  if ('IntersectionObserver' in window && !prefersReduced.matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }});
    }, { threshold: .12, rootMargin: '0px 0px -15px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else { $$('.reveal').forEach(el => el.classList.add('is-visible')); }

  const film = $("#hero-film");
  // Film remains silent; reduced-motion users get a static poster.
  if (prefersReduced.matches) film.pause();
  prefersReduced.addEventListener?.("change", e => {
    if (e.matches) film.pause(); else film.play().catch(() => {});
  });

  const tabs = $$('.case-tab');
  const panels = $$('.case-panel');
  const chooseTab = (next, focus = false) => {
    tabs.forEach((tab, index) => { const active = index === next; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    panels.forEach((panel, index) => { panel.hidden = index !== next; });
    if (focus) tabs[next].focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => chooseTab(index));
    tab.addEventListener('keydown', e => {
      if (['ArrowDown','ArrowUp','Home','End'].includes(e.key)) {
        e.preventDefault(); const n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (index + (e.key === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length;
        chooseTab(n, true);
      }
    });
  });

  const images = {
    front: { src: 'assets/book-front.webp', alt: 'Capa do livro O Legado dos Corvos em perspectiva' },
    back: { src: 'assets/book-back.webp', alt: 'Contracapa do livro O Legado dos Corvos' },
    stack: { src: 'assets/book-stack.webp', alt: 'Cinco exemplares de O Legado dos Corvos empilhados' }
  };
  const stage = $('#product-main');
  $$('.gallery-button').forEach(button => button.addEventListener('click', () => {
    const data = images[button.dataset.product]; if (!data) return;
    stage.src = data.src; stage.alt = data.alt;
    $$('.gallery-button').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  }));

})();