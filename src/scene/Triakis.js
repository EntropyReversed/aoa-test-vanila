import { Group, MeshStandardMaterial } from "three";
import Manager from "../sceneSetup/Manager";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectsGallery } from "./ProjectsGallery";
import { BackgroundTriangles } from "./BackgroundTriangles";
import { SectionImages } from "./SectionImages";
import { TriakisHighlight } from "./TriakisHighlight";

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
      debug.addSceneObject({ name: "highlightOneGroup", object: this.highlightOne.group });
      debug.addSceneObject({ name: "highlightTwoGroup", object: this.highlightTwo.group });
      debug.addSceneObject({ name: "highlightThreeGroup", object: this.highlightThree.group });
      debug.addSceneObject({ name: "Camera", object: this.camera });

      debug.addCustomConfig(this.camera, (folder) => {
        folder.addBinding(this.camera, "fov",).on('change', () => {
          this.camera.updateProjectionMatrix();
        });
      });

    }

    this.manager.signals.debug.subscribe(onDebug);
  }

  init() {
    this.projectsGallery = new ProjectsGallery();
    this.sectionImages = new SectionImages();
    this.sectionImagesWrap = this.sectionImages.wrap;
    this.sectionImagesImages = this.sectionImages.images;

    // const clouds = document.querySelectorAll('.cloud')
    // const tl = gsap.timeline();

    // clouds.forEach((cloud, index) => {
    //   const cloudStart = {};
    //   const cloudEnd = {
    //     duration: 5,
    //     ease: 'linear',
    //     repeat: '-1',
    //     yoyo: true,
    //   };

    //   // eslint-disable-next-line default-case
    //   switch (index) {
    //     case 0:
    //       cloudStart.x = 0;
    //       cloudEnd.x = 30;
    //       break;
    //     case 1:
    //       cloudStart.x = 0;
    //       cloudEnd.x = -30;
    //       break;
    //     case 2:
    //       cloudStart.y = 0;
    //       cloudStart.rotation = 0;
    //       cloudEnd.y = 30;
    //       cloudEnd.rotation = 2;
    //       break;
    //   }

    //   tl.fromTo(cloud, cloudStart, cloudEnd, `<+={(index + 1) * 10}%`);
    // });

    this.backgroundTriangles = new BackgroundTriangles();
    this.trianglesGroup = this.backgroundTriangles.trianglesGroup;
    this.triangleOutlineMain = this.backgroundTriangles.triangleOutlineMain;
    this.triangleOutlineLeft = this.backgroundTriangles.triangleOutlineLeft;
    this.triangleOutlineRight = this.backgroundTriangles.triangleOutlineRight;


    this.model.material = new MeshStandardMaterial({
      color: 'white',
      map: this.colorMap,
      metalness: 0.9,
      roughness: 0.4,
      opacity: 0,
      transparent: true,
    });
    this.model.name = "Triakis";
    this.loaderGroup = new Group();
    this.loaderGroup.name = "LoaderGroup";
    this.loaderGroup.scale.set(0, 0, 0);
    this.loaderGroup.position.x = -0.013;
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

    this.processGroup = new Group();
    this.processGroup.name = "ProcessGroup";

    this.highlightOne = new TriakisHighlight(this.supportGroup);
    this.highlightOne.group.position.set(-0.54, -0.11, -0.35);
    this.highlightTwo = new TriakisHighlight(this.supportGroup);
    this.highlightTwo.group.position.set(-0.59, -0.26, 0.2);
    this.highlightThree = new TriakisHighlight(this.supportGroup);
    this.highlightThree.group.position.set(-0.3, -0.52, -0.17);
    // this.projectsGroup.position.set(0, 0, 0);

    // this.supportGroup.position.set(0, 0, 0);
    // this.supportGroup.scale.set(0, 0, 0);
    // this.supportGroup.rotation.set(0, 0, 0);

    this.loaderGroup.add(this.model);
    this.supportGroup.add(this.loaderGroup)
    this.peopleGroup.add(this.supportGroup)
    this.projectsGroup.add(this.peopleGroup)
    this.processGroup.add(this.projectsGroup)
    this.scene.add(this.processGroup);
    // this.model.rotation.set(-0.27, -1.02, 0);

    gsap.timeline()
      // .to('.loading-screen__images div', {
      //   opacity: 1,
      //   scale: 1,
      //   stagger: {
      //     grid: [2, 7],
      //     amount: 3,
      //     from: 'end',
      //   },
      //   onStart: () => {
      //     gsap.to('.loading-screen__images div', {
      //       contentVisibility: 'visible',
      //     })
      //   },
      //   duration: 1, ease: "none"
      // })
      // .to('.loading-screen__images', {
      //   xPercent: 50, duration: 4, ease: "power1.inOut"
      // }, '<+=1')
      // .to('.loading-screen__images div', {
      //   opacity: 0, scale: 0.8, stagger: {
      //     grid: [2, 7],
      //     amount: 1.5,
      //     from: 2,
      //   }, duration: 1, ease: "none"
      // }, '-=0.5')
      .to(this.loaderGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5, delay: 0.5, ease: "power2.out" }, '<')
      .to(this.model.material, { opacity: 1, duration: 1, ease: "power2.out" }, '<')
      .to(this.loaderGroup.rotation, {
        z: 0, x: Math.PI * -0.2, duration: 2, ease: "power2.out"
      }, '<')
      .to('.projects-slider', {
        opacity: 0.8, duration: 6, ease: "power2.out",
        onStart: () => {
          this.projectsGallery.initGallery();
          this.sectionImages.init();
        }
      }, '<')
      .fromTo([
        this.highlightOne.mesh.material.uniforms.uRevealOpacity,
        this.highlightTwo.mesh.material.uniforms.uRevealOpacity,
        this.highlightThree.mesh.material.uniforms.uRevealOpacity,
      ], { value: 0 }, {
        value: 1, duration: 2
      }, '<+=1')

      .to([
        this.triangleOutlineMain.uRevealOpacity,
        this.triangleOutlineLeft.uRevealOpacity,
        this.triangleOutlineRight.uRevealOpacity,
      ], {
        value: 1, duration: 2
      }, '<')
      .to(this.sectionImagesWrap, {
        opacity: 0.9, duration: 3, ease: "power2.out",
      }, '<+=1')
      .to('.triakis-section__inner', {
        y: 0, opacity: 1, duration: 1, ease: "power2.out", onStart: () => {
          gsap.to('.triakis-section__inner', {
            contentVisibility: 'visible',
          })
        }
      }, '<')

    //supportGroup
    const timelineSupport = gsap.timeline({ ease: "none" })
      .to(this.supportGroup.rotation, {
        x: -1.8, y: 0.66, z: 1.1, duration: 1,
      })
      .to(this.supportGroup.scale, {
        x: 0.9, y: 0.9, z: 0.9, duration: 1,
      }, '<')
      .to([
        this.triangleOutlineMain.uOpacity,
        this.triangleOutlineLeft.uOpacity,
        this.triangleOutlineRight.uOpacity,
      ], {
        value: 0, duration: 1
      }, '<')
      .to(this.trianglesGroup.position, {
        y: 3, duration: 1,
      }, '<')
      .to(this.camera.position, {
        y: 0.2, duration: 1,
      }, '<')
      .to('.projects-slider', {
        '--progress': 1, duration: 1,
      }, '<')


    // peopleGroup
    const defaultEase = "none";
    const defaultDuration = 1;
    const imageFadeDuration = 0.5;

    // Timeline for "People" section
    const timelinePeople = gsap.timeline({ ease: defaultEase })
      .fromTo(this.camera.position, { x: 0, y: 0.2 }, { x: 1.2, y: 0.35, duration: defaultDuration })
      .to(this.peopleGroup.rotation, { x: -0.1, y: 0.4, z: 4, duration: defaultDuration }, '<')
      .to(this.peopleGroup.scale, { x: 0.85, y: 0.85, z: 0.85, duration: defaultDuration }, '<')
      .to(this.sectionImagesImages[0], { opacity: 1, duration: imageFadeDuration }, '<')
      .to([
        this.highlightOne.group.scale,
        this.highlightTwo.group.scale,
        this.highlightThree.group.scale,
      ], { x: 0.2, y: 0.2, z: 0.2, stagger: 0.1, duration: defaultDuration * 0.4, ease: 'power1.inOut' }, '<')
      .to([
        this.highlightOne.mesh.material.uniforms.uOpacity,
        this.highlightTwo.mesh.material.uniforms.uOpacity,
        this.highlightThree.mesh.material.uniforms.uOpacity,
      ], { value: 1, duration: defaultDuration * 0.3, ease: 'power1.inOut' }, '<+=0.1')
      .fromTo(this.highlightOne.mesh.material.uniforms.uTransition, { value: 0 }, {
        value: 1, duration: defaultDuration * 0.4, ease: 'power1.inOut'
      }, '<+0.3')

    // Timeline for "Projects" section
    const timelineProjects = gsap.timeline({ ease: defaultEase })
      .to(this.projectsGroup.rotation, { x: 0.14, y: 0.82, z: 1.91, duration: defaultDuration })
      .to(this.sectionImagesImages[1], { opacity: 1, duration: imageFadeDuration }, '<')
      .fromTo(this.highlightOne.mesh.material.uniforms.uTransition, { value: 1 }, {
        value: 0, duration: defaultDuration * 0.4, ease: 'power1.inOut'
      }, '<+0.3')
      .fromTo(this.highlightTwo.mesh.material.uniforms.uTransition, { value: 0 }, {
        value: 1, duration: defaultDuration * 0.4, ease: 'power1.inOut'
      }, '<')

    // Timeline for "Process" section
    const timelineProcess = gsap.timeline({ ease: defaultEase })
      .to(this.processGroup.rotation, { x: 0.41, y: 1.09, z: 1.64, duration: defaultDuration })
      .to(this.sectionImagesImages[2], { opacity: 1, duration: imageFadeDuration }, '<')
      .fromTo(this.highlightTwo.mesh.material.uniforms.uTransition, { value: 1 }, {
        value: 0, duration: defaultDuration * 0.4, ease: 'power1.inOut'
      }, '<+0.3')
      .fromTo(this.highlightThree.mesh.material.uniforms.uTransition, { value: 0 }, {
        value: 1, duration: defaultDuration * 0.4, ease: 'power1.inOut'
      }, '<')

    const triggers = [
      { trigger: '#home', animation: timelineSupport },
      { trigger: '#support', animation: timelinePeople },
      { trigger: '#people', animation: timelineProjects },
      { trigger: '#projects', animation: timelineProcess },
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
    this.debug();
  }
}