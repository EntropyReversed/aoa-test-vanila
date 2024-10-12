import { MeshStandardMaterial } from "three";
import Manager from "../sceneSetup/Manager";
import { Triakis } from "./Triakis";

export default class TriakisAnimation {
  constructor() {
    this.manager = Manager.instance;
    this.init();
  }

  setUpEnvironment() {
    const lights = [
      // {
      //   type: 'directional',
      //   color: '#ffffff',
      //   intensity: 2,
      //   position: [5, 9, 10],
      //   target: [0, 0, 0],
      // },
      // {
      //   type: 'directional',
      //   color: '#ffffff',
      //   intensity: 2,
      //   position: [-4, 8, 10],
      //   target: [0, 0, 0],
      // },
      // {
      //   type: 'directional',
      //   color: '#ffffff',
      //   intensity: 2,
      //   position: [0, 0, -10],
      //   target: [0, 0, 0],
      // },
      // {
      //   type: 'spot',
      //   color: '#ffffff',
      //   intensity: 10.5,
      //   position: [-3, 3, 8],
      //   name: 'Spotlight'
      // },
      {
        type: 'ambient',
        color: '#ffffff',
        intensity: 10,
        name: 'Ambient',
      }
    ]

    // name from assets
    this.enviroment.setSkybox({
      name: 'skyBox',
      environment: true,
    });

    lights.forEach(light => this.enviroment.addLight(light));
  }

  initScene() {
    this.setUpEnvironment();
    this.triakis = new Triakis();
  }

  init() {
    const {
      enviroment,
    } = this.manager;

    this.enviroment = enviroment;

    this.initScene();
  }
}
