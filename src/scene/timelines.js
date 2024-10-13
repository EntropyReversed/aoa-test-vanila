import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const createTimeline = (config, manager) => {
  return gsap.timeline({
    onUpdate: () => manager.requestRender(),
    ...config
  })
};

export const loadingTimeline = (parentClass) => {
  const {
    manager,
    loaderGroup,
    model,
    projectsGallery,
    sectionImages,
    highlightOne,
    highlightTwo,
    highlightThree,
    triangleOutlineMain,
    triangleOutlineLeft,
    triangleOutlineRight,
  } = parentClass;

  const sectionImagesWrap = sectionImages.wrap;

  return createTimeline({}, manager)
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
    .to(loaderGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5, delay: 0.5, ease: "power2.out" }, 'start')
    .to(model.material, { opacity: 1, duration: 1, ease: "power2.out" }, 'start')
    .to(loaderGroup.rotation, {
      z: 0, x: Math.PI * -0.2, duration: 2, ease: "power2.out"
    }, 'start')
    .to('.projects-slider', {
      opacity: 0.8, duration: 6, ease: "power2.out",
      onStart: () => {
        projectsGallery.initGallery();
      }
    }, 'start')
    .to([
      highlightOne.uRevealOpacity,
      highlightTwo.uRevealOpacity,
      highlightThree.uRevealOpacity,
    ], {
      value: 1, duration: 2
    }, 'start+=1.5')
    .to([
      triangleOutlineMain.uRevealOpacity,
      triangleOutlineLeft.uRevealOpacity,
      triangleOutlineRight.uRevealOpacity,
    ], {
      value: 1, duration: 2
    }, '<')
    .to(sectionImagesWrap, {
      opacity: 0.9, duration: 3, ease: "power2.out",
    }, '<+=1')
    .to('.triakis-section__inner', {
      y: 0, opacity: 1, duration: 1, ease: "power2.out", onStart: () => {
        gsap.to('.triakis-section__inner', {
          contentVisibility: 'visible',
        })
      }
    }, 'start+=1.3')
}

export const timelineSupport = (parentClass, ease, duration) => {
  const {
    manager,
    supportGroup,
    triangleOutlineMain,
    triangleOutlineLeft,
    triangleOutlineRight,
    trianglesGroup,
    camera,
  } = parentClass;

  return createTimeline({ ease }, manager)
    .to(supportGroup.rotation, {
      x: -1.8, y: 0.66, z: 1.1, duration,
    })
    .to(supportGroup.scale, {
      x: 0.9, y: 0.9, z: 0.9, duration,
    }, '<')
    .to([
      triangleOutlineMain.uOpacity,
      triangleOutlineLeft.uOpacity,
      triangleOutlineRight.uOpacity,
    ], {
      value: 0, duration
    }, '<')
    .to(trianglesGroup.position, {
      y: 3, duration,
    }, '<')
    .to(camera.position, {
      y: 0.2, duration,
    }, '<')
    .to('.projects-slider', {
      '--progress': 1, duration,
    }, '<')
}

export const timelinePeople = (parentClass, ease, duration, imageFadeDuration) => {
  const {
    manager,
    peopleGroup,
    sectionImages,
    highlightOne,
    highlightTwo,
    highlightThree,
    camera,
  } = parentClass;
  const sectionImagesImages = sectionImages.images;

  return createTimeline({ ease }, manager)
    .to(camera.position, { x: 1.2, y: 0.35, duration })
    .to(peopleGroup.rotation, { x: -0.1, y: 0.4, z: 4, duration }, '<')
    .to(peopleGroup.scale, { x: 0.85, y: 0.85, z: 0.85, duration }, '<')
    .to(sectionImagesImages[0], { opacity: 1, duration: imageFadeDuration }, '<')
    .to([
      highlightOne.group.scale,
      highlightTwo.group.scale,
      highlightThree.group.scale,
    ], { x: 0.2, y: 0.2, z: 0.2, stagger: 0.1, duration: duration * 0.2, ease: 'power1.inOut' }, '<+=0.3')
    .to([
      highlightOne.uOpacity,
      highlightTwo.uOpacity,
      highlightThree.uOpacity,
    ], { value: 1, stagger: 0.1, duration: duration * 0.2, ease: 'power1.inOut' }, '<')

    .to(highlightOne.uTransition, {
      value: 1, duration: duration * 0.4,
    }, '<+0.2')

}

export const timelineProjects = (parentClass, ease, duration, imageFadeDuration) => {
  const {
    manager,
    projectsGroup,
    sectionImages,
    highlightOne,
    highlightTwo,
  } = parentClass;
  const sectionImagesImages = sectionImages.images;

  return createTimeline({ ease }, manager)
    .to(projectsGroup.rotation, { x: 0.14, y: 0.82, z: 1.91, duration })
    .to(sectionImagesImages[1], { opacity: 1, duration: imageFadeDuration }, '<')
    .to(highlightOne.uTransition, {
      value: 0, duration: duration * 0.4,
    }, '<+0.3')
    .to(highlightTwo.uTransition, {
      value: 1, duration: duration * 0.4,
    }, '<')
}

export const timelineProcess = (parentClass, ease, duration, imageFadeDuration) => {
  const {
    manager,
    processGroup,
    sectionImages,
    highlightTwo,
    highlightThree,
  } = parentClass;
  const sectionImagesImages = sectionImages.images;

  return createTimeline({ ease }, manager)
    .to(processGroup.rotation, { x: 0.41, y: 1.09, z: 1.64, duration })
    .to(sectionImagesImages[2], { opacity: 1, duration: imageFadeDuration }, '<')
    .to(highlightTwo.uTransition, {
      value: 0, duration: duration * 0.4,
    }, '<+0.3')
    .to(highlightThree.uTransition, {
      value: 1, duration: duration * 0.4,
    }, '<')
}

export const cloudsTimeline = (duration) => {
  const animationOne = gsap.timeline()
    .to('.clouds--back', {
      y: () => window.innerHeight * -1.3, duration, ease: 'none',
    })
    .to('.clouds--front', {
      y: () => window.innerHeight * -1.3, duration, ease: 'none',
    }, '<')
  const animationTwo = gsap.timeline()
    .to('.clouds--back .clouds-inner', {
      y: () => window.innerHeight * -1, duration, ease: 'none',
    })
    .to('.clouds--front .clouds-inner', {
      y: () => window.innerHeight * -1, duration, ease: 'none',
    }, '<')
    .to('.clouds', {
      opacity: 0, duration: duration * 0.5, ease: 'none',
    }, '-=0.3')

  ScrollTrigger.create({
    trigger: '#home',
    start: "top top",
    end: "bottom top",
    animation: animationOne,
    scrub: 1.5,
  });
  ScrollTrigger.create({
    trigger: '#support',
    start: "top+=30% top",
    end: "bottom top",
    animation: animationTwo,
    scrub: 2,
  });
}