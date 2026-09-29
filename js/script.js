/**
 * LOGISTICS PLATFORM - JAVASCRIPT ENGINE
 * Modular, vanilla JS for fast performance and interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initNumberCounters();
  initTrackingEngine();
  initFleetFilters();
  initQuoteCalculator();
  initBookingForm();
  initAuthForms();
  initTestimonialSlider();
  initScrollRevealAndCounters();
  initFAQAccordion();
  initDashboardSidebar();
  initAdminCharts();
  initRouteOptimizer();
  initInputValidationMasks();
  initContactFormValidation();
});

/* Global scroll-locking utilities for mobile menus and dashboard drawers */
let bodyScrollPosition = 0;

function disableBodyScroll() {
  bodyScrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${bodyScrollPosition}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function enableBodyScroll() {
  document.documentElement.classList.remove('no-scroll');
  document.body.classList.remove('no-scroll');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, bodyScrollPosition);
}

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileDrawer() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-menu-item a, .drawer-btn-group a, .mobile-nav-list a, .mobile-nav-cta a');

  if (!drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    disableBodyScroll();
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    enableBodyScroll();
  };

  overlay.addEventListener('touchmove', (e) => {
    if (drawer.classList.contains('active')) {
      e.preventDefault();
    }
  }, { passive: false });

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Drawer real-time menu search filter
  const drawerSearchInput = document.querySelector('.drawer-search-box input');
  if (drawerSearchInput) {
    drawerSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const menuItems = document.querySelectorAll('.drawer-menu-item');
      menuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. STATS NUMBER COUNTER ANIMATION
   ========================================================================== */
function initNumberCounters() {
  const statNumbers = document.querySelectorAll('.stat-counter');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeOut * target);

          el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        };

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  statNumbers.forEach(num => observer.observe(num));
}

/* ==========================================================================
   3. SHIPMENT TRACKING ENGINE (DEMO DATA & SEARCH)
   ========================================================================== */
const demoShipments = {
  'LP10001': {
    id: 'LP10001',
    status: 'In Transit',
    origin: 'Seattle Logistics Hub, WA',
    destination: 'Chicago Central Terminal, IL',
    currentLocation: 'Bozeman Highway Hub, MT',
    eta: 'Today, 18:30 CST',
    carrier: 'Stackly Express Freight',
    service: 'Interstate Road Express',
    weight: '1,450 kg',
    vehicleId: 'LP-TRK-402 (Volvo FH16)',
    driver: 'Marcus Reed',
    stepIndex: 2, // 0: Confirmed, 1: Picked Up, 2: In Transit, 3: Out for Delivery, 4: Delivered
    timeline: [
      { step: 'Order Confirmed', time: 'Sep 22, 08:30 AM', location: 'Seattle Logistics Hub, WA', completed: true },
      { step: 'Picked Up & Scanned', time: 'Sep 22, 11:15 AM', location: 'Seattle Terminal Yard', completed: true },
      { step: 'In Transit via Interstate 90', time: 'Sep 23, 02:40 PM', location: 'Bozeman Hub, MT (Telemetry Active)', completed: true, active: true },
      { step: 'Out for Delivery', time: 'Estimated Sep 24, 02:00 PM', location: 'Chicago Terminal', completed: false },
      { step: 'Delivered', time: 'Estimated Sep 24, 06:30 PM', location: 'Final Consignee Warehouse', completed: false }
    ]
  },
  'LP10002': {
    id: 'LP10002',
    status: 'Out for Delivery',
    origin: 'Dallas Distribution Center, TX',
    destination: 'Austin Commercial Center, TX',
    currentLocation: 'Austin North Corridor, TX',
    eta: 'Today, in ~45 mins',
    carrier: 'Stackly Metro Van',
    service: 'Same-Day Express',
    weight: '85 kg (3 Packages)',
    vehicleId: 'LP-VAN-118 (Mercedes Sprinter)',
    driver: 'Elena Gomez',
    stepIndex: 3,
    timeline: [
      { step: 'Order Confirmed', time: 'Sep 24, 06:00 AM', location: 'Dallas Distribution Center, TX', completed: true },
      { step: 'Picked Up & Sorted', time: 'Sep 24, 07:45 AM', location: 'Dallas Sorting Hub', completed: true },
      { step: 'In Transit to Metro Station', time: 'Sep 24, 10:30 AM', location: 'I-35 Southbound', completed: true },
      { step: 'Out for Delivery with Driver', time: 'Sep 24, 01:15 PM', location: 'Austin North Courier Van LP-118', completed: true, active: true },
      { step: 'Delivered', time: 'Pending Delivery Verification', location: 'Austin Consignee', completed: false }
    ]
  },
  'LP10003': {
    id: 'LP10003',
    status: 'Delivered',
    origin: 'Atlanta Air Freight Terminal, GA',
    destination: 'Miami Seaport Logistics, FL',
    currentLocation: 'Miami Delivery Dock 4, FL',
    eta: 'Delivered successfully',
    carrier: 'Stackly Heavy Haul',
    service: 'Temperature-Controlled Freight',
    weight: '3,200 kg',
    vehicleId: 'LP-TRK-890 (Freightliner Cascadia)',
    driver: 'David Ross',
    stepIndex: 4,
    timeline: [
      { step: 'Order Confirmed', time: 'Sep 21, 09:00 AM', location: 'Atlanta Air Freight Terminal, GA', completed: true },
      { step: 'Cargo Loaded & Inspected', time: 'Sep 21, 12:30 PM', location: 'Atlanta Logistics Depot', completed: true },
      { step: 'In Transit via I-75', time: 'Sep 22, 08:00 AM', location: 'Orlando Gateway Depot', completed: true },
      { step: 'Arrived at Miami Terminal', time: 'Sep 23, 07:30 AM', location: 'Miami Seaport Hub', completed: true },
      { step: 'Delivered & Signed', time: 'Sep 23, 02:15 PM', location: 'Miami Seaport Logistics (Signed by R. Ramos)', completed: true, active: false }
    ]
  }
};

