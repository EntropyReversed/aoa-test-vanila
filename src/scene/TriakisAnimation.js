import { MeshStandardMaterial } from "three";
import Manager from "../sceneSetup/Manager";

export default class TriakisAnimation {
  constructor() {
    this.manager = Manager.instance;
    this.init();
  }

  setUpEnvironment() {
    const lights = [
      {
        type: 'directional',
        color: '#ffffff',
        intensity: 1,
        position: [0, 8, 10],
        target: [0, 0, 0],
        name: 'Sun'
      },
      {
        type: 'spot',
        color: '#ffffff',
        intensity: 1.5,
        position: [-3, 3, 8],
        name: 'Spotlight'
      },
      {
        type: 'ambient',
        color: '#ffffff',
        intensity: 1.2,
        name: 'Ambient',
      }
    ]

    // name from assets
    this.enviroment.setSkybox({
      name: 'skyBox',
      background: true,
      environment: true,
    });

    lights.forEach(light => this.enviroment.addLight(light));
  }

  initScene() {
    this.setUpEnvironment();

    this.model.material = new MeshStandardMaterial({
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
    });
    this.scene.add(this.model);
  }

  init() {
    const {
      wrap,
      sizes,
      scene,
      enviroment,
      resources,
      rendererClass,
      cameraClass,
      signals,
      raycasterClass,
      screenSizer,
      postProcessing
    } = this.manager;

    this.scene = scene;
    this.sizes = sizes;
    this.wrap = wrap;
    this.scene = scene;
    this.renderer = rendererClass.renderer;
    this.resources = resources;
    this.enviroment = enviroment;
    this.camera = cameraClass.camera;
    this.screenSizer = screenSizer;
    this.model = resources.items.model.scene.children[0];
    this.raycaster = raycasterClass;
    this.postProcessing = postProcessing;
    this.debugSignal = signals.debug;
    this.resizeSignal = signals.resize;
    this.updateSignal = signals.update;

    this.initScene();
  }
}
