import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { TextureLoader, LoadingManager } from "three";
import Manager from './Manager';
import { assetsTypes, loadingStates } from './constants';

const { glbModel, texture, hdrTexture } = assetsTypes;

export default class Resources {
  items = {};
  loaded = 0;

  constructor(assets) {
    this.manager = Manager.instance;
    this.assets = assets;
    this.init();
  }

  startLoading() {
    const loaderMap = {
      [glbModel]: this.loaders.gltfLoader,
      [texture]: this.loaders.textureLoader,
      [hdrTexture]: this.loaders.rgbeLoader,
    };

    for (const asset of this.assets) {
      const loader = loaderMap[asset.type];

      if (loader) {
        loader.load(
          asset.path,
          (file) => this.items[asset.name] = file,
        );

        continue;
      }
      console.warn(`Unknown asset type: ${asset.type} for asset: ${asset.name}`);
    }
  }

  onLoadComplete() {
    this.loadedSignal.setValue({ status: loadingStates.ready, progress: 1 });
  }

  onProgress(itemsLoaded, itemsTotal) {
    this.loadedSignal.setValue({ status: loadingStates.loading, progress: itemsLoaded / itemsTotal });
  }

  onError(url) {
    this.loadedSignal.setValue({
      status: loadingStates.error,
      message: `Failed to load asset from: ${url}`
    });
  }

  init() {
    this.loadedSignal = this.manager.signals.loaded;

    this.loadingManager = new LoadingManager(
      () => this.onLoadComplete(),
      (_, itemsLoaded, itemsTotal) => this.onProgress(itemsLoaded, itemsTotal),
      (url) => this.onError(url)
    );

    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
    this.loaders.textureLoader = new TextureLoader(this.loadingManager);
    this.loaders.rgbeLoader = new RGBELoader(this.loadingManager);

    this.loadedSignal.setValue({ status: loadingStates.loading, progress: 0 });
    this.startLoading();
  }
}
