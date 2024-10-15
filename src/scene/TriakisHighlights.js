import { ShaderMaterial } from "three";
import Manager from "../sceneSetup/Manager";
import { TriakisHighlight } from "./TriakisHighlight";
import gsap from "gsap";

export class TriakisHighlights {
  constructor(model) {
    this.manager = Manager.instance;
    this.model = model;
    this.init();
  }

  createMaterial() {
    this.uniforms = {
      uTexBase: null,
      uTexFull: null,
      uTransition: null,
      uOpacity: null,
      uRevealOpacity: null,
    };
    this.material = new ShaderMaterial({
      transparent: true,
      uniforms: this.uniforms,
      depthWrite: false,
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
  }

  events() {
    this.manager.raycasterClass.addEventListeners(
      {
        objects: [this.highlightOne.mesh, this.highlightTwo.mesh, this.highlightThree.mesh],
        onMouseEnter: () => {
          document.body.style.cursor = 'pointer';
        },
        onMouseLeave: () => {
          document.body.style.cursor = 'auto';
        },
        onClick: ({ object: { userData } }) => {
          gsap.to(window, { scrollTo: userData.sectionID, duration: 1, });
        }
      }
    );
  }

  createHighlights() {
    this.highlightOne = new TriakisHighlight(this.model, '#people', this.material);
    this.highlightTwo = new TriakisHighlight(this.model, '#projects', this.material);
    this.highlightThree = new TriakisHighlight(this.model, '#process', this.material);
    this.material.dispose();

    this.highlightOne.group.position.set(0.54, 0.11, 0.35);
    this.highlightTwo.group.position.set(0.59, -0.3, 0);
    this.highlightThree.group.position.set(0.46, -0.33, 0.52);
  }

  init() {
    this.createMaterial();
    this.createHighlights();
    this.events();
  }
}