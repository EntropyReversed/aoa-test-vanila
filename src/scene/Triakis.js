import { Group, MeshStandardMaterial } from "three";
import Manager from "../sceneSetup/Manager";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BackgroundTriangles } from "./BackgroundTriangles";
import { TriakisHighlight } from "./TriakisHighlight";
import { cloudsTimeline, loadingTimeline, timelinePeople, timelineProcess, timelineProjects, timelineSupport } from "./timelines";

export class Triakis {
  constructor(parentClass) {
    this.manager = Manager.instance;
    const { scene, resources, cameraClass } = this.manager;
    this.scene = scene;
    this.camera = cameraClass.camera;
    this.resources = resources;
    this.projectsGallery = parentClass.projectsGallery;
    this.sectionImages = parentClass.sectionImages;
    this.init();
  }

  debug() {
    const onDebug = (debug) => {
      // debug.addSceneObject({ name: "triakis", object: this.model });
      // debug.addSceneObject({ name: "highlightOneGroup", object: this.highlightOne.group });
      // debug.addSceneObject({ name: "highlightTwoGroup", object: this.highlightTwo.group });
      // debug.addSceneObject({ name: "highlightThreeGroup", object: this.highlightThree.group });
      // debug.addSceneObject({ name: "triangleMain", object: this.triangleOutlineMain.triangle });
      // debug.addSceneObject({ name: "triangleLeft", object: this.triangleOutlineLeft.triangle });
      // debug.addSceneObject({ name: "triangleRight", object: this.triangleOutlineRight.triangle });
      debug.addSceneObject({ name: "camera", object: this.camera });

      // debug.addCustomConfig(this.camera, (folder) => {
      //   const lookAtParams = {
      //     x: 0,
      //     y: 0,
      //     z: 0
      //   };

      //   folder.addBinding(lookAtParams, 'x', {
      //     label: 'LookAt X',
      //     min: -1,
      //     max: 1
      //   }).on('change', () => {
      //     this.camera.lookAt(lookAtParams.x, lookAtParams.y, lookAtParams.z);
      //   });

      //   folder.addBinding(lookAtParams, 'y', {
      //     label: 'LookAt Y',
      //     min: -1,
      //     max: 1
      //   }).on('change', () => {
      //     this.camera.lookAt(lookAtParams.x, lookAtParams.y, lookAtParams.z);
      //   });

      //   folder.addBinding(lookAtParams, 'z', {
      //     label: 'LookAt Z',
      //     min: -1,
      //     max: 1
      //   }).on('change', () => {
      //     this.camera.lookAt(lookAtParams.x, lookAtParams.y, lookAtParams.z);
      //   });
      // });
    }

    this.manager.signals.debug.subscribe(onDebug);
  }

  createGroups() {
    this.loaderGroup = new Group();
    this.loaderGroup.scale.set(0.5, 0.5, 0.5);
    this.loaderGroup.position.x = -0.013;
    this.loaderGroup.rotation.set(
      Math.PI * -0.1,
      Math.PI,
      Math.PI * -1.5
    );

    this.supportGroup = new Group();
    this.peopleGroup = new Group();
    this.projectsGroup = new Group();
    this.processGroup = new Group();
    this.loaderGroup.add(this.model);
    this.supportGroup.add(this.loaderGroup)
    this.peopleGroup.add(this.supportGroup)
    this.projectsGroup.add(this.peopleGroup)
    this.processGroup.add(this.projectsGroup)
    this.scene.add(this.processGroup);
  }

  createTimelines() {
    const ease = "none";
    const duration = 1;
    const imageDuration = 0.5;

    loadingTimeline(this);

    cloudsTimeline(duration);

    const triggers = [
      {
        trigger: '#home',
        animation: timelineSupport(this, ease, duration),
      },
      {
        trigger: '#support',
        animation: timelinePeople(this, ease, duration, imageDuration),
      },
      {
        trigger: '#people',
        animation: timelineProjects(this, ease, duration, imageDuration),
      },
      {
        trigger: '#projects',
        animation: timelineProcess(this, ease, duration, imageDuration),
      },
    ];

    triggers.forEach(({ trigger, animation }, index) => {
      ScrollTrigger.create({
        trigger,
        start: index === 0 ? "top top" : "top+=30% top",
        end: "bottom top",
        animation,
        scrub: 1,
      });
    });
  }

  createTriangles() {
    this.backgroundTriangles = new BackgroundTriangles();
    this.trianglesGroup = this.backgroundTriangles.trianglesGroup;
    this.triangleOutlineMain = this.backgroundTriangles.triangleOutlineMain;
    this.triangleOutlineLeft = this.backgroundTriangles.triangleOutlineLeft;
    this.triangleOutlineRight = this.backgroundTriangles.triangleOutlineRight;
  }

  createHighlights() {
    this.highlightOne = new TriakisHighlight(this.supportGroup, '#people');
    this.highlightTwo = new TriakisHighlight(this.supportGroup, '#projects');
    this.highlightThree = new TriakisHighlight(this.supportGroup, '#process');

    this.highlightOne.group.position.set(-0.54, -0.11, -0.35);
    this.highlightTwo.group.position.set(-0.59, -0.26, 0.2);
    this.highlightThree.group.position.set(-0.3, -0.52, -0.17);
  }

  createModel() {
    this.model = this.resources.items.model.scene.children[0];
    this.colorMap = this.resources.items.colorLayer;

    this.model.material = new MeshStandardMaterial({
      color: 'white',
      map: this.colorMap,
      metalness: 0.9,
      roughness: 0.4,
      opacity: 0,
      transparent: true,
    });
    this.colorMap.dispose();
  }

  init() {
    this.createTriangles();
    this.createModel();
    this.createGroups();
    this.createHighlights();
    this.createTimelines();

    this.debug();
  }
}