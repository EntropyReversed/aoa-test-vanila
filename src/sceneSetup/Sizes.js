import Manager from "./Manager";

export default class Sizes {
  constructor({ width, height }) {
    this.manager = Manager.instance;
    this.renderOnDemand = this.manager.renderOnDemand;
    this.manualResize = Boolean(width && height);
    this.widthInit = width || window.innerWidth;
    this.heightinit = height || window.innerHeight;


    this.test = document.createElement('div');
    this.test.style.position = 'fixed';
    this.test.style.top = '4rem';
    this.test.style.left = 0;
    this.test.style.zIndex = 1000;
    this.test.style.color = 'white';
    this.test.style.textShadow = '0 0 2px black';
    document.body.appendChild(this.test);
    this.init();
  }

  setSizes(width, height) {
    const { innerWidth, innerHeight } = window;
    this.width = this.manualResize ? (width ?? this.widthInit) : innerWidth;
    this.height = this.manualResize ? (height ?? this.heightinit) : innerHeight;
    this.test.innerHTML = `
      this.height: ${this.height};
      testHeight: ${document.querySelector('#home').clientHeight};
    `

    console.dir(window)

    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    if (this.renderOnDemand) {
      this.manager.requestRender();
    }

    this.resizeSignal.setValue({
      width: this.width,
      height: this.height,
      aspect: this.aspect,
      pixelRatio: this.pixelRatio,
    });
  }

  init() {
    const { signals } = this.manager;
    this.resizeSignal = signals.resize;
    this.setSizes();

    if (this.manualResize) return;
    window.addEventListener("resize", () => this.setSizes());
  }
}
