import { Group, LinearFilter, LinearMipmapLinearFilter, MeshStandardMaterial } from "three";
import Manager from "../sceneSetup/Manager";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export class Triakis {
  constructor() {
    this.manager = Manager.instance;
    const { scene, resources, cameraClass } = this.manager;
    this.scene = scene;
    this.camera = cameraClass.camera;
    this.colorMap = resources.items.colorLayer;
    this.model = resources.items.model.scene.children[0];
    this.refreshDebug = null;
    this.init();
  }

  debug() {
    const onDebug = (debug) => {
      this.refreshDebug = debug.refresh;

      debug.addSceneObject({ name: "Triakis", object: this.model });
      debug.addSceneObject({ name: "projectsGroup", object: this.projectsGroup });
      debug.addSceneObject({ name: "Camera", object: this.camera });
    }

    this.manager.signals.debug.subscribe(onDebug);
  }

  init() {
    // this.colorMap.minFilter = LinearMipmapLinearFilter;
    // this.colorMap.magFilter = LinearFilter;

    this.model.material = new MeshStandardMaterial({
      color: 'white',
      map: this.colorMap,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
    });
    this.model.name = "Triakis";
    this.loaderGroup = new Group();
    this.loaderGroup.name = "LoaderGroup";
    this.loaderGroup.scale.set(0, 0, 0);
    this.loaderGroup.position.x = -0.015;
    this.loaderGroup.rotation.set(
      Math.PI * -0.1,
      Math.PI,
      Math.PI * -1.5
    );

    this.supportGroup = new Group();
    this.supportGroup.name = "SupportGroup";

    this.peopleGroup = new Group();
    this.peopleGroup.name = "PeopleGroup";

    this.projectsGroup = new Group();
    this.projectsGroup.name = "ProjectsGroup";
    this.projectsGroup.position.set(0, 0.1, 1.5);

    // this.supportGroup.position.set(0, 0, 0);
    // this.supportGroup.scale.set(0, 0, 0);
    // this.supportGroup.rotation.set(0, 0, 0);

    this.loaderGroup.add(this.model);
    this.supportGroup.add(this.loaderGroup)
    this.peopleGroup.add(this.supportGroup)
    this.projectsGroup.add(this.peopleGroup)
    this.scene.add(this.projectsGroup);
    // this.model.rotation.set(-0.27, -1.02, 0);

    gsap.timeline()
      .to('.loading-screen__images div', {
        opacity: 1,
        scale: 1,
        stagger: {
          grid: [2, 7],
          amount: 3,
          from: 'end',
        },
        onStart: () => {
          gsap.to('.loading-screen__images div', {
            contentVisibility: 'visible',
          })
        },
        duration: 1, ease: "none"
      })
      .to('.loading-screen__images', {
        xPercent: 50, duration: 4, ease: "power1.inOut"
      }, '<+=1')
      .to('.loading-screen__images div', {
        opacity: 0, scale: 0.8, stagger: {
          grid: [2, 7],
          amount: 1.5,
          from: 2,
        }, duration: 1, ease: "none"
      }, '-=0.5')
      .to(this.loaderGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5, delay: 0.2, ease: "power2.out" }, '<')
      .to(this.loaderGroup.rotation, { z: 0, duration: 2, ease: "power2.out" }, '<')
      .to('.triakis-section__inner', {
        opacity: 1, duration: 2, ease: "power2.out", onStart: () => {
          gsap.to('.triakis-section__inner', {
            contentVisibility: 'visible',
          })
        }
      }, '<+=1.5')

    //supportGroup
    const timelineSupport = gsap.timeline()
      .to(this.supportGroup.rotation, {
        x: -1.98, y: 0.56, z: 1.3, duration: 1, ease: "none"
      })
      .to(this.supportGroup.scale, {
        x: 0.9, y: 0.9, z: 0.9, duration: 1, ease: "none"
      }, '<')
      .to(this.supportGroup.position, {
        y: -0.1, duration: 1, ease: "none"
      }, '<')


    // peopleGroup
    const timelinePeople = gsap.timeline()
      .to(this.camera.position, {
        x: 1, y: 0.15, duration: 1, ease: "none"
      })
      .to(this.peopleGroup.rotation, {
        y: 0.4, z: 3, duration: 1, ease: "none",
      }, '<')
      .to(this.peopleGroup.scale, {
        x: 0.8, y: 0.8, z: 0.8, duration: 1, ease: "none",
      }, '<')

    const timelineProjects = gsap.timeline()
      .to(this.projectsGroup.position, {
        x: -0.1, duration: 1, ease: "none",
      })
      .to(this.projectsGroup.rotation, {
        x: -0.41, y: 0.41, z: 4.64, duration: 1, ease: "none",
      }, '<')


    ScrollTrigger.create({
      trigger: '#home',
      start: "top top",
      endTrigger: '#support',
      end: "top top",
      animation: timelineSupport,
      scrub: 1,
    });
    ScrollTrigger.create({
      trigger: '#support',
      start: "top+=30% top",
      end: "bottom top",
      animation: timelinePeople,
      scrub: 1,
    });
    ScrollTrigger.create({
      trigger: '#people',
      start: "top+=30% top",
      end: "bottom top",
      animation: timelineProjects,
      scrub: 1,
    });
    this.debug();
  }
}