import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
//-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
// DEBUG
// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
const gui = new dat.GUI();

// **-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//                      Base
// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color('#030000');
// Declare effect
let effect;

// Declare cursor
const cursor = {};
cursor.x = 0;
cursor.y = 0;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  effect.setSize(window.innerWidth, window.innerHeight);
});

//-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//                    MATERIAL
//-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.45;
material.roughness = 0.65;

// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);

//-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//                    GEOMETRY
//-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-

//
// TEXT
//
const textLoader = new FontLoader();
textLoader.load("/fonts/SpaceMono_Regular.json", function (font) {
  const textGeometry = new TextGeometry("CFM", {
    font: font,
    size: 1.4,
    height: 0.35,
    // curveSegments: 20,
    // bevelEnabled: true,
    // bevelThickness: .5,
    // bevelSize: 10,
  });

  const textMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.45,
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  // textMesh.scale.x = 2.15;
  textMesh.scale.set(1.5, 0.65, 1);
  // center the text
  textGeometry.center();
  scene.add(textMesh);
});

//
// PARTICLES
//
// const particlesGeometry = new THREE.BufferGeometry();
// const count = 500;

// const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

// for (
//   let i = 0;
//   i < count * 3;
//   i++ // Multiply by 3 for same reason
// ) {
//   positions[i] = (Math.random() - 0.5) * 10; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
// }

// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(positions, 3)
// );

// const particlesMaterial = new THREE.PointsMaterial();
// particlesMaterial.size = 0.02;
// particlesMaterial.sizeAttenuation = true;

// const pointsMesh = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(pointsMesh)

// CURSOR
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//                          LIGHTS
//-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(ambientLight, pointLight);

// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//                        CAMERA
// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//
// Base camera
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
cameraGroup.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//                        RENDERER
// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
// renderer.setClearColor(new THREE.Color("#7b7b7b"));
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//                        ASCII
// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
// effectComposer.addPass(dotScreenPass);

// bloompass
const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.strength = 0.56;
unrealBloomPass.radius = 0.75;
unrealBloomPass.threshold = 0.1;

gui.add(unrealBloomPass, "enabled");
gui.add(unrealBloomPass, "strength").min(0).max(2).step(0.001);
gui.add(unrealBloomPass, "radius").min(0).max(2).step(0.001);
gui.add(unrealBloomPass, "threshold").min(0).max(1).step(0.001);
// effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
// effect.setSize(window.innerWidth, window.innerHeight);
// effect.domElement.style.color = "white";
// effect.domElement.style.backgroundColor = "black";

// Special case: append effect.domElement, instead of renderer.domElement.
// AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.
// document.body.appendChild(effect.domElement);

const asciiPass = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });

effectComposer.addPass(unrealBloomPass, dotScreenPass, asciiPass);

// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
//                        ANIMATE
// -=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-=x=-
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update bloom strength
  const amplitude = 0.25;
  const frequency = 1.5;
  const offset = 1.25;
  let strength = amplitude * Math.sin(elapsedTime * frequency) + offset;
  unrealBloomPass.strength = strength;
  // Update objects
  // textGeometry.rotation.y = 0.1 * elapsedTime;

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
  // Update controls
  controls.update();

  // Render
  // renderer.render(scene, camera)
  // effect.render(scene, camera);
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
