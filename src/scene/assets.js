import { assetsTypes } from "../sceneSetup/constants";

const {
  glbModel,
  texture,
  hdrTexture,
} = assetsTypes;

export default [
  {
    name: "model",
    type: glbModel,
    path: "/assets/models/triakis.glb",
  },

  {
    name: "flowImage",
    type: texture,
    path: "/assets/textures/flow1.png",
  },
  {
    name: "tealLayer",
    type: texture,
    path: "/assets/textures/tealLayer.webp",
  },
  {
    name: "skyBox",
    type: hdrTexture,
    path: "/assets/textures/clouds.hdr",
  }
];
