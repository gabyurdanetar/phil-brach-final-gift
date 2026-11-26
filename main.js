/* =========================================================
   Phil Brach · The Final Gift — interactions
   Mobile menu, header rule on scroll, gentle section reveal,
   cover tilt on hover, newsletter form validation,
   draft-notes toggle. Motion respects prefers-reduced-motion.
   ========================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Header: hairline once the page scrolls ---------- */
  const header = $("[data-header]");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Gentle reveal as each block enters ---------- */
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Cover leans gently toward the pointer ---------- */
  const book = $(".hero__book");
  if (book && !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    book.addEventListener("pointermove", (e) => {
      const r = book.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
      const y = (e.clientY - r.top) / r.height - 0.5;
      book.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
      book.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    });
    book.addEventListener("pointerleave", () => {
      book.style.removeProperty("--ry");
      book.style.removeProperty("--rx");
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger");
  const menu = $("#menu");
  const label = burger ? $(".burger__label", burger) : null;

  function setMenu(open) {
    if (!burger || !menu) return;
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Close" : "Menu";
  }
  burger?.addEventListener("click", () => setMenu(menu.hidden));
  menu?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu && !menu.hidden) { setMenu(false); burger.focus(); }
  });
  window.matchMedia("(min-width: 1001px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Newsletter form (mockup: nothing is sent) ---------- */
  const form = $("#signup");
  if (form) {
    const input = $("input[type=email]", form);
    const msg = $("#signup-msg");
    const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!valid(input.value.trim())) {
        msg.textContent = "Please enter a valid email address.";
        msg.className = "signup__msg is-error";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      msg.textContent = "Thank you. You’re on the list. (Mockup: nothing was sent.)";
      msg.className = "signup__msg is-ok";
    });
  }

  /* ---------- Draft notes toggle ---------- */
  const notesBtn = $(".notes-toggle");
  notesBtn?.addEventListener("click", () => {
    const on = document.body.classList.toggle("show-notes");
    notesBtn.setAttribute("aria-pressed", String(on));
    notesBtn.textContent = on ? "Hide draft notes" : "Show draft notes";
  });
})();
