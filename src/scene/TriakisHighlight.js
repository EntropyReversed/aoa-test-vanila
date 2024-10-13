import { Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial, Uniform, Vector3 } from "three";
import Manager from "../sceneSetup/Manager";
import { Billboard } from "../sceneSetup/Billboard";

export class TriakisHighlight {
  constructor(parentGroup) {
    this.manager = Manager.instance;
    this.scene = this.manager.scene;
    this.parentGroup = parentGroup;
    this.raycaster = this.manager.raycasterClass;
    this.resources = this.manager.resources;
    this.textureBase = this.resources.items.triakisHighlight;
    this.textureBaseFull = this.resources.items.triakisHighlightFull;

    this._uTransition = { value: 0 };
    this._uOpacity = { value: 0 };
    this._uRevealOpacity = { value: 0 };

    this.uniforms = {
      uTexBase: new Uniform(this.textureBase),
      uTexFull: new Uniform(this.textureBaseFull),
      uTransition: this._uTransition,
      uOpacity: this._uOpacity,
      uRevealOpacity: this._uRevealOpacity,
    };
    this.textureBase.dispose();
    this.textureBaseFull.dispose();
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

  createHighlight() {
    const material = new ShaderMaterial({
      transparent: true,
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexBase;
        uniform sampler2D uTexFull;
        uniform float uTransition;
        uniform float uOpacity;
        uniform float uRevealOpacity;
        varying vec2 vUv;

        void main() {
          vec4 base = texture2D(uTexBase, vUv);
          vec4 full = texture2D(uTexFull, vUv);
          vec4 mixedColor = mix(base, full, uTransition);

          float mask = smoothstep(0.45, 0.5, distance(vUv, vec2(0.5)));
          gl_FragColor = vec4(vec3(mixedColor.xyz), ((1.0 - mask) * uOpacity) * uRevealOpacity);
        }
      `,
    });

    this.mesh = new Mesh(
      new PlaneGeometry(1, 1),
      material
    );

    this.group = new Billboard({ children: this.mesh, autoAdd: false }).group;
    this.group.scale.setScalar(0.05);
    this.parentGroup.add(this.group);

    this.raycaster.addEventListeners(
      {
        objects: [this.mesh],
        onMouseEnter: (hitInfo) => {
          document.body.style.cursor = 'pointer';
        },
        onMouseLeave: (hitInfo) => {
          document.body.style.cursor = 'auto';
        },
        // onClick: (hitInfo) => {
        // }
      }
    );
  }
}