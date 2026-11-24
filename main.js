/* =========================================================
   Phil Brach · The Final Gift — interactions
   Navigation only: mobile menu, header rule on scroll,
   newsletter form validation, draft-notes toggle.
   No decorative motion.
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
