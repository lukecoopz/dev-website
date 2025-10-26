// Environment creation (ground, zones, decorations)
import { createZones } from "./zones.js";
import { createDecorations } from "./decorations.js";

export function createEnvironment(scene) {
  // Ground
  const groundGeometry = new THREE.PlaneGeometry(500, 500);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90ee90 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.castShadow = false;
  scene.add(ground);

  // Starting dirt line
  createStartingLine(scene);

  // Interactive zones
  createZones(scene);

  // Decorative elements
  const collidableObjects = createDecorations(scene);

  // Shadow patches
  createShadowPatches(scene);

  return { collidableObjects };
}

function createStartingLine(scene) {
  const lineGeometry = new THREE.BoxGeometry(8, 0.02, 0.3);
  const lineMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
  const startingLine = new THREE.Mesh(lineGeometry, lineMaterial);
  startingLine.position.set(0, 0.01, 30);
  startingLine.receiveShadow = true;
  startingLine.castShadow = false;
  scene.add(startingLine);
}

function createShadowPatches(scene) {
  const shadowPositions = [
    { x: 0, z: 30 },
    { x: -20, z: -20 },
    { x: 20, z: -20 },
    { x: -20, z: 20 },
    { x: 20, z: 20 },
    { x: 0, z: 0 },
  ];

  shadowPositions.forEach((pos) => {
    const shadowGeometry = new THREE.CircleGeometry(4, 16);
    const shadowMaterial = new THREE.MeshLambertMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.1,
    });
    const shadowPatch = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowPatch.position.set(pos.x, 0.005, pos.z);
    shadowPatch.rotation.x = -Math.PI / 2;
    shadowPatch.castShadow = false;
    shadowPatch.receiveShadow = true;
    scene.add(shadowPatch);
  });
}
