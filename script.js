(() => {
  'use strict';

  // Place your resume PDF next to index.html with this name, or change the path here.
  const CONFIG = { resumeUrl: 'resume.pdf', resumeFileName: 'Arjun-Mehta-Resume.pdf' };

  const PROJECTS = {
    segmentation: {
      meta: 'Marketing Analytics · MBA project · 2025',
      title: 'Customer Segmentation & Campaign Effectiveness',
      problem: 'Understand how different customer groups and product categories respond to marketing campaigns.',
      approach: 'Analysed a 240-record classroom sales dataset with Excel PivotTables and Power BI to compare customer groups, product categories and campaign response. Built an interactive dashboard.',
      tools: 'Excel PivotTables, Power BI',
      outcome: 'Recommended segment-specific messaging based on the comparison.',
      note: 'The dataset and results were created for academic practice.'
    },
    retail: {
      meta: 'Business Strategy · 2025',
      title: 'Retail Expansion Feasibility Study',
      problem: 'Decide which Hyderabad neighbourhood is the strongest candidate for a new retail location.',
      approach: 'Compared 4 neighbourhoods with a weighted scorecard covering target-customer density, competitor presence, accessibility and indicative rental cost.',
      tools: 'Weighted scorecard, competitor analysis',
      outcome: 'Presented a shortlist and a risk assessment to the project panel.',
      note: 'Assumptions and data limitations were documented for the panel.'
    },
    finance: {
      meta: 'Finance coursework · 2024',
      title: 'Working Capital & Financial Performance Review',
      problem: 'Find what drives cash tied up in a sample retail company.',
      approach: 'Reviewed three years of illustrative financial statements and calculated current ratio, inventory days, receivable days and payable days.',
      tools: 'Financial ratio analysis',
      outcome: 'Summarised the cash-conversion-cycle drivers and proposed practical working-capital improvement areas.',
      note: 'Based on illustrative statements for a sample company.'
    }
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Resume links
  try {
    $$('#resumeBtn, [data-resume]').forEach((a) => {
      a.setAttribute('href', CONFIG.resumeUrl);
      a.setAttribute('download', CONFIG.resumeFileName);
    });
  } catch (err) { console.error('Resume link setup failed', err); }

  // Footer year
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  if (toggle && links) {
    const setOpen = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // Scroll progress + back to top
  const bar = $('#progress');
  const toTop = $('#toTop');
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('show', y > 600);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  // Counters
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    if (reduceMotion) { el.textContent = target; return; }
    const start = performance.now();
    const duration = 1200;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        $$('[data-count]', entry.target).forEach(runCounter);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    $$('.reveal').forEach((el) => revealObs.observe(el));

    // Active nav link
    const sections = $$('main section[id]');
    const navAnchors = $$('.nav-links a');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => {
          const active = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
  }

  // Project modal
  const modal = $('#projectModal');
  if (modal) {
    const field = (label, text) => {
      const wrap = document.createDocumentFragment();
      const h = document.createElement('h4'); h.textContent = label;
      const p = document.createElement('p'); p.textContent = text;
      wrap.append(h, p);
      return wrap;
    };
    const content = $('#modalContent');
    $$('[data-project]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const data = PROJECTS[btn.dataset.project];
        if (!data) return;
        $('#modalMeta').textContent = data.meta;
        $('#modalTitle').textContent = data.title;
        content.replaceChildren(
          field('Business problem', data.problem),
          field('Approach', data.approach),
          field('Tools', data.tools),
          field('Outcome', data.outcome),
          field('Note', data.note)
        );
        if (typeof modal.showModal === 'function') modal.showModal();
        else modal.setAttribute('open', '');
      });
    });
    const close = () => (typeof modal.close === 'function' ? modal.close() : modal.removeAttribute('open'));
    $('#modalClose')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }
})();
