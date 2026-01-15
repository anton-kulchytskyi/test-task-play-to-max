import Game from './game/Game.js';
import DfsStrategy from './core/algorithms/DfsStrategy.js';
import BfsStrategy from './core/algorithms/BfsStrategy.js';

const strategies = {
  DFS: DfsStrategy,
  BFS: BfsStrategy,
};

const gridElement = document.getElementById('gameGrid');
new Game(gridElement, strategies, 10, 10);
