document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.experience-more-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.experience-card');
      if (!card) return;

      const extras = card.querySelectorAll('.experience-bullet--extra');
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      extras.forEach((el) => {
        el.hidden = expanded;
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      btn.textContent = expanded ? 'See more' : 'See less';
    });
  });
});
