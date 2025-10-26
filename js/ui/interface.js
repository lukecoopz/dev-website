// UI interface setup
export function setupUI(navigation, modalManager, scooter, scene, camera) {
  // Start button
  document.getElementById("start-button")?.addEventListener("click", () => {
    document.getElementById("instructions").style.display = "none";
  });

  // Waypoint navigation
  document.querySelectorAll(".waypoint").forEach((waypoint) => {
    waypoint.addEventListener("click", () => {
      const zone = waypoint.dataset.zone;
      navigation.navigateToZone(zone, scooter);
    });
  });

  // Click on zones
  document.getElementById("canvas")?.addEventListener("click", (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.userData && object.userData.type === "zone") {
        modalManager.showZoneInfo(object.userData.zoneName);
      }
    }
  });
}

export function hideLoadingScreen() {
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  }, 3000);
}
