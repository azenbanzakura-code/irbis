/* ==================== УТИЛИТЫ ==================== */
// TODO: общие функции по мере необходимости.

/* ==================== КОМПОНЕНТЫ ==================== */
// TODO: каждый компонент в отдельном IIFE с проверкой наличия DOM-элементов.

/* ==================== СЛАЙДЕРЫ ==================== */
(function () {
  if (typeof Swiper === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sliders = [];
  const projects = document.querySelector('.home-projects-slider');
  if (projects) sliders.push(new Swiper(projects, {
    slidesPerView: 1, spaceBetween: 24, speed: reduce.matches ? 0 : 600,
    watchOverflow: true,
    navigation: { prevEl: '.home-projects-nav__prev', nextEl: '.home-projects-nav__next' },
    pagination: { el: '.home-projects__pagination', type: 'fraction', formatFractionCurrent: n => String(n).padStart(2,'0'), formatFractionTotal: n => String(n).padStart(2,'0') },
    a11y: { prevSlideMessage: 'Предыдущее направление', nextSlideMessage: 'Следующее направление', slideLabelMessage: '{{index}} из {{slidesLength}}', containerRoleDescriptionMessage: 'Карусель проектных направлений' },
    on: { init: syncFocus, slideChange: syncFocus }
  }));
  const journal = document.querySelector('.home-journal-slider');
  if (journal) sliders.push(new Swiper(journal, {
    slidesPerView: 1.12, spaceBetween: 20, speed: reduce.matches ? 0 : 600,
    watchOverflow: true,
    navigation: { prevEl: '.home-journal-nav__prev', nextEl: '.home-journal-nav__next' },
    breakpoints: { 768: { slidesPerView: 2.15, spaceBetween: 24 }, 1024: { slidesPerView: 3, spaceBetween: 28 } },
    a11y: { prevSlideMessage: 'Предыдущие материалы', nextSlideMessage: 'Следующие материалы', slideLabelMessage: '{{index}} из {{slidesLength}}', containerRoleDescriptionMessage: 'Карусель материалов' }
  }));
  function syncFocus(swiper) {
    swiper.slides.forEach((slide,index) => { slide.inert = index !== swiper.activeIndex; });
  }
  reduce.addEventListener('change', () => sliders.forEach(slider => { slider.params.speed = reduce.matches ? 0 : 600; }));
})();

/* ==================== БЛОКИ СТРАНИЦ ==================== */
/* ==================== ПРОЕКТЫ: ЛИСТИНГ ==================== */
(function () {
  const page = document.querySelector('.projects-page');
  const root = page && page.querySelector('.projects-slider');
  if (!root || typeof Swiper === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labels = [...root.querySelectorAll('.project-preview__meta .home-tag')].map(el => el.textContent);
  const slides = [...root.querySelectorAll('.projects-slider__item')];
  const count = page.querySelector('.projects-controls__count');
  const initial = Math.max(0, slides.findIndex(slide => '#' + slide.id === location.hash));
  root.classList.add('_enhanced');
  const slider = new Swiper(root, {
    initialSlide: initial, slidesPerView: 1, spaceBetween: 28, autoHeight: true,
    speed: reduce.matches ? 0 : 1000, watchOverflow: true,
    navigation: { prevEl: '.projects-slider-nav__prev', nextEl: '.projects-slider-nav__next' },
    pagination: {
      el: '.projects-index', type: 'bullets', clickable: true,
      bulletClass: 'projects-index__button', bulletActiveClass: '_is-active',
      renderBullet: (i, className) => `<button class="${className}" type="button" aria-label="Проект ${i + 1}: ${labels[i]}"><span aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span>${labels[i]}</span></button>`
    },
    a11y: {
      prevSlideMessage: 'Предыдущий проект', nextSlideMessage: 'Следующий проект',
      paginationBulletMessage: 'Открыть проект {{index}}',
      slideLabelMessage: 'Проект {{index}} из {{slidesLength}}',
      containerRoleDescriptionMessage: 'Карусель проектов'
    },
    on: { init: syncState, slideChange: syncState }
  });
  function syncState(swiper) {
    swiper.slides.forEach((slide, i) => { slide.inert = i !== swiper.activeIndex; });
    count.textContent = `${String(swiper.activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }
  const index = page.querySelector('.projects-index');
  index.addEventListener('keydown', event => {
    const buttons = [...index.querySelectorAll('button')];
    const active = buttons.indexOf(event.target);
    if (active < 0) return;
    let next = active;
    if (event.key === 'ArrowRight') next = Math.min(buttons.length - 1, active + 1);
    else if (event.key === 'ArrowLeft') next = Math.max(0, active - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else return;
    event.preventDefault();
    slider.slideTo(next);
    buttons[next].focus();
  });
  window.addEventListener('hashchange', () => {
    const target = slides.findIndex(slide => '#' + slide.id === location.hash);
    if (target >= 0) slider.slideTo(target);
  });
  reduce.addEventListener('change', () => { slider.params.speed = reduce.matches ? 0 : 1000; });
  page.classList.add('_projects-ready');
})();

/* ==================== ПРОЕКТЫ: ГАЛЕРЕЯ ==================== */
(function () {
  const section = document.querySelector('.project-gallery');
  const root = section && section.querySelector('.project-gallery-slider');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (typeof Swiper !== 'undefined') {
    root.classList.add('_enhanced');
    const slider = new Swiper(root, {
      slidesPerView: 1.15, spaceBetween: 20, speed: reduce.matches ? 0 : 1000,
      watchOverflow: true,
      breakpoints: { 768: { slidesPerView: 2.15, spaceBetween: 24 }, 1024: { slidesPerView: 3.15, spaceBetween: 28 } },
      navigation: { prevEl: '.project-gallery-nav__prev', nextEl: '.project-gallery-nav__next' },
      pagination: { el: '.project-gallery__pagination', type: 'fraction', formatFractionCurrent: n => String(n).padStart(2, '0'), formatFractionTotal: n => String(n).padStart(2, '0') },
      a11y: { prevSlideMessage: 'Предыдущее изображение', nextSlideMessage: 'Следующее изображение', slideLabelMessage: '{{index}} из {{slidesLength}}', containerRoleDescriptionMessage: 'Галерея проекта' }
    });
    root.addEventListener('focusin', event => {
      const item = event.target.closest('.project-gallery__item');
      if (item) slider.slideTo([...slider.slides].indexOf(item));
    });
    reduce.addEventListener('change', () => { slider.params.speed = reduce.matches ? 0 : 1000; });
    section.classList.add('_gallery-ready');
  }
  if (typeof Fancybox !== 'undefined') Fancybox.bind('[data-fancybox="project-gallery"]', {
    animated: !reduce.matches, dragToClose: false,
    l10n: { CLOSE: 'Закрыть', NEXT: 'Следующее изображение', PREV: 'Предыдущее изображение', MODAL: 'Галерея проекта', ERROR: 'Не удалось загрузить изображение', IMAGE_ERROR: 'Не удалось загрузить изображение' }
  });
})();

// TODO: логика страниц на Vanilla JS в отдельных IIFE.
/* ==================== БУРГЕР ==================== */
(function () {
  const header = document.querySelector('.home-header');
  const burger = document.querySelector('.home-burger');
  const menu = document.querySelector('.home-menu');
  if (!header || !burger || !menu) return;
  function setOpen(open) {
    header.classList.toggle('_is-open', open);
    document.body.classList.toggle('_disable-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.inert = !open;
  }
  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (burger.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { setOpen(false); burger.focus(); }
    if (event.key === 'Tab') {
      const focusable = [burger, ...menu.querySelectorAll('a')];
      const index = focusable.indexOf(document.activeElement);
      if (event.shiftKey && index === 0) { event.preventDefault(); focusable.at(-1).focus(); }
      else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); burger.focus(); }
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', event => { if (event.matches) setOpen(false); });
})();
/* ==================== ЯКОРНЫЕ ССЫЛКИ ==================== */
(function () {
  document.querySelectorAll('._scroll-to[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
/* ==================== ШАПКА И ВИДЕО ВСТУПЛЕНИЯ ==================== */
(function () {
  const page = document.querySelector('.homepage');
  const header = document.querySelector('.home-header');
  const intro = document.querySelector('.home-intro');
  const video = document.querySelector('.home-intro__video');
  const statements = document.querySelector('.home-statements');
  if (!page || !intro || !header || !video || !statements) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phrases = [...document.querySelectorAll('.home-statements__phrase')];
  const current = document.querySelector('.home-statements__current');
  const progress = document.querySelector('.home-statements__line > span');
  const frame = document.querySelector('.home-intro__frame');
  const themes = [...document.querySelectorAll('main section[data-theme], footer[data-theme]')];
  const clamp = value => Math.max(0, Math.min(1, value));
  let queued = false;
  function update() {
    queued = false;
    let theme = 'dark';
    for (const section of themes) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 65 && rect.bottom > 65) theme = section.dataset.theme;
    }
    header.dataset.theme = theme;
    if (reduce.matches) return;
    const p = clamp(window.scrollY / window.innerHeight);
    video.style.filter = `blur(${28 * (1-p)}px)`;
    frame.style.clipPath = `inset(${12 * (1-p)}px round ${16 * (1-p)}px)`;
    const rect = statements.getBoundingClientRect();
    const ratio = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
    const active = Math.min(phrases.length-1, Math.floor(ratio * phrases.length));
    phrases.forEach((phrase, index) => phrase.classList.toggle('_is-active',index === active));
    current.textContent = String(active + 1).padStart(2,'0');
    progress.style.transform = `scaleX(${Math.max(1/3,ratio)})`;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  function configure() {
    page.classList.toggle('_motion',!reduce.matches);
    if (reduce.matches) video.pause(); else video.play().catch(() => {});
    update();
  }
  const visibility = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting && !reduce.matches && !document.hidden) video.play().catch(() => {}); else video.pause();
  }));
  visibility.observe(intro);
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); else if (intro.getBoundingClientRect().bottom > 0 && !reduce.matches) video.play().catch(() => {}); });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  reduce.addEventListener('change',configure);
  configure();
})();
/* ==================== ПРОДУКЦИЯ: ВИДЕО ПРИ ПРОКРУТКЕ ==================== */
(function () {
  const flow = document.querySelector('.home-flow');
  if (!flow) return;
  const desktop = window.matchMedia('(min-width: 1024px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rows = [...flow.querySelectorAll('.home-flow__item')];
  const videos = [...flow.querySelectorAll('.home-flow__video')];
  const caption = flow.querySelector('.home-flow__caption > span');
  let active = -1;
  let queued = false;
  const load = video => {
    if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
  };
  const preload = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const index = Number(entry.target.dataset.product);
    load(desktop.matches ? videos[index] : entry.target.querySelector('video'));
  }), { rootMargin: '50% 0px' });
  rows.forEach(row => preload.observe(row));
  function update() {
    queued = false;
    const rect = flow.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0 && !document.hidden;
    let index = 0;
    let distance = Infinity;
    rows.forEach((row,i) => {
      const rect = row.getBoundingClientRect();
      const d = Math.abs(rect.top+rect.height/2-window.innerHeight/2);
      if (d < distance) { distance = d; index = i; }
    });
    if (index !== active) {
      active = index;
      videos.forEach((video,i) => video.classList.toggle('_is-active',i === index));
      caption.textContent = rows[index].querySelector('h3').textContent;
    }
    videos.forEach((video,i) => {
      if (desktop.matches && visible && i === active && !reduce.matches) { load(video); video.play().catch(() => {}); } else video.pause();
    });
    rows.forEach(row => {
      const video = row.querySelector('video');
      const rect = video.getBoundingClientRect();
      const center = rect.top + rect.height/2;
      if (!desktop.matches && !document.hidden && !reduce.matches && center > window.innerHeight*.1 && center < window.innerHeight*.9) { load(video); video.play().catch(() => {}); } else video.pause();
    });
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  document.addEventListener('visibilitychange',schedule);
  desktop.addEventListener('change',schedule);
  reduce.addEventListener('change',schedule);
  update();
})();
/* ==================== ПРИЦЕЛ ==================== */
(function () {
  const hero = document.querySelector('.home-hero');
  const reticle = document.querySelector('.home-reticle');
  if (!hero || !reticle || window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
  const [vertical,horizontal] = reticle.querySelectorAll('span');
  const dot = reticle.querySelector('i');
  hero.addEventListener('pointermove', event => {
    if (window.scrollY > 8) { reticle.style.opacity = '0'; return; }
    const rect = hero.getBoundingClientRect();
    const x = event.clientX-rect.left, y = event.clientY-rect.top;
    vertical.style.transform = `translateX(${x}px)`;
    horizontal.style.transform = `translateY(${y}px)`;
    dot.style.transform = `translate(${x}px,${y}px)`;
    reticle.style.opacity = '1';
  });
  hero.addEventListener('pointerleave',() => { reticle.style.opacity = '0'; });
  window.addEventListener('scroll',() => { reticle.style.opacity = '0'; },{passive:true});
})();
/* ==================== CTA: ПОПАПЫ ЗАЯВОК ==================== */
(function () {
  const popup = document.getElementById('request-popup');
  if (!popup || typeof Fancybox === 'undefined') return;
  const form = popup.querySelector('.home-form');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let opener;
  // Контекст обновляется до того, как Fancybox перенесёт inline-форму в диалог.
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-request]');
    if (!trigger || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    opener = trigger;
    form.reset();
    form.elements.namedItem('phone').setCustomValidity('');
    form.querySelector('.home-form__status').textContent = '';
    const draft = form.querySelector('.home-form__draft');
    draft.hidden = true;
    draft.removeAttribute('href');
    popup.querySelector('#request-title').textContent = trigger.dataset.requestTitle;
    popup.querySelector('#request-context').textContent = trigger.dataset.requestContext;
    form.dataset.subject = trigger.dataset.requestSubject;
    form.elements.namedItem('context').value = trigger.dataset.requestContext;
  }, true);
  Fancybox.bind('[data-request]', {
    groupAttr: false,
    animated: !reduce.matches,
    dragToClose: false,
    mainClass: 'request-lightbox',
    l10n: { CLOSE: 'Закрыть форму', MODAL: 'Форма обращения в ИРБИС', ERROR: 'Не удалось открыть форму' },
    on: {
      ready: instance => {
        const container = instance.getContainer();
        const dialog = container?.closest('dialog') || container;
        dialog?.setAttribute('aria-labelledby', 'request-title');
        dialog?.setAttribute('aria-describedby', 'request-description');
        requestAnimationFrame(() => {
          if (instance.getContainer()?.isConnected) form.elements.namedItem('name').focus({ preventScroll: true });
        });
      },
      destroy: () => {
        if (opener?.closest('.home-menu')) document.querySelector('.home-burger')?.focus({ preventScroll: true });
      }
    }
  });
})();

/* ==================== ФОРМЫ: ПОДГОТОВКА ПИСЬМА ==================== */
(function () {
  document.querySelectorAll('.home-form').forEach(form => {
    const phone = form.elements.namedItem('phone');
    const consent = form.elements.namedItem('consent');
    const status = form.querySelector('.home-form__status');
    const draft = form.querySelector('.home-form__draft');
    if (!phone || !consent || !status || !draft) return;
    consent.checked = false;
    function clearDraft() {
      phone.setCustomValidity('');
      status.textContent = '';
      draft.hidden = true;
      draft.removeAttribute('href');
    }
    form.addEventListener('input', clearDraft);
    form.addEventListener('change', clearDraft);
    form.addEventListener('reset', clearDraft);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const digits = phone.value.replace(/\D/g,'');
      if (digits.length < 7 || digits.length > 15) {
        phone.setCustomValidity('Укажите телефон: от 7 до 15 цифр, с кодом страны или города.');
        phone.reportValidity();
        return;
      }
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const context = String(data.get('context') || document.title).trim();
      const body = `Обращение: ${form.dataset.subject}\r\nКонтекст: ${context}\r\n\r\nИмя: ${String(data.get('name')).trim()}\r\nТелефон: ${String(data.get('phone')).trim()}\r\n\r\nЗадача: ${String(data.get('message') || '').trim()}\r\n\r\nДаю согласие на обработку моих персональных данных в соответствии с политикой конфиденциальности.\r\nДокументы: consent.html и privacy.html, тексты-заглушки от 19.10.2026.`;
      draft.href = `mailto:Zakaz@irbisprom.ru?subject=${encodeURIComponent(form.dataset.subject || 'Заявка с сайта ИРБИС')}&body=${encodeURIComponent(body)}`;
      draft.hidden = false;
      status.textContent = 'Письмо подготовлено, но ещё не отправлено. Откройте его в почтовой программе, проверьте и отправьте. Если программа не настроена, позвоните нам.';
      draft.focus();
    });
  });
})();

/* ==================== ВНУТРЕННИЕ СТРАНИЦЫ: ТЕМА ШАПКИ ==================== */
(function () {
  const page = document.querySelector('.about-page, .equipment-page, .projects-page, .blog-page, .contacts-page, .legal-page');
  const header = page && page.querySelector('.home-header');
  if (!header) return;
  const sections = [...page.querySelectorAll('main section[data-theme], footer[data-theme]')];
  let queued = false;
  function update() {
    queued = false;
    const line = header.getBoundingClientRect().height / 2;
    const section = sections.find(item => {
      const rect = item.getBoundingClientRect();
      return rect.top <= line && rect.bottom > line;
    });
    header.dataset.theme = section ? section.dataset.theme : 'light';
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();

/* ==================== ОБОРУДОВАНИЕ: СЛАЙДЕРЫ И ГРУППЫ ==================== */
(function () {
  const page = document.querySelector('.equipment-page');
  if (!page || typeof Swiper === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sliders = [];
  ['equipment-projects', 'equipment-production-slider'].forEach(name => {
    const root = page.querySelector('.' + name);
    if (!root) return;
    root.classList.add('_enhanced');
    sliders.push(new Swiper(root, {
      slidesPerView: 1, spaceBetween: 24, speed: reduce.matches ? 0 : 1000,
      watchOverflow: true,
      navigation: { prevEl: '.' + name + '-nav__prev', nextEl: '.' + name + '-nav__next' },
      pagination: { el: '.' + name + '__pagination', type: 'fraction', formatFractionCurrent: n => String(n).padStart(2,'0'), formatFractionTotal: n => String(n).padStart(2,'0') },
      a11y: { prevSlideMessage: 'Предыдущий слайд', nextSlideMessage: 'Следующий слайд', slideLabelMessage: '{{index}} из {{slidesLength}}' },
      on: { init: syncFocus, slideChange: syncFocus }
    }));
  });
  const tabsRoot = page.querySelector('.equipment-tabs');
  const productsRoot = page.querySelector('.equipment-products');
  if (tabsRoot && productsRoot) {
    const tabs = [...tabsRoot.querySelectorAll('.equipment-tabs__tab')];
    const panels = [...productsRoot.querySelectorAll('.equipment-product')];
    const initial = Math.max(0, panels.findIndex(panel => '#' + panel.id === location.hash));
    tabsRoot.classList.add('_enhanced');
    productsRoot.classList.add('_enhanced');
    tabsRoot.querySelector('.equipment-tabs__list').setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', tab.id);
    });
    const thumbs = new Swiper(tabsRoot, {
      initialSlide: initial, slidesPerView: 'auto', spaceBetween: 12,
      speed: reduce.matches ? 0 : 1000, watchSlidesProgress: true,
      a11y: { enabled: false }
    });
    const products = new Swiper(productsRoot, {
      initialSlide: initial, slidesPerView: 1, spaceBetween: 35,
      speed: reduce.matches ? 0 : 1000, autoHeight: true,
      thumbs: { swiper: thumbs },
      navigation: { prevEl: '.equipment-products-nav__prev', nextEl: '.equipment-products-nav__next' },
      pagination: { el: '.equipment-products__pagination', type: 'fraction', formatFractionCurrent: n => String(n).padStart(2,'0'), formatFractionTotal: n => String(n).padStart(2,'0') },
      a11y: { enabled: false },
      on: { init: syncTabs, slideChange: syncTabs }
    });
    function syncTabs(swiper) {
      tabs.forEach((tab, i) => {
        const active = i === swiper.activeIndex;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].inert = !active;
      });
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', event => event.preventDefault());
      tab.addEventListener('keydown', event => {
        let next = i;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          products.slideTo(i);
          return;
        } else return;
        event.preventDefault();
        products.slideTo(next);
        thumbs.slideTo(next);
        tabs[next].focus({ preventScroll: true });
      });
    });
    sliders.push(thumbs, products);
  }
  function syncFocus(swiper) {
    swiper.slides.forEach((slide, i) => { slide.inert = i !== swiper.activeIndex; });
  }
  reduce.addEventListener('change', () => sliders.forEach(slider => { slider.params.speed = reduce.matches ? 0 : 1000; }));
  page.classList.add('_equipment-ready');
})();

/* ==================== О КОМПАНИИ: БЕГУЩАЯ СТРОКА ПАРТНЁРОВ ==================== */
(function () {
  const brands = document.querySelector('.about-brands');
  if (!brands) return;
  const track = brands.querySelector('.about-brands__track');
  const group = brands.querySelector('.about-brands__group');
  const toggle = brands.querySelector('.about-brands__toggle');
  const viewport = brands.querySelector('.about-brands__viewport');
  if (!track || !group || !toggle || !viewport) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  track.appendChild(copy);
  function configure() {
    const moving = !reduce.matches;
    brands.classList.toggle('_running', moving);
    copy.hidden = !moving;
    toggle.hidden = !moving;
    viewport.tabIndex = moving ? -1 : 0;
    viewport.scrollLeft = 0;
  }
  toggle.addEventListener('click', () => {
    const paused = brands.classList.toggle('_paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.querySelector('.about-brands__label').textContent = paused ? 'Продолжить' : 'Приостановить';
    toggle.querySelector('.about-brands__state').textContent = paused ? '▷' : 'Ⅱ';
  });
  reduce.addEventListener('change', configure);
  document.addEventListener('visibilitychange', () => {
    brands.classList.toggle('_paused-away', document.hidden);
  });
  configure();
})();

