import gsap from "gsap";
import Manager from "../sceneSetup/Manager";
import { loadingStates } from "../sceneSetup/constants";

export class LoadingScreen {
  constructor({ wrapSelector, textCounterSelector, onComplete }) {
    this.loaderWrap = document.querySelector(wrapSelector);
    if (!Boolean(this.loaderWrap)) return;

    this.manager = Manager.instance;
    this.textCounter = this.loaderWrap.querySelector(textCounterSelector);
    this.onComplete = onComplete;
    this.init();
  }

  animate({ progress, status }) {
    gsap.timeline()
      .to(this.textCounter, {
        innerHTML: `${Math.floor(progress * 100)}%`,
        roundProps: "innerHTML",
        snap: { innerHTML: 1 },
      })
      .to(this.loaderWrap, {
        '--progress': progress,
      }, '<')

    if (status === loadingStates.ready) {
      gsap.to(
        this.loaderWrap,
        {
          autoAlpha: 0,
          duration: 1.5,
          onStart: () => {
            this.onComplete?.();
            this.loaderWrap.style.pointerEvents = "none";
          },
          onComplete: () => {
            this.loaderWrap.style.pointerEvents = "none";
          },
        }
      );
    }
  }

  init() {
    const { resources, signals } = this.manager;
    this.resources = resources;
    this.loadedSignal = signals.loaded;

    if (!Boolean(this.resources)) return this.loaderWrap.remove();

    this.loadedSignal.subscribe(this.animate.bind(this));
  }
}