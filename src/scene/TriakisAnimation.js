import gsap from "gsap";
import Manager from "../sceneSetup/Manager";
import { ProjectsGallery } from "./ProjectsGallery";
import { SectionImages } from "./SectionImages";
import { Triakis } from "./Triakis";
import { LoadingScreen } from "./LoadingScreen";

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
      {
        type: 'directional',
        color: '#ffffff',
        intensity: 0.1,
        position: [-4, 0, 10],
        target: [0, 0, 0],
      },
      {
        type: 'ambient',
        color: '#ffffff',
        intensity: 10,
        name: 'Ambient',
      }
    ]

    this.enviroment.setSkybox({
      name: 'gainMap',
      environment: true,
    });

    lights.forEach(light => this.enviroment.addLight(light));
  }

  initScene() {
    this.setUpEnvironment();
    this.projectsGallery = new ProjectsGallery();
    this.sectionImages = new SectionImages();
    this.triakis = new Triakis(this);
  }

  init() {
    const {
      enviroment,
    } = this.manager;

    this.enviroment = enviroment;

    new LoadingScreen({
      wrapSelector: ".loading-screen",
      textCounterSelector: ".loading-screen__text",
      onComplete: () => {
        const clouds = document.querySelectorAll('.cloud img');
        clouds.forEach(cloud => {
          cloud.classList.add('load');
          gsap.fromTo(cloud, {
            scale: 0.8,
            opacity: 0,
          }, {
            delay: 0.5,
            opacity: 1,
            scale: 1,
            duration: 2,
          });
        });
      },
    });

    this.initScene();
  }
}
