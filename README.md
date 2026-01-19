# Match-3 Group Finder

Interactive algorithm visualizer for finding connected groups in a grid.

## Live Demo

**[Try it here](https://anton-kulchytskyi.github.io/test-task-play-to-max/)**

## Problem Statement

Given a grid where each cell contains an element, find all cells connected to a clicked cell that contain the same element (4-directional connectivity).

When you click a cell, the entire connected group gets removed.

## Features

- Three search algorithms (DFS, BFS, Union-Find)
- Real-time visualization with animation
- Performance metrics tracking
- Adjustable grid size
- Results history

## Project Structure

```
src/
├── main.js                      # Entry point
│
├── core/algorithms/
│   ├── BaseSearchStrategy.js    # Shared logic for all algorithms
│   ├── DfsStrategy.js           # Depth-First Search
│   ├── BfsStrategy.js           # Breadth-First Search
│   └── UnionFindStrategy.js     # Union-Find algorithm
│
└── game/
    ├── Cell.js                  # Single cell
    ├── Grid.js                  # Grid management
    ├── Game.js                  # Main game coordinator
    ├── GameController.js        # Game logic
    ├── UI.js                    # DOM interactions
    ├── Animator.js              # Animations
    ├── MetricsTracker.js        # Performance tracking
    └── ResultsStore.js          # Results storage
```

## Algorithms

### Depth-First Search (DFS)

Goes deep into one direction before backtracking. Uses recursion.

**Complexity:** O(n) time, O(n) space  
**Good for:** Small to medium grids, simple implementation

### Breadth-First Search (BFS)

Explores level by level using a queue.

**Complexity:** O(n) time, O(n) space  
**Good for:** When you need level-by-level traversal

### Union-Find

Pre-builds the entire group structure, then answers queries instantly.

**Complexity:** O(n) build, ~O(1) query  
**Good for:** Multiple searches on the same grid

**Note:** For grids up to 45×45, all three perform similarly (< 1.5ms). The real difference is visible in the animation patterns.

## Visualization

The checkbox "Animate search" shows how each algorithm explores the grid:

- **DFS**: Snake-like pattern (goes deep first)
- **BFS**: Ripple pattern (expands in waves)
- **Union-Find**: Horizontal scan during build phase

Each cell gets highlighted as it's being visited, then turns yellow when added to the group.

## How to Run

### Quick Start

Open `index.html` in your browser.

### Development Server

```bash
npm run dev
```

Then open http://localhost:8000

### VS Code

Use Live Server extension.

## How to Use

1. Choose grid size and algorithm
2. Click any cell to find its group
3. Watch the animation (if enabled)
4. Check the metrics and results table
5. Click "New Grid" to start over

## Technologies

- Vanilla JavaScript (ES6 modules)
- CSS Grid
- No frameworks or build tools
