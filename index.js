document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     THEME SWITCHER
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const htmlElement = document.documentElement;

  // Load theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const menuIcon = document.getElementById('menu-icon');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    if (navMenu.classList.contains('open')) {
      menuIcon.className = 'fa-solid fa-xmark';
    } else {
      menuIcon.className = 'fa-solid fa-bars';
    }
  });

  // Close menu when clicking on any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuIcon.className = 'fa-solid fa-bars';
    });
  });

  /* ==========================================================================
     SCROLL EFFECTS (NAVBAR SHADOW & PROGRESS REVEALS)
     ========================================================================== */
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const skillProgressBars = document.querySelectorAll('.skill-progress');

  // Handle header shrink on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    highlightActiveNavSection();
  });

  // Active Link Highlighting
  function highlightActiveNavSection() {
    let scrollPosition = window.scrollY + 120; // offset header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Intersection Observer for Scroll Reveals
  const scrollObserverOptions = {
    root: null, // viewport
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // offset bottom
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        
        // Trigger skill progress bars loading when Bio details card is revealed
        if (entry.target.classList.contains('bio-details-col')) {
          animateSkillBars();
        }
        
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, scrollObserverOptions);

  revealElements.forEach(el => {
    scrollObserver.observe(el);
  });

  // Specifically observe the bio details container for skill animation
  const bioDetails = document.querySelector('.bio-details-col');
  if (bioDetails) {
    scrollObserver.observe(bioDetails);
  }

  function animateSkillBars() {
    skillProgressBars.forEach(bar => {
      const width = bar.style.width; // Grab width set in inline CSS
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }

  /* ==========================================================================
     TESTIMONIALS SLIDER
     ========================================================================== */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const currentNumEl = document.getElementById('slider-current-num');
  const totalNumEl = document.getElementById('slider-total-num');
  
  let currentSlideIndex = 0;
  let slideInterval;
  const slideDuration = 6000; // 6 seconds

  // Initialize total slide count pagination
  if (totalNumEl) {
    totalNumEl.textContent = String(slides.length).padStart(2, '0');
  }

  // Initialize navigation dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', idx);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.dot');

  function goToSlide(index, direction = 'next') {
    const prevIndex = currentSlideIndex;
    slides[prevIndex].classList.remove('active');
    dots[prevIndex].classList.remove('active');
    
    // Add direction animation class
    if (direction === 'prev') {
      slides[prevIndex].classList.add('slide-left');
    } else {
      slides[prevIndex].classList.remove('slide-left');
    }
    
    currentSlideIndex = (index + slides.length) % slides.length;
    
    // Apply new active slide
    slides[currentSlideIndex].classList.remove('slide-left');
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Update pagination number
    if (currentNumEl) {
      currentNumEl.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }
  }

  function nextSlide() {
    goToSlide(currentSlideIndex + 1, 'next');
  }

  function prevSlide() {
    goToSlide(currentSlideIndex - 1, 'prev');
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  // Auto-play management
  function startAutoplay() {
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }

  // Hover pauses autoplay
  const sliderContainer = document.querySelector('.testimonials-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay(); // Start slideshow on load

  /* ==========================================================================
     CONTACT FORM VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successAlert = document.getElementById('form-success-alert');
  const inputs = contactForm.querySelectorAll('.form-control');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    inputs.forEach(input => {
      if (!validateInput(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Simulate form submission to backend
      const submitBtn = document.getElementById('form-submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';

      setTimeout(() => {
        // Success state
        successAlert.classList.add('show');
        contactForm.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        
        // Clean form floating label active state
        inputs.forEach(input => {
          input.parentElement.classList.remove('invalid');
        });

        // Hide success alert after 5 seconds
        setTimeout(() => {
          successAlert.classList.remove('show');
        }, 5000);

      }, 1500);
    }
  });

  // Inline input validation listener
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      // clear error classes as they type
      if (input.value.trim() !== '') {
        input.parentElement.classList.remove('invalid');
      }
    });
  });

  function validateInput(input) {
    const parent = input.parentElement;
    const value = input.value.trim();
    let isValid = true;

    if (value === '') {
      isValid = false;
    } else if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    }

    if (!isValid) {
      parent.classList.add('invalid');
    } else {
      parent.classList.remove('invalid');
    }

    return isValid;
  }
});
