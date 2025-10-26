// Zone creation and management
import * as THREE from "three";

export const ZONE_POSITIONS = {
  experience: { x: -20, z: -20, color: 0xff6b6b },
  skills: { x: 20, z: -20, color: 0x4ecdc4 },
  projects: { x: -20, z: 20, color: 0x45b7d1 },
  education: { x: 20, z: 20, color: 0xf9ca24 },
  contact: { x: 0, z: 0, color: 0xf0932b },
};

export function createZones(scene) {
  Object.keys(ZONE_POSITIONS).forEach((zoneName) => {
    const pos = ZONE_POSITIONS[zoneName];

    // Zone marker
    const zoneGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 8);
    const zoneMaterial = new THREE.MeshLambertMaterial({
      color: pos.color,
      transparent: true,
      opacity: 0.7,
    });
    const zone = new THREE.Mesh(zoneGeometry, zoneMaterial);
    zone.position.set(pos.x, 0.25, pos.z);
    zone.castShadow = true;
    zone.receiveShadow = true;
    zone.userData = { type: "zone", zoneName: zoneName };
    scene.add(zone);

    // Zone label
    createZoneLabel(scene, zoneName, pos.x, pos.z);

    // Zone particles
    createZoneParticles(scene, pos.x, pos.z, pos.color);
  });
}

function createZoneLabel(scene, zoneName, x, z) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 64;

  context.fillStyle = "rgba(0, 0, 0, 0.8)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  context.font = "bold 20px Arial";
  context.textAlign = "center";
  context.fillText(
    zoneName.toUpperCase(),
    canvas.width / 2,
    canvas.height / 2 + 7
  );

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.position.set(x, 3, z);
  sprite.scale.set(8, 2, 1);
  createLabelShadow(scene, x, z);
  scene.add(sprite);
}

function createLabelShadow(scene, x, z) {
  const shadowGeometry = new THREE.PlaneGeometry(6, 1.5);
  const shadowMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3,
  });
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.position.set(x, 0.01, z);
  shadow.rotation.x = -Math.PI / 2;
  shadow.castShadow = false;
  shadow.receiveShadow = true;
  scene.add(shadow);
}

function createZoneParticles(scene, x, z, color) {
  const particleCount = 50;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = x + (Math.random() - 0.5) * 10;
    positions[i + 1] = Math.random() * 5;
    positions[i + 2] = z + (Math.random() - 0.5) * 10;
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: color,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
}
