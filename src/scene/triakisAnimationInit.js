import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import Manager from "../sceneSetup/Manager";
import TriakisAnimation from "./TriakisAnimation";
import assets from "./assets";
import { loadingStates } from "../sceneSetup/constants";

export const triakisAnimationInit = () => {
  const wrap = document.getElementById("scene");
  if (wrap) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
    });

    const { signals } = new Manager({
      wrap,
      assets,
      renderOnDemand: true,
      debug: window.location.href.includes("debug"),
    });

    signals.loaded.subscribe(({ status, message }) => {
      if (status === loadingStates.error) return console.error(message);
      if (status !== loadingStates.ready) return;
      new TriakisAnimation();
    });
  }
}