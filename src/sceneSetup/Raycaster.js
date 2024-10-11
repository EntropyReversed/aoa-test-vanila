import { Raycaster, Vector2 } from 'three';
import Manager from './Manager';

export class RaycasterClass {
  currentHoveredObject = null;
  eventRegistrations = [];
  raycaster = new Raycaster();
  mouse = new Vector2();

  constructor() {
    this.manager = Manager.instance;
    this.init();
  }

  onPointerMove(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  getIntersects(objects) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(objects, true);
    return intersects;
  }

  handleMouseMove() {
    this.eventRegistrations.forEach(registration => {
      const intersects = this.getIntersects(registration.objects);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0];

        if (registration.currentHoveredObject?.object !== intersectedObject.object) {
          if (registration.currentHoveredObject && registration.onMouseLeave) {
            registration.onMouseLeave(registration.currentHoveredObject);
          }
          if (registration.onMouseEnter) {
            registration.onMouseEnter(intersectedObject);
          }
          registration.currentHoveredObject = intersectedObject;
        }
        if (registration.onMouseMove) {
          registration.onMouseMove(intersectedObject);
        }
      } else if (registration.currentHoveredObject) {
        if (registration.onMouseLeave) {
          registration.onMouseLeave(registration.currentHoveredObject);
        }
        registration.currentHoveredObject = null;
      }
    });
  }

  handleClick() {
    this.eventRegistrations.forEach(registration => {
      const intersects = this.getIntersects(registration.objects);
      if (intersects.length > 0 && registration.onClick) {
        registration.onClick(intersects[0]);
      }
    });
  }

  addEventListeners({ objects, onMouseEnter, onMouseLeave, onMouseMove, onClick }) {
    const registration = {
      objects,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      onClick,
      currentHoveredObject: null
    };
    this.eventRegistrations.push(registration);
  }

  createListeners() {
    this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.domElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.domElement.addEventListener('click', this.handleClick.bind(this));
  }

  dispose() {
    this.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.domElement.removeEventListener('mousemove', this.handleMouseMove);
    this.domElement.removeEventListener('click', this.handleClick);
    this.eventRegistrations = [];
  }

  init() {
    const { cameraClass, scene, canvas } = this.manager;
    this.camera = cameraClass.camera;
    this.scene = scene.scene;
    this.domElement = canvas;

    this.createListeners();
  }
}