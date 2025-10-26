// Scene setup and lighting
export function setupScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Sky blue

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 8, 42);

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  // Main directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(20, 15, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  directionalLight.shadow.bias = -0.0001;
  scene.add(directionalLight);

  // Create sun in the sky
  createSun(scene);

  return { scene, camera, renderer };
}

function createSun(scene) {
  const sunGeometry = new THREE.SphereGeometry(2, 16, 16);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffeb3b,
    emissive: 0xffeb3b,
    emissiveIntensity: 0.3,
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(20, 15, 10);
  scene.add(sun);

  // Add sun glow effect
  const glowGeometry = new THREE.SphereGeometry(3, 16, 16);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffeb3b,
    transparent: true,
    opacity: 0.2,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.set(20, 15, 10);
  scene.add(glow);
}

// Handle window resize
export function setupWindowResize(camera, renderer) {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
