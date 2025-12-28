// Shared Orb Text Synchronization logic

(function() {
  'use strict';

  class OrbTextSync {
    constructor() {
      this.canvas = null;
      this.orbTextContainer = null;
      this.orbSyncText = null;
      this.originalText = null;
      this.isActive = false;
      this.resizeObserver = null;
      this.intersectionObserver = null;
      this.resizeTimeout = null;

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      this.canvas = document.getElementById('shader-canvas');
      this.orbTextContainer = document.getElementById('orbTextContainer');
      this.orbSyncText = document.getElementById('orbSyncText');
      this.originalText = document.getElementById('orbText');

      if (!this.canvas || !this.orbTextContainer || !this.orbSyncText || !this.originalText) {
        return;
      }

      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(document.body);

      this.intersectionObserver = new IntersectionObserver(
        entries => this.handleVisibilityChange(entries),
        { threshold: 0.1 }
      );
      this.intersectionObserver.observe(this.originalText);

      this.handleResize();
      this.startSynchronization();
    }

    handleVisibilityChange(entries) {
      const entry = entries[0];
      if (entry && entry.isIntersecting && this.canvas) {
        this.activateOrbSync();
      }
    }

    activateOrbSync() {
      if (this.isActive) return;

      setTimeout(() => {
        this.isActive = true;
        this.orbTextContainer.style.display = 'block';
        this.updateTextPosition();
        requestAnimationFrame(() => {
          this.orbSyncText.style.opacity = '1';
          this.orbSyncText.style.transform = this.orbSyncText.style.transform.replace('scale(0.95)', 'scale(1)');
        });
      }, 500);
    }

    updateTextPosition() {
      if (!this.isActive || !this.orbSyncText) return;

      this.orbSyncText.style.left = '50%';
      this.orbSyncText.style.top = '55%';
      this.orbSyncText.style.fontSize = '8.58vw';
      this.orbSyncText.style.fontWeight = 'bold';
      this.orbSyncText.style.transform = 'translate(-50%, -50%)';
      this.orbSyncText.style.textShadow = 'none';
      this.orbSyncText.style.background = 'none';
      this.orbSyncText.style.backdropFilter = 'none';
    }

    handleResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.updateTextPosition(), 16);
    }

    startSynchronization() {
      // No continuous loop required; resize + activation handle positioning.
    }

    destroy() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }
      clearTimeout(this.resizeTimeout);
    }
  }

  function bootstrapOrbTextSync() {
    if (window.orbTextSync) {
      return;
    }
    try {
      window.orbTextSync = new OrbTextSync();
    } catch (error) {
      console.warn('OrbTextSync initialization failed:', error);
      const originalText = document.getElementById('orbText');
      if (originalText) {
        originalText.style.opacity = '0.1';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapOrbTextSync);
  } else {
    bootstrapOrbTextSync();
  }

  window.addEventListener('beforeunload', () => {
    if (window.orbTextSync && typeof window.orbTextSync.destroy === 'function') {
      window.orbTextSync.destroy();
    }
  });
})();
