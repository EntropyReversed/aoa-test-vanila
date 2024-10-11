import { Group, Quaternion } from "three";
import Manager from "./Manager";

export class Billboard {
  quaternion = new Quaternion();

  constructor({ children, autoAdd = true }) {
    this.manager = Manager.instance;
    this.children = children;
    this.autoAdd = autoAdd;
    this.init();
  }

  update() {
    this.group.updateMatrix();
    this.group.updateWorldMatrix(false, false);
    this.group.getWorldQuaternion(this.quaternion);
    this.camera.getWorldQuaternion(this.groupInner.quaternion).premultiply(this.quaternion.invert());
  }

  create() {
    this.group = new Group();
    this.group.name = "Billboard";
    this.groupInner = new Group();
    this.groupInner.add(this.children);
    this.group.add(this.groupInner);
    if (this.autoAdd) this.scene.add(this.group);
    this.updateSignal.subscribe(this.updateCallback, 0);
  }

  remove() {
    this.scene.remove(this.group);
    this.updateSignal.unsubscribe(this.updateCallback);
  }

  init() {
    const { scene, cameraClass, signals } = this.manager;
    this.scene = scene;
    this.camera = cameraClass.camera;
    this.updateSignal = signals.update;
    this.updateCallback = this.update.bind(this);

    this.create();
  }
}