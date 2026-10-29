const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const backToTop = document.querySelector("#back-to-top");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

// Mobile navigation
function closeMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navItems.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Reveal sections as they enter the viewport
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Active navigation and back-to-top visibility
const sections = document.querySelectorAll("main section[id]");
function updateScrollUI() {
  const scrollPosition = window.scrollY + 140;
  let currentSection = "home";

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) currentSection = section.id;
  });

  navItems.forEach((link) => {
    const active = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  backToTop?.classList.toggle("visible", window.scrollY > 500);
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 680) closeMenu();
});
updateScrollUI();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});

// Contact form: validates fields, then prepares a message in the visitor's email app.
// Replace this address with your real email. A static site cannot send mail by itself.
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const recipient = "jameselpedes496@gmail.com";
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  formStatus.textContent = "Opening your email app…";
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

// Keep the footer year current
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
