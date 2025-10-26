// Scooter creation using GLTF model
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function createScooter(scene, onLoadComplete) {
  const scooter = new THREE.Group();

  // Position scooter at starting point (set Y to 0 initially)
  scooter.position.set(0, 0, 30);
  scooter.rotation.y = 0;

  // Store wheels for rotation animation
  scooter.wheels = [];
  scooter.frontWheel = null;
  scooter.handlebars = null;
  scooter.steering = null; // Steering column
  scooter.kickstand = null; // Kickstand for animation

  scene.add(scooter);

  // Create exhaust smoke particle system
  createExhaustSmoke(scooter);

  // Load GLTF model
  const loader = new GLTFLoader();

  loader.load(
    "vespa_primavera_sprint/scene.gltf",
    (gltf) => {
      const model = gltf.scene;

      // Apply scale and rotation FIRST
      model.scale.set(1.5, 1.5, 1.5);
      model.rotation.y = Math.PI / 2; // Rotate 90 degrees

      // Center the model horizontally
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      model.position.x = -center.x;
      model.position.z = -center.z;
      model.position.y = -0.4;

      // Enable shadows and detect animatable parts
      let wheelRear = null;
      let wheelFront = null;

      model.traverse((child) => {
        if (child.isMesh || child.isObject3D) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }

          const name = child.name.toLowerCase();

          // Detect wheels
          if (name === "wheel rear" || name === "wheel_rear_30") {
            wheelRear = child;
          }

          if (name.startsWith("bone_") && !wheelFront) {
            let hasWheelChild = false;
            child.traverse((c) => {
              if (c.name.toLowerCase().includes("wheel front")) {
                hasWheelChild = true;
              }
            });
            if (hasWheelChild) {
              wheelFront = child;
            }
          }

          // Detect handlebars
          if (name.includes("handle") && !scooter.handlebars) {
            let handleGroup = child.parent;
            while (
              handleGroup &&
              !handleGroup.name.toLowerCase().includes("handle")
            ) {
              handleGroup = handleGroup.parent;
            }
            scooter.handlebars = handleGroup || child.parent || child;
          }

          // Detect steering column
          if (name.includes("steering") && !scooter.steering) {
            scooter.steering = child;
          }

          // Detect kickstand
          if (
            (name.includes("leg_1") || name.includes("rear_leg")) &&
            !scooter.kickstand
          ) {
            scooter.kickstand = child;
          }
        }
      });

      // Assign found wheels
      if (wheelRear) scooter.wheels.push(wheelRear);
      if (wheelFront) {
        scooter.wheels.push(wheelFront);
        scooter.frontWheel = wheelFront;
      }

      scooter.add(model);

      if (onLoadComplete) {
        onLoadComplete();
      }
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Loading Vespa: ${percent.toFixed(0)}%`);
    },
    (error) => {
      console.error("Error loading Vespa model:", error);
      if (onLoadComplete) {
        onLoadComplete();
      }
    }
  );

  return scooter;
}

// Create exhaust smoke particle system
function createExhaustSmoke(scooter) {
  const particleCount = 50;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  const ages = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
    velocities.push(new THREE.Vector3(0, 0, 0));
    ages.push(Math.random() * 100);
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Create circular texture for round particles
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const smokeTexture = new THREE.CanvasTexture(canvas);

  const smokeMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 0.15,
    map: smokeTexture,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const smokeSystem = new THREE.Points(particles, smokeMaterial);
  smokeSystem.position.set(0.25, -0.1, 1);
  scooter.add(smokeSystem);

  scooter.smokeSystem = {
    particles: smokeSystem,
    velocities: velocities,
    ages: ages,
    particleCount: particleCount,
  };
}

// Update exhaust smoke particles
export function updateExhaustSmoke(scooter, isMoving) {
  if (!scooter.smokeSystem) return;

  const { particles, velocities, ages, particleCount } = scooter.smokeSystem;
  const positions = particles.geometry.attributes.position.array;

  for (let i = 0; i < particleCount; i++) {
    ages[i] += isMoving ? 2 : 3.0;

    if (ages[i] > 100) {
      ages[i] = 0;
      positions[i * 3] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      velocities[i].set(
        (Math.random() - 0.5) * 0.01,
        0.01 + Math.random() * 0.01,
        0.05 + Math.random() * 0.03
      );
    }

    positions[i * 3] += velocities[i].x;
    positions[i * 3 + 1] += velocities[i].y;
    positions[i * 3 + 2] += velocities[i].z;

    velocities[i].x += (Math.random() - 0.5) * 0.001;
    velocities[i].z += (Math.random() - 0.5) * 0.001;
  }

  particles.geometry.attributes.position.needsUpdate = true;

  const targetOpacity = isMoving ? 0.6 : 0.2;
  particles.material.opacity +=
    (targetOpacity - particles.material.opacity) * 0.1;
}

// Rotate wheels based on movement
export function updateWheels(scooter, speed) {
  if (!scooter.wheels || scooter.wheels.length === 0) return;

  const rotationSpeed = speed * 0.5;

  scooter.wheels.forEach((wheelGroup) => {
    wheelGroup.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotationSpeed);
  });
}

// Update handlebar and front wheel steering
export function updateSteering(scooter, steerAngle) {
  const maxSteerAngle = Math.PI / 6;
  const targetAngle = -steerAngle * maxSteerAngle;
  const lerpFactor = 0.15;

  if (scooter.steering) {
    if (!scooter.steering.currentRotation) {
      scooter.steering.currentRotation = 0;
    }
    scooter.steering.currentRotation +=
      (targetAngle - scooter.steering.currentRotation) * lerpFactor;
    scooter.steering.rotation.y = scooter.steering.currentRotation;
  }

  if (scooter.handlebars) {
    if (!scooter.handlebars.currentRotation) {
      scooter.handlebars.currentRotation = 0;
    }
    scooter.handlebars.currentRotation +=
      (targetAngle - scooter.handlebars.currentRotation) * lerpFactor;
    scooter.handlebars.rotation.y = scooter.handlebars.currentRotation;
  }

  if (scooter.frontWheel) {
    if (!scooter.frontWheel.currentRotation) {
      scooter.frontWheel.currentRotation = 0;
    }
    scooter.frontWheel.currentRotation +=
      (targetAngle - scooter.frontWheel.currentRotation) * lerpFactor;
    scooter.frontWheel.rotation.y = scooter.frontWheel.currentRotation;
  }
}

// Update kickstand position based on movement
export function updateKickstand(scooter, isMoving) {
  if (!scooter.kickstand) return;

  const downAngle = 0;
  const upAngle = Math.PI / 3;
  const targetAngle = isMoving ? upAngle : downAngle;

  if (scooter.kickstand.currentRotation === undefined) {
    scooter.kickstand.currentRotation = downAngle;
  }

  const lerpFactor = 0.05;
  scooter.kickstand.currentRotation +=
    (targetAngle - scooter.kickstand.currentRotation) * lerpFactor;

  scooter.kickstand.rotation.z = scooter.kickstand.currentRotation;
}
