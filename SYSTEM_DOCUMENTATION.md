# 🐜 Ant Colony Optimization (ACO) Network Simulation: Deep Technical Manual

This document provides an exhaustive breakdown of the simulation's architecture, data connectivity, and algorithmic execution.

---

## 🏗️ 1. System Architecture: "What Powers What"

The system is built on a modern, decoupled architecture to ensure high performance during real-time calculations.

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **The Brain (Logic)** | `useACO.js` (Custom Hook) | Manages the mathematical engine, probability matrices, pheromone updates, and simulation state. |
| **The Heart (Data)** | `config.json` | The "Source of Truth." Defines the nodes, initial distances, and simulation constants ($\alpha, \beta, \rho$). |
| **The Eyes (View)** | `NetworkGraph.jsx` | A high-performance SVG visualizer that maps logical nodes to 2D coordinates and animates ant movement. |
| **The Nervous System** | `Framer Motion` | Handles all micro-animations, path transitions, and "Pheromone Glow" effects. |
| **The Dashboard** | `React 19` | Coordinates the real-time data flow between the engine and the UI components. |

---

## 🔗 2. Data Connectivity: How Nodes Connect

The network is represented as an **Unweighted Directed Graph** (mapped into a JSON structure).

### A. The Graph Model
In `src/data/config.json`, the network is defined by:
- **Nodes**: Each node has an `id` (A, B, C...) and fixed `x, y` coordinates for visualization.
- **Edges**: Each edge connects two nodes and carries:
  - `dist`: The physical weight (cost).
  - `pheromone`: The digital weight (learned importance).

### B. Logical vs. Visual Connection
When you launch the app:
1. The **Engine** reads the JSON and builds an **Adjacency Matrix** of available paths.
2. The **UI** reads the same JSON to draw `<line>` elements between the `x, y` points.
3. **Synchronization**: When a node fails (e.g., Node D), the Engine removes it from the math logic, and the UI immediately hides the corresponding SVG elements.

---

## ⚙️ 3. How the Simulation Works (Step-by-Step)

### Step 1: Launching a Scout (Forward Ant)
- **Input**: User clicks "Run Ant Wave".
- **Logic**: The engine places an ant at Node A. It looks at all connected neighbors.
- **Probability**: For each neighbor, it calculates a score based on `(Pheromone^1 * (1/Distance)^2)`.
- **Movement**: The ant "hops" to the neighbor with the highest probability. This repeats until it hits Node E.

### Step 2: Reinforcement (Backward Ant)
- **Input**: Ant reaches Node E.
- **Logic**: The engine calculates the total distance the ant traveled.
- **Deposit**: The engine iterates through every edge in that ant's path and adds pheromones: `new_pheromone = old_pheromone + (10 / total_distance)`.

### Step 3: Data Routing
- **Input**: User clicks "Send Data".
- **Logic**: Data packets are **not scouts**. They do not explore. They strictly follow the path with the **absolute highest pheromone level**.
- **PDR Calculation**: If the path is broken or loops, the packet is "Lost," and the PDR (Packet Delivery Ratio) drops.

### Step 4: The Maintenance Phase (Evaporation)
- **Input**: User clicks "Trigger Evaporation".
- **Logic**: The engine reduces every pheromone level in the network by the evaporation rate ($\rho = 0.9$).
- **Purpose**: This simulates the **decay of old information**. Without evaporation, the network would stay "locked" onto the first path it finds. Evaporation forces the system to constantly re-verify that a path is still the best one, allowing it to adapt if a shorter path is discovered later.

---

## 🔍 4. Component Breakdown: "What is What"

### 1. The Network Graph (Central Area)
- **Visualizes**: The topology.
- **Lines**: The thickness of a line represents the **Pheromone Concentration**.
- **Dots**: Animated sprites representing active Ants or Data.

### 2. Metrics Dashboard (Top Bar)
- **PDR**: Reliability of the current "Learned" path.
- **Avg Delay**: Efficiency of the current "Learned" path.
- **Overhead**: The cost of discovery (Scouts vs. Data).
- **Best Path Found**: The shortest distance discovery achieved by the Ant Wave.

### 3. Control Panel (Right Sidebar)
- **Scenarios**: Presets that modify the `config.json` data in real-time.
  - *Failure*: Deletes Node D from the internal map.
  - *Mobility*: Increases distances, causing "Pheromone Stale-ness."

### 4. System Logs (Bottom Right)
- A real-time trace of every ant's journey. Used for debugging the "Path History."

---

## 📈 5. Mathematical Proof of Adaptation
When **Node D fails**, the PDR drops to 0% initially.
1. The system "forgets" Node D through **Evaporation**.
2. New **Scouts** are sent. They find the alternate **A-C-E** path.
3. Since A-C-E is now the only path receiving **Reinforcement**, its pheromone levels skyrocket.
4. **Data Packets** follow the new blue trail, and the PDR recovers to 100%.
