let currentSlide = 0;
let slideInterval;

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // Form validation (Registration page)
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', validateForm);
  }

  // Slider functionality (Home page)
  const slider = document.getElementById('facilitySlider');
  if (slider) {
    initializeSlider();
  }

  // Navbar blur + toggle
  initializeNavbar();
  initializeNavToggle();
});

// ============================================
// FORM VALIDATION
// ============================================

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\d\s\-\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function validateAge(age) {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 16 && ageNum <= 100;
}

function showError(input, message) {
  const group = input.closest('.form-group');
  const error = group.querySelector('.error-message');
  group.classList.add('error');
  error.textContent = message;
  error.classList.add('show');
}

function clearError(input) {
  const group = input.closest('.form-group');
  const error = group.querySelector('.error-message');
  group.classList.remove('error');
  error.classList.remove('show');
}

function validateForm(e) {
  e.preventDefault();
  let isValid = true;

  const fields = [
    'fullName',
    'email',
    'phone',
    'membership',
    'goals',
    'age',
    'emergencyContact',
    'experience'
  ].map(id => document.getElementById(id));

  fields.forEach(clearError);

  if (!fields[0].value.trim()) {
    showError(fields[0], 'Full name is required');
    isValid = false;
  }

  if (!validateEmail(fields[1].value)) {
    showError(fields[1], 'Invalid email');
    isValid = false;
  }

  if (!validatePhone(fields[2].value)) {
    showError(fields[2], 'Invalid phone number');
    isValid = false;
  }

  if (!fields[3].value) {
    showError(fields[3], 'Select a membership');
    isValid = false;
  }

  if (fields[4].value.trim().length < 10) {
    showError(fields[4], 'Tell us more about your goals');
    isValid = false;
  }

  if (!validateAge(fields[5].value)) {
    showError(fields[5], 'Invalid age');
    isValid = false;
  }

  if (!fields[6].value.trim()) {
    showError(fields[6], 'Emergency contact required');
    isValid = false;
  }

  if (!fields[7].value) {
    showError(fields[7], 'Select experience level');
    isValid = false;
  }

  if (isValid) {
    const success = document.getElementById('successMessage');
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      e.target.reset();
      success.classList.remove('show');
    }, 3000);
  }
}

// ============================================
// IMAGE SLIDER
// ============================================

function initializeSlider() {
  const slides = document.querySelectorAll('.slider-slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });

  prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

  startSlideshow();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.slider-slide');
  const dots = document.querySelectorAll('.slider-dot');

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));

  document.getElementById('facilitySlider').style.transform =
    `translateX(-${currentSlide * 100}%)`;
}

function startSlideshow() {
  slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000);
}

// ============================================
// NAVBAR EFFECTS
// ============================================

function initializeNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ============================================
// NAV TOGGLE (BURGER)
// ============================================

function initializeNavToggle() {
  const nav = document.querySelector('.navbar');
  const toggle = nav?.querySelector('.nav-toggle');
  const menu = nav?.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  const close = () => {
    toggle.classList.remove('active');
    menu.classList.remove('open');
  };

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', close)
  );

  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

// ============================================
// STATS COUNTER ON SCROLL
// ============================================

function animateStats() {
  const numbers = document.querySelectorAll(".stat-box .number");
  if (!numbers.length) return;

  numbers.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;

    const speed = 50;

    const timer = setInterval(() => {
      current += 1;
      el.textContent = `+${current}`;

      if (current >= target) {
        el.textContent = `+${target}`;
        clearInterval(timer);
      }
    }, speed);
  });
}

function initStatsObserver() {
  const statsSection = document.getElementById("stats");
  if (!statsSection) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateStats();
        observer.disconnect();
      }
    },
    { threshold: 0.35 }
  );

  observer.observe(statsSection);
}

document.addEventListener("DOMContentLoaded", () => {
  initStatsObserver();
});

