// Decorative elements (trees, etc.)
import * as THREE from "three";

export function createDecorations(scene) {
  const collidableObjects = [];

  // Trees
  let treesPlaced = 0;
  let attempts = 0;
  const maxAttempts = 1000;

  while (treesPlaced < 20 && attempts < maxAttempts) {
    const x = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 80;

    if (isPositionClearOfZones(x, z)) {
      const tree = createTree();
      tree.position.set(x, 0, z);
      scene.add(tree);
      collidableObjects.push(tree);
      treesPlaced++;
    }
    attempts++;
  }

  return collidableObjects;
}

function createTree() {
  const tree = new THREE.Group();

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3);
  const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 1.5;
  trunk.castShadow = true;
  tree.add(trunk);

  // Leaves
  const leavesGeometry = new THREE.SphereGeometry(2, 8, 6);
  const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 4;
  leaves.castShadow = true;
  tree.add(leaves);

  return tree;
}

function isPositionClearOfZones(x, z) {
  const zonePositions = {
    experience: { x: -20, z: -20, radius: 8 },
    skills: { x: 20, z: -20, radius: 8 },
    projects: { x: -20, z: 20, radius: 8 },
    education: { x: 20, z: 20, radius: 8 },
    contact: { x: 0, z: 0, radius: 8 },
  };

  for (const zoneName in zonePositions) {
    const zone = zonePositions[zoneName];
    const distance = Math.sqrt(
      Math.pow(x - zone.x, 2) + Math.pow(z - zone.z, 2)
    );

    if (distance < zone.radius) {
      return false;
    }
  }

  return true;
}
