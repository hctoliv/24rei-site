/* ===========================================================
   24 REI — interações
   =========================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- preloader + entrada do hero ---------- */
  function start() {
    var loader = $('#loader');
    if (loader) loader.classList.add('is-done');
    document.body.classList.add('is-ready');
  }
  if (document.readyState === 'complete') { setTimeout(start, reduced ? 0 : 420); }
  else { window.addEventListener('load', function () { setTimeout(start, reduced ? 0 : 420); }); }
  setTimeout(start, 2600); // rede lenta não deve prender a página

  /* ---------- header + barra de progresso ---------- */
  var header = $('#header');
  var bar = $('#progress');
  var toTop = $('#toTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-stuck', y > 24);
    if (toTop) toTop.classList.toggle('is-on', y > window.innerHeight * 0.9);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- menu mobile ---------- */
  var burger = $('#burger');
  var menu = $('#menu');

  function setMenu(open) {
    document.body.classList.toggle('is-locked', open);
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $$(':scope > a', menu).forEach(function (a, i) {
      a.style.transitionDelay = open ? (0.12 + i * 0.06) + 's' : '0s';
    });
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = $$('.rv');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- contadores ---------- */
  var nf = new Intl.NumberFormat('pt-BR');

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var sep = el.getAttribute('data-sep') === '1';
    var fmt = function (n) { return prefix + (sep ? nf.format(n) : String(n)) + suffix; };

    if (reduced) { el.textContent = fmt(target); return; }

    var dur = 1800, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$('[data-count]');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCounter);
  } else {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- acordeão de serviços ---------- */
  $$('.svc').forEach(function (svc) {
    var btn = $('.svc__row', svc);
    btn.addEventListener('click', function () {
      var open = svc.classList.contains('is-open');
      $$('.svc').forEach(function (o) {
        o.classList.remove('is-open');
        $('.svc__row', o).setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        svc.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- esteiras infinitas (duplicam o conteúdo) ---------- */
  ['#marquee', '#marcasTrack'].forEach(function (sel) {
    var track = $(sel);
    if (track && !reduced) track.innerHTML += track.innerHTML;
  });

  /* ---------- parallax suave dos blobs do hero ---------- */
  if (!reduced) {
    var blobs = $$('.blob');
    var hero = $('.hero');
    if (hero && blobs.length) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.width / 2) / r.width;
        var y = (e.clientY - r.height / 2) / r.height;
        blobs.forEach(function (b, i) {
          var f = (i + 1) * 14;
          b.style.translate = (x * f) + 'px ' + (y * f) + 'px';
        });
      }, { passive: true });
    }
  }

  /* ---------- nav ativa conforme a seção ---------- */
  var links = $$('.nav a[href^="#"]');
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = sections.indexOf(en.target);
        links.forEach(function (a, j) {
          if (j === i) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) sio.observe(s); });
  }

  /* ---------- formulário -> WhatsApp ---------- */
  var WPP = '5511993563103';
  var form = $('#form');
  var note = $('#formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var required = ['f-nome', 'f-email', 'f-tel', 'f-msg'];
      var missing = required.filter(function (id) { return !$('#' + id).value.trim(); });
      if (missing.length) {
        var first = $('#' + missing[0]);
        first.focus();
        first.style.borderColor = 'var(--m)';
        note.textContent = 'Preencha os campos obrigatórios para continuar.';
        return;
      }

      var v = function (id) { return $('#' + id).value.trim(); };
      var linhas = [
        'Olá, 24 Rei! Vim pelo site.',
        '',
        'Nome: ' + v('f-nome'),
        v('f-empresa') ? 'Empresa: ' + v('f-empresa') : null,
        'E-mail: ' + v('f-email'),
        'Telefone: ' + v('f-tel'),
        'Assunto: ' + v('f-assunto'),
        'Serviço: ' + v('f-servico'),
        '',
        'Projeto: ' + v('f-msg')
      ].filter(function (l) { return l !== null; });

      var url = 'https://api.whatsapp.com/send?phone=' + WPP + '&text=' + encodeURIComponent(linhas.join('\n'));

      // um link real abre em qualquer contexto; window.open morre em popup blocker e em página incorporada
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      note.innerHTML = 'Mensagem pronta. Se o WhatsApp não abrir sozinho, ' +
        '<a href="' + url + '" target="_blank" rel="noopener" style="color:var(--c)">toque aqui</a> ' +
        'ou chame no (11) 2022-4475.';
    });

    $$('input, textarea, select', form).forEach(function (el) {
      el.addEventListener('input', function () { el.style.borderColor = ''; });
    });
  }

  /* ---------- ano no rodapé ---------- */
  var yr = $('#year');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
