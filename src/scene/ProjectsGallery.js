import gsap from "gsap";

export class ProjectsGallery {
  current = 0;
  autoPlayDelay = 5000;
  isTransitioning = false;
  loadIndex = 2;

  constructor() {
    this.wrap = document.querySelector('.projects-slider');
    if (!this.wrap) return;
    this.init();
  }

  initGallery() {
    this.slides.forEach((slide, index) => {
      slide.style.opacity = index === 0 ? 1 : 0;
    });

    this.imagesLoaded[0] = true;
    this.imagesLoaded[1] = true;
    this.images[0].classList.add('load');
    this.images[1].classList.add('load');

    this.play();
  }

  play() {
    if (this.delayedCall) {
      this.delayedCall.kill();
    }
    this.delayedCall = gsap.delayedCall(this.autoPlayDelay / 1000, () => this.nextImage());
  }

  nextImage() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    if (this.loadIndex < this.total && !this.imagesLoaded[this.loadIndex]) {
      this.imagesLoaded[this.loadIndex] = true;
      this.images[this.loadIndex].classList.add('load');
      this.loadIndex++;
    }

    const prev = this.slides[this.current];
    this.current = (this.current + 1) % this.total;

    gsap.to(this.slides[this.current], {
      opacity: 1,
      duration: 2,
      ease: 'none',
      onComplete: () => {
        prev.style.opacity = 0;
        this.isTransitioning = false;
        this.play();
      }
    });
  }

  init() {
    this.slides = this.wrap.querySelectorAll('.projects-slider__project');
    this.images = this.wrap.querySelectorAll('.projects-slider__project img');
    this.imagesLoaded = new Array(this.images.length).fill(false);
    this.total = this.slides.length;
    this.initGallery();
  }
}