import Manager from "./Manager";

export default class Sizes {
  constructor({ width, height }) {
    this.manager = Manager.instance;
    this.renderOnDemand = this.manager.renderOnDemand;
    this.manualResize = Boolean(width && height);
    this.widthInit = width || window.innerWidth;
    this.heightinit = height || window.innerHeight;

    this.createScreenSizer()
    this.init();
  }

  createScreenSizer() {
    this.screenSizer = document.createElement('div');
    this.screenSizer.style.position = 'fixed';
    this.screenSizer.style.top = '0';
    this.screenSizer.style.left = '0';
    this.screenSizer.style.width = '1px';
    this.screenSizer.style.height = '100vh';
    this.screenSizer.style.background = 'transparent';
    this.screenSizer.style.pointerEvents = 'none';
    document.body.appendChild(this.screenSizer);
  }

  setSizes(width, height) {
    const { innerWidth, innerHeight } = window;
    this.width = this.manualResize ? (width ?? this.widthInit) : innerWidth;
    this.height = this.manualResize ? (height ?? this.heightinit) : this.screenSizer.clientHeight;

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
