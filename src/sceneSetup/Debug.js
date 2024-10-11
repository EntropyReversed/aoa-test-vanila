import { Pane } from "tweakpane";

export class Debug {
  pane = new Pane();
  sceneObjects = new Set();
  customConfigs = new Map();

  addSceneObject(sceneObject) {
    this.sceneObjects.add(sceneObject);
    this.refreshPane();
  }

  addCustomConfig(object, configFunction) {
    this.customConfigs.set(object, (mainFolder) => {
      const subfolderConfig = configFunction(mainFolder);

      if (subfolderConfig) {
        const { label, config } = subfolderConfig;
        const subfolder = mainFolder.addFolder({ title: label ?? 'Custom' });
        config(subfolder);
      }
    });
    this.refreshPane();
  }

  refreshPane() {
    this.pane.dispose();
    this.pane = new Pane();
    this.createDynamicConfig();
  }

  createDynamicConfig() {
    Array.from(this.sceneObjects).forEach(({ name, object }, index) => {
      if (object) {
        const folder = this.pane.addFolder({ title: name, expanded: index === 0 });

        if (object.material) {
          this.createMaterialControls(object.material, folder);
        }

        if (object.isLight) {
          this.createLightControls(object, folder);
          this.createTransformControls(object, folder, { position: true, scale: false, rotation: false });
        }

        if (object.isCamera) {
          this.createTransformControls(object, folder, { position: true, scale: false, rotation: false });
        }

        if (object.isMesh) {
          this.createTransformControls(object, folder);
        }

        if (object.isGroup) {
          this.createTransformControls(object, folder);
        }

        if (this.customConfigs.has(object)) {
          const customConfigFunction = this.customConfigs.get(object);
          customConfigFunction(folder);
        }

        if (index < this.sceneObjects.size - 1) {
          this.pane.addBlade({
            view: 'separator',
          })
        }
      }
    });
  }

  createTransformControls(mesh, folder, type = { scale: true, position: true, rotation: true }) {
    if (type.scale) {
      this.createGeometryScaleControls(mesh, folder.addFolder({ title: 'Scale' }));
    }

    if (type.position) {
      this.createGeometryPositionControls(mesh, folder.addFolder({ title: 'Position' }));
    }

    if (type.rotation) {
      this.createGeometryRotationControls(mesh, folder.addFolder({ title: 'Rotation' }));
    }
  }

  createMaterialControls(material, folder) {
    const materialFolder = folder.addFolder({ title: 'Material' });
    this.createColorControl(material, materialFolder);

    if (Boolean(material.metalness)) {
      materialFolder.addBinding(material, 'metalness', { label: 'Metallic', min: 0, max: 1 });
    }

    if (Boolean(material.roughness)) {
      materialFolder.addBinding(material, 'roughness', { label: 'Roughness', min: 0, max: 1 });
    }

    if (material.transparent) {
      materialFolder.addBinding(material, 'opacity', { label: 'Opacity', min: 0, max: 1 });
    }
  }

  createGeometryScaleControls(mesh, folder) {
    folder.addBinding(mesh.scale, 'x', { label: 'x', min: 0.1, max: 4 });
    folder.addBinding(mesh.scale, 'y', { label: 'y', min: 0.1, max: 4 });
    folder.addBinding(mesh.scale, 'z', { label: 'z', min: 0.1, max: 4 });
  }

  createGeometryPositionControls(mesh, folder) {
    folder.addBinding(mesh.position, 'x', { label: 'x', min: -10, max: 10 });
    folder.addBinding(mesh.position, 'y', { label: 'y', min: -10, max: 10 });
    folder.addBinding(mesh.position, 'z', { label: 'z', min: -10, max: 10 });
  }

  createGeometryRotationControls(mesh, folder) {
    folder.addBinding(mesh.rotation, 'x', { label: 'x', min: -Math.PI * 2, max: Math.PI * 2 });
    folder.addBinding(mesh.rotation, 'y', { label: 'y', min: -Math.PI * 2, max: Math.PI * 2 });
    folder.addBinding(mesh.rotation, 'z', { label: 'z', min: -Math.PI * 2, max: Math.PI * 2 });
  }

  createLightControls(light, folder) {
    folder.addBinding(light, 'intensity', { label: 'Intensity', min: 0, max: 20 });
    this.createColorControl(light, folder);
  }

  createColorControl(obj, folder) {
    const baseColor255 = obj.color.clone().multiplyScalar(255);
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } };

    folder.addBinding(params, 'color', { label: 'Color' }).on('change', e => {
      obj.color.setRGB(e.value.r / 255, e.value.g / 255, e.value.b / 255);
    });
  }

  refresh() {
    this.pane.refresh();
  }
}
