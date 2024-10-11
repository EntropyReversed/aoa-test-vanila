import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Manager from "./Manager";

export default class Controls {
  isEnabled = true;

  constructor() {
    this.manager = Manager.instance;
    this.init();
  }

  update() {
    if (!this.isEnabled) return;
    this.controls.update();
  }

  setupDebug() {
    this.debugSignal.subscribe((debug) => {
      debug.addSceneObject({ name: "Orbit Controls", object: this });

      debug.addCustomConfig(this, (folder) => {
        folder.addBinding(this, 'isEnabled', {
          label: 'Toggle',
        }).on('change', ({ value }) => {
          value ? this.enable() : this.disable();
        });
      });
    });
  }

  enable() {
    this.isEnabled = true;
    this.controls.enabled = true;

    this.updateSignal.subscribe(this.updateCallback, 0);
  }

  disable() {
    this.isEnabled = false;
    this.controls.enabled = false;

    this.updateSignal.unsubscribe(this.updateCallback);
  }

  init() {
    const { cameraClass, rendererClass, signals } = this.manager;
    this.camera = cameraClass.camera;
    this.renderer = rendererClass.renderer;
    this.updateSignal = signals.update;
    this.debugSignal = signals.debug;
    this.updateCallback = this.update.bind(this);

    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.setupDebug();
    this.disable();
  }
}