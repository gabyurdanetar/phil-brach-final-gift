/* =========================================================
   Phil Brach · The Final Gift — interactions
   No dependencies. Every effect degrades gracefully:
   without JS the page is fully readable, and with
   prefers-reduced-motion the scroll choreography is off.
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqTravel = window.matchMedia("(min-width: 1024px) and (min-height: 560px)");
  const mqFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let reduce = mqReduce.matches;
  root.classList.toggle("reduce", reduce);

  let vh = window.innerHeight;

  /* ---------- Year + release countdown ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  const countEl = $("[data-countdown]");
  const unitEl = $("[data-countdown-unit]");
  if (countEl) {
    const release = new Date(2027, 1, 16); // February 16, 2027 (local time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((release - today) / 86400000);
    const box = countEl.closest(".countdown");
    if (days > 0) {
      countEl.textContent = String(days);
      if (unitEl) unitEl.textContent = days === 1 ? "day" : "days";
    } else if (box) {
      countEl.textContent = "✦";
      box.querySelector(".countdown__label").innerHTML = "Available now<br>Sophia Institute Press";
    }
  }

  /* ---------- Header: scrolled state, hide on scroll down, progress ---------- */
  const header = $("[data-header]");
  const progressBar = $(".header__progress span");
  let lastY = window.scrollY;

  function updateHeader(y) {
    if (!header) return;
    header.classList.toggle("is-scrolled", y > 24);
    const menuOpen = root.classList.contains("menu-open");
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (!menuOpen && goingDown && y > 480) header.classList.add("is-hidden");
    else if (goingUp || y < 480 || menuOpen) header.classList.remove("is-hidden");
    if (Math.abs(y - lastY) > 4) lastY = y;
    const max = document.documentElement.scrollHeight - vh;
    if (progressBar) progressBar.style.setProperty("--progress", max > 0 ? clamp(y / max).toFixed(4) : "0");
  }
  // Keyboard users tabbing into the header should always see it.
  header?.addEventListener("focusin", () => header.classList.remove("is-hidden"));

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger");
  const menu = $("#menu");

  function setMenu(open) {
    if (!burger || !menu) return;
    root.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    menu.toggleAttribute("inert", !open);
    if (open) {
      header?.classList.remove("is-hidden");
      setTimeout(() => $("a", menu)?.focus({ preventScroll: true }), 300);
    }
  }
  burger?.addEventListener("click", () => setMenu(!root.classList.contains("menu-open")));
  menu?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("menu-open")) {
      setMenu(false);
      burger?.focus();
    }
  });
  // If the viewport grows past the mobile breakpoint, close the menu.
  window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Reveal + count-up (checked inside the rAF loop below) ----------
     Anything whose top has entered the lower 10% of the viewport (or that the
     reader already scrolled past, e.g. after a jump link) is revealed once. */
  let pendingReveals = $$(".reveal");
  function checkReveals() {
    if (!pendingReveals.length) return;
    const limit = vh * 0.9;
    pendingReveals = pendingReveals.filter((el) => {
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add("in");
        return false;
      }
      return true;
    });
  }

  const fmtCount = (el, n) => `${el.dataset.prefix || ""}${n}${el.dataset.suffix || ""}`;
  let pendingCounters = reduce ? [] : $$("[data-count]");
  pendingCounters.forEach((el) => { el.textContent = fmtCount(el, 0); });
  function runCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const start = performance.now();
    const dur = 1600;
    const step = (now) => {
      const t = clamp((now - start) / dur);
      el.textContent = fmtCount(el, Math.round(easeOut(t) * target));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function checkCounters() {
    if (!pendingCounters.length) return;
    pendingCounters = pendingCounters.filter((el) => {
      if (el.getBoundingClientRect().top < vh * 0.85) {
        runCounter(el);
        return false;
      }
      return true;
    });
  }

  /* ---------- Quote: split into words for the scroll "ink" effect ---------- */
  const scrub = $("[data-scrub]");
  let scrubWords = [];
  if (scrub) {
    const p = $("p", scrub);
    const keys = new Set(["widow’s", "mite"]);
    const words = p.textContent.trim().split(/\s+/);
    p.setAttribute("aria-label", p.textContent.trim());
    p.textContent = "";
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "w" + (keys.has(word) ? " key" : "");
      span.setAttribute("aria-hidden", "true");
      span.textContent = word;
      p.appendChild(span);
      if (i < words.length - 1) p.appendChild(document.createTextNode(" "));
    });
    scrubWords = $$(".w", p);
  }

  /* ---------- The book ---------- */
  const heroSlot = $('[data-slot="hero"]');
  const featSlot = $('[data-slot="feature"]');
  const flyer = $(".flyer");
  const heroStage = $(".hero");
  const rigA = heroSlot ? $(".book-rig", heroSlot) : null; // hero book (travels)
  const rigB = featSlot ? $(".book-rig", featSlot) : null; // feature book (static on small screens)
  let travel = false;
  let geo = null;
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

  const docRect = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
  };

  function setPose(rig, { rx, ry, rz, open }) {
    const s = rig.style;
    s.setProperty("--rx", rx.toFixed(2) + "deg");
    s.setProperty("--ry", ry.toFixed(2) + "deg");
    s.setProperty("--rz", rz.toFixed(2) + "deg");
    s.setProperty("--open", open.toFixed(4));
    // Light sheen follows the cover's angle (normalised to -180..180).
    const n = ((((ry + 180) % 360) + 360) % 360) - 180;
    s.setProperty("--sheen", clamp((n + 40) / 80).toFixed(3));
  }

  function setMode() {
    if (!rigA || !rigB || !flyer || !heroSlot) return;
    const want = mqTravel.matches && !reduce;
    if (want === travel) return;
    travel = want;
    root.classList.toggle("travel", travel);
    if (travel) {
      flyer.appendChild(rigA);
    } else {
      heroSlot.appendChild(rigA);
      flyer.style.transform = "";
      geo = null;
    }
    measure();
  }

  function measure() {
    vh = window.innerHeight;
    if (!travel || !featSlot || !heroSlot || !flyer) { geo = null; return; }
    const h = docRect(heroSlot);
    // The slot itself is never transformed, so it is the reliable landing box.
    const f = docRect(featSlot);
    if (!h.w || !f.w) { geo = null; return; }
    // Scroll position where the feature book sits centred in the viewport.
    const end = Math.max(1, f.y + f.h / 2 - vh / 2);
    geo = { h, f, end };
    flyer.style.width = h.w + "px";
    flyer.style.height = h.h + "px";
  }

  function renderBooks(y) {
    if (!rigA || !rigB) return;

    if (travel && geo) {
      const { h, f, end } = geo;
      const p = clamp(y / end);
      const e = easeInOut(p);
      // Sideways move waits until the reader is past the deed, so the book
      // never sits on top of the "idea in brief" copy.
      const px = easeInOut(clamp((p - 0.62) / 0.38));
      const arc = Math.sin(Math.PI * p);
      const open = easeOut(clamp((y - end + vh * 0.06) / (vh * 0.42)));
      // Closed, the book lands centred in the stage; opening slides it right
      // so the open spread is centred (mirrors the CSS on .book-slot--feature).
      const landX = f.x - (f.w / 2 + 12) * (1 - open);
      const x = lerp(h.x, landX, px) + Math.sin(Math.PI * px) * Math.min(40, window.innerWidth * 0.03);
      const ty = lerp(h.y, f.y, p);
      const scale = lerp(1, f.w / h.w, px);
      flyer.style.transform = `translate3d(${x.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

      const k = 1 - p;
      setPose(rigA, {
        rx: 6 + tilt.x * k + arc * 8,
        ry: lerp(-24, 344, e) + tilt.y * k + open * 10,
        rz: arc * -5,
        open,
      });
      return;
    }

    // Static mode (small screens / reduced motion)
    const heroP = clamp(y / vh);
    setPose(rigA, { rx: 6 + tilt.x, ry: -24 + tilt.y + heroP * 16, rz: 0, open: 0 });

    const r = rigB.getBoundingClientRect();
    const centre = r.top + r.height / 2;
    const open = reduce ? 0 : easeOut(clamp((vh * 0.72 - centre) / (vh * 0.42)));
    const enter = clamp((vh - r.top) / vh);
    setPose(rigB, { rx: 4, ry: lerp(-30, -14, enter) + open * 8, rz: 0, open });
  }

  // Pointer tilt on the hero book (desktop only)
  let tiltRaf = 0;
  function tiltLoop() {
    tilt.x += (tilt.tx - tilt.x) * 0.08;
    tilt.y += (tilt.ty - tilt.y) * 0.08;
    renderBooks(window.scrollY);
    if (Math.abs(tilt.tx - tilt.x) > 0.02 || Math.abs(tilt.ty - tilt.y) > 0.02) {
      tiltRaf = requestAnimationFrame(tiltLoop);
    } else {
      tiltRaf = 0;
    }
  }
  function kickTilt() { if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltLoop); }
  if (heroStage) {
    heroStage.addEventListener("pointermove", (e) => {
      if (reduce || !mqFinePointer.matches) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tilt.ty = nx * 16;
      tilt.tx = -ny * 10;
      kickTilt();
    });
    heroStage.addEventListener("pointerleave", () => { tilt.tx = 0; tilt.ty = 0; kickTilt(); });
  }

  /* ---------- Other scroll-linked effects ---------- */
  const strikeEl = $("[data-strike]");
  const coins = $(".coins");
  const pledge = $(".pledge");
  const gifts = $$(".gift");

  // 0 when the element's top hits `from` (fraction of vh), 1 when it reaches `to`.
  const progressOf = (el, from, to) => {
    const r = el.getBoundingClientRect();
    return clamp((vh * from - r.top) / (vh * (from - to)));
  };
  const inView = (el, margin = 0.2) => {
    const r = el.getBoundingClientRect();
    return r.bottom > -vh * margin && r.top < vh * (1 + margin);
  };

  function renderEffects() {
    if (reduce) return;

    if (strikeEl && inView(strikeEl)) {
      strikeEl.style.setProperty("--strike", easeOut(progressOf(strikeEl, 0.82, 0.42)).toFixed(3));
    }

    if (scrub && scrubWords.length && inView(scrub)) {
      const p = progressOf(scrub, 0.85, 0.4);
      const lit = Math.round(p * scrubWords.length);
      scrubWords.forEach((w, i) => w.classList.toggle("on", i < lit));
    }

    if (coins && inView(coins)) {
      const p = progressOf(coins, 1, 0);
      coins.style.setProperty("--ca", ((0.5 - p) * 150).toFixed(1) + "deg");
      coins.style.setProperty("--cb", ((p - 0.5) * 120 + 10).toFixed(1) + "deg");
    }

    if (pledge && gifts.length && inView(pledge)) {
      const r = pledge.getBoundingClientRect();
      const mid = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 roughly
      gifts.forEach((g) => {
        const speed = parseFloat(g.style.getPropertyValue("--speed")) || 1;
        g.style.setProperty("--py", (mid * speed * 120).toFixed(1) + "px");
      });
    }
  }

  /* ---------- Hero particle field ----------
     Gold, green and plum motes drifting upward, linked by faint threads,
     pushed aside by the pointer. Runs only while the hero is on screen;
     with reduced motion a single still frame is drawn. */
  const particles = (() => {
    const canvas = $(".hero__particles");
    const host = $(".hero");
    if (!canvas || !host || !canvas.getContext) return { sync() {}, resize() {} };
    const ctx = canvas.getContext("2d");
    const tints = ["68, 112, 28", "212, 168, 69", "69, 32, 92", "111, 154, 47"];
    const pointer = { x: -9999, y: -9999 };
    const LINK = 96;
    let w = 0, h = 0, pts = [], running = false, raf = 0;

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 8,
      r: Math.random() * 2.4 + 0.8,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(Math.random() * 0.32 + 0.08),
      tint: tints[(Math.random() * tints.length) | 0],
      a: Math.random() * 0.45 + 0.35,
      tw: Math.random() * Math.PI * 2,
    });

    function resize() {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(120, Math.max(36, (w * h) / 10000)));
      pts = Array.from({ length: count }, () => spawn(true));
      draw();
    }

    function step() {
      for (const p of pts) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 130 * 130) {
          const d = Math.sqrt(d2) || 1;
          const force = ((130 - d) / 130) * 1.6;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }
        p.x += p.vx; p.y += p.vy; p.tw += 0.025;
        if (p.y < -10 || p.x < -10 || p.x > w + 10) Object.assign(p, spawn(false));
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.7;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            ctx.strokeStyle = `rgba(69, 32, 92, ${((1 - Math.sqrt(d2) / LINK) * 0.16).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = `rgba(${p.tint}, ${(p.a * (0.65 + 0.35 * Math.sin(p.tw))).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function loop() {
      if (!running) return;
      step(); draw();
      raf = requestAnimationFrame(loop);
    }

    host.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    });
    host.addEventListener("pointerleave", () => { pointer.x = pointer.y = -9999; });

    return {
      resize,
      // Start/stop with hero visibility (called from the frame scheduler).
      sync() {
        const r = host.getBoundingClientRect();
        const should = !reduce && r.bottom > 0 && r.top < vh;
        if (should && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!should && running) { running = false; cancelAnimationFrame(raf); }
      },
    };
  })();

  /* ---------- Frame scheduler ---------- */
  let ticking = false;
  function render() {
    ticking = false;
    const y = window.scrollY;
    checkReveals();
    checkCounters();
    particles.sync();
    updateHeader(y);
    renderBooks(y);
    renderEffects();
  }
  function requestRender() {
    if (!ticking) { ticking = true; requestAnimationFrame(render); }
  }

  let lastParticleSize = "";
  function relayout() {
    setMode();
    measure();
    // Only rebuild the particle field when the hero's size really changes
    // (mobile URL-bar resizes would otherwise reshuffle it constantly).
    const hr = heroStage ? heroStage.getBoundingClientRect() : null;
    const key = hr ? `${Math.round(hr.width)}x${Math.round(hr.height / 40)}` : "";
    if (key !== lastParticleSize) { lastParticleSize = key; particles.resize(); }
    requestRender();
  }

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", relayout);
  window.addEventListener("load", relayout);
  mqTravel.addEventListener("change", relayout);
  mqReduce.addEventListener("change", (e) => {
    reduce = e.matches;
    root.classList.toggle("reduce", reduce);
    relayout();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  if ("ResizeObserver" in window) {
    let roTimer = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(roTimer);
      roTimer = requestAnimationFrame(() => { measure(); requestRender(); });
    }).observe(document.body);
  }

  if (reduce && scrubWords.length) scrubWords.forEach((w) => w.classList.add("on"));
  relayout();

  /* ---------- Newsletter form (mockup: nothing is sent) ---------- */
  const form = $("#signup");
  if (form) {
    const input = $("input[type=email]", form);
    const msg = $("#signup-msg");
    const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!valid(value)) {
        msg.textContent = "Please enter a valid email address.";
        msg.className = "signup__msg is-error";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      msg.textContent = "Thank you. You’re on the list. (Mockup: nothing was sent.)";
      msg.className = "signup__msg is-ok";
      form.classList.add("is-sent");
    });
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true" && valid(input.value.trim())) {
        input.removeAttribute("aria-invalid");
        msg.textContent = "";
        msg.className = "signup__msg";
      }
    });
  }

  /* ---------- Draft notes toggle ---------- */
  const notesBtn = $(".notes-toggle");
  notesBtn?.addEventListener("click", () => {
    const on = document.body.classList.toggle("show-notes");
    notesBtn.setAttribute("aria-pressed", String(on));
    notesBtn.textContent = on ? "Hide draft notes" : "Show draft notes";
    measure();
    requestRender();
  });
})();
