import { Euler, Group, Vector3 } from "three";
import Manager from "../sceneSetup/Manager";
import { TriangleOutline } from "./TriangleOutline";

export class BackgroundTriangles {
  constructor() {
    this.manager = Manager.instance;
    this.scene = this.manager.scene;
    this.createTriangles();
  }

  createTriangles() {
    this.trianglesGroup = new Group();

    this.triangleOutlineMain = new TriangleOutline({
      color: '#00B0BE',
      position: new Vector3(-0.028, -0.65, -1),
      scale: new Vector3(2, 2, 2),
    });
    this.triangleOutlineLeft = new TriangleOutline({
      color: '#99DFE5',
      position: new Vector3(-1, -0.05, -1),
      rotation: new Euler(0, 0, Math.PI * 0.1),
      scale: new Vector3(1.4, 1.4, 1.4),
    });
    this.triangleOutlineRight = new TriangleOutline({
      color: '#FFCB2F',
      position: new Vector3(1, -0.05, -1),
      rotation: new Euler(0, 0, Math.PI * -0.1),
      scale: new Vector3(1.4, 1.4, 1.4),
    });
    this.trianglesGroup.add(this.triangleOutlineMain.triangle);
    this.trianglesGroup.add(this.triangleOutlineLeft.triangle);
    this.trianglesGroup.add(this.triangleOutlineRight.triangle);
    this.scene.add(this.trianglesGroup);
  }
}