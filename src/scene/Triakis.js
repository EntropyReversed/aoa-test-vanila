import { Group, MeshStandardMaterial } from "three";
import Manager from "../sceneSetup/Manager";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export class Triakis {
  constructor() {
    this.manager = Manager.instance;
    const { scene, resources, cameraClass } = this.manager;
    this.scene = scene;
    this.camera = cameraClass.camera;
    this.model = resources.items.model.scene.children[0];
    this.refreshDebug = null;
    this.init();
  }

  debug() {
    const onDebug = (debug) => {
      this.refreshDebug = debug.refresh;

      debug.addSceneObject({ name: "Triakis", object: this.model });
      debug.addSceneObject({ name: "peopleGroup", object: this.peopleGroup });
      debug.addSceneObject({ name: "Camera", object: this.camera });
    }

    this.manager.signals.debug.subscribe(onDebug);
  }

  init() {
    this.model.material = new MeshStandardMaterial({
      roughness: 0.1,
      metalness: 0.95,
      transparent: true,
    });
    this.model.name = "Triakis";
    this.loaderGroup = new Group();
    this.loaderGroup.name = "LoaderGroup";
    this.loaderGroup.scale.set(0, 0, 0);
    this.loaderGroup.rotation.set(
      Math.PI * -0.1,
      Math.PI,
      Math.PI * -1.5
    );

    this.supportGroup = new Group();
    this.supportGroup.name = "SupportGroup";

    this.peopleGroup = new Group();
    this.peopleGroup.name = "PeopleGroup";
    this.peopleGroup.position.set(0, 0.1, 1.5);

    // this.supportGroup.position.set(0, 0, 0);
    // this.supportGroup.scale.set(0, 0, 0);
    // this.supportGroup.rotation.set(0, 0, 0);

    this.loaderGroup.add(this.model);
    this.supportGroup.add(this.loaderGroup)
    this.peopleGroup.add(this.supportGroup)
    this.scene.add(this.peopleGroup);
    // this.model.rotation.set(-0.27, -1.02, 0);

    gsap.timeline()
      .to(this.loaderGroup.scale, { x: 1, y: 1, z: 1, duration: 2, delay: 0.2, ease: "power2.out" })
      .to(this.loaderGroup.rotation, { z: 0, duration: 2, ease: "power2.out" }, '<')

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


    //peopleGroup
    // const timelinePeople = gsap.timeline()

    //   .to(this.peopleGroup.position, {
    //     x: -1, duration: 1, ease: "none"
    //   })
    //   .to(this.peopleGroup.rotation, {
    //     x: 0.07, y: 0.34, z: 2.32, duration: 1, ease: "none"
    //   }, '<')




    ScrollTrigger.create({
      trigger: '#scene',
      start: "top top",
      end: "bottom top",
      animation: timelineSupport,
      scrub: 1,
      markers: true,
    });
    this.debug();
  }
}