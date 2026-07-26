
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 400);
});

/* ---------- Sticky nav ---------- */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---------- Mobile menu ---------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
function toggleMenu(open){
  mobileMenu.classList.toggle('open', open);
  mobileOverlay.classList.toggle('open', open);
  hamburgerBtn.setAttribute('aria-expanded', open);
}
hamburgerBtn.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
mobileOverlay.addEventListener('click', () => toggleMenu(false));
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Testimonial carousel ---------- */
const testiSlides = document.getElementById('testiSlides');
const slides = testiSlides.children;
const dotsWrap = document.getElementById('testiDots');
let testiIndex = 0;
let testiTimer;

for (let i = 0; i < slides.length; i++){
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
}

function goToSlide(i){
  testiIndex = (i + slides.length) % slides.length;
  testiSlides.style.transform = `translateX(-${testiIndex * 100}%)`;
  [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === testiIndex));
  resetTestiTimer();
}
function resetTestiTimer(){
  clearInterval(testiTimer);
  testiTimer = setInterval(() => goToSlide(testiIndex + 1), 5000);
}
document.getElementById('testiNext').addEventListener('click', () => goToSlide(testiIndex + 1));
document.getElementById('testiPrev').addEventListener('click', () => goToSlide(testiIndex - 1));
resetTestiTimer();

/* ---------- Rotating review wheel ---------- */
const wheelReviews = [
  { name:'Amanda P.', loc:'Kansas City, MO', text:'Fast, professional, and the results speak for themselves.' },
  { name:'Ryan K.', loc:'Overland Park, KS', text:'Booked seal coating — driveway looks brand new.' },
  { name:'Nicole H.', loc:'Lee\'s Summit, MO', text:'Great communication from quote to completion.' },
  { name:'Tyler S.', loc:'Independence, MO', text:'Handled our gutters and windows in one visit. Easy.' },
  { name:'Megan F.', loc:'Shawnee, KS', text:'Reasonably priced and genuinely careful with our property.' },
  { name:'Brandon C.', loc:'Blue Springs, MO', text:'Junk removal team was quick and left the space spotless.' },
];
const wheelTrack = document.getElementById('wheelTrack');
[...wheelReviews, ...wheelReviews].forEach(r => {
  const card = document.createElement('div');
  card.className = 'wheel-card';
  card.innerHTML = `<div class="stars">★★★★★</div><p>"${r.text}"</p><div class="who"><b>${r.name}</b> — ${r.loc}</div>`;
  wheelTrack.appendChild(card);
});

/* ---------- Before/After slider ---------- */
const baSlider = document.getElementById('baSlider');
const baAfter = document.getElementById('baAfter');
let dragging = false;
function setSlider(clientX){
  const rect = baSlider.getBoundingClientRect();
  let pct = ((clientX - rect.left) / rect.width) * 100;
  pct = Math.max(4, Math.min(96, pct));
  baAfter.style.width = pct + '%';
  baSlider.querySelector('.ba-handle').style.left = pct + '%';
}
baSlider.addEventListener('mousedown', e => { dragging = true; setSlider(e.clientX); });
window.addEventListener('mousemove', e => { if (dragging) setSlider(e.clientX); });
window.addEventListener('mouseup', () => dragging = false);
baSlider.addEventListener('touchstart', e => setSlider(e.touches[0].clientX));
baSlider.addEventListener('touchmove', e => setSlider(e.touches[0].clientX));

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('#galleryGrid .ph').forEach(item => {
  item.addEventListener('click', () => {
    const imgSrc = item.dataset.img;
    if (imgSrc){
      lightboxImg.innerHTML = `<img src="${imgSrc}" alt="${item.dataset.caption || 'Photo'}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
      lightboxImg.innerHTML = `<span>${item.dataset.caption || 'Photo'}</span>`;
    }
    lightbox.classList.add('open');
  });
});
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

/* ---------- Contact form validation ---------- */
const quoteForm = document.getElementById('quoteForm');
const formFieldsWrap = document.getElementById('formFieldsWrap');
const formSuccess = document.getElementById('formSuccess');

const validators = {
  name: v => v.trim().length > 1,
  phone: v => /^[\d\s\-\(\)\+]{7,}$/.test(v.trim()),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  address: v => v.trim().length > 4,
  service: v => v.trim().length > 0,
  message: v => v.trim().length > 3,
};

quoteForm.addEventListener('submit', function(e){
  e.preventDefault();
  let valid = true;
  Object.keys(validators).forEach(name => {
    const input = quoteForm.querySelector(`[name="${name}"]`);
    const fieldWrap = quoteForm.querySelector(`[data-field="${name}"]`);
    const ok = validators[name](input.value);
    fieldWrap.classList.toggle('error', !ok);
    if (!ok) valid = false;
  });

  if (!valid) return;

  const submitBtn = quoteForm.querySelector('.submit-btn');
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  const formData = new FormData(quoteForm);

  fetch('https://formsubmit.co/ajax/theconcordresidential@gmail.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error('Request failed');
      return res.json();
    })
    .then(() => {
      formFieldsWrap.style.display = 'none';
      formSuccess.classList.add('show');
      quoteForm.reset();
    })
    .catch(err => {
      console.error('Quote request error:', err);
      alert("Sorry, something went wrong sending your request. Please call or text us directly at (816) 539-5496.");
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    });
});
