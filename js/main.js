// Main entry point
import { setupScene, setupWindowResize } from "./scene/setup.js";
import {
  createScooter,
  updateExhaustSmoke,
  updateWheels,
  updateSteering,
  updateKickstand,
} from "./objects/scooter.js";
import { createEnvironment } from "./objects/environment.js";
import { KeyboardControls } from "./controls/keyboard.js";
import { Navigation } from "./controls/navigation.js";
import { ModalManager } from "./ui/modal.js";
import { setupUI, hideLoadingScreen } from "./ui/interface.js";
import { CollisionDetector } from "./utils/collision.js";

// Global state
let scene, camera, renderer, scooter;
let keyboardControls, navigation, modalManager, collisionDetector;
let isLoaded = false;
let isBoosting = false; // Boost state

// Camera zoom settings
let cameraDistance = 12;
const MIN_ZOOM = 2;
const MAX_ZOOM = 12;
const ZOOM_SPEED = 0.5;

function init() {
  // Setup scene
  const sceneSetup = setupScene();
  scene = sceneSetup.scene;
  camera = sceneSetup.camera;
  renderer = sceneSetup.renderer;

  // Create environment
  const { collidableObjects } = createEnvironment(scene);

  // Create scooter
  scooter = createScooter(scene);

  // Initialize controls and managers
  keyboardControls = new KeyboardControls();
  navigation = new Navigation();
  modalManager = new ModalManager();
  collisionDetector = new CollisionDetector(
    scooter,
    collidableObjects,
    modalManager,
    navigation
  );

  // Setup UI
  setupUI(navigation, modalManager, scooter, scene, camera);

  // Setup window resize handler
  setupWindowResize(camera, renderer);

  // Setup mouse wheel zoom
  setupMouseWheelZoom();

  // Hide loading screen
  hideLoadingScreen();
  setTimeout(() => {
    isLoaded = true;
  }, 3500);

  // Start animation loop
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (isLoaded) {
    updateScooterMovement();
    updateCamera();
    collisionDetector.checkBoundaries(navigation.isNavigating);
    collisionDetector.checkTreeCollisions(navigation.isNavigating);
    collisionDetector.checkZoneCollision();
  }

  renderer.render(scene, camera);
}

function updateScooterMovement() {
  const baseSpeed = 0.1;
  const boostMultiplier = 2.5;
  const speed = isBoosting ? baseSpeed * boostMultiplier : baseSpeed;
  const rotationSpeed = 0.02;
  let isMoving = false;
  let movementSpeed = 0;
  let steerAngle = 0;

  // Toggle boost with Shift key
  if (
    keyboardControls.isKeyPressed("ShiftLeft") ||
    keyboardControls.isKeyPressed("ShiftRight")
  ) {
    if (!keyboardControls.shiftWasPressed) {
      isBoosting = !isBoosting;
      keyboardControls.shiftWasPressed = true;
    }
  } else {
    keyboardControls.shiftWasPressed = false;
  }

  if (
    keyboardControls.isKeyPressed("KeyW") ||
    keyboardControls.isKeyPressed("ArrowUp")
  ) {
    scooter.position.x -= Math.sin(scooter.rotation.y) * speed;
    scooter.position.z -= Math.cos(scooter.rotation.y) * speed;
    isMoving = true;
    movementSpeed = speed;
  }
  if (
    keyboardControls.isKeyPressed("KeyS") ||
    keyboardControls.isKeyPressed("ArrowDown")
  ) {
    scooter.position.x += Math.sin(scooter.rotation.y) * speed;
    scooter.position.z += Math.cos(scooter.rotation.y) * speed;
    isMoving = true;
    movementSpeed = -speed; // Negative for reverse
  }
  if (
    keyboardControls.isKeyPressed("KeyA") ||
    keyboardControls.isKeyPressed("ArrowLeft")
  ) {
    scooter.rotation.y += rotationSpeed;
    steerAngle = -1;
  }
  if (
    keyboardControls.isKeyPressed("KeyD") ||
    keyboardControls.isKeyPressed("ArrowRight")
  ) {
    scooter.rotation.y -= rotationSpeed;
    steerAngle = 1;
  }

  if (keyboardControls.isKeyPressed("KeyR")) {
    navigation.resetScooter(scooter, modalManager);
    isBoosting = false;
  }

  // Keep scooter on ground
  scooter.position.y = 0.4;

  // Update wheels, steering, exhaust smoke, and kickstand
  updateWheels(scooter, movementSpeed);
  updateSteering(scooter, steerAngle);
  updateExhaustSmoke(scooter, isMoving);
  updateKickstand(scooter, isMoving);
}

function updateCamera() {
  const minHeight = 1.5;
  const maxHeight = 8;
  const heightRatio = (cameraDistance - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);
  const cameraHeight = minHeight + (maxHeight - minHeight) * heightRatio;

  const minZOffset = 0.5;
  const maxZOffset = 12;
  const zOffset = minZOffset + (maxZOffset - minZOffset) * heightRatio;

  const cameraOffset = new THREE.Vector3(0, cameraHeight, zOffset);
  cameraOffset.applyQuaternion(scooter.quaternion);

  const lerpFactor = cameraDistance < 4 ? 1.0 : 0.1;
  camera.position.lerp(scooter.position.clone().add(cameraOffset), lerpFactor);

  const lookAtDistance = cameraDistance < 4 ? -10 : 0;
  const lookAtHeight = cameraDistance < 4 ? 1.5 : 0;
  const lookAtOffset = new THREE.Vector3(0, lookAtHeight, lookAtDistance);
  lookAtOffset.applyQuaternion(scooter.quaternion);
  const lookAtPoint = scooter.position.clone().add(lookAtOffset);
  camera.lookAt(lookAtPoint);
}

// Setup mouse wheel zoom controls
function setupMouseWheelZoom() {
  window.addEventListener(
    "wheel",
    (event) => {
      if (modalManager && modalManager.isModalOpen()) {
        return;
      }

      event.preventDefault();

      if (event.deltaY < 0) {
        cameraDistance = Math.max(MIN_ZOOM, cameraDistance - ZOOM_SPEED);
      } else {
        cameraDistance = Math.min(MAX_ZOOM, cameraDistance + ZOOM_SPEED);
      }
    },
    { passive: false }
  );
}

// Start the application
init();
