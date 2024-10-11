import Manager from "./Manager";

export class FollowHTML {
  constructor({ object, target, onUpdate, scaleAdjust = false }) {
    this.manager = Manager.instance;
    this.sizes = this.manager.sizes;
    this.updateSignal = this.manager.signals.update;
    this.setupTargetObserver({ object, target, onUpdate, scaleAdjust });
  }

  updateBasedOnTarget(obj, target, scaleAdjust) {
    if (!target) return;
    const { offsetWidth: w, offsetHeight: h } = target;
    const { top, left } = target.getBoundingClientRect();
    const x = this.sizes.width * -0.5 + w * 0.5;
    const y = this.sizes.height * 0.5 - h * 0.5;

    if (scaleAdjust) {
      obj.scale.set(w, h, obj.scale.z);
    }
    obj.position.set(x + left, y - top, obj.position.z);
  }

  setupTargetObserver(objData) {
    const { object, target, scaleAdjust, onUpdate } = objData;

    const onUpdateCallback = () => {
      onUpdate?.();
      this.updateBasedOnTarget(object, target, scaleAdjust)
    };

    onUpdateCallback();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.updateSignal.subscribe(onUpdateCallback, 1);
        } else {
          this.updateSignal.unsubscribe(onUpdateCallback);
        }
      });
    });

    observer.observe(target);
    objData.observer = observer;
  }
}