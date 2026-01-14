import Grid from './core/Grid.js';
import DFSGroupFinder from './core/algorithms/DFS.js';

const gridElement = document.getElementById('gameGrid');
let grid = new Grid(gridElement, 10, 10);
let groupFinder = new DFSGroupFinder(grid);
let currentGroup = [];






let totalRemoved = 0;

updateGridSizeDisplay();

gridElement.addEventListener('click', handleGridClick);

document.getElementById('newGridBtn').addEventListener('click', createNewGrid);
document.getElementById('clearBtn').addEventListener('click', clearSelection);

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

  currentGroup = groupFinder.findConnectedGroup(row, col);

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
  groupFinder = new DFSGroupFinder(grid);
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
