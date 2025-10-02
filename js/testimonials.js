// LYNCK Studio - Testimonials Carousel
// Testimonials Data
const testimonials = [
  {
    name: "Marcus Thompson",
    designation: "CEO, TechFlow Solutions",
    quote: "LYNCK transformed our digital presence completely. Their strategic approach increased our lead generation by 300% in just 3 months. The team's expertise in both creative and technical execution is unmatched.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Sarah Chen",
    designation: "Marketing Director, InnovateLab",
    quote: "Working with LYNCK Academy was a game-changer for our startup. They didn't just create campaigns – they educated our team and built sustainable marketing processes that continue to drive growth.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "David Rodriguez",
    designation: "Founder, EcoGreen Solutions",
    quote: "The ROI from our LYNCK partnership has been incredible. Their data-driven approach combined with creative storytelling helped us reach our target audience authentically and effectively.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Michael Johnson",
    designation: "VP Marketing, FinanceForward",
    quote: "LYNCK's comprehensive approach to digital marketing helped us scale from startup to industry leader. Their education-focused methodology ensured our internal team could sustain and build upon their initial success.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
  }
];

// Testimonials Functionality
document.addEventListener('DOMContentLoaded', function() {
  let currentIndex = 0;
  let autoplayInterval;

  const imageContainer = document.getElementById('imageContainer');
  const nameEl = document.getElementById('testimonialName');
  const designationEl = document.getElementById('testimonialDesignation');
  const quoteEl = document.getElementById('testimonialQuote');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!imageContainer || !nameEl || !prevBtn || !nextBtn) return;

  function calculateGap() {
    const width = imageContainer.offsetWidth;
    const minWidth = 400;
    const maxWidth = 800;
    const minGap = 80;
    const maxGap = 140;

    if (width <= minWidth) return minGap;
    if (width >= maxWidth) return maxGap;
    return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
  }

  function getImageStyle(index) {
    const gap = calculateGap();
    const maxStickUp = gap * 0.4;
    const offset = (index - currentIndex + testimonials.length) % testimonials.length;

    // Active (center) image
    if (offset === 0) {
      return {
        zIndex: 4,
        opacity: 1,
        transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)'
      };
    }

    // Immediate right (offset 1)
    if (offset === 1) {
      return {
        zIndex: 3,
        opacity: 0.8,
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`
      };
    }

    // Far right (offset 2)
    if (offset === 2) {
      return {
        zIndex: 2,
        opacity: 0.6,
        transform: `translateX(${gap * 1.6}px) translateY(-${maxStickUp * 1.3}px) scale(0.7) rotateY(-25deg)`
      };
    }

    // Immediate left (offset 3 for 4 testimonials)
    if (offset === 3) {
      return {
        zIndex: 3,
        opacity: 0.8,
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`
      };
    }

    // Default hidden state
    return {
      zIndex: 1,
      opacity: 0,
      transform: 'scale(0.3) translateY(50px)'
    };
  }

  function updateTestimonial() {
    const current = testimonials[currentIndex];

    // Update text content with fade effect
    const textContainer = document.getElementById('testimonialText');
    textContainer.style.opacity = '0';

    setTimeout(() => {
      nameEl.textContent = current.name;
      designationEl.textContent = current.designation;
      quoteEl.textContent = current.quote;
      textContainer.style.opacity = '1';
    }, 150);

    // Update image positions
    const imageWrappers = document.querySelectorAll('.testimonial-image-wrapper');
    imageWrappers.forEach((wrapper, index) => {
      const style = getImageStyle(index);
      Object.assign(wrapper.style, style);
    });
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateTestimonial();
    resetAutoplay();
  }

  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
    resetAutoplay();
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextTestimonial, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Event listeners
  prevBtn.addEventListener('click', prevTestimonial);
  nextBtn.addEventListener('click', nextTestimonial);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevTestimonial();
    if (e.key === 'ArrowRight') nextTestimonial();
  });

  // Handle window resize
  window.addEventListener('resize', updateTestimonial);

  // Initialize
  updateTestimonial();
  startAutoplay();

  // Add transition styles
  const textContainer = document.getElementById('testimonialText');
  textContainer.style.transition = 'opacity 0.3s ease-in-out';
});
