import { Object3D, DirectionalLight, SpotLight, AmbientLight, PMREMGenerator, Vector3 } from "three";
import Manager from "./Manager";
import { loadingStates } from "./constants";

export default class Environment {
  lights = [];
  skybox = null;

  constructor(config = {}) {
    this.manager = Manager.instance;
    this.config = config;
    this.init();
  }

  addLight(lightConfig) {
    let light;
    switch (lightConfig.type) {
      case 'directional':
        light = new DirectionalLight(lightConfig.color, lightConfig.intensity);
        if (lightConfig.target) {
          const target = new Object3D();
          this.setPosition(target, lightConfig.target);
          this.scene.add(target);
          light.target = target;
        }
        break;
      case 'spot':
        light = new SpotLight(lightConfig.color, lightConfig.intensity);
        break;
      case 'ambient':
        light = new AmbientLight(lightConfig.color, lightConfig.intensity);
        break;
      default:
        console.warn(`Unsupported light type: ${lightConfig.type}`);
        return;
    }

    this.setPosition(light, lightConfig.position);
    if (lightConfig.name) light.name = lightConfig.name;

    this.lights.push(light);
    this.scene.add(light);

    return light;
  }

  removeLight(light) {
    const index = this.lights.indexOf(light);
    if (index !== -1) {
      this.lights.splice(index, 1);
      this.scene.remove(light);
    }
  }

  setSkybox(skyboxConfig) {
    if (this.skybox) {
      if (this.scene.background === this.skybox) {
        this.scene.background = null;
      }
      if (this.scene.environment === this.skybox) {
        this.scene.environment = null;
      }
    }

    const texture = this.resources.items[skyboxConfig.name];
    if (!texture) {
      console.warn(`Skybox texture '${skyboxConfig.name}' not found in resources.`);
      return;
    }

    if (!texture.isTexture) {
      console.warn(`Unsupported texture type for skybox: ${skyboxConfig.name}`);
      return;
    }

    this.skybox = this.pmremGenerator.fromEquirectangular(texture).texture;

    if (skyboxConfig.background) {
      this.scene.background = this.skybox;
    }
    if (skyboxConfig.environment) {
      this.scene.environment = this.skybox;
    }
  }

  setPosition(object, position) {
    if (Array.isArray(position) && position.length >= 3) {
      object.position.set(position[0], position[1], position[2]);
      return;
    }

    if (position instanceof Vector3) {
      object.position.copy(position);
      return;
    }

    if (typeof position === 'object' && ['x', 'y', 'z'].every(axis => axis in position)) {
      object.position.set(position.x, position.y, position.z);
    }
  }

  onLoadComplete({ status }) {
    if (status !== loadingStates.ready) return;
    if (this.pendingSkyboxConfig) {
      this.setSkybox(this.config.skybox);
      this.pendingSkyboxConfig = null;
    }
  }

  init() {
    const { rendererClass, scene, signals, resources } = this.manager;
    this.renderer = rendererClass.renderer;
    this.scene = scene;
    this.loadedSignal = signals.loaded;
    this.resources = resources;
    this.pmremGenerator = new PMREMGenerator(this.renderer);
    this.loadedSignal.subscribe(this.onLoadComplete.bind(this));

    this.config.lights && this.config.lights.forEach(light => this.addLight(light));
    this.pendingSkyboxConfig = Boolean(this.config.skybox);
  }
}