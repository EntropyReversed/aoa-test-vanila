import { Group, MeshStandardMaterial } from "three";
import Manager from "../sceneSetup/Manager";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BackgroundTriangles } from "./BackgroundTriangles";
import { cloudsTimeline, loadingTimeline, timelinePeople, timelineProcess, timelineProjects, timelineSupport } from "./timelines";
import { TriakisHighlights } from "./TriakisHighlights";
import gsap from "gsap";
import { linearMap } from "./helpers";

export class Triakis {
  constructor(parentClass) {
    this.manager = Manager.instance;
    const { scene, sizes, resources, cameraClass } = this.manager;
    this.scene = scene;
    this.sizes = sizes;
    this.camera = cameraClass.camera;
    this.resources = resources;
    this.projectsGallery = parentClass.projectsGallery;
    this.sectionImages = parentClass.sectionImages;
    this.init();
  }

  debug() {
    const onDebug = (debug) => {
      // debug.addSceneObject({ name: "triakis", object: this.model });
      debug.addSceneObject({ name: "highlightOneGroup", object: this.highlightOne.group });
      debug.addSceneObject({ name: "highlightTwoGroup", object: this.highlightTwo.group });
      debug.addSceneObject({ name: "highlightThreeGroup", object: this.highlightThree.group });
      // debug.addSceneObject({ name: "triangleMain", object: this.triangleOutlineMain.triangle });
      // debug.addSceneObject({ name: "triangleLeft", object: this.triangleOutlineLeft.triangle });
      // debug.addSceneObject({ name: "triangleRight", object: this.triangleOutlineRight.triangle });
      // debug.addSceneObject({ name: "camera", object: this.camera });

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
        invalidateOnRefresh: true,
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
    this.triakisHighlights = new TriakisHighlights(this.model)
    this.highlightOne = this.triakisHighlights.highlightOne;
    this.highlightTwo = this.triakisHighlights.highlightTwo;
    this.highlightThree = this.triakisHighlights.highlightThree;

  }

  createModel() {
    this.model = this.resources.items.model.scene.children[0];
    this.colorMap = this.resources.items.colorLayer;
    const material = new MeshStandardMaterial({
      color: 'white',
      map: this.colorMap,
      metalness: 0.9,
      roughness: 0.38,
      opacity: 0,
      transparent: true,
    });
    this.model.material = material;
    material.dispose();
    this.colorMap.dispose();
  }

  init() {
    this.createTriangles();
    this.createModel();
    this.createGroups();
    this.createHighlights();
    this.createTimelines();

    const setUpCameraZoom = (camera, width) => {
      gsap.set(camera.position, {
        z: () => {
          if (width > 1000) return linearMap(width, 1000, 1920, 2, 1.8);
          return linearMap(width, 300, 1000, 3.4, 2)
        },
      })
    }

    setUpCameraZoom(this.camera, this.sizes.width);
    this.manager.signals.resize.subscribe(({ width }) => {
      setUpCameraZoom(this.camera, width);
    })

    this.debug();
  }
}