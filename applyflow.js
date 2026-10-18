const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

document.querySelector('#year').textContent = new Date().getFullYear();

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !open);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  });
});

const flowDialog = document.querySelector('.flow-dialog');
const flowZoomButton = document.querySelector('.case-flow-zoom');
const flowCloseButton = document.querySelector('.flow-dialog-close');
const flowImage = document.querySelector('.flow-dialog-viewport img');
const flowZoomLevel = document.querySelector('.flow-zoom-level');
let flowZoom = 1;

if (flowDialog && flowZoomButton && flowCloseButton && flowImage && flowZoomLevel) {
  const setFlowZoom = (nextZoom) => {
    flowZoom = Math.min(2, Math.max(0.75, nextZoom));
    flowImage.style.width = `${flowZoom * 100}%`;
    flowZoomLevel.textContent = `${Math.round(flowZoom * 100)}%`;
  };

  flowZoomButton.addEventListener('click', () => {
    setFlowZoom(1);
    flowDialog.showModal();
    flowDialog.querySelector('.flow-dialog-viewport').focus();
  });

  flowDialog.querySelectorAll('[data-flow-zoom]').forEach((control) => {
    control.addEventListener('click', () => {
      const direction = control.dataset.flowZoom === 'in' ? 0.25 : -0.25;
      setFlowZoom(flowZoom + direction);
    });
  });

  flowCloseButton.addEventListener('click', () => flowDialog.close());

  flowDialog.addEventListener('click', (event) => {
    if (event.target === flowDialog) flowDialog.close();
  });

  flowDialog.addEventListener('close', () => flowZoomButton.focus());
}

const revealTargets = [...document.querySelectorAll(
  '.case-hero, .case-facts, .case-copy-grid, .case-showcase, .case-cta, .about-contact, .fitfuel-screen-sequence, .profitpulse-cover'
)];
revealTargets.forEach((target, index) => {
  target.classList.add('reveal');
  if (target.matches('.case-copy-grid')) target.classList.add(`reveal-delay-${(index % 3) + 1}`);
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}
