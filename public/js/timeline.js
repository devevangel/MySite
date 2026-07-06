document.addEventListener('DOMContentLoaded', () => {
  const entries = document.querySelectorAll('.timeline-entry');
  if (!entries.length) return;

  if (entries[0]) entries[0].classList.add('is-active');

  const observer = new IntersectionObserver(
    (observed) => {
      observed.forEach((item) => {
        if (item.isIntersecting) {
          entries.forEach((el) => el.classList.remove('is-active'));
          item.target.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );

  entries.forEach((entry) => observer.observe(entry));
});
