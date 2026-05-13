// ============================================================
// Mize Landing — script.js
// JS vanilla, modular, sem frameworks
// ============================================================

// ===== NAVBAR SCROLL =====
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

// ===== HAMBURGER / MOBILE MENU =====
function initMobileMenu() {
  var hamburgerBtn  = document.getElementById('hamburgerBtn');
  var mobileMenu    = document.getElementById('mobileMenu');
  var closeMobileMenu = document.getElementById('closeMobileMenu');
  var mobileNavLinks  = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', closeMenu);
  }

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on backdrop tap
  mobileMenu.addEventListener('click', function (e) {
    if (e.target === mobileMenu) closeMenu();
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;

      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      var navbarHeight = document.getElementById('navbar')
        ? document.getElementById('navbar').offsetHeight
        : 70;
      var offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
}

// ===== AOS INIT =====
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }
}

// ===== PRICING TOGGLE =====
function initPricingToggle() {
  var toggleBtn     = document.getElementById('billingToggle');
  var labelMonthly  = document.getElementById('label-monthly');
  var labelAnnual   = document.getElementById('label-annual');
  var priceAmounts  = document.querySelectorAll('.p-amount');

  if (!toggleBtn) return;

  var isAnnual = false;

  function updatePrices() {
    priceAmounts.forEach(function (el) {
      var monthly = parseInt(el.getAttribute('data-monthly'), 10);
      var annual  = parseInt(el.getAttribute('data-annual'),  10);

      if (isNaN(monthly)) return;

      if (isAnnual) {
        var annualPrice = annual || Math.round(monthly * 0.8);
        el.textContent = annualPrice;
      } else {
        el.textContent = monthly;
      }
    });

    if (labelMonthly) {
      labelMonthly.classList.toggle('tl-active', !isAnnual);
    }
    if (labelAnnual) {
      labelAnnual.classList.toggle('tl-active', isAnnual);
    }

    toggleBtn.classList.toggle('tog-on', isAnnual);
    toggleBtn.setAttribute('aria-checked', String(isAnnual));
  }

  toggleBtn.addEventListener('click', function () {
    isAnnual = !isAnnual;
    updatePrices();
  });

  // Keyboard support
  toggleBtn.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      isAnnual = !isAnnual;
      updatePrices();
    }
  });

  // Init
  updatePrices();
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var btn  = item.querySelector('.faq-btn');
    var body = item.querySelector('.faq-body');
    if (!btn || !body) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('faq-open');

      // Close all
      faqItems.forEach(function (i) {
        i.classList.remove('faq-open');
        var b = i.querySelector('.faq-btn');
        var bd = i.querySelector('.faq-body');
        if (b)  b.setAttribute('aria-expanded', 'false');
        if (bd) bd.setAttribute('aria-hidden', 'true');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('faq-open');
        btn.setAttribute('aria-expanded', 'true');
        body.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

// ===== LEAD FORM =====
function initLeadForm() {
  var form = document.getElementById('leadForm');
  if (!form) return;

  var submitBtn = document.getElementById('formSubmitBtn');

  var fields = [
    { id: 'nome',        errId: 'err-nome',        msg: 'Por favor, informe seu nome.' },
    { id: 'restaurante', errId: 'err-restaurante',  msg: 'Por favor, informe o nome do restaurante.' },
    { id: 'cidade',      errId: 'err-cidade',       msg: 'Por favor, informe sua cidade.' },
    { id: 'tamanho',     errId: 'err-tamanho',      msg: 'Por favor, selecione o tamanho.' },
    { id: 'whatsapp',    errId: 'err-whatsapp',     msg: 'Por favor, informe seu WhatsApp.' }
  ];

  function showError(errId, msg) {
    var el = document.getElementById(errId);
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }

  function clearError(errId) {
    var el = document.getElementById(errId);
    if (el) { el.classList.remove('show'); }
  }

  function validateForm() {
    var valid = true;
    fields.forEach(function (f) {
      var input = document.getElementById(f.id);
      if (!input) return;
      if (!input.value.trim()) {
        showError(f.errId, f.msg);
        valid = false;
      } else {
        clearError(f.errId);
      }
    });
    return valid;
  }

  // Clear errors on input
  fields.forEach(function (f) {
    var input = document.getElementById(f.id);
    if (input) {
      input.addEventListener('input', function () { clearError(f.errId); });
      input.addEventListener('change', function () { clearError(f.errId); });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    var payload = {
      nome:        document.getElementById('nome')        ? document.getElementById('nome').value.trim()        : '',
      restaurante: document.getElementById('restaurante') ? document.getElementById('restaurante').value.trim() : '',
      cidade:      document.getElementById('cidade')      ? document.getElementById('cidade').value.trim()      : '',
      tamanho:     document.getElementById('tamanho')     ? document.getElementById('tamanho').value            : '',
      whatsapp:    document.getElementById('whatsapp')    ? document.getElementById('whatsapp').value.trim()    : '',
      origem:      'landing-cta-final',
      timestamp:   new Date().toISOString()
    };

    // Disable button during "submission"
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    // POST para /api/leads (placeholder — apenas console.log nesta fase)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function () {
        console.log('[Mize Lead]', payload);
        window.location.href = 'obrigado.html';
      })
      .catch(function () {
        // Em caso de falha de rede, loga e redireciona mesmo assim
        console.log('[Mize Lead — offline]', payload);
        window.location.href = 'obrigado.html';
      });
  });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
function initActiveNavOnScroll() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    var scrollY = window.scrollY;
    var navH = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 70;

    sections.forEach(function (section) {
      var top    = section.offsetTop - navH - 40;
      var bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

// ===== VERTICAL DRAWERS =====
function initVerticalDrawers() {
  var overlay     = document.getElementById('verticalDrawerOverlay');
  var allDrawers  = document.querySelectorAll('.vertical-drawer');
  var activeDrawer = null;
  var lastFocused  = null;

  function fireAnalytics(vertical) {
    try {
      if (typeof gtag === 'function') {
        gtag('event', 'vertical_drawer_open', { vertical: vertical });
      } else {
        console.log('[Mize Analytics] vertical_drawer_open', { vertical: vertical });
      }
    } catch (e) { /* silencioso */ }
  }

  function openDrawer(vertical) {
    var drawer = document.getElementById('drawer-' + vertical);
    if (!drawer) return;

    lastFocused = document.activeElement;

    // Show overlay
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('overlay-visible');
    // Force reflow before adding animation class
    overlay.getBoundingClientRect();
    overlay.classList.add('overlay-shown');

    // Show drawer
    drawer.removeAttribute('aria-hidden');
    drawer.classList.add('drawer-active');

    activeDrawer = drawer;
    document.body.classList.add('drawer-open');

    // Move focus into drawer
    var firstFocusable = getFirstFocusable(drawer);
    if (firstFocusable) {
      firstFocusable.focus();
    }

    fireAnalytics(vertical);
  }

  function closeDrawer() {
    if (!activeDrawer) return;

    activeDrawer.classList.remove('drawer-active');
    activeDrawer.setAttribute('aria-hidden', 'true');
    activeDrawer = null;

    overlay.classList.remove('overlay-shown');
    // Wait for fade-out then hide
    overlay.addEventListener('transitionend', function hideOverlay() {
      overlay.classList.remove('overlay-visible');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.removeEventListener('transitionend', hideOverlay);
    });

    document.body.classList.remove('drawer-open');

    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  // ----- Focus trap -----
  function getFirstFocusable(container) {
    var focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return focusable.length ? focusable[0] : null;
  }

  function getLastFocusable(container) {
    var focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return focusable.length ? focusable[focusable.length - 1] : null;
  }

  function trapFocus(e) {
    if (!activeDrawer) return;
    if (e.key !== 'Tab') return;

    var first = getFirstFocusable(activeDrawer);
    var last  = getLastFocusable(activeDrawer);
    if (!first || !last) return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ----- Event: card clicks -----
  document.querySelectorAll('.vertical-card[data-vertical]').forEach(function (card) {
    card.addEventListener('click', function () {
      openDrawer(card.getAttribute('data-vertical'));
    });
    // Keyboard: Space / Enter already fires click on <button>
  });

  // ----- Event: close buttons inside drawers -----
  document.querySelectorAll('[data-close-drawer]').forEach(function (btn) {
    btn.addEventListener('click', closeDrawer);
  });

  // ----- Event: overlay click -----
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // ----- Event: Esc + focus trap -----
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeDrawer) {
      closeDrawer();
      return;
    }
    trapFocus(e);
  });
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', function () {
  initAOS();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initPricingToggle();
  initFAQ();
  initLeadForm();
  initActiveNavOnScroll();
  initVerticalDrawers();
});
