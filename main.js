
import { LazyImages } from "./src/LazyImages";
import { triakisAnimationInit } from "./src/scene/triakisAnimationInit";

window.addEventListener('DOMContentLoaded', () => {
  new LazyImages();
})

triakisAnimationInit();