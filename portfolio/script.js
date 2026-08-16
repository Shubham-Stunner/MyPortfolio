const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.getElementById('site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const backTop = document.getElementById('back-top');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 16);
  backTop.classList.toggle('show', scrollY > 700);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    if (entry.target.querySelectorAll('[data-count]').length) animateCounters(entry.target);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal,.pipeline-watch').forEach(el => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

function animateCounters(scope) {
  if (prefersReduced) { scope.querySelectorAll('[data-count]').forEach(el => el.textContent = el.dataset.count); return; }
  scope.querySelectorAll('[data-count]').forEach(el => {
    const end = Number(el.dataset.count); let current = 0; const step = Math.max(1, Math.ceil(end / 34));
    const timer = setInterval(() => { current += step; if (current >= end) { current = end; clearInterval(timer); } el.textContent = current; }, 28);
  });
}

const terminalLines = ['$ whoami','shubham-mukherjee','', '$ kubectl get pods','NAME              STATUS','api-service       Running','frontend          Running','payment-service   Running','', '$ aws ec2 describe-instances','Instances: 12','Status: Healthy','', '$ terraform apply','Infrastructure successfully deployed.'];
const terminal = document.getElementById('terminal-output');
async function typeTerminal() {
  if (prefersReduced) { terminal.textContent = terminalLines.join('\n'); return; }
  for (const line of terminalLines) {
    for (const char of line) { terminal.textContent += char; await wait(18); }
    terminal.textContent += '\n'; await wait(line.startsWith('$') ? 220 : 70);
  }
}
function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
typeTerminal();

document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.background = `radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px, rgba(57,213,255,.16), rgba(14,30,52,.72) 38%)`;
  });
  card.addEventListener('pointerleave', () => card.style.background = '');
});

const emailButton = document.getElementById('email-copy');
const copyStatus = document.getElementById('copy-status');
emailButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('shubhammukherji654@gmail.com');
    copyStatus.textContent = 'Email copied to clipboard.';
  } catch {
    copyStatus.textContent = 'Opening your email client.';
  }
});
