import { Scene } from "three";
import Camera from "./Camera.js";
import Enviroment from "./Enviroment.js";
import Renderer from "./Renderer.js";
import ScreenSizer from "./ScreenSizer.js";
import { Signal } from "./Signal.js";
import Sizes from "./Sizes.js";
import Resources from "./Resources.js";
import { RaycasterClass } from "./Raycaster.js";

export default class Manager {
  static instance;
  renderRequested = false;

  constructor({
    wrap = document.body,
    assets = [],
    canvasSelector = "canvas",
    manualSizes = {},
    debug = false,
    renderOnDemand = false,
  } = {}) {
    if (Manager.instance) {
      return Manager.instance;
    }
    Manager.instance = this;

    this.wrap = wrap;
    this.assets = assets;
    this.hasDebug = debug;
    this.manualSizes = manualSizes;
    this.renderOnDemand = renderOnDemand;
    this.canvas = this.initCanvas(canvasSelector);
    this.init();
  }

  initCanvas(canvasSelector) {
    const canvas = this.wrap.querySelector(canvasSelector);
    if (canvas) return canvas;
    const newCanvas = document.createElement("canvas");
    this.wrap.appendChild(newCanvas);
    return newCanvas;
  }

  setUpSignals() {
    this.signals = {
      update: new Signal(),
      resize: new Signal(),
      loaded: new Signal(),
      debug: new Signal(),
    }
  }

  setUpClasses() {
    this.scene = new Scene();
    this.sizes = new Sizes(this.manualSizes);
    this.cameraClass = new Camera();
    this.rendererClass = new Renderer();
    this.resources = new Resources(this.assets);
    this.enviroment = new Enviroment();
    this.screenSizer = new ScreenSizer();
    this.raycasterClass = new RaycasterClass();
  }

  requestRender() {
    if (this.renderRequested) return;
    this.renderRequested = true;
  }

  update() {
    this.rendererClass.renderer.setAnimationLoop((delta) => {
      if (this.renderOnDemand && !this.renderRequested) return;
      this.stats?.begin()
      this.signals.update.setValue({ delta });
      this.stats?.end()
      if (this.renderOnDemand) this.renderRequested = false;
    });
  }

  async setUpDebug() {
    if (!this.hasDebug) return;

    const { default: Stats } = await import('stats.js');
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    const { Debug } = await import('./Debug.js');
    this.debug = new Debug();
    this.signals.debug.setValue(this.debug);
  }

  init() {
    this.setUpSignals();
    this.setUpClasses();
    this.update();
    this.setUpDebug();
  }
}