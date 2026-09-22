(() => {
  const section = document.querySelector('.home-feature');
  if (!section) return;
  const slides = Array.from(section.querySelectorAll('.feature-slide'));
  const controls = section.querySelector('.feature-controls');
  const selectors = Array.from(section.querySelectorAll('[data-slide]'));
  const pause = section.querySelector('.feature-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reducedMotion.matches;
  let hovered = false;
  let timer;
  function show(index) {
    current = index;
    slides.forEach((slide, i) => { slide.hidden = i !== current; slide.inert = i !== current; });
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
  }
  function schedule() {
    window.clearTimeout(timer);
    pause.textContent = paused ? 'Resume rotation' : 'Pause rotation';
    if (paused || hovered || document.hidden || section.contains(document.activeElement)) return;
    timer = window.setTimeout(() => {
      show((current + 1) % slides.length);
      schedule();
    }, 5000);
  }
  selectors.forEach((button, i) => button.addEventListener('click', () => {
    show(i);
    schedule();
  }));
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  section.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  section.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  section.addEventListener('focusin', schedule);
  section.addEventListener('focusout', () => window.setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; schedule(); });
  show(current);
  controls.hidden = false;
  schedule();
})();
