document.documentElement.classList.add("js");

const navToggle = document.querySelector("[data-nav-toggle]");
const navigation = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const desktopMenu = window.matchMedia("(min-width: 64rem)");

function closeMenu() {
  if (!navToggle || !navigation) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
  navigation.hidden = true;
  document.body.classList.remove("menu-open");
}

function openMenu() {
  if (!navToggle || !navigation) return;
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Fechar menu");
  navigation.hidden = false;
  document.body.classList.add("menu-open");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  isOpen ? closeMenu() : openMenu();
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (!desktopMenu.matches) closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

desktopMenu.addEventListener("change", (event) => {
  if (event.matches) {
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    if (navigation) navigation.hidden = false;
  } else {
    closeMenu();
  }
});

if (desktopMenu.matches && navigation) {
  navigation.hidden = false;
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const copyStatus = document.querySelector("[data-copy-status]");

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

document.querySelectorAll("[data-coupon]").forEach((button) => {
  button.addEventListener("click", async () => {
    const coupon = button.dataset.coupon;
    const label = button.querySelector("[data-copy-label]");

    try {
      await copyText(coupon);
      if (label) label.textContent = "Copiado";
      if (copyStatus) copyStatus.textContent = `Cupom ${coupon} copiado.`;

      window.setTimeout(() => {
        if (label) label.textContent = "Copiar";
      }, 1800);
    } catch {
      if (label) label.textContent = "Selecione o código";
      if (copyStatus) copyStatus.textContent = `Não foi possível copiar o cupom ${coupon}.`;
    }
  });
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
