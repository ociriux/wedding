document.addEventListener('DOMContentLoaded', () => {
  // --- 1. HERO CAROUSEL ---
  const carouselTrack = document.getElementById('heroCarouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const dotsContainer = document.getElementById('heroDots');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoPlayTimer = null;

  if (carouselTrack && totalSlides > 0) {
    // Generate dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      updateCarousel();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(nextSlide, 3500);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    startAutoPlay();

    // Touch swipe for Hero Carousel
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 40) {
        nextSlide();
        resetAutoPlay();
      } else if (touchEndX > touchStartX + 40) {
        prevSlide();
        resetAutoPlay();
      }
    }, { passive: true });
  }

  // --- 2. FAQ TABS & ACCORDION ---
  const faqTabs = document.querySelectorAll('.faq-tab-btn');
  const faqGroups = document.querySelectorAll('.faq-group');

  faqTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetCategory = tab.dataset.category;

      faqTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      faqGroups.forEach(group => {
        if (group.id === `faq-group-${targetCategory}`) {
          group.classList.add('active');
        } else {
          group.classList.remove('active');
        }
      });
    });
  });

  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      if (isOpen) {
        item.classList.remove('open');
        body.style.maxHeight = null;
      } else {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- 3. GALLERY LIGHTBOX ---
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentGalleryIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push(img.src);
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    lightboxImg.src = galleryImages[currentGalleryIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  }

  function showPrevGalleryImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIndex];
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextGalleryImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevGalleryImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextGalleryImage();
    if (e.key === 'ArrowLeft') showPrevGalleryImage();
  });

  // Swipe for lightbox
  let lbTouchStartX = 0;
  let lbTouchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      lbTouchEndX = e.changedTouches[0].screenX;
      if (lbTouchEndX < lbTouchStartX - 50) {
        showNextGalleryImage();
      } else if (lbTouchEndX > lbTouchStartX + 50) {
        showPrevGalleryImage();
      }
    }, { passive: true });
  }
});
