// Lazy load hero/service videos so the heavy mp4 is fetched only when needed
(function() {
  'use strict';

  const videos = document.querySelectorAll('video[data-video-src]');
  if (!videos.length) {
    return;
  }

  const loadVideo = (video) => {
    if (!video || video.dataset.loaded === 'true') {
      return;
    }

    const source = document.createElement('source');
    source.src = video.dataset.videoSrc;
    if (video.dataset.videoType) {
      source.type = video.dataset.videoType;
    }
    video.appendChild(source);
    video.load();
    video.dataset.loaded = 'true';
  };

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadVideo(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px 0px' })
    : null;

  videos.forEach(video => {
    if (observer) {
      observer.observe(video);
    } else {
      loadVideo(video);
    }

    video.addEventListener('play', () => loadVideo(video));
    video.addEventListener('pointerdown', () => loadVideo(video), { once: true });
  });
})();
