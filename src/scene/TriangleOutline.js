import { BufferAttribute, BufferGeometry, Euler, LineBasicMaterial, LineLoop, Vector3 } from "three";
import Manager from "../sceneSetup/Manager";

export class TriangleOutline {
  constructor(options) {
    this.manager = Manager.instance;
    this.scene = this.manager.scene;
    this.options = {
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      color: 0xffffff,
      revealOpacity: 0,
      ...options,
    };

    this._uOpacity = { value: 1 };
    this._uRevealOpacity = { value: this.options.revealOpacity };

    this.createTriangle();
  }

  get uOpacity() {
    return this._uOpacity;
  }

  set uOpacity(value) {
    this._uOpacity.value = value;
    this.updateShaderUniforms();
  }

  get uRevealOpacity() {
    return this._uRevealOpacity;
  }

  set uRevealOpacity(value) {
    this._uRevealOpacity.value = value;
    this.updateShaderUniforms();
  }

  updateShaderUniforms() {
    if (this.triangle && this.triangle.material.userData.shader) {
      const shader = this.triangle.material.userData.shader;
      shader.uniforms.uOpacity.value = this._uOpacity.value;
      shader.uniforms.uRevealOpacity.value = this._uRevealOpacity.value;
    }
  }

  createTriangle() {
    const vertices = new Float32Array([
      0, -1, 0,
      -0.9, 0.84, 0,
      0.9, 0.84, 0,
    ]);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    const material = new LineBasicMaterial({ color: this.options.color, transparent: true });
    const onBeforeCompile = (shader) => {
      shader.uniforms.uOpacity = this._uOpacity;
      shader.uniforms.uRevealOpacity = this._uRevealOpacity;

      shader.fragmentShader = shader.fragmentShader.replace(
        'uniform float opacity;',
        'uniform float opacity;\nuniform float uOpacity;\nuniform float uRevealOpacity;'
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        'vec4 diffuseColor = vec4( diffuse, uOpacity * uRevealOpacity );'
      );

      material.userData.shader = shader;
    };

    material.onBeforeCompile = onBeforeCompile;
    material.needsUpdate = true;

    this.triangle = new LineLoop(geometry, material);

    this.triangle.position.copy(this.options.position);
    this.triangle.rotation.copy(this.options.rotation);
    this.triangle.scale.copy(this.options.scale);
  }
}