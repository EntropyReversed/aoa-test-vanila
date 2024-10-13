import { assetsTypes } from "../sceneSetup/constants";

const {
  glbModel,
  texture,
  gainMapTexture
} = assetsTypes;

export default [
  {
    name: "model",
    type: glbModel,
    path: "/assets/models/triakis.glb",
  },
  {
    name: "colorLayer",
    type: texture,
    path: "/assets/textures/colorLayer2.webp",
  },
  {
    name: "triakisHighlight",
    type: texture,
    path: "/assets/textures/triakis-highlight.webp",
  },
  {
    name: "triakisHighlightFull",
    type: texture,
    path: "/assets/textures/triakis-highlight-full.webp",
  },
  {
    name: "gainMap",
    type: gainMapTexture,
    path: [
      "/clouds.webp",
      "/clouds-gainmap.webp",
      "/clouds.json",
    ],
  },
];
