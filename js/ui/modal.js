// Modal management
import { cvData } from "../data/cvData.js";

export class ModalManager {
  constructor() {
    this.modalOpen = false;
    this.currentZone = null;
    this.visitedZones = new Set();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Modal close button
    document.getElementById("close-modal")?.addEventListener("click", () => {
      this.closeModal();
    });

    // ESC key to close modal
    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        this.closeModal();
      }
    });
  }

  showZoneInfo(zoneName) {
    const modalBody = document.getElementById("modal-body");
    let content = "";

    switch (zoneName) {
      case "experience":
        content = `
          <h2>💼 Professional Experience</h2>
          ${cvData.experience
            .map(
              (exp) => `
            <div style="margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
              <h3>${exp.company} - ${exp.position}</h3>
              <p><strong>${exp.period} | ${exp.location}</strong></p>
              <p>${exp.description}</p>
            </div>
          `
            )
            .join("")}
        `;
        break;

      case "skills":
        content = `
          <h2>🛠️ Technical Skills</h2>
          <p>${cvData.skills.join(" • ")}</p>
        `;
        break;

      case "projects":
        content = `
          <h2>🚀 Personal Projects</h2>
          ${cvData.projects
            .map(
              (project) => `
            <div style="margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
              <h3>${project.name}</h3>
              <p><strong>${project.period}</strong></p>
              <p>${project.description}</p>
            </div>
          `
            )
            .join("")}
        `;
        break;

      case "education":
        content = `
          <h2>🎓 Education</h2>
          <h3>${cvData.education.institution}</h3>
          <p><strong>${cvData.education.degree}</strong></p>
          <p>Majoring in ${cvData.education.major}</p>
          <p>Graduated: ${cvData.education.graduation} | ${
          cvData.education.location
        }</p>
          
          <h3>Computer Science Coursework:</h3>
          <ul>
            ${cvData.education.coursework.computerScience
              .map((course) => `<li>${course}</li>`)
              .join("")}
          </ul>
          
          <h3>Information Systems Coursework:</h3>
          <ul>
            ${cvData.education.coursework.informationSystems
              .map((course) => `<li>${course}</li>`)
              .join("")}
          </ul>
        `;
        break;

      case "contact":
        content = `
          <h2>📞 Contact Information</h2>
          <div style="margin-bottom: 2rem;">
            <h3>Luke Cooper</h3>
            <p><strong>Email:</strong> <a href="mailto:${
              cvData.personal.email
            }" style="color: #4facfe;">${cvData.personal.email}</a></p>
            <p><strong>Phone:</strong> ${cvData.personal.phone}</p>
            <p><strong>LinkedIn:</strong> <a href="${
              cvData.personal.linkedin
            }" target="_blank" style="color: #4facfe;">${
          cvData.personal.linkedin
        }</a></p>
          </div>
          
          <h3>Professional References</h3>
          ${cvData.referees
            .map(
              (ref) => `
            <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
              <h4>${ref.name}</h4>
              <p><strong>${ref.position} at ${ref.company}</strong></p>
              <p>Phone: ${ref.phone}</p>
              <p>Email: <a href="mailto:${ref.email}" style="color: #4facfe;">${ref.email}</a></p>
            </div>
          `
            )
            .join("")}
        `;
        break;
    }

    modalBody.innerHTML = content;
    document.getElementById("modal-overlay")?.classList.remove("hidden");
    this.modalOpen = true;
    this.visitedZones.add(zoneName);
  }

  closeModal() {
    document.getElementById("modal-overlay")?.classList.add("hidden");
    this.modalOpen = false;

    // Clear active waypoint highlight when modal closes
    document.querySelectorAll(".waypoint").forEach((wp) => {
      wp.classList.remove("active");
    });
  }

  clearVisitedZones() {
    this.visitedZones.clear();
    this.currentZone = null;
  }

  isModalOpen() {
    return this.modalOpen;
  }

  hasVisitedZone(zoneName) {
    return this.visitedZones.has(zoneName);
  }

  setCurrentZone(zoneName) {
    this.currentZone = zoneName;
  }

  getCurrentZone() {
    return this.currentZone;
  }

  clearCurrentZone(zoneName) {
    if (this.currentZone === zoneName) {
      this.visitedZones.delete(zoneName);
      this.currentZone = null;
    }
  }
}
