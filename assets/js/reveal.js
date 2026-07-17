/* AURORA — scroll reveals + scroll-progress bar for AI4Good.
   Progressive enhancement: without JS everything is visible (CSS gates on .has-js). */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- scroll progress bar ----- */
  var bar = document.querySelector('.scroll-progress');
  if (bar && !reduce) {
    var onScroll = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      bar.style.width = (pct * 100).toFixed(2) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ----- scroll reveals ----- */
  if (reduce) return;

  var selector = [
    '.hero > *',
    '.section-title',
    '.intro',
    '.post-grid > .card',
    '.post-header',
    '.post-lede',
    '.content > h2',
    '.content > figure',
    '.post-footer',
    '.page-head'
  ].join(',');

  var els = Array.prototype.slice.call(document.querySelectorAll(selector));
  els.forEach(function (el) { el.classList.add('reveal'); });

  /* stagger cards within the grid */
  var cards = document.querySelectorAll('.post-grid > .card');
  Array.prototype.forEach.call(cards, function (card, i) {
    card.style.transitionDelay = Math.min(i, 8) * 55 + 'ms';
  });

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  els.forEach(function (el) { io.observe(el); });
})();
