import { Clock, NoToneMapping, SRGBColorSpace, WebGLRenderer } from "three";
import Manager from "./Manager";

export default class Renderer {
  constructor() {
    this.manager = Manager.instance;
    this.customRenderFn = null;
    this.init();
  }

  subscribeToSignals() {
    this.updateCallback = this.update.bind(this);
    this.resizeSignal.subscribe(this.onResize.bind(this));
    this.updateSignal.subscribe(this.updateCallback);
  }

  setRenderer() {
    // ColorManagement.enabled = true;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      outputColorSpace: SRGBColorSpace,
      toneMapping: NoToneMapping,
    });
    this.renderer.setClearColor(0x000000, 1);
    this.onResize({
      width: this.sizes.width,
      height: this.sizes.height,
      pixelRatio: this.sizes.pixelRatio,
    })
  }

  update() {
    if (this.customRenderFn) {
      this.customRenderFn();
      return;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize({ width, height, pixelRatio }) {
    this.renderer.setSize(width, height);
    this.renderer.setViewport(0, 0, width, height);
    this.renderer.setPixelRatio(pixelRatio);
  }

  init() {
    const {
      sizes,
      scene,
      canvas,
      cameraClass,
      signals
    } = this.manager;

    this.sizes = sizes;
    this.scene = scene;
    this.canvas = canvas;
    this.camera = cameraClass.camera;
    this.resizeSignal = signals.resize;
    this.updateSignal = signals.update;
    this.clock = new Clock();
    this.setRenderer();
    this.subscribeToSignals();
  }
}