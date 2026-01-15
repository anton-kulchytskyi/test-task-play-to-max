import Grid from './core/Grid.js';
import DfsStrategy from './core/algorithms/DfsStrategy.js';
import BfsStrategy from './core/algorithms/BfsStrategy.js';

const strategies = {
  DFS: DfsStrategy,
  BFS: BfsStrategy,
};

const gridElement = document.getElementById('gameGrid');
let grid = new Grid(gridElement, 10, 10);
let currentStrategyName = 'DFS';
let groupFinder = new strategies[currentStrategyName]();
let currentGroup = [];

let totalRemoved = 0;

updateGridSizeDisplay();

gridElement.addEventListener('click', handleGridClick);

document.getElementById('newGridBtn').addEventListener('click', createNewGrid);
document.getElementById('clearBtn').addEventListener('click', clearSelection);
document
  .getElementById('algorithmSelector')
  .addEventListener('change', selectAlgorithm);

function handleGridClick(e) {
  const cellElement = e.target.closest('.cell');
  if (!cellElement) return;

  const row = parseInt(cellElement.dataset.row);
  const col = parseInt(cellElement.dataset.col);
  const cell = grid.getCell(row, col);

  if (!cell || !cell.element) {
    clearSelection();
    return;
  }

  currentGroup = groupFinder.findGroup(grid, row, col);

  if (currentGroup.length === 0) return;

  grid.highlightGroup(currentGroup);

  updateInfoPanel(row, col, cell.element, currentGroup.length);

  setTimeout(() => {
    grid.removeGroup(currentGroup);
    totalRemoved += currentGroup.length;

    document.getElementById('removedCount').textContent = totalRemoved;

    currentGroup = [];
  }, 500);
}

function createNewGrid() {
  grid = new Grid(gridElement, 10, 10);
  groupFinder = new strategies[currentStrategyName]();
  currentGroup = [];
  totalRemoved = 0;

  updateGridSizeDisplay();
  clearInfoPanel();
  document.getElementById('removedCount').textContent = '0';
}

function clearSelection() {
  grid.clearHighlights();
  currentGroup = [];
  clearInfoPanel();
}

function selectAlgorithm(e) {
  currentStrategyName = e.target.value;
  groupFinder = new strategies[currentStrategyName]();
  document.getElementById(
    'algorithm-info'
  ).textContent = ` ${currentStrategyName}`;
  createNewGrid();
}

function updateInfoPanel(row, col, element, groupSize) {
  document.getElementById(
    'selectedCell'
  ).textContent = `[${row}, ${col}] = ${element}`;
  document.getElementById('groupSize').textContent = groupSize;
}

function clearInfoPanel() {
  document.getElementById('selectedCell').textContent = '-';
  document.getElementById('groupSize').textContent = '0';
}

function updateGridSizeDisplay() {
  document.getElementById('gridSize').textContent = `${grid.rows}×${grid.cols}`;
}
