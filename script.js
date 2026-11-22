// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 40));

// Hamburger & Mobile Dropdown
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', (e) => {
    const dropdown = a.nextElementSibling;
    // If we click a link that has a dropdown menu
    if (dropdown && dropdown.classList.contains('dropdown')) {
      // On mobile viewports, toggle the accordion and prevent following the anchor hash immediately
      if (window.innerWidth <= 900) {
        e.preventDefault();
        a.parentElement.classList.toggle('dropdown-active');
        return; // Stop here, do not close the entire nav menu!
      }
    }
    
    // For all other regular link clicks, or if we are on desktop, close the menu completely
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    
    // Reset any accordion states for a clean open next time
    document.querySelectorAll('.dropdown-active').forEach(li => li.classList.remove('dropdown-active'));
  });
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Form handler — redirect to WhatsApp
function handleForm(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const service = document.getElementById('service').value;
  const msg = document.getElementById('message').value;
  const text = encodeURIComponent(
    `Hi Daypower! 👋\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${msg}\n\nPlease send me a free solar quote.`
  );
  window.open(`https://wa.me/919437527157?text=${text}`, '_blank');
}

// ── TESTIMONIAL SLIDER ──────────────────────────────────────────
(function () {
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const btnNext = document.getElementById('test-next');
  const btnPrev = document.getElementById('test-prev');

  if (!track || !btnNext || !btnPrev) return;

  const CARD_GAP = 24;          // px — must match CSS gap
  const AUTO_INTERVAL = 5000;   // ms

  // How many cards fit in the viewport?
  function cardsVisible() {
    const ww = window.innerWidth;
    if (ww <= 600) return 1;
    if (ww <= 900) return 2;
    return 3;
  }

  const origCards = Array.from(track.children);
  const total = origCards.length;   // 6

  // ── Clone cards for infinite loop ──
  // Prepend last N clones, append first N clones
  function buildTrack() {
    // Remove any existing clones
    track.querySelectorAll('.clone').forEach(c => c.remove());

    const vis = cardsVisible();
    const clonesBefore = [];
    const clonesAfter  = [];

    for (let i = 0; i < vis; i++) {
      const after  = origCards[i % total].cloneNode(true);
      const before = origCards[(total - vis + i) % total].cloneNode(true);
      after.classList.add('clone');
      before.classList.add('clone');
      clonesAfter.push(after);
      clonesBefore.push(before);
    }

    // Prepend clones (reversed so order is correct)
    clonesBefore.reverse().forEach(c => track.insertBefore(c, track.firstChild));
    clonesAfter.forEach(c => track.appendChild(c));
  }

  // ── Card width (all cards same size, set by CSS flex) ──
  function cardWidth() {
    return track.children[0].getBoundingClientRect().width;
  }

  let currentIndex = 0;  // 0 = first original card
  let isTransitioning = false;
  let autoTimer = null;

  // ── Translate track to index (accounting for prepended clones) ──
  function getOffset(index) {
    const vis = cardsVisible();
    const w = cardWidth();
    // index 0 = first original = position vis (prepended clones count)
    return (vis + index) * (w + CARD_GAP);
  }

  function goTo(index, animate) {
    track.style.transition = animate
      ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';
    track.style.transform = `translateX(-${getOffset(index)}px)`;
    currentIndex = index;
    updateDots();
  }

  // ── Dots ──
  function buildDots() {
    dotsContainer.innerHTML = '';
    const vis = cardsVisible();
    const pages = Math.ceil(total / vis);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { stopAuto(); goTo(i * vis, true); startAuto(); });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const vis = cardsVisible();
    const idx = ((currentIndex % total) + total) % total;
    const activePage = Math.floor(idx / vis);
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === activePage));
  }

  // ── Infinite loop: after transition jump silently ──
  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    const vis = cardsVisible();
    if (currentIndex >= total) {
      goTo(currentIndex - total, false);
    } else if (currentIndex < 0) {
      goTo(currentIndex + total, false);
    }
  });

  function next() {
    if (isTransitioning) return;
    isTransitioning = true;
    goTo(currentIndex + cardsVisible(), true);
  }

  function prev() {
    if (isTransitioning) return;
    isTransitioning = true;
    goTo(currentIndex - cardsVisible(), true);
  }

  // ── Auto-scroll ──
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // ── Pause on hover ──
  track.parentElement.addEventListener('mouseenter', stopAuto);
  track.parentElement.addEventListener('mouseleave', startAuto);

  // ── Buttons ──
  btnNext.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  btnPrev.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

  // ── Initialise ──
  function init() {
    buildTrack();
    buildDots();
    goTo(0, false);
    startAuto();
  }

  // Re-init on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

  init();
})();


// Why Choose Us Carousel Controls (Dynamic for Mobile)
const whyGrid = document.querySelector('.why-grid');
const whyNext = document.getElementById('why-next');
const whyPrev = document.getElementById('why-prev');

if (whyGrid && whyNext && whyPrev) {
  const whyCards = Array.from(whyGrid.children);
  
  // Conditionally clone the first card. We add a specific class to safely hide it on Desktop via CSS.
  if (whyCards.length > 0) {
    const clone = whyCards[0].cloneNode(true);
    clone.classList.remove('reveal');
    clone.classList.add('mobile-clone');
    clone.style.opacity = '1';
    clone.style.transform = 'translateY(0)';
    whyGrid.appendChild(clone);
  }

  const scrollWhyNext = () => {
    if (whyGrid.scrollLeft + whyGrid.clientWidth >= whyGrid.scrollWidth - 10) {
      whyGrid.style.scrollBehavior = 'auto';
      whyGrid.style.scrollSnapType = 'none';
      whyGrid.scrollLeft = 0;
      
      void whyGrid.offsetWidth; // Reflow
      
      whyGrid.style.scrollBehavior = 'smooth';
      whyGrid.style.scrollSnapType = 'x mandatory';
      whyGrid.scrollBy({ left: whyGrid.clientWidth, behavior: 'smooth' });
    } else {
      whyGrid.scrollBy({ left: whyGrid.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollWhyPrev = () => {
    if (whyGrid.scrollLeft <= 10) {
      whyGrid.style.scrollBehavior = 'auto';
      whyGrid.style.scrollSnapType = 'none';
      whyGrid.scrollLeft = whyGrid.scrollWidth - whyGrid.clientWidth;
      
      void whyGrid.offsetWidth;
      
      whyGrid.style.scrollBehavior = 'smooth';
      whyGrid.style.scrollSnapType = 'x mandatory';
      whyGrid.scrollBy({ left: -whyGrid.clientWidth, behavior: 'smooth' });
    } else {
      whyGrid.scrollBy({ left: -whyGrid.clientWidth, behavior: 'smooth' });
    }
  };

  whyNext.addEventListener('click', scrollWhyNext);
  whyPrev.addEventListener('click', scrollWhyPrev);

  let autoWhyInterval = setInterval(scrollWhyNext, 5000);

  whyGrid.addEventListener('mouseenter', () => clearInterval(autoWhyInterval));
  whyGrid.addEventListener('mouseleave', () => {
    autoWhyInterval = setInterval(scrollWhyNext, 5000);
  });
}

// ══════════════════════════════════════════════
// SOLAR ROI & SAVINGS CALCULATOR LOGIC
// ══════════════════════════════════════════════
let currentCalcType = 'commercial';

function setCalcType(type) {
  currentCalcType = type;
  document.querySelectorAll('.calc-type-btn, .switch-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });

  const slider = document.getElementById('bill-slider');
  const tipText = document.getElementById('calc-tip-text');
  const minLbl = document.getElementById('slider-min-lbl');
  const maxLbl = document.getElementById('slider-max-lbl');

  if (type === 'residential') {
    slider.min = '1500';
    slider.max = '25000';
    slider.step = '500';
    slider.value = '6000';
    if (minLbl) minLbl.innerText = '₹1,500';
    if (maxLbl) maxLbl.innerText = '₹25,000';
    if (tipText) {
      tipText.innerText = 'Residential systems are eligible for up to ₹78,000 direct PM Surya Ghar DBT subsidy.';
    }
  } else {
    slider.min = '10000';
    slider.max = '500000';
    slider.step = '2000';
    slider.value = '50000';
    if (minLbl) minLbl.innerText = '₹10,000';
    if (maxLbl) maxLbl.innerText = '₹5,00,000+';
    if (tipText) {
      tipText.innerText = 'Commercial & Industrial rates typically range between ₹8 - ₹10 per unit with 80% tax depreciation.';
    }
  }
  updateCalculator();
}

function updateCalculator() {
  const slider = document.getElementById('bill-slider');
  if (!slider) return;

  const bill = parseFloat(slider.value);
  const billDisplay = document.getElementById('bill-val-display');
  if (billDisplay) {
    billDisplay.innerText = '₹' + bill.toLocaleString('en-IN');
  }

  // Rate per unit assumption
  const ratePerUnit = currentCalcType === 'commercial' ? 8.5 : 6.5;
  const unitsPerMonth = bill / ratePerUnit;
  let recommendedKW = Math.round((unitsPerMonth / 120) * 10) / 10;
  if (recommendedKW < 1) recommendedKW = 1;

  // Monthly savings ~85% of total bill
  const monthlySavings = Math.round(bill * 0.85);
  // Lifetime savings (25 yrs)
  const lifetimeSavings = Math.round(monthlySavings * 12 * 25 * 1.15);

  let lifetimeDisplay = '';
  if (lifetimeSavings >= 10000000) {
    lifetimeDisplay = '₹' + (lifetimeSavings / 10000000).toFixed(2) + ' Cr';
  } else {
    lifetimeDisplay = '₹' + (lifetimeSavings / 100000).toFixed(2) + ' Lakh';
  }

  const paybackYears = currentCalcType === 'commercial' ? '3.1 Years' : '3.8 Years';
  const co2Val = (recommendedKW * 1.2).toFixed(1) + ' Tons';

  const kwElem = document.getElementById('res-kw');
  const monthElem = document.getElementById('res-monthly-savings');
  const lifeElem = document.getElementById('res-lifetime-savings');
  const paybackElem = document.getElementById('res-payback');
  const co2Elem = document.getElementById('res-co2');
  const waBtn = document.getElementById('calc-wa-btn');

  if (kwElem) kwElem.innerText = recommendedKW + ' kWp';
  if (monthElem) monthElem.innerText = '₹' + monthlySavings.toLocaleString('en-IN');
  if (lifeElem) lifeElem.innerText = lifetimeDisplay;
  if (paybackElem) paybackElem.innerText = paybackYears;
  if (co2Elem) co2Elem.innerText = co2Val;

  if (waBtn) {
    const text = encodeURIComponent(
      `Hello Daypower! 👋\nI used your Solar Calculator:\n- Type: ${currentCalcType === 'commercial' ? 'Commercial/Industrial' : 'Residential'}\n- Monthly Bill: ₹${bill.toLocaleString('en-IN')}\n- Estimated Size: ${recommendedKW} kWp\n\nPlease share a formal customized proposal.`
    );
    waBtn.href = `https://wa.me/919437527857?text=${text}`;
  }
}

// Initial trigger
updateCalculator();
