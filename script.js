// ===== Язык =====
const LANGS = ['ru', 'kk', 'en'];
let lang = 'ru';
try {
  const saved = localStorage.getItem('lang');
  if (LANGS.includes(saved)) lang = saved;
} catch (e) {}
const t = key => (I18N[lang] && I18N[lang][key] !== undefined) ? I18N[lang][key] : I18N.ru[key];

// ===== Данные каталога =====
const PHOTO = 'images/product.png';
const PHOTO_FB = 'https://www.figma.com/api/mcp/asset/bd4c1d40-c686-4f7b-a7bf-041bc62fd37e.png';
const BASE = [
  { model: 'Polar FT1',  old: '4 750', price: '4 500' },
  { model: 'Suunto M2',  old: '6 690', price: '6 641' },
  { model: 'Polar FT7',  old: '7 390', price: '7 021' },
  { model: 'Polar FT1',  old: '4 750', price: '4 500' },
  { model: 'Suunto M2',  old: '6 690', price: '6 641' },
  { model: 'Polar FT4',  old: '6 690', price: '6 641' }
];
// Пока в макете один набор товаров — для вкладок меняем только порядок
const CATALOG = {
  fitness:   BASE,
  run:       [...BASE].reverse(),
  triathlon: [BASE[2], BASE[5], BASE[1], BASE[0], BASE[4], BASE[3]]
};
let currentCat = 'fitness';
let currentOrder = 'Polar FT1';

// ===== Рендер каталога =====
const cardsEl = document.getElementById('cards');

function renderCards(cat) {
  currentCat = cat;
  const cur = t('cur');
  cardsEl.innerHTML = CATALOG[cat].map(p => {
    const name = `${t('hm')} ${p.model}`;
    return `
    <div class="card">
      <div class="card__top">
        <div class="card__front">
          <img class="card__photo" src="${PHOTO}" data-fallback="${PHOTO_FB}" onerror="this.onerror=null;this.src=this.dataset.fallback" alt="${name}">
          <div class="card__title">${name}</div>
          <p class="card__desc">${t('card_desc')}</p>
          <button class="card__more" data-flip>${t('more')}</button>
        </div>
        <div class="card__back">
          <ul>${t('features').map(f => `<li>${f}</li>`).join('')}</ul>
          <button class="card__more" data-flip>${t('back')}</button>
        </div>
      </div>
      <div class="card__foot">
        <div><span class="price__old">${p.old} ${cur}</span><span class="price__new">${p.price} ${cur}</span></div>
        <button class="btn" data-buy="${p.model}">${t('buy')}</button>
      </div>
    </div>`;
  }).join('');
}

function renderOrderName() {
  document.getElementById('orderName').textContent = `${t('hm')} ${currentOrder}`;
}

document.getElementById('tabs').addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === tab));
  renderCards(tab.dataset.cat);
});

cardsEl.addEventListener('click', e => {
  const flip = e.target.closest('[data-flip]');
  if (flip) flip.closest('.card').classList.toggle('flipped');
  const buy = e.target.closest('[data-buy]');
  if (buy) {
    currentOrder = buy.dataset.buy;
    renderOrderName();
    openModal('modal-order');
  }
});

// ===== Применение языка ко всей странице =====
function applyLang(l) {
  if (!LANGS.includes(l)) l = 'ru';
  lang = l;
  try { localStorage.setItem('lang', l); } catch (e) {}
  document.documentElement.lang = l;
  document.title = t('title');

  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.setAttribute('title', t(el.dataset.i18nTitle)); });
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('active', b.dataset.lang === l));

  renderCards(currentCat);
  renderOrderName();
}

document.querySelector('.lang').addEventListener('click', e => {
  const b = e.target.closest('[data-lang]');
  if (b) applyLang(b.dataset.lang);
});

// ===== Карусель =====
const SLIDE = 'images/slide-3.png';
const SLIDE_FB = 'https://www.figma.com/api/mcp/asset/3320f9b1-b007-464a-a077-c79f311eec26.png';
// Слайды 1 и 2 лежат в папке images/
const slides = ['images/slide-1.png', 'images/slide-2.png', SLIDE];
let current = 0;
const track = document.getElementById('track');
const dots = document.getElementById('dots');
track.innerHTML = slides.map((s, i) => `<img src="${s}" ${s === SLIDE ? `data-fallback="${SLIDE_FB}" onerror="this.onerror=null;this.src=this.dataset.fallback"` : ''} alt="Слайд ${i + 1}">`).join('');
dots.innerHTML = slides.map(() => '<i></i>').join('');
function showSlide(i) {
  current = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  [...dots.children].forEach((d, k) => d.classList.toggle('active', k === current));
}
document.querySelector('.carousel__arrow--prev').addEventListener('click', () => showSlide(current - 1));
document.querySelector('.carousel__arrow--next').addEventListener('click', () => showSlide(current + 1));
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') showSlide(current - 1);
  if (e.key === 'ArrowRight') showSlide(current + 1);
});
showSlide(0);

// ===== Модальные окна =====
const overlay = document.getElementById('overlay');

function openModal(id) {
  overlay.hidden = false;
  overlay.querySelectorAll('.modal').forEach(m => m.hidden = m.id !== id);
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const opener = e.target.closest('[data-open]');
  if (opener) openModal(opener.dataset.open);
  if (e.target.closest('[data-close]') || e.target === overlay) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== Формы =====
document.querySelectorAll('[data-lead]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Здесь можно отправить данные на сервер:
    // fetch('/api/lead', { method: 'POST', body: new FormData(form) });
    form.reset();
    openModal('modal-thanks');
  });
});


// ===== Кнопка «наверх» =====
const toTop = document.getElementById('toTop');
function updateToTop() {
  toTop.hidden = window.scrollY < 400;
}
window.addEventListener('scroll', updateToTop, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
updateToTop();

// ===== Старт: применяем сохранённый язык =====
applyLang(lang);
