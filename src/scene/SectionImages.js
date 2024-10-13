export class SectionImages {
  constructor() {
    this.wrap = document.querySelector('.section-images');
    if (!this.wrap) return;
    this.images = this.wrap.querySelectorAll('.section-images__image');
    this.support = document.querySelector('#support');
    this.people = document.querySelector('#people');
    this.projects = document.querySelector('#projects');
    this.process = document.querySelector('#process');

    this.init();
  }

  init() {
    const sections = [this.support, this.people, this.projects, this.process];

    const observer = new IntersectionObserver((entries) => {
      for (let entry of entries) {
        if (entry.isIntersecting) {
          this.images.forEach((image) => {
            image.classList.add('load');
          });

          // Disconnect the observer after at least one section is intersecting
          observer.disconnect();
          break;
        }
      }
    }, {
      threshold: 0.1,
    });

    sections.forEach((section) => {
      observer.observe(section);
    });
  }
}