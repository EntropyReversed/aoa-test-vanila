import { PerspectiveCamera } from "three";
import Manager from "./Manager";

export default class Camera {
  constructor() {
    this.manager = Manager.instance;
    this.init();
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      70,
      this.sizes.aspect,
      0.1,
      20
    );

    this.camera.position.y = 0.3;
    this.camera.position.z = 1.8;
    this.scene.add(this.camera);
  }

  resize({ aspect }) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  init() {
    const {
      sizes,
      scene,
      canvas,
      signals
    } = this.manager;

    this.sizes = sizes;
    this.scene = scene;
    this.canvas = canvas;
    this.resizeSignal = signals.resize;
    this.createCamera();
    this.resizeSignal.subscribe(this.resize.bind(this));
  }
}