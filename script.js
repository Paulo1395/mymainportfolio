const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const audienceTabs = [...document.querySelectorAll('[data-audience]')];
const workTabs = [...document.querySelectorAll('[data-work-view]')];
const projectGrid = document.querySelector('#project-grid');
const visualsGallery = document.querySelector('#visuals-gallery');
const visualsTrack = document.querySelector('#visuals-track');
const projectCards = [...document.querySelectorAll('.project-card')];
const projectDialog = document.querySelector('#project-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogArt = document.querySelector('#dialog-art');
const toast = document.querySelector('#interaction-toast');
let lastProjectTrigger = null;
let toastTimeout;

const visualsSet = visualsTrack.querySelector('.visuals-set');
const visualsLoop = visualsSet.cloneNode(true);
visualsLoop.setAttribute('aria-hidden', 'true');
visualsLoop.querySelectorAll('img').forEach((image) => image.alt = '');
visualsTrack.append(visualsLoop);

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

const audienceCopy = {
  everyone: 'I design intuitive digital experiences that simplify everyday tasks and make complex products easier to use.',
  recruiters: 'I lead product design from discovery to delivery, turning user insight into clear, accessible digital experiences.',
  founders: 'I help ambitious teams turn sharp ideas into intuitive products people can actually use.',
  product: 'I partner with product teams to untangle complex workflows and ship clear, thoughtful experiences.'
};

audienceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    audienceTabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    document.querySelector('#hero-title').textContent = audienceCopy[tab.dataset.audience];
  });
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + audienceTabs.length) % audienceTabs.length;
    audienceTabs[next].focus();
    audienceTabs[next].click();
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

workTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.workView;
    workTabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    const showVisuals = mode === 'visuals';
    projectGrid.hidden = showVisuals;
    visualsGallery.hidden = !showVisuals;
    visualsGallery.classList.remove('is-active');
    if (showVisuals) {
      void visualsGallery.offsetWidth;
      visualsGallery.classList.add('is-active');
    }
    showToast(mode === 'visuals' ? 'Viewing interface visuals' : 'Viewing selected work');
  });
});

const projectNames = {
  applyflow: 'Applyflow',
  fitfuel: 'Fitfuel',
  profitpulse: 'ProfitPulse'
};

projectCards.forEach((card) => {
  card.addEventListener('click', () => {
    const detailPages = { applyflow: 'applyflow.html', fitfuel: 'fitfuel.html', profitpulse: 'profitpulse.html' };
    if (detailPages[card.dataset.project]) {
      window.location.href = detailPages[card.dataset.project];
      return;
    }
    lastProjectTrigger = card;
    dialogTitle.textContent = projectNames[card.dataset.project];
    const visual = card.querySelector('.project-visual');
    dialogArt.replaceChildren(visual.cloneNode(true));
    projectDialog.showModal();
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
projectDialog.addEventListener('close', () => lastProjectTrigger?.focus());

const revealTargets = [
  ...document.querySelectorAll('.work-section, .project-card, .experience-section, .experience-card, .contact-section')
];
revealTargets.forEach((target, index) => {
  target.classList.add('reveal');
  if (target.classList.contains('project-card') || target.classList.contains('experience-card')) {
    target.classList.add('reveal-delay-' + ((index % 3) + 1));
  }
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

const heroArt = document.querySelector('.hero-art');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroArt.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroArt.style.setProperty('--pointer-x', (x * 18) + 'px');
    heroArt.style.setProperty('--pointer-y', (y * 18) + 'px');
  });
  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--pointer-x', '0px');
    heroArt.style.setProperty('--pointer-y', '0px');
  });
}
