# 🛵 Interactive 3D Portfolio

An interactive 3D portfolio website where you can drive a Vespa scooter through a virtual world to explore my CV content. Built with Three.js and vanilla JavaScript.

## ✨ Features

### 🚗 Vespa Scooter Simulation

- **Realistic GLTF 3D model** with detailed animations
- **Wheel rotation** synchronized with movement speed
- **Steering animations** (handlebars and front wheel turn realistically)
- **Kickstand animation** (automatically retracts when moving, extends when stationary)
- **Exhaust smoke particles** with dynamic opacity based on movement
- **Boost mode** (toggle with Shift key for 2.5x speed)

### 📹 Dynamic Camera System

- **Mouse wheel zoom** to adjust camera distance
- **First-person mode** when zoomed in close
- **Third-person mode** with smooth camera lag when zoomed out
- **Instant camera response** in first-person, smooth follow in third-person
- **Automatic scroll disable** when modals are open

### 🗺️ Interactive CV Zones

- **4 interactive zones**: Experience, Education, Skills, and Contact
- **Modal popups** with detailed information
- **Waypoint navigation** - click map to auto-navigate to zones
- **Visit tracking** to prevent duplicate modal displays
- **Smooth animations** when navigating between zones

### 🎮 Controls & Navigation

- **WASD / Arrow Keys** - Drive the scooter
- **Shift** - Toggle boost mode
- **R** - Reset to starting position
- **Mouse Wheel** - Zoom camera in/out
- **Map Waypoints** - Click to navigate automatically

### 🌳 Environment

- **Collision detection** with boundaries and obstacles
- **Decorative trees** and scenery
- **Particle effects** for zone markers
- **Ground plane** with realistic shadows
- **Dynamic lighting** system

## 🛠️ Technologies

- **Three.js** - 3D rendering and animation
- **JavaScript (ES6 Modules)** - Clean, modular code structure
- **HTML5/CSS3** - Responsive UI design
- **GLTF/GLB** - 3D model format
- **Nx** - Development tooling and build system

## 📁 Project Structure

```
Luke-dev-website/
├── js/
│   ├── main.js                 # Entry point & animation loop
│   ├── controls/
│   │   ├── keyboard.js         # Keyboard input handling
│   │   └── navigation.js       # Waypoint navigation system
│   ├── data/
│   │   └── cvData.js           # CV content data
│   ├── objects/
│   │   ├── scooter.js          # Vespa model & animations
│   │   ├── environment.js      # Ground and environment
│   │   ├── zones.js            # Interactive CV zones
│   │   └── decorations.js      # Trees and scenery
│   ├── scene/
│   │   └── setup.js            # Three.js scene configuration
│   ├── ui/
│   │   ├── modal.js            # Modal management
│   │   └── interface.js        # UI controls
│   └── utils/
│       └── collision.js        # Collision detection
├── vespa_primavera_sprint/     # 3D Vespa model assets
├── index.html                  # Main HTML file
├── styles.css                  # Styling
└── package.json                # Dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/lukecoopz/dev-website.git
cd dev-website
```

2. Download the 3D model assets:

Go to the [latest release](https://github.com/lukecoopz/dev-website/releases/latest) and download `vespa-model.zip`, then extract it in the project root:

```bash
# The zip file should extract to create: vespa_primavera_sprint/
unzip vespa-model.zip
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm start
# or
nx serve
```

5. Open your browser to `http://localhost:4200`

## 🎮 How to Use

1. **Drive Around**: Use WASD or Arrow Keys to explore the world
2. **Find Zones**: Drive into colored zones to view CV information
3. **Use the Map**: Click waypoints on the right-side map for auto-navigation
4. **Toggle Boost**: Press Shift to go faster (or slower)
5. **Zoom Camera**: Scroll mouse wheel for different perspectives
6. **Reset**: Press R to return to the starting position

## 🙏 Acknowledgments

- **Vespa 3D Model**: [Vespa Primavera Sprint](https://sketchfab.com/3d-models/vespa-primavera-sprint-f64830bc08cb4ed396515de9b5509be4) from Sketchfab
- **Three.js**: Amazing 3D library
- **Inspiration**: Interactive portfolio websites and 3D web experiences
