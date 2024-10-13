import gsap from "gsap";

export const loadingTimeline = (parentClass) => {
  const {
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

  return gsap.timeline()
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
    .to(loaderGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5, delay: 0.5, ease: "power2.out" }, '<')
    .to(model.material, { opacity: 1, duration: 1, ease: "power2.out" }, '<')
    .to(loaderGroup.rotation, {
      z: 0, x: Math.PI * -0.2, duration: 2, ease: "power2.out"
    }, '<')
    .to('.projects-slider', {
      opacity: 0.8, duration: 6, ease: "power2.out",
      onStart: () => {
        projectsGallery.initGallery();
        sectionImages.init();
      }
    }, '<')
    .to([
      highlightOne.uRevealOpacity,
      highlightTwo.uRevealOpacity,
      highlightThree.uRevealOpacity,
    ], {
      value: 1, duration: 2
    }, '<+=1')

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
    }, '<')
}

export const timelineSupport = (parentClass, ease, duration) => {
  const {
    supportGroup,
    triangleOutlineMain,
    triangleOutlineLeft,
    triangleOutlineRight,
    trianglesGroup,
    camera,
  } = parentClass;

  return gsap.timeline({ ease })
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
    peopleGroup,
    sectionImages,
    highlightOne,
    highlightTwo,
    highlightThree,
    camera,
  } = parentClass;
  const sectionImagesImages = sectionImages.images;

  return gsap.timeline({ ease })
    .fromTo(camera.position, { x: 0, y: 0.2 }, { x: 1.2, y: 0.35, duration })
    .to(peopleGroup.rotation, { x: -0.1, y: 0.4, z: 4, duration }, '<')
    .to(peopleGroup.scale, { x: 0.85, y: 0.85, z: 0.85, duration }, '<')
    .to(sectionImagesImages[0], { opacity: 1, duration: imageFadeDuration }, '<')
    .to([
      highlightOne.group.scale,
      highlightTwo.group.scale,
      highlightThree.group.scale,
    ], { x: 0.2, y: 0.2, z: 0.2, stagger: 0.1, duration: duration * 0.4, ease: 'power1.inOut' }, '<')
    .to([
      highlightOne.uOpacity,
      highlightTwo.uOpacity,
      highlightThree.uOpacity,
    ], { value: 1, duration: duration * 0.3, ease: 'power1.inOut' }, '<+=0.1')
    .to(highlightOne.uTransition, {
      value: 1, duration: duration * 0.4,
    }, '<+0.3')
}

export const timelineProjects = (parentClass, ease, duration, imageFadeDuration) => {
  const {
    projectsGroup,
    sectionImages,
    highlightOne,
    highlightTwo,
  } = parentClass;
  const sectionImagesImages = sectionImages.images;

  return gsap.timeline({ ease })
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
    processGroup,
    sectionImages,
    highlightTwo,
    highlightThree,
  } = parentClass;
  const sectionImagesImages = sectionImages.images;

  return gsap.timeline({ ease })
    .to(processGroup.rotation, { x: 0.41, y: 1.09, z: 1.64, duration })
    .to(sectionImagesImages[2], { opacity: 1, duration: imageFadeDuration }, '<')
    .to(highlightTwo.uTransition, {
      value: 0, duration: duration * 0.4,
    }, '<+0.3')
    .to(highlightThree.uTransition, {
      value: 1, duration: duration * 0.4,
    }, '<')
}