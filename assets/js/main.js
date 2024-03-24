(function () {
  /* ========= Add Box Shadow in Header on Scroll ======== */
  window.addEventListener('scroll', function () {
    const header = document.querySelector('.header')
    if (header) {
      if (window.scrollY > 0) {
        header.style.boxShadow = '0px 0px 30px 0px rgba(200, 208, 216, 0.30)'
      } else {
        header.style.boxShadow = 'none'
      }
    }
  })

  /* ========= Preloader ======== */
  const preloader = document.querySelectorAll('#preloader')

  window.addEventListener('load', function () {
    if (preloader.length) {
      this.document.getElementById('preloader').style.display = 'none'
    }
  })

  // ========== theme switcher ==========
  const optionButton = document.querySelector('.option-btn')
  const optionButtonClose = document.querySelector('.option-btn-close')
  const optionBox = document.querySelector('.option-box')
  const optionOverlay = document.querySelector('.option-overlay')

  if (optionButton && optionBox && optionOverlay) {
    optionButton.addEventListener('click', () => {
      optionBox.classList.add('show')
      optionOverlay.classList.add('show')
    })
  }

  if (optionButtonClose && optionBox && optionOverlay) {
    optionButtonClose.addEventListener('click', () => {
      optionBox.classList.remove('show')
      optionOverlay.classList.remove('show')
    })
  }

  if (optionOverlay && optionBox) {
    optionOverlay.addEventListener('click', () => {
      optionOverlay.classList.remove('show')
      optionBox.classList.remove('show')
    })
  }

  // ========== layout change
  const leftSidebarButton = document.querySelector('.leftSidebarButton')
  const rightSidebarButton = document.querySelector('.rightSidebarButton')
  const dropdownMenuEnd = document.querySelectorAll(
    '.header-right .dropdown-menu'
  )

  if (leftSidebarButton && rightSidebarButton && dropdownMenuEnd) {
    rightSidebarButton.addEventListener('click', () => {
      document.body.classList.add('rightSidebar')
      rightSidebarButton.classList.add('active')
      leftSidebarButton.classList.remove('active')

      dropdownMenuEnd.forEach((el) => {
        el.classList.remove('dropdown-menu-end')
      })
    })
    leftSidebarButton.addEventListener('click', () => {
      document.body.classList.remove('rightSidebar')
      leftSidebarButton.classList.add('active')
      rightSidebarButton.classList.remove('active')

      dropdownMenuEnd.forEach((el) => {
        el.classList.add('dropdown-menu-end')
      })
    })
  }

  // =========== theme change
  const lightThemeButton = document.querySelector('.lightThemeButton')
  const darkThemeButton = document.querySelector('.darkThemeButton')
  const logo = document.querySelector('.navbar-logo img')

  if (lightThemeButton && darkThemeButton && logo) {
    // Check if the user has a saved theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.body.classList.add('darkTheme')
      darkThemeButton.classList.add('active')
      lightThemeButton.classList.remove('active')
      logo.src = 'assets/images/logo/logo-white.svg'
    } else {
      document.body.classList.remove('darkTheme')
      lightThemeButton.classList.add('active')
      darkThemeButton.classList.remove('active')
      logo.src = 'assets/images/logo/logo.svg'
    }

    darkThemeButton.addEventListener('click', () => {
      document.body.classList.add('darkTheme')
      localStorage.setItem('theme', 'dark') // Save theme preference
      darkThemeButton.classList.add('active')
      lightThemeButton.classList.remove('active')
      logo.src = 'assets/images/logo/logo-white.svg'
    })

    lightThemeButton.addEventListener('click', () => {
      document.body.classList.remove('darkTheme')
      localStorage.setItem('theme', 'light') // Save theme preference
      lightThemeButton.classList.add('active')
      darkThemeButton.classList.remove('active')
      logo.src = 'assets/images/logo/logo.svg'
    })
  }

  // Enabling bootstrap tooltips
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  )
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  )
})();

// load components html files from component folder
function loadComponent(component, targetSelector, newContent) {
  const targetElement = document.querySelector(targetSelector);
  if (!targetElement) {
    console.error(`Error loading ${component}: Target element '${targetSelector}' not found.`);
    return;
  }

  fetch(`components/${component}.html`)
    .then(response => response.text())
    .then(html => {
      targetElement.innerHTML = html;
      if (newContent) {
        for (let className in newContent) {
          if (newContent.hasOwnProperty(className)) {
            const content = newContent[className];
            const elements = document.getElementsByClassName(className);
            for (let i = 0; i < elements.length; i++) {
              elements[i].textContent = content;
            }
          }
        }
      }
    })
    .catch(error => {
      console.error(`Error loading ${component}:`, error);
    });
}