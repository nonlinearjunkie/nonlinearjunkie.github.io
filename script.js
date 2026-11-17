const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll("[data-section]")];
const reveals = document.querySelectorAll(".reveal");

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  header.classList.toggle("menu-open", !isOpen);
  document.body.style.overflow = isOpen ? "" : "hidden";
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    header.classList.remove("menu-open");
    document.body.style.overflow = "";
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -4%" }
);

reveals.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
  revealObserver.observe(element);
});

const trackedSections = sections.filter((section) =>
  navLinks.some((link) => link.getAttribute("href") === `#${section.id}`)
);

let activeFrame;
const updateActiveNav = () => {
  const threshold = Math.min(window.innerHeight * 0.35, 240);
  let activeId = null;

  trackedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= threshold) activeId = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
};

window.addEventListener(
  "scroll",
  () => {
    window.cancelAnimationFrame(activeFrame);
    activeFrame = window.requestAnimationFrame(updateActiveNav);
  },
  { passive: true }
);

updateActiveNav();

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    header.classList.remove("menu-open");
    document.body.style.overflow = "";
    navToggle.focus();
  }
});
