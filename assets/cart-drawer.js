/* ============================================================
   Hasna's Coffee — AJAX Cart Drawer
   ============================================================ */
(function () {
  'use strict';

  var drawer    = document.getElementById('hc-cart-drawer');
  var overlay   = document.getElementById('hc-cart-overlay');
  var closeBtn  = document.getElementById('hc-cart-close');
  var cartBody  = document.getElementById('hc-cart-body');
  var emptyEl   = document.getElementById('hc-cart-empty');
  var totalEl   = document.getElementById('hc-cart-total');
  var noteInput = document.getElementById('hc-cart-note');

  if (!drawer) return;

  /* ── Open / Close ── */
  function openDrawer() {
    drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    fetchAndRender();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay)  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ── Cart icon triggers ── */
  document.querySelectorAll('.header__cart-btn, [data-cart-trigger]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openDrawer();
    });
  });

  /* ── Auto-open when /cart is visited directly ── */
  document.addEventListener('hc:open-cart', function () {
    openDrawer();
  });

  /* ── Intercept Add to Cart forms ── */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    var formId = form.getAttribute('id');
    var isProductForm = formId === 'hc-product-form'
      || form.classList.contains('shopify-product-form')
      || form.classList.contains('product-form');
    if (!isProductForm) return;
    e.preventDefault();

    var btn = form.querySelector('[type="submit"]');
    var originalText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Adding…'; }

    var data = new FormData(form);
    var payload = { quantity: 1 };
    data.forEach(function (v, k) {
      if (k === 'id' || k === 'quantity') payload[k] = v;
    });

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(payload)
    })
    .then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.description || 'Could not add item.'); });
      return r.json();
    })
    .then(function () {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
      openDrawer();
    })
    .catch(function (err) {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
      console.error('Cart add error', err);
      alert(err.message || 'Could not add item to cart. Please try again.');
    });
  });

  /* ── Fetch + render ── */
  function showLoading() {
    if (!cartBody) return;
    Array.from(cartBody.children).forEach(function (c) {
      if (c.id !== 'hc-cart-empty') c.remove();
    });
    if (emptyEl) emptyEl.hidden = true;
    var loader = document.createElement('div');
    loader.id = 'hc-cart-loader';
    loader.className = 'cart-drawer__loading';
    loader.textContent = 'Loading…';
    cartBody.appendChild(loader);
  }

  function fetchAndRender() {
    showLoading();
    fetch('/cart.js', {
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (cart) { renderCart(cart); })
    .catch(function (err) {
      console.error('Cart fetch error', err);
      var loader = document.getElementById('hc-cart-loader');
      if (loader) loader.remove();
      var errEl = document.createElement('p');
      errEl.className = 'cart-drawer__error';
      errEl.textContent = 'Could not load cart. Please refresh and try again.';
      if (cartBody) cartBody.appendChild(errEl);
    });
  }

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  function shopifyImageUrl(url, size) {
    if (!url) return '';
    return url.replace(/(\.(jpg|jpeg|png|gif|webp))(\?|$)/i, '_' + size + '$1$3');
  }

  function renderCart(cart) {
    if (!cartBody) return;
    Array.from(cartBody.children).forEach(function (child) {
      if (child.id !== 'hc-cart-empty') child.remove();
    });

    if (cart.item_count === 0) {
      if (emptyEl) { emptyEl.hidden = false; emptyEl.style.display = ''; }
      if (totalEl) totalEl.textContent = '$0.00 USD';
      updateHeaderCount(0);
      return;
    }

    if (emptyEl) { emptyEl.hidden = true; emptyEl.style.display = 'none'; }
    cart.items.forEach(function (item) {
      try { cartBody.appendChild(buildItem(item)); }
      catch (e) { console.error('Cart item build error', e, item); }
    });

    if (totalEl) totalEl.textContent = formatMoney(cart.total_price) + ' USD';
    if (noteInput && cart.note) noteInput.value = cart.note;
    updateHeaderCount(cart.item_count);
  }

  function buildItem(item) {
    var el = document.createElement('div');
    el.className = 'cart-item';
    el.dataset.key = item.key;

    var variantLabel = '';
    if (item.variant_title && item.variant_title !== 'Default Title') {
      variantLabel = '<p class="cart-item__variant">' + escHtml(item.variant_title) + '</p>';
    }

    var rawUrl = (item.featured_image && item.featured_image.url) ? item.featured_image.url : '';
    var imgSrc = shopifyImageUrl(rawUrl, '160x160');
    var imgHtml = imgSrc
      ? '<img src="' + imgSrc + '" alt="' + escHtml(item.title || '') + '" width="80" height="80" loading="lazy">'
      : '';

    el.innerHTML =
      '<div class="cart-item__img-wrap">' + imgHtml + '</div>' +
      '<div class="cart-item__info">' +
        '<p class="cart-item__title">' + escHtml(item.product_title || item.title || '') + '</p>' +
        variantLabel +
        '<p class="cart-item__price">' + formatMoney(item.price) + '</p>' +
        '<div class="cart-item__controls">' +
          '<div class="cart-item__qty">' +
            '<button class="cart-item__qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>' +
            '<span class="cart-item__qty-num">' + item.quantity + '</span>' +
            '<button class="cart-item__qty-btn" data-action="inc" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<button class="cart-item__remove" aria-label="Remove ' + escHtml(item.product_title || '') + '">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<span class="cart-item__total">' + formatMoney(item.line_price) + '</span>';

    var decBtn = el.querySelector('[data-action="dec"]');
    var incBtn = el.querySelector('[data-action="inc"]');
    var rmvBtn = el.querySelector('.cart-item__remove');

    if (decBtn) decBtn.addEventListener('click', function () { changeQty(item.key, item.quantity - 1); });
    if (incBtn) incBtn.addEventListener('click', function () { changeQty(item.key, item.quantity + 1); });
    if (rmvBtn) rmvBtn.addEventListener('click', function () { changeQty(item.key, 0); });

    return el;
  }

  function changeQty(key, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ id: key, quantity: qty })
    })
    .then(function (r) { return r.json(); })
    .then(function (cart) { renderCart(cart); })
    .catch(function (err) { console.error('Cart change error', err); });
  }

  if (noteInput) {
    noteInput.addEventListener('change', function () {
      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ note: noteInput.value })
      }).catch(function (err) { console.error('Note update error', err); });
    });
  }

  function updateHeaderCount(count) {
    var countEl = document.getElementById('CartCount');
    if (countEl) {
      countEl.textContent = count;
      countEl.style.display = count === 0 ? 'none' : '';
    }
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
