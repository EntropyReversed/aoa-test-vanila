import { MeshBasicMaterial, PlaneGeometry } from "three";
import Manager from "../sceneSetup/Manager";

export class TriakisHighlight {
  constructor(group) {
    this.manager = Manager.instance;
    this.scene = this.manager.scene;
    this.group = group
    this.createHighlight();
  }

  createHighlight() {
    this.mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new MeshBasicMaterial({
        color: 'red',
        transparent: true,
      })
    );

    this.group.add(this.mesh);
  }
}