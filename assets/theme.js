/**
 * Hasna's Coffee — Theme JavaScript
 */

(function () {
  'use strict';

  /* ============================================================
     Sticky Header
     ============================================================ */
  const header = document.getElementById('SiteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     Mobile Navigation
     ============================================================ */
  const mobileMenuBtn = document.querySelector('.header__mobile-menu-btn');
  const mobileNav = document.getElementById('MobileNav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');
  const mobileNavOverlay = document.getElementById('MobileNavOverlay');

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNavOverlay && mobileNavOverlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn && mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNavOverlay && mobileNavOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    mobileMenuBtn && mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  mobileMenuBtn && mobileMenuBtn.addEventListener('click', openMobileNav);
  mobileNavClose && mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavOverlay && mobileNavOverlay.addEventListener('click', closeMobileNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeSearchBar();
    }
  });

  /* ============================================================
     Search Toggle
     ============================================================ */
  const searchToggle = document.getElementById('SearchToggle');
  const searchBar = document.getElementById('SearchBar');
  const searchClose = document.getElementById('SearchClose');

  function openSearchBar() {
    if (!searchBar) return;
    searchBar.hidden = false;
    const input = searchBar.querySelector('input');
    input && setTimeout(() => input.focus(), 50);
  }

  function closeSearchBar() {
    if (!searchBar) return;
    searchBar.hidden = true;
  }

  searchToggle && searchToggle.addEventListener('click', () => {
    searchBar && searchBar.hidden ? openSearchBar() : closeSearchBar();
  });

  searchClose && searchClose.addEventListener('click', closeSearchBar);

  /* ============================================================
     Testimonials Slider
     ============================================================ */
  const track = document.getElementById('TestimonialsTrack');
  const prevBtn = document.getElementById('TestimonialsPrev');
  const nextBtn = document.getElementById('TestimonialsNext');
  const dotsContainer = document.getElementById('TestimonialsDots');

  if (track) {
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();

    function getSlidesPerView() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - slidesPerView);
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const count = getMaxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.classList.add('testimonials__dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.testimonials__dot');
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots();
    }

    prevBtn && prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    buildDots();

    window.addEventListener('resize', () => {
      slidesPerView = getSlidesPerView();
      currentIndex = Math.min(currentIndex, getMaxIndex());
      buildDots();
      goTo(currentIndex);
    }, { passive: true });

    // Auto-advance
    let autoplay = setInterval(() => goTo(currentIndex < getMaxIndex() ? currentIndex + 1 : 0), 5000);
    track.closest('.testimonials') && track.closest('.testimonials').addEventListener('mouseenter', () => clearInterval(autoplay));
    track.closest('.testimonials') && track.closest('.testimonials').addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo(currentIndex < getMaxIndex() ? currentIndex + 1 : 0), 5000);
    });
  }

  /* ============================================================
     Add to Cart (Quick Add)
     ============================================================ */
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.product-card__atc');
    if (!btn) return;

    const variantId = btn.dataset.productId;
    if (!variantId) return;

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Adding...';

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 }),
      });

      if (response.ok) {
        btn.textContent = 'Added!';
        btn.style.background = 'var(--color-gold-light)';

        // Update cart count
        const cartRes = await fetch('/cart.js');
        if (cartRes.ok) {
          const cart = await cartRes.json();
          const countEl = document.getElementById('CartCount');
          if (countEl) {
            countEl.textContent = cart.item_count;
            countEl.setAttribute('data-count', cart.item_count);
          }
        }

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 2000);
      } else {
        throw new Error('Failed to add');
      }
    } catch {
      btn.textContent = 'Try again';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 2000);
    }
  });

  /* ============================================================
     Collection Filter
     ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      // Filter logic can be extended with actual product tags
    });
  });

  /* ============================================================
     Scroll Animations (Intersection Observer)
     ============================================================ */
  const animatables = document.querySelectorAll('[data-animate]');
  if (animatables.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatables.forEach(el => observer.observe(el));
  }

})();
