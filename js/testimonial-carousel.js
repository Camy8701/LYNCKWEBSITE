// Testimonial Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let cardsPerView = 3; // Default for desktop

  // Calculate cards per view based on screen width
  function updateCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) {
      cardsPerView = 1; // Mobile
    } else if (width < 1024) {
      cardsPerView = 2; // Tablet
    } else {
      cardsPerView = 3; // Desktop
    }
  }

  // Get total number of cards
  const cards = track.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;

  // Calculate max index (last possible position)
  function getMaxIndex() {
    return Math.max(0, totalCards - cardsPerView);
  }

  // Update carousel position
  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // 2rem gap between cards
    const offset = -(currentIndex * (cardWidth + gap));
    track.style.transform = `translateX(${offset}px)`;

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();

    // Visual feedback for disabled buttons
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentIndex >= getMaxIndex() ? '0.5' : '1';
    prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
    nextBtn.style.cursor = currentIndex >= getMaxIndex() ? 'not-allowed' : 'pointer';
  }

  // Navigate to previous testimonial
  function gotoPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  // Navigate to next testimonial
  function gotoNext() {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateCarousel();
    }
  }

  // Event listeners
  prevBtn.addEventListener('click', gotoPrev);
  nextBtn.addEventListener('click', gotoNext);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      gotoPrev();
    } else if (e.key === 'ArrowRight') {
      gotoNext();
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        gotoNext(); // Swiped left - show next
      } else {
        gotoPrev(); // Swiped right - show previous
      }
    }
  }

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCardsPerView();
      currentIndex = Math.min(currentIndex, getMaxIndex());
      updateCarousel();
    }, 250);
  });

  // Initialize
  updateCardsPerView();
  updateCarousel();
});
