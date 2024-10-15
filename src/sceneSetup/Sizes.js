import Manager from "./Manager";

export default class Sizes {
  constructor({ width, height }) {
    this.manager = Manager.instance;
    this.renderOnDemand = this.manager.renderOnDemand;
    this.manualResize = Boolean(width && height);
    this.widthInit = width || window.innerWidth;
    this.heightInit = height || window.innerHeight;
    this.isMobile = this.checkIfMobile();
    this.mobileHeightMax = this.heightInit;
    this.init();
  }

  setSizes(width, height) {
    const { innerWidth, innerHeight } = window;
    this.width = this.manualResize ? (width ?? this.widthInit) : innerWidth;

    if (this.isMobile) {
      // On mobile, use the larger of current inner height and recorded max height
      this.mobileHeightMax = Math.max(this.mobileHeightMax, innerHeight);
      this.height = this.mobileHeightMax;
    } else {
      this.height = this.manualResize ? (height ?? this.heightInit) : innerHeight;
    }

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
    if (this.isMobile) {
      window.addEventListener("orientationchange", () => {
        // Reset max height on orientation change
        this.mobileHeightMax = window.innerHeight;
        this.setSizes();
      });
    }
  }

  checkIfMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}