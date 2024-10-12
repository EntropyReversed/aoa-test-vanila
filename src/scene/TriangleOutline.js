import { BufferAttribute, BufferGeometry, Euler, LineBasicMaterial, LineLoop, Vector3 } from "three";
import Manager from "../sceneSetup/Manager";

export class TriangleOutine {
  constructor(options) {
    this.manager = Manager.instance;
    this.scene = this.manager.scene;
    this.options = {
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      color: 0xffffff,
      ...options,
    };

    this.createTriangle();
  }

  createTriangle() {
    const vertices = new Float32Array([
      0, -0.95, 0,
      -1.04, 0.84, 0,
      1.04, 0.84, 0,
    ]);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    const material = new LineBasicMaterial({ color: this.options.color });
    this.triangle = new LineLoop(geometry, material);

    this.triangle.position.copy(this.options.position);
    this.triangle.rotation.copy(this.options.rotation);
    this.triangle.scale.copy(this.options.scale);
  }
}