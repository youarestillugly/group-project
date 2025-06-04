document.addEventListener("DOMContentLoaded", () => {
      const menuToggle = document.querySelector('.menu-toggle');
      const navMenu = document.querySelector('.navbar nav ul');

      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
      });
    });