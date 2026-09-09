document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.blog-toolbar');
  if (!form) return;

  const topic = form.querySelector('#blog-tag');
  if (topic) {
    topic.addEventListener('change', () => {
      form.submit();
    });
  }
});
