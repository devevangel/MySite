document.addEventListener('DOMContentLoaded', () => {
  const groups = document.querySelectorAll('.timeline-year-group');
  if (!groups.length) return;

  groups.forEach((group) => {
    const btn = group.querySelector('.timeline-year-header');
    const entries = group.querySelector('.timeline-year-entries');
    if (!btn || !entries) return;

    btn.addEventListener('click', () => {
      const isOpen = group.classList.contains('is-open');
      if (isOpen) {
        entries.hidden = true;
        group.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        entries.hidden = false;
        group.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
