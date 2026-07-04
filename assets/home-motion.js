(() => {
  const root = document.querySelector('.dd-home');
  if (!root) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fields = {
    phone: root.querySelector('#phone-shell'),
    backdrop: root.querySelector('#product-backdrop'),
    screenIcon: root.querySelector('#screen-icon'),
    screenLabel: root.querySelector('#screen-label'),
    screenKicker: root.querySelector('#screen-kicker'),
    screenTitle: root.querySelector('#screen-title'),
    screenBody: root.querySelector('#screen-body'),
    screenList: root.querySelector('#screen-list'),
    sideList: root.querySelector('#side-list'),
    brief: root.querySelector('#product-brief'),
    briefStatus: root.querySelector('#brief-status'),
    briefTitle: root.querySelector('#brief-title'),
    briefCopy: root.querySelector('#brief-copy'),
    briefChips: root.querySelector('#brief-chips'),
  };

  const makeList = (items, tagName = 'span') =>
    items.filter(Boolean).map((item) => {
      const node = document.createElement(tagName);
      node.textContent = item;
      return node;
    });

  function activateProduct(tab) {
    const accent = tab.dataset.accent || '#ff2fb3';
    root.style.setProperty('--active-accent', accent);
    tab.style.setProperty('--tab-accent', accent);

    root.querySelectorAll('.product-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
      item.style.setProperty('--tab-accent', item.dataset.accent || '#ff2fb3');
    });

    if (fields.screenIcon && tab.dataset.icon) fields.screenIcon.src = tab.dataset.icon;
    if (fields.screenLabel) fields.screenLabel.textContent = tab.dataset.label || '';
    if (fields.screenKicker) fields.screenKicker.textContent = tab.dataset.kicker || '';
    if (fields.screenTitle) fields.screenTitle.textContent = tab.dataset.title || '';
    if (fields.screenBody) fields.screenBody.textContent = tab.dataset.body || '';
    if (fields.briefStatus) fields.briefStatus.textContent = tab.dataset.status || '';
    if (fields.briefTitle) fields.briefTitle.textContent = tab.dataset.label || '';
    if (fields.briefCopy) fields.briefCopy.textContent = tab.dataset.body || '';

    const rows = (tab.dataset.rows || '').split('|').filter(Boolean);
    const chips = (tab.dataset.chips || '').split('|').filter(Boolean);
    fields.screenList?.replaceChildren(...makeList(rows.slice(0, 4)));
    fields.sideList?.replaceChildren(...makeList(rows.slice(3), 'li'));
    fields.briefChips?.replaceChildren(...makeList(chips));

    if (fields.backdrop) {
      const nextBackground = tab.dataset.background;
      fields.backdrop.style.opacity = nextBackground ? '0.88' : '0';
      if (nextBackground) fields.backdrop.src = nextBackground;
    }
  }

  root.querySelectorAll('.product-tab').forEach((tab) => {
    tab.style.setProperty('--tab-accent', tab.dataset.accent || '#ff2fb3');
    tab.addEventListener('click', () => activateProduct(tab));
    tab.addEventListener('focus', () => activateProduct(tab));
  });

  const firstTab = root.querySelector('.product-tab.active') || root.querySelector('.product-tab');
  if (firstTab) activateProduct(firstTab);

  const product = root.querySelector('.hero-product');
  product?.addEventListener('pointermove', (event) => {
    if (reduced.matches || !fields.phone) return;
    const rect = product.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width - 0.5) || 0;
    const py = ((event.clientY - rect.top) / rect.height - 0.5) || 0;
    fields.phone.style.transform = `translate3d(${px * 8}px, ${py * 7}px, 0)`;
  });

  product?.addEventListener('pointerleave', () => {
    if (!fields.phone || window.innerWidth < 761) return;
    fields.phone.style.transform = 'translate3d(0, 0, 0)';
  });

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.18 });

  root.querySelectorAll('section').forEach((section) => reveal.observe(section));

  const canvas = root.querySelector('#home-brand-field');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  let width = 0;
  let height = 0;
  let tick = 0;
  const blobs = [];

  function resize() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    blobs.length = 0;

    const count = width < 800 ? 5 : 9;
    for (let i = 0; i < count; i += 1) {
      blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 170 + Math.random() * 240,
        vx: -0.05 + Math.random() * 0.1,
        vy: -0.04 + Math.random() * 0.08,
        hue: i % 3 === 0 ? '255, 47, 179' : i % 3 === 1 ? '58, 25, 8' : '32, 216, 245',
      });
    }
  }

  function draw() {
    tick += 1;
    ctx.clearRect(0, 0, width, height);

    blobs.forEach((blob, index) => {
      if (!reduced.matches) {
        blob.x += blob.vx + Math.sin((tick + index * 20) / 180) * 0.035;
        blob.y += blob.vy + Math.cos((tick + index * 18) / 210) * 0.03;
        if (blob.x < -blob.r) blob.x = width + blob.r;
        if (blob.x > width + blob.r) blob.x = -blob.r;
        if (blob.y < -blob.r) blob.y = height + blob.r;
        if (blob.y > height + blob.r) blob.y = -blob.r;
      }

      const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
      gradient.addColorStop(0, `rgba(${blob.hue}, .075)`);
      gradient.addColorStop(0.55, `rgba(${blob.hue}, .028)`);
      gradient.addColorStop(1, `rgba(${blob.hue}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
