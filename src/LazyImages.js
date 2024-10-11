export class LazyImages {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    if (this.images.length) this.init();
  }

  loadImage(image) {
    const src = image.getAttribute('data-src');
    console.log(image)
    if (src) {
      image.setAttribute('src', src);
      image.removeAttribute('data-src');
    }
  }

  observeImages() {
    this.images.forEach(image => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(image);
            observer.disconnect();
          }
        });
      });
      observer.observe(image);
    });
  }

  init() {
    this.observeImages();
  }
}
