// Collision detection utilities
export class CollisionDetector {
  constructor(scooter, collidableObjects, modalManager, navigation) {
    this.scooter = scooter;
    this.collidableObjects = collidableObjects;
    this.modalManager = modalManager;
    this.navigation = navigation;
  }

  checkBoundaries(isNavigating) {
    if (isNavigating) return;

    const boundary = 50;

    // X boundaries
    if (this.scooter.position.x > boundary) {
      this.scooter.position.x = boundary;
    }
    if (this.scooter.position.x < -boundary) {
      this.scooter.position.x = -boundary;
    }

    // Z boundaries
    if (this.scooter.position.z > boundary) {
      this.scooter.position.z = boundary;
    }
    if (this.scooter.position.z < -boundary) {
      this.scooter.position.z = -boundary;
    }
  }

  checkTreeCollisions(isNavigating) {
    if (isNavigating) return;

    const scooterRadius = 1.5;

    this.collidableObjects.forEach((tree) => {
      const distance = Math.sqrt(
        Math.pow(this.scooter.position.x - tree.position.x, 2) +
          Math.pow(this.scooter.position.z - tree.position.z, 2)
      );

      const treeRadius = 2;

      if (distance < scooterRadius + treeRadius) {
        const angle = Math.atan2(
          this.scooter.position.z - tree.position.z,
          this.scooter.position.x - tree.position.x
        );
        const pushDistance = scooterRadius + treeRadius - distance + 0.1;

        this.scooter.position.x += Math.cos(angle) * pushDistance;
        this.scooter.position.z += Math.sin(angle) * pushDistance;
      }
    });
  }

  checkZoneCollision() {
    const zonePositions = {
      experience: { x: -20, z: -20, radius: 3 },
      skills: { x: 20, z: -20, radius: 3 },
      projects: { x: -20, z: 20, radius: 3 },
      education: { x: 20, z: 20, radius: 3 },
      contact: { x: 0, z: 0, radius: 3 },
    };

    const scooterPos = this.scooter.position;
    const isNavigating = this.navigation.isNavigating;
    const targetZone = this.navigation.getTargetZone();

    Object.keys(zonePositions).forEach((zoneName) => {
      const zone = zonePositions[zoneName];
      const distance = Math.sqrt(
        Math.pow(scooterPos.x - zone.x, 2) + Math.pow(scooterPos.z - zone.z, 2)
      );

      if (distance <= zone.radius) {
        if (this.modalManager.getCurrentZone() !== zoneName) {
          this.modalManager.setCurrentZone(zoneName);

          // Update active waypoint
          document.querySelectorAll(".waypoint").forEach((wp) => {
            wp.classList.remove("active");
          });
          document
            .querySelector(`[data-zone="${zoneName}"]`)
            ?.classList.add("active");

          // Show modal only if:
          // 1. Not currently navigating via waypoint, OR
          // 2. Navigating AND this is the target zone
          // 3. Modal is not already open
          // 4. Haven't visited this zone yet
          const shouldShowModal =
            (!isNavigating || zoneName === targetZone) &&
            !this.modalManager.isModalOpen() &&
            !this.modalManager.hasVisitedZone(zoneName);

          if (shouldShowModal) {
            this.modalManager.showZoneInfo(zoneName);
          }
        }
      } else {
        // Left the zone
        this.modalManager.clearCurrentZone(zoneName);
      }
    });
  }
}
