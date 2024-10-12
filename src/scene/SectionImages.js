export class SectionImages {
  constructor() {
    this.wrap = document.querySelector('.section-images');
    if (!this.wrap) return;
    this.images = this.wrap.querySelectorAll('.section-images__image');
  }

  init() {
    this.images.forEach((image) => {
      image.classList.add('load');
    });
  }
}