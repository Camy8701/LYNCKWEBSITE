// Testimonial Carousel - 7 cards showing 3 at a time
document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const cards = track.querySelectorAll('article');
  const totalCards = cards.length; // 7 cards

  // Cards per view based on screen size
  function getCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;        // Mobile: 1 card
    if (width < 1024) return 2;       // Tablet: 2 cards
    return 3;                         // Desktop: 3 cards
  }

  function getMaxIndex() {
    const cardsPerView = getCardsPerView();
    return Math.max(0, totalCards - cardsPerView);
  }

  function updateCarousel() {
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // gap-8 = 32px
    const offset = -(currentIndex * (cardWidth + gap));

    track.style.transform = `translateX(${offset}px)`;

    // Update button states
    const maxIndex = getMaxIndex();
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
    nextBtn.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
  }

  function gotoPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  function gotoNext() {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  }

  // Event listeners
  prevBtn.addEventListener('click', gotoPrev);
  nextBtn.addEventListener('click', gotoNext);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') gotoPrev();
    else if (e.key === 'ArrowRight') gotoNext();
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) gotoNext();
      else gotoPrev();
    }
  }, { passive: true });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const maxIndex = getMaxIndex();
      currentIndex = Math.min(currentIndex, maxIndex);
      updateCarousel();
    }, 250);
  });

  // Initialize
  updateCarousel();
});
