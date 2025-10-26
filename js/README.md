# JavaScript Module Structure

This project uses ES6 modules to organize the code into manageable, reusable components.

## Directory Structure

```
js/
├── data/
│   └── cvData.js           # CV/resume data
├── scene/
│   └── setup.js            # Three.js scene setup and lighting
├── objects/
│   ├── scooter.js          # Vespa-style scooter creation
│   ├── environment.js      # Environment setup (ground, shadows)
│   ├── zones.js            # Interactive zones for CV sections
│   └── decorations.js      # Trees and decorative elements
├── controls/
│   ├── keyboard.js         # Keyboard input handling
│   └── navigation.js       # Waypoint navigation system
├── ui/
│   ├── modal.js            # Modal window management
│   └── interface.js        # UI setup and interactions
├── utils/
│   └── collision.js        # Collision detection utilities
└── main.js                 # Main entry point
```

## Module Descriptions

### Data Layer

- **cvData.js**: Contains all CV/resume information (experience, skills, projects, education, contact)

### Scene Layer

- **setup.js**: Initializes Three.js scene, camera, renderer, lighting, and sun

### Objects Layer

- **scooter.js**: Creates the Vespa-style scooter with raised seat
- **environment.js**: Sets up ground, starting line, and shadow patches
- **zones.js**: Creates interactive zones with labels and particle effects
- **decorations.js**: Generates trees and checks zone clearance

### Controls Layer

- **keyboard.js**: KeyboardControls class for handling WASD/Arrow key input
- **navigation.js**: Navigation class for waypoint-based movement

### UI Layer

- **modal.js**: ModalManager class for displaying CV information
- **interface.js**: UI setup for buttons, waypoints, and click handlers

### Utils Layer

- **collision.js**: CollisionDetector class for boundary, tree, and zone collision detection

### Main

- **main.js**: Application entry point that ties all modules together

## Usage

The application automatically initializes when the page loads. The main.js file imports all necessary modules and coordinates their interaction.

All modules use ES6 import/export syntax for clean dependency management.
