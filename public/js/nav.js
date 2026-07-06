document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.tech-header');
  const toggle = document.querySelector('.tech-nav-toggle');
  const menu = document.getElementById('tech-nav-menu');
  if (!header || !toggle || !menu) return;

  const desktopQuery = window.matchMedia('(min-width: 769px)');

  function setOpen(open) {
    header.classList.toggle('is-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-menu-open', open);
  }

  function closeMenu() {
    setOpen(false);
  }

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('is-nav-open'));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
});
