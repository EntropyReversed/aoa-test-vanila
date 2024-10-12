export class LazyImages {
  attributes = {
    dataSrc: 'data-src',
    dataSrcSet: 'data-srcset',
    dataMutation: 'data-mutation',
  };

  classes = {
    load: 'load',
    images: `img[${this.attributes.dataSrc}]`,
  }

  constructor() {
    this.images = document.querySelectorAll(this.classes.images);
    if (this.images.length) this.init();
  }

  loadImage(image) {
    const src = image.getAttribute(this.attributes.dataSrc);
    const srcset = image.getAttribute(this.attributes.dataSrcSet);
    if (src) {
      image.setAttribute('src', src);
      image.removeAttribute(this.attributes.dataSrc);
      if (image.hasAttribute(this.attributes.dataMutation)) {
        image.removeAttribute(this.attributes.dataMutation);
      }
    }

    if (srcset) {
      image.setAttribute('srcset', srcset);
      image.removeAttribute(this.attributes.dataSrcSet);
    }
  }

  createMutationObserver(image) {
    let isLoaded = false;
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.attributeName === 'class' && mutation.target.classList.contains(this.classes.load) && !isLoaded) {
          this.loadImage(image);
          isLoaded = true;
          image.classList.remove(this.classes.load);
          if (image.classList.length === 0) {
            image.removeAttribute('class');
          }
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
      const isMutation = image.hasAttribute(this.attributes.dataMutation);
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
