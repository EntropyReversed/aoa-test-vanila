import { Group } from "three";
import Manager from "./Manager";
import { Billboard } from "./Billboard";

export default class ScreenSizer {
  objectsArr = [];

  constructor(scale = 1) {
    this.manager = Manager.instance;
    this.scale = scale;
    this.init();
  }

  scaleObject(obj) {
    const distance = this.camera.position.distanceTo(obj.position);
    const fov = this.camera.fov * (Math.PI / 180);
    const pixelSize = (2 * Math.tan(fov / 2) * distance) / this.sizes.height;
    const scaleFactor = pixelSize / this.scale;
    obj.scale.setScalar(scaleFactor);
  }

  update() {
    this.objectsArr.forEach(({ group }) => this.scaleObject(group));
  }

  addObject({ object, isBillboard = false, scaleAdjust = true, onUpdate }) {
    let obj = object;

    if (isBillboard) {
      obj = new Billboard({ children: object, autoAdd: false }).group;
    }

    const group = new Group();
    group.visible = false;
    group.add(obj);
    group.position.z = obj.position.z;

    this.scene.add(group);

    const objData = { group, object, visible: true, observer: null, onUpdate, scaleAdjust };
    this.objectsArr.push(objData);

    if (this.objectsArr.length === 1) {
      this.updateSignal.subscribe(this.updateCallback, 0);
    }

    requestAnimationFrame(() => (group.visible = true));
  }

  removeObject(obj) {
    const index = this.objectsArr.findIndex(data => data.group.children.includes(obj));

    if (index !== -1) {
      const { group, observer } = this.objectsArr[index];

      this.scene.remove(group);

      if (observer) {
        observer.disconnect();
      }

      this.objectsArr.splice(index, 1);

      if (this.objectsArr.length === 0) {
        this.updateSignal.unsubscribe(this.updateCallback);
      }
    }
  }

  init() {
    const { cameraClass, sizes, scene, signals } = this.manager;
    this.camera = cameraClass.camera;
    this.sizes = sizes;
    this.scene = scene;
    this.updateSignal = signals.update;
    this.updateCallback = this.update.bind(this);
  }
}
