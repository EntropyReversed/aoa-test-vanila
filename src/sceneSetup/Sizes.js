import Manager from "./Manager";

export default class Sizes {
  constructor({ width, height }) {
    this.manager = Manager.instance;
    this.manualResize = Boolean(width && height);
    this.widthInit = width || window.innerWidth;
    this.heightinit = height || window.innerHeight;
    this.init();
  }

  setSizes(width, height) {
    const { innerWidth, innerHeight } = window;
    this.width = this.manualResize ? (width ?? this.widthInit) : innerWidth;
    this.height = this.manualResize ? (height ?? this.heightinit) : innerHeight;

    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

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
