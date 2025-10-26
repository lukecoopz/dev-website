// Navigation and waypoint management
import { ZONE_POSITIONS } from "../objects/zones.js";

export class Navigation {
  constructor() {
    this.isNavigating = false;
    this.targetZone = null;
  }

  navigateToZone(zoneName, scooter) {
    const pos = ZONE_POSITIONS[zoneName];
    if (pos) {
      this.targetZone = zoneName;
      this.animateToPosition(scooter, pos.x, pos.z);

      // Update active waypoint
      document.querySelectorAll(".waypoint").forEach((wp) => {
        wp.classList.remove("active");
      });
      document
        .querySelector(`[data-zone="${zoneName}"]`)
        ?.classList.add("active");
    }
  }

  animateToPosition(scooter, x, z) {
    this.isNavigating = true;

    const startX = scooter.position.x;
    const startZ = scooter.position.z;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      scooter.position.x = startX + (x - startX) * easeProgress;
      scooter.position.z = startZ + (z - startZ) * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isNavigating = false;
        this.targetZone = null;
      }
    };

    animate();
  }

  getTargetZone() {
    return this.targetZone;
  }

  resetScooter(scooter, modalManager) {
    scooter.position.set(0, 0.4, 30);
    scooter.rotation.y = 0;
    this.isNavigating = false;
    this.targetZone = null;

    if (modalManager) {
      modalManager.closeModal();
      modalManager.clearVisitedZones();
    }

    // Reset active waypoint
    document.querySelectorAll(".waypoint").forEach((wp) => {
      wp.classList.remove("active");
    });
  }
}