function initTrackingEngine() {
  const trackForms = document.querySelectorAll('.tracking-form-sync');
  const sampleBtns = document.querySelectorAll('.sample-id-btn');

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const input = document.querySelector('.tracking-input');
      if (input) {
        input.value = id;
        performTrackingSearch(id);
      }
    });
  });

  trackForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="text"]');
      if (!input) return;
      const trackingId = input.value.trim().toUpperCase();
      performTrackingSearch(trackingId);
    });
  });

  // Check URL parameters for tracking ID
  const urlParams = new URLSearchParams(window.location.search);
  const trackParam = urlParams.get('trackingId') || urlParams.get('id');
  if (trackParam) {
    const input = document.querySelector('.tracking-input');
    if (input) input.value = trackParam.toUpperCase();
    performTrackingSearch(trackParam.toUpperCase());
  }
}

function performTrackingSearch(id) {
  const resultsWrap = document.getElementById('trackingResults');
  const feedbackMsg = document.getElementById('trackingFeedback');
  if (!resultsWrap) return;

  if (!id) {
    showTrackingError('Please enter a valid tracking ID (e.g. LP10001, LP10002, LP10003).');
    return;
  }

  const data = demoShipments[id];

  if (!data) {
    showTrackingError(`Tracking ID "${id}" could not be found. Please check your reference number or try demo IDs: LP10001, LP10002, or LP10003.`);
    if (resultsWrap) resultsWrap.style.display = 'none';
    return;
  }

  if (feedbackMsg) feedbackMsg.style.display = 'none';
  resultsWrap.style.display = 'block';

  // Populate Meta Values
  setElemText('trackIdDisplay', data.id);
  setElemText('trackStatusDisplay', data.status);
  setElemText('trackOriginDisplay', data.origin);
  setElemText('trackDestDisplay', data.destination);
  setElemText('trackLocationDisplay', data.currentLocation);
  setElemText('trackEtaDisplay', data.eta);
  setElemText('trackVehicleDisplay', data.vehicleId);
  setElemText('trackDriverDisplay', data.driver);
  setElemText('trackWeightDisplay', data.weight);
  setElemText('trackServiceDisplay', data.service);

  // Status Badge Color
  const statusBadge = document.getElementById('trackStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = data.status;
    statusBadge.className = 'badge ' + (
      data.status === 'Delivered' ? 'badge-green' :
      data.status === 'Out for Delivery' ? 'badge-amber' : 'badge-blue'
    );
  }

  // Render Stepper Timeline
  const stepperContainer = document.getElementById('timelineStepper');
  if (stepperContainer) {
    const steps = [
      'Order Confirmed',
      'Picked Up',
      'In Transit',
      'Out for Delivery',
      'Delivered'
    ];

    const progressPercentage = (data.stepIndex / (steps.length - 1)) * 100;

    let stepperHtml = `<div class="timeline-progress-bar" style="width: ${progressPercentage}%"></div>`;

    steps.forEach((stepName, idx) => {
      const isCompleted = idx < data.stepIndex;
      const isActive = idx === data.stepIndex;
      const stepClass = isActive ? 'timeline-step active' : (isCompleted ? 'timeline-step completed' : 'timeline-step');
      
      const timelineEvent = data.timeline[idx] || {};
      const timeInfo = timelineEvent.time || 'Pending';

      stepperHtml += `
        <div class="${stepClass}">
          <div class="step-node">
            ${isCompleted ? `
              <svg fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
            ` : (idx + 1)}
          </div>
          <div class="step-title">${stepName}</div>
          <div class="step-time">${timeInfo}</div>
        </div>
      `;
    });

    stepperContainer.innerHTML = stepperHtml;
  }

  // Scroll to results smoothly if user on tracking page
  resultsWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showTrackingError(msg) {
  const feedbackMsg = document.getElementById('trackingFeedback');
  if (feedbackMsg) {
    feedbackMsg.textContent = msg;
    feedbackMsg.style.display = 'block';
  } else {
    showToast(msg, 'warning');
  }
}

function setElemText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || '-';
}

