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
  // {
  //   name: "tealLayer",
  //   type: texture,
  //   path: "/assets/textures/tealLayer.webp",
  // },
  {
    name: "colorLayer",
    type: texture,
    path: "/assets/textures/colorLayer2.webp",
  },
  {
    name: "skyBox",
    type: hdrTexture,
    path: "/assets/textures/clouds.hdr",
  },
];
