import { EffectComposer } from "three/examples/jsm/Addons.js";
import Manager from "./Manager";

export class PostProcessing {
  passes = {};
  enabled = false;

  constructor() {
    this.manager = Manager.instance;
    this.init();
  }

  setEnabled({ value }) {
    this.enabled = value;
    if (this.manager.rendererClass.customRenderFn) return;

    if (value) {
      this.updateSignal.subscribe(this.updateCallback);
      this.resizeSignal.subscribe(this.resizeCallback);
      this.updateSignal.unsubscribe(this.rendererUpdateCallback);
      return;
    }

    this.updateSignal.unsubscribe(this.updateCallback);
    this.resizeSignal.unsubscribe(this.resizeCallback);
    this.updateSignal.subscribe(this.rendererUpdateCallback);
  }

  addPass(name, pass) {
    if (!this.passes[name]) {
      this.passes[name] = pass;
      this.composer.addPass(pass);
    }
  }

  removePass(name) {
    if (this.passes[name]) {
      const passIndex = this.composer.passes.indexOf(this.passes[name]);
      if (passIndex > -1) {
        this.composer.passes.splice(passIndex, 1);
        delete this.passes[name];
      }
    }
  }

  togglePass(name, enabled) {
    if (!this.passes[name]) return;
    this.passes[name].enabled = enabled;
  }

  update() {
    this.composer.render();
  }

  resize({ width, height }) {
    this.composer.setSize(width, height);
  }

  initComposer() {
    this.composer = new EffectComposer(this.renderer);

    this.updateCallback = this.update.bind(this);
    this.resizeCallback = this.resize.bind(this);
    this.rendererUpdateCallback = this.manager.rendererClass.updateCallback;

    this.updateSignal = this.signals.update;
    this.resizeSignal = this.signals.resize;
  }

  init() {
    const { rendererClass, scene, cameraClass, signals } = this.manager;
    this.renderer = rendererClass.renderer;
    this.scene = scene;
    this.camera = cameraClass.camera;
    this.signals = signals;
    this.initComposer();
  }
}