/* ==========================================================================
   4. FLEET MANAGEMENT FILTERING
   ========================================================================== */
function initFleetFilters() {
  const filterBtns = document.querySelectorAll('.fleet-filter-btn');
  const fleetCards = document.querySelectorAll('.fleet-card-item');
  const searchInput = document.getElementById('fleetSearchInput');
  const statusSelect = document.getElementById('fleetStatusFilter');
  const locationSelect = document.getElementById('fleetLocationFilter');
  const clearBtn = document.getElementById('clearFleetFiltersBtn');

  if (!fleetCards.length) return;

  let activeType = 'all';

  const applyFilters = () => {
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const statusVal = statusSelect ? statusSelect.value.toLowerCase() : 'all';
    const locVal = locationSelect ? locationSelect.value.toLowerCase() : 'all';

    let visibleCount = 0;

    fleetCards.forEach(card => {
      const type = card.getAttribute('data-type') || '';
      const status = (card.getAttribute('data-status') || '').toLowerCase();
      const location = (card.getAttribute('data-location') || '').toLowerCase();
      const cardText = card.textContent.toLowerCase();

      const matchesType = activeType === 'all' || type.toLowerCase() === activeType.toLowerCase();
      const matchesStatus = statusVal === 'all' || status === statusVal;
      const matchesLoc = locVal === 'all' || location.includes(locVal);
      const matchesSearch = !searchVal || cardText.includes(searchVal);

      if (matchesType && matchesStatus && matchesLoc && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const countDisplay = document.getElementById('fleetResultCount');
    if (countDisplay) {
      countDisplay.textContent = `${visibleCount} vehicles found`;
    }
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (statusSelect) statusSelect.addEventListener('change', applyFilters);
  if (locationSelect) locationSelect.addEventListener('change', applyFilters);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (statusSelect) statusSelect.value = 'all';
      if (locationSelect) locationSelect.value = 'all';
      filterBtns.forEach(b => b.classList.remove('active'));
      const allBtn = document.querySelector('.fleet-filter-btn[data-filter="all"]');
      if (allBtn) allBtn.classList.add('active');
      activeType = 'all';
      applyFilters();
      showToast('Fleet filters reset', 'info');
    });
  }
}

/* ==========================================================================
   5. SHIPPING QUOTE CALCULATOR
   ========================================================================== */
function initQuoteCalculator() {
  const quoteForm = document.getElementById('shippingQuoteForm');
  if (!quoteForm) return;

  const calculateEstimate = () => {
    const pickup = document.getElementById('quotePickup')?.value || 'Seattle';
    const delivery = document.getElementById('quoteDelivery')?.value || 'Chicago';
    const weight = parseFloat(document.getElementById('quoteWeight')?.value) || 10;
    const packageType = document.getElementById('quotePkgType')?.value || 'standard_parcel';
    const speed = document.querySelector('input[name="quoteSpeed"]:checked')?.value || 'standard';

    // Base rates calculation (Sample Demo Model)
    let baseRate = 35.00;
    let weightRate = weight * 1.85;

    // Package Type Multipliers
    let pkgMultiplier = 1.0;
    if (packageType === 'pallet') pkgMultiplier = 2.4;
    else if (packageType === 'heavy_freight') pkgMultiplier = 3.5;
    else if (packageType === 'fragile_goods') pkgMultiplier = 1.6;

    // Speed Multipliers
    let speedMultiplier = 1.0;
    let etaDays = '3 - 5 Business Days';
    if (speed === 'express') {
      speedMultiplier = 1.65;
      etaDays = '1 - 2 Business Days';
    } else if (speed === 'same_day') {
      speedMultiplier = 2.8;
      etaDays = 'Same-Day (Guaranteed by 20:00)';
    }

    const calculatedTotal = (baseRate + weightRate) * pkgMultiplier * speedMultiplier;
    const roundedPrice = Math.round(calculatedTotal * 100) / 100;

    // Update UI elements
    setElemText('calculatedPriceDisplay', `$${roundedPrice.toFixed(2)}`);
    setElemText('calculatedEtaDisplay', etaDays);
    setElemText('quoteRouteDisplay', `${pickup} → ${delivery}`);
    setElemText('quoteWeightDisplay', `${weight} kg`);
  };

  quoteForm.addEventListener('input', calculateEstimate);
  quoteForm.addEventListener('change', calculateEstimate);
  calculateEstimate();
}

/* ==========================================================================
   6. SHIPMENT BOOKING FORM VALIDATION & MODAL
   ========================================================================== */
function initBookingForm() {
  const bookingForm = document.getElementById('shipmentBookingForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Required fields validation
    const fields = [
      { id: 'senderName', name: 'Sender Name' },
      { id: 'senderEmail', name: 'Sender Email', type: 'email' },
      { id: 'senderMobile', name: 'Sender Phone' },
      { id: 'pickupAddress', name: 'Pickup Address' },
      { id: 'receiverName', name: 'Receiver Name' },
      { id: 'receiverMobile', name: 'Receiver Phone' },
      { id: 'deliveryAddress', name: 'Delivery Address' },
      { id: 'pkgWeight', name: 'Package Weight' },
      { id: 'pickupDate', name: 'Pickup Date' }
    ];

    fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (!input) return;
      const errorMsg = document.getElementById(`${field.id}Error`);

      if (!input.value.trim()) {
        input.classList.add('error');
        if (errorMsg) {
          errorMsg.textContent = `${field.name} is required.`;
          errorMsg.classList.add('visible');
        }
        isValid = false;
      } else if (field.type === 'email' && !validateEmail(input.value.trim())) {
        input.classList.add('error');
        if (errorMsg) {
          errorMsg.textContent = 'Please enter a valid email address.';
          errorMsg.classList.add('visible');
        }
        isValid = false;
      } else {
        input.classList.remove('error');
        if (errorMsg) errorMsg.classList.remove('visible');
      }
    });

    if (isValid) {
      // Generate demo Tracking Reference
      const newTrackingId = 'LP' + Math.floor(10000 + Math.random() * 90000);
      
      const modal = document.getElementById('bookingConfirmationModal');
      if (modal) {
        setElemText('modalBookedId', newTrackingId);
        setElemText('modalSenderDisplay', document.getElementById('senderName')?.value);
        setElemText('modalReceiverDisplay', document.getElementById('receiverName')?.value);
        setElemText('modalPickupDisplay', document.getElementById('pickupAddress')?.value);
        setElemText('modalDeliveryDisplay', document.getElementById('deliveryAddress')?.value);
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
      } else {
        showToast(`Shipment confirmed! Tracking ID: ${newTrackingId}`, 'success');
      }
    } else {
      showToast('Please complete all required fields correctly.', 'error');
    }
  });

  // Modal Close buttons
  const closeBtns = document.querySelectorAll('.modal-close-trigger');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==========================================================================
   7. AUTH FORMS (LOGIN / REGISTER)
   ========================================================================== */
function initAuthForms() {
  // Global Logout Click Interceptor
  document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('a[href*="login.html"], .sidebar-logout-btn');
    if (logoutBtn && (logoutBtn.textContent.includes('Logout') || logoutBtn.href.includes('logout=true'))) {
      sessionStorage.setItem('stackly_logged_out', 'true');
      localStorage.removeItem('stackly_user_session');
      localStorage.removeItem('stackly_remembered_user');
    }
  });

  // Password Visibility Toggle
  const togglePassBtns = document.querySelectorAll('.password-toggle-btn');
  togglePassBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>`;
      } else if (input) {
        input.type = 'password';
        btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
      }
    });
  });

  // Role selector buttons
  const roleButtons = document.querySelectorAll('.role-opt-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const form = btn.closest('form') || document;
      form.querySelectorAll('.role-opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedRole = btn.getAttribute('data-role');
      const formRoleInput = form.querySelector('#selectedRoleInput, #loginRole, input[name="role"]');
      if (formRoleInput) formRoleInput.value = selectedRole;

      // When switching roles, clear password and refresh inputs
      const passInput = form.querySelector('#loginPass, #regPass, #regConfirmPass');
      if (passInput) passInput.value = '';
    });
  });

  // Demo Credentials Auto-Fill Buttons & Welcome Greeting
  const demoCredButtons = document.querySelectorAll('.demo-cred-btn');
  demoCredButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      const pass = btn.getAttribute('data-pass');
      const role = btn.getAttribute('data-role');
      
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPass');
      const roleInput = document.getElementById('loginRole');
      
      if (emailInput) {
        emailInput.value = email;
        emailInput.classList.remove('is-invalid');
      }
      if (passInput) {
        passInput.value = pass;
        passInput.classList.remove('is-invalid');
      }
      if (roleInput) roleInput.value = role;

      // Update role buttons UI
      const authContainer = btn.closest('.auth-card') || document;
      authContainer.querySelectorAll('.role-opt-btn').forEach(b => {
        if (b.getAttribute('data-role') === role) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      const roleTitle = role === 'driver' ? 'Fleet Driver (Marcus Rivera)' : (role === 'admin' ? 'Ops Commander' : 'Product Lead (Kappalasuresh92)');
      showToast(`👋 Welcome! Loaded ${roleTitle} credentials.`, 'info');
    });
  });

  // Login form handler & Logout refresh
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPass');
    const rememberCheckbox = document.getElementById('rememberMe');

    // Check if user came from a logout event
    const urlParams = new URLSearchParams(window.location.search);
    const isLogout = urlParams.get('logout') === 'true' || sessionStorage.getItem('stackly_logged_out') === 'true';

    if (isLogout) {
      if (emailInput) emailInput.value = '';
      if (passInput) passInput.value = '';
      if (rememberCheckbox) rememberCheckbox.checked = false;
      loginForm.reset();
      sessionStorage.removeItem('stackly_logged_out');
      localStorage.removeItem('stackly_remembered_user');

      // Clean up URL without reloading
      if (urlParams.get('logout') === 'true') {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      setTimeout(() => {
        showToast('Logged out successfully. Credentials cleared.', 'info');
      }, 350);
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput?.value.trim();
      const pass = passInput?.value.trim();
      const role = document.getElementById('loginRole')?.value || 'customer';

      if (!email || !pass) {
        showToast('Please enter your email and password.', 'error');
        return;
      }

      let welcomeMsg = '👋 Welcome back to Stackly Logistics!';
      if (role === 'driver' || email.includes('driver')) {
        welcomeMsg = '👋 Welcome aboard, Marcus Rivera! Accessing Driver Hub...';
      } else if (role === 'admin' || email.includes('admin')) {
        welcomeMsg = '👋 Welcome, Operations Commander! Accessing Central Tower...';
      } else {
        welcomeMsg = '👋 Welcome back, Kappalasuresh92! Accessing Cloud Workspace...';
      }

      showToast(welcomeMsg, 'success');
      setTimeout(() => {
        if (role === 'admin' || email.includes('admin')) window.location.href = 'admin-dashboard.html';
        else if (role === 'driver' || email.includes('driver')) window.location.href = 'driver-dashboard.html';
        else window.location.href = 'customer-dashboard.html';
      }, 900);
    });
  }

  // Register form handler
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const pass = document.getElementById('regPass')?.value;
      const confirmPass = document.getElementById('regConfirmPass')?.value;
      const terms = document.getElementById('regTerms')?.checked;
      const role = roleInput?.value || 'customer';

      if (/[0-9]/.test(name)) {
        showToast('Name field cannot contain numbers or digits.', 'error');
        document.getElementById('regName')?.focus();
        return;
      }
      const mobileVal = document.getElementById('regMobile')?.value.trim();
      if (mobileVal && /[a-zA-Z]/.test(mobileVal)) {
        showToast('Mobile number cannot contain alphabetic letters.', 'error');
        document.getElementById('regMobile')?.focus();
        return;
      }
      if (!name || !email || !pass) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }
      if (pass !== confirmPass) {
        showToast('Passwords do not match.', 'error');
        return;
      }
      if (!terms) {
        showToast('Please accept the Terms & Conditions.', 'warning');
        return;
      }

      showToast('Registration successful! Redirecting to dashboard...', 'success');
      setTimeout(() => {
        if (role === 'admin') window.location.href = 'admin-dashboard.html';
        else if (role === 'driver') window.location.href = 'driver-dashboard.html';
        else window.location.href = 'customer-dashboard.html';
      }, 1200);
    });
  }
}

/* ==========================================================================
   8. TESTIMONIAL SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dots = document.querySelectorAll('.slider-dot');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  const updateSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentIndex + 1);
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentIndex - 1);
      resetAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateSlide(idx);
      resetAutoPlay();
    });
  });

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, 6500);
  };

  const resetAutoPlay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    startAutoPlay();
  };

  startAutoPlay();
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  // Ensure all FAQ items are closed by default
  faqItems.forEach(item => {
    item.classList.remove('active');
    const answerPanel = item.querySelector('.faq-answer');
    if (answerPanel) answerPanel.style.maxHeight = null;
  });

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerPanel = item.querySelector('.faq-answer');

    if (!questionBtn || !answerPanel) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close other open panels for clean single open behavior
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        answerPanel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answerPanel.style.maxHeight = answerPanel.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* ==========================================================================
   10. DASHBOARD MOBILE SIDEBAR DRAWER
   ========================================================================== */
function initDashboardSidebar() {
  const toggleBtns = document.querySelectorAll('.dash-mobile-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const sidebarLinks = document.querySelectorAll('.sidebar-menu-link');

  if (!sidebar) return;

  let overlay = document.querySelector('.dashboard-sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'dashboard-sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const openSidebar = () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    disableBodyScroll();
  };

  const closeSidebar = () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    enableBodyScroll();
  };

  overlay.addEventListener('touchmove', (e) => {
    if (sidebar.classList.contains('active')) {
      e.preventDefault();
    }
  }, { passive: false });

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });
  });

  overlay.addEventListener('click', closeSidebar);

  // Close when clicking close button inside sidebar if present
  const closeBtn = sidebar.querySelector('.sidebar-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) closeSidebar();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
}

/* ==========================================================================
   11. ROUTE OPTIMIZER & GPS NAVIGATION MAP RENDERER
   ========================================================================== */
function initRouteOptimizer() {
  const canvases = document.querySelectorAll('#routeCanvas, #liveTrackingCanvas, .route-map-canvas');
  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render Animated Map Frame
    let pulseRadius = 12;
    let pulseOpacity = 0.8;

    function renderMap() {
      // Clear & Background
      ctx.fillStyle = '#0b1329';
      ctx.fillRect(0, 0, width, height);

      // Draw Map Grid / Streets Network
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 40; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 30; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Secondary Arterial Roads
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.4);
      ctx.lineTo(width, height * 0.45);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width * 0.35, 0);
      ctx.lineTo(width * 0.4, height);
      ctx.stroke();

      // Glow underlay
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      waypoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Route Main Stroke
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      waypoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Waypoint Markers
      waypoints.forEach((p, idx) => {
        if (idx === 0) {
          // Origin Pin
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (idx === waypoints.length - 1) {
          // Destination Pin
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.fillText('📍 ' + p.name, p.x - 45, p.y - 15);
        } else if (idx === 3) {
          // Live Vehicle Position & Dynamic Animated Radar Pulse
          const vehicleP = p;

          // Pulse Ring 1
          ctx.strokeStyle = `rgba(56, 189, 248, ${pulseOpacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(vehicleP.x, vehicleP.y, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Pulse Ring 2 (Offset)
          const r2 = (pulseRadius + 10) % 28 + 8;
          const op2 = Math.max(0, 1 - r2 / 28);
          ctx.strokeStyle = `rgba(6, 182, 212, ${op2 * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(vehicleP.x, vehicleP.y, r2, 0, Math.PI * 2);
          ctx.stroke();

          // Vehicle Center Dot
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(vehicleP.x, vehicleP.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.fillText('🚐 Live Dispatch (Active)', vehicleP.x - 55, vehicleP.y - 24);
        }
      });

      // Animate Pulse
      pulseRadius += 0.4;
      pulseOpacity -= 0.015;
      if (pulseRadius > 26) {
        pulseRadius = 10;
        pulseOpacity = 0.85;
      }

      requestAnimationFrame(renderMap);
    }

    renderMap();
  });

  const optimizeBtn = document.getElementById('optimizeRouteBtn');
  if (!optimizeBtn) return;

  optimizeBtn.addEventListener('click', () => {
    const originalText = optimizeBtn.innerHTML;
    optimizeBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
      Calculating Optimal AI Waypoints...
    `;
    optimizeBtn.disabled = true;

    setTimeout(() => {
      optimizeBtn.innerHTML = originalText;
      optimizeBtn.disabled = false;
      setElemText('mapDistanceDisplay', '1,120 km (-84 km saved)');
      setElemText('mapEtaDisplay', '14 hrs 10 mins (-1h 35m)');
      setElemText('mapFuelDisplay', '94.2% Efficiency (+8.4%)');
      showToast('Route re-optimized! Saved 84 km & 95 minutes.', 'success');
    }, 1200);
  });
}

/* ==========================================================================
   12. ADMIN DASHBOARD CHARTS (SVG/CANVAS RENDERER)
   ========================================================================== */
function initAdminCharts() {
  const chartCanvases = document.querySelectorAll('#shipmentTrendChart, #volumeChart');
  chartCanvases.forEach(chartCanvas => {
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = chartCanvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 220;

    chartCanvas.width = width * dpr;
    chartCanvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const months = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const deliveries = [1420, 1850, 1720, 2150, 2480, 1950, 1680];
    const maxVal = 3000;

    const padding = 35;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Draw Grid Lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 3; i++) {
      const y = padding + (graphHeight / 3) * i;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
    }
    ctx.stroke();

    // Draw Area Gradient
    const stepX = graphWidth / (months.length - 1);
    ctx.beginPath();
    deliveries.forEach((val, idx) => {
      const x = padding + idx * stepX;
      const y = height - padding - (val / maxVal) * graphHeight;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(0, 102, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 102, 255, 0.02)');

    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Main Stroke
    ctx.beginPath();
    deliveries.forEach((val, idx) => {
      const x = padding + idx * stepX;
      const y = height - padding - (val / maxVal) * graphHeight;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#0066ff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Data Points & Labels
    deliveries.forEach((val, idx) => {
      const x = padding + idx * stepX;
      const y = height - padding - (val / maxVal) * graphHeight;

      ctx.fillStyle = '#0a1128';
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(months[idx], x, height - 10);
    });
  });
}

/* ==========================================================================
   13. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button style="color: inherit; opacity: 0.7; font-size: 1.2rem; line-height: 1;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
}

/* ==========================================================================
   14. INPUT VALIDATION & REAL-TIME SANITIZATION (NAME NO DIGITS, PHONE NO LETTERS)
   ========================================================================== */
function initInputValidationMasks() {
  // 1. Strict Name fields - completely block digits (0-9)
  const nameSelectors = [
    '#contactName', '#regName', '#senderName', '#receiverName', '#quoteName',
    'input[name="name"]', 'input[name="fullname"]', 'input[name="fullName"]',
    'input[name*="name" i]', 'input[id*="name" i]'
  ];
  
  const nameInputs = document.querySelectorAll(nameSelectors.join(', '));
  nameInputs.forEach(input => {
    // Prevent typing digits
    input.addEventListener('keydown', function(e) {
      // Allow navigation/editing keys (Backspace, Tab, Enter, Arrows, Delete, etc.)
      if (e.key && e.key.length === 1 && /[0-9]/.test(e.key)) {
        e.preventDefault();
        showToast('Digits/Numbers are not allowed in name fields.', 'warning');
      }
    });

    // Realtime sanitization on input & paste
    input.addEventListener('input', function() {
      const sanitized = this.value.replace(/[0-9]/g, '').replace(/[^a-zA-Z\s.'-]/g, '');
      if (this.value !== sanitized) {
        this.value = sanitized;
      }
    });

    input.addEventListener('paste', function(e) {
      setTimeout(() => {
        this.value = this.value.replace(/[0-9]/g, '').replace(/[^a-zA-Z\s.'-]/g, '');
      }, 10);
    });
  });

  // 2. Strict Phone/Mobile fields - completely block alphabetic letters (a-zA-Z)
  const phoneSelectors = [
    '#contactPhone', '#regMobile', '#senderPhone', '#receiverPhone', '#quotePhone',
    'input[type="tel"]', 'input[name*="phone" i]', 'input[name*="mobile" i]',
    'input[id*="phone" i]', 'input[id*="mobile" i]'
  ];

  const phoneInputs = document.querySelectorAll(phoneSelectors.join(', '));
  phoneInputs.forEach(input => {
    // Prevent typing letters
    input.addEventListener('keydown', function(e) {
      // Allow navigation/editing keys
      if (e.key && e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
        showToast('Alphabetic letters are not allowed in phone/mobile fields.', 'warning');
      }
    });

    // Realtime sanitization on input & paste
    input.addEventListener('input', function() {
      const sanitized = this.value.replace(/[a-zA-Z]/g, '').replace(/[^0-9+\s\-()]/g, '');
      if (this.value !== sanitized) {
        this.value = sanitized;
      }
    });

    input.addEventListener('paste', function(e) {
      setTimeout(() => {
        this.value = this.value.replace(/[a-zA-Z]/g, '').replace(/[^0-9+\s\-()]/g, '');
      }, 10);
    });
  });
}

function initContactFormValidation() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const nameInput = document.getElementById('contactName');
      const phoneInput = document.getElementById('contactPhone');

      if (nameInput) {
        const nameVal = nameInput.value.trim();
        if (/[0-9]/.test(nameVal)) {
          showToast('Name cannot contain numbers or digits.', 'error');
          nameInput.focus();
          return;
        }
        if (!/^[a-zA-Z\s.'-]+$/.test(nameVal)) {
          showToast('Please enter a valid full name using letters only.', 'error');
          nameInput.focus();
          return;
        }
      }

      if (phoneInput && phoneInput.value.trim()) {
        const phoneVal = phoneInput.value.trim();
        if (/[a-zA-Z]/.test(phoneVal)) {
          showToast('Phone number cannot contain alphabetic letters.', 'error');
          phoneInput.focus();
          return;
        }
        if (!/^[\d\s+\-()]{7,20}$/.test(phoneVal)) {
          showToast('Please enter a valid phone number (at least 7 digits).', 'error');
          phoneInput.focus();
          return;
        }
      }

      showToast('Your operational inquiry has been submitted! A dispatcher will respond shortly.', 'success');
      this.reset();
    });
  }
}



/* ==========================================================================
   12. SCROLL REVEAL & NUMERIC COUNTER ANIMATION ENGINE
   ========================================================================== */
function initScrollRevealAndCounters() {
  // 1. Auto-tag cards and grid children for smooth scroll reveal
  const autoRevealSelectors = [
    '.service-card',
    '.feature-card',
    '.solution-card',
    '.fleet-card',
    '.how-it-works-step',
    '.dash-stat-card',
    '.dash-card',
    '.testimonial-card',
    '.pricing-card',
    '.cta-card',
    '.stat-card'
  ];

  autoRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        // Stagger inside parent grids
        const staggerIndex = (idx % 4) + 1;
        el.classList.add(`stagger-${staggerIndex}`);
      }
    });
  });

  // 2. IntersectionObserver for Reveal Elements
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, [data-animate]');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => {
      el.classList.add('is-visible');
      el.classList.add('in-view');
    });
  }

  // 3. Smooth Numeric Counter Animation
  const counterElements = document.querySelectorAll('.stat-number, .dash-stat-num, [data-counter]');
  
  const animateCount = (el) => {
    const rawText = el.textContent.trim();
    // Parse numeric value, prefix ($ etc.), and suffix (%, +, M, k, etc.)
    const match = rawText.match(/^([^0-9]*)([0-9.,]+)(.*)$/);
    if (!match) return;

    const prefix = match[1];
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const targetVal = parseFloat(numStr);
    if (isNaN(targetVal)) return;

    const isDecimal = numStr.includes('.');
    const decimalPlaces = isDecimal ? numStr.split('.')[1].length : 0;
    const duration = 1600; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetVal * easeOut;

      let formattedNum = isDecimal ? currentVal.toFixed(decimalPlaces) : Math.floor(currentVal).toLocaleString();
      if (!isDecimal && numStr.includes(',')) {
        formattedNum = Math.floor(currentVal).toLocaleString();
      }

      el.textContent = `${prefix}${formattedNum}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = rawText; // Ensure exact final string
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => counterObserver.observe(el));
  }
}
