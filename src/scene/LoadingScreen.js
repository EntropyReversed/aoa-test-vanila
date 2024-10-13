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
        onStart: () => {
          gsap.set(window, { scrollTo: 0 });
        }
      })
      .to(this.loaderWrap, {
        '--progress': progress,
      }, '<')

    if (status === loadingStates.ready) {
      gsap.to(
        this.loaderWrap,
        {
          opacity: 0,
          // delay: 2,
          duration: 1.5,
          onStart: () => {
            this.onComplete?.();
            document.body.style.overflow = "auto";
            this.loaderWrap.style.pointerEvents = "none";
            if (this.manager.renderOnDemand) {
              this.manager.requestRender();
            }
          },
          onComplete: () => {
            this.loaderWrap.remove()
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