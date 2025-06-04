document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    // Toggle class instead of inline style for better control
    mobileMenu.classList.toggle("show");
  });
});
