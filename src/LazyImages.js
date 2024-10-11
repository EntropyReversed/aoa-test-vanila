export class LazyImages {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    if (this.images.length) this.init();
  }

  loadImage(image) {
    const src = image.getAttribute('data-src');
    const srcset = image.getAttribute('data-srcset');
    if (src) {
      image.setAttribute('src', src);
      image.removeAttribute('data-src');
    }

    if (srcset) {
      image.setAttribute('srcset', srcset);
      image.removeAttribute('data-srcset');
    }
  }

  createMutationObserver(image) {
    let isLoaded = false;
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.attributeName === 'class' && mutation.target.classList.contains('load') && !isLoaded) {
          this.loadImage(image);
          isLoaded = true;
          image.classList.remove('load');
          observer.disconnect();
          break;
        }
      }
    });
    return observer;
  }

  createIntersectionObserver(image) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(image);
          observer.disconnect();
        }
      });
    });
    return observer;
  }

  observeImages() {
    this.images.forEach(image => {
      const isMutation = image.hasAttribute('data-mutation');
      const observer = isMutation ?
        this.createMutationObserver(image) :
        this.createIntersectionObserver(image);

      observer.observe(image, isMutation ? { attributes: true } : undefined);
    });
  }

  init() {
    this.observeImages();
  }
}
