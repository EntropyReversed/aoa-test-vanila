import { Mesh, Uniform } from "three";
import Manager from "../sceneSetup/Manager";
import { Billboard } from "../sceneSetup/Billboard";
import { CircleGeometry } from "three";

export class TriakisHighlight {
  constructor(parentGroup, sectionID, material) {
    this.manager = Manager.instance;
    this.scene = this.manager.scene;
    this.sectionID = sectionID;
    this.parentGroup = parentGroup;
    this.material = material.clone();

    this.createHighlight();
  }

  get uTransition() {
    return this._uTransition;
  }

  set uTransition(value) {
    this._uTransition.value = value;
  }

  get uOpacity() {
    return this._uOpacity;
  }

  set uOpacity(value) {
    this._uOpacity.value = value;
  }

  get uRevealOpacity() {
    return this._uRevealOpacity;
  }

  set uRevealOpacity(value) {
    this._uRevealOpacity.value = value;
  }

  updateMaterial() {
    const {
      triakisHighlight: textureBase,
      triakisHighlightFull: textureBaseFull,
    } = this.manager.resources.items;

    this._uTransition = { value: 0 };
    this._uOpacity = { value: 0 };
    this._uRevealOpacity = { value: 0 };

    this.uniforms = {
      uTexBase: new Uniform(textureBase),
      uTexFull: new Uniform(textureBaseFull),
      uTransition: this._uTransition,
      uOpacity: this._uOpacity,
      uRevealOpacity: this._uRevealOpacity,
    };
    this.material.uniforms = this.uniforms;
    this.material.uniformsNeedUpdate = true;
    textureBase.dispose();
    textureBaseFull.dispose();
  }

  createHighlight() {
    this.updateMaterial();
    this.mesh = new Mesh(
      new CircleGeometry(0.5, 16),
      this.material,
    );
    this.mesh.userData.sectionID = this.sectionID;
    this.material.dispose();

    this.group = new Billboard({ children: this.mesh, autoAdd: false }).group;
    this.group.scale.setScalar(0.05);
    this.parentGroup.add(this.group);
  }
}