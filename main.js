
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { LazyImages } from "./src/LazyImages";
import { triakisAnimationInit } from "./src/scene/triakisAnimationInit";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
ScrollTrigger.normalizeScroll({
  allowNestedScroll: true,
});

// const lenis = new Lenis();
// lenis.on('scroll', ScrollTrigger.update);

// gsap.ticker.add((time) => {
//   lenis.raf(time * 1000);
// });

// gsap.ticker.lagSmoothing(0);

window.addEventListener('DOMContentLoaded', () => {
  new LazyImages();
})

triakisAnimationInit();