import Manager from "./src/sceneSetup/Manager";
import assets from "./src/scene/assets";
import { loadingStates } from "./src/sceneSetup/constants";
import { LoadingScreen } from "./src/sceneSetup/LoadingScreen";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import TriakisAnimation from "./src/scene/TriakisAnimation";
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll();

const wrap = document.getElementById("scene");
if (wrap) {
  // const sizeMapperW = gsap.utils.mapRange(0, 1920, 400, 600);
  // const sizeMapperH = gsap.utils.mapRange(0, 1920, 200, 400);

  const manager = new Manager({
    wrap,
    assets,
    //TODO: make it so that renderOnDemand works with controls and debug
    // postProcessing won't be able to work with renderOnDemand
    // renderOnDemand: true,
    // manualSizes: { width: sizeMapperW(window.innerWidth), height: sizeMapperH(window.innerWidth) },
    debug: window.location.href.includes("debug"),
  });

  new LoadingScreen({
    wrapSelector: ".loading-screen",
    textCounterSelector: ".loading-screen__text",
    onComplete: () => {
      console.log("Loading complete");
    },
  });

  manager.signals.loaded.subscribe(({ status, message }) => {
    if (status === loadingStates.error) return console.error(message);
    if (status !== loadingStates.ready) return;
    new TriakisAnimation();
  });

  // window.addEventListener("resize", () => {
  //   manager.sizes.setSizes(sizeMapperW(window.innerWidth), sizeMapperH(window.innerWidth));
  // });
}
