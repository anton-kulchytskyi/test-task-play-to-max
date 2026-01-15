import Grid from '../game/Grid.js';
export default class Game {
  constructor(gridElement, strategies, initialRows = 10, initialCols = 10) {
    this.gridElement = gridElement;
    this.strategies = strategies;
    this.currentStrategyName = 'DFS';
    this.currentGroup = [];
    this.totalRemoved = 0;

    this.init(initialRows, initialCols);
    this.setupEventListeners();
  }

  init(rows, cols) {
    this.grid = new Grid(this.gridElement, rows, cols);
    this.groupFinder = new this.strategies[this.currentStrategyName]();
    this.updateGridSizeDisplay();
  }

  setupEventListeners() {
    this.gridElement.addEventListener('click', (e) => this.handleGridClick(e));

    document
      .getElementById('newGridBtn')
      .addEventListener('click', () => this.createNewGrid());

    document
      .getElementById('clearBtn')
      .addEventListener('click', () => this.clearSelection());

    document
      .getElementById('algorithmSelector')
      .addEventListener('change', (e) => this.selectAlgorithm(e));

    document
      .getElementById('gridRowsInput')
      .addEventListener('change', (e) => this.changeGridSize());

    document
      .getElementById('gridColsInput')
      .addEventListener('change', (e) => this.changeGridSize());
  }

  async handleGridClick(e) {
    const cellElement = e.target.closest('.cell');
    if (!cellElement) return;

    const row = parseInt(cellElement.dataset.row);
    const col = parseInt(cellElement.dataset.col);
    const cell = this.grid.getCell(row, col);

    if (!cell || !cell.element) {
      this.clearSelection();
      return;
    }

    this.grid.clearHighlights();

    const { group, steps } = this.groupFinder.findGroup(this.grid, row, col);
    if (group.length === 0) return;

    this.updateInfoPanel(row, col, cell.element, group.length);

    const stepDelay = 20;
    for (const step of steps) {
      if (!step.cell) continue;
      if (step.type === 'visit') step.cell.markVisited();
      if (step.type === 'add') step.cell.markInGroup();
      await this.delay(stepDelay);
    }

    await this.delay(250);

    this.grid.removeGroup(group);
    this.totalRemoved += group.length;
    document.getElementById('removedCount').textContent = this.totalRemoved;
    this.currentGroup = [];
  }

  createNewGrid() {
    const rows = this.grid.rows;
    const cols = this.grid.cols;
    this.currentGroup = [];
    this.totalRemoved = 0;

    this.init(rows, cols);
    this.clearInfoPanel();
    document.getElementById('removedCount').textContent = '0';
  }

  clearSelection() {
    this.grid.clearHighlights();
    this.currentGroup = [];
    this.clearInfoPanel();
  }

  selectAlgorithm(e) {
    this.currentStrategyName = e.target.value;
    this.groupFinder = new this.strategies[this.currentStrategyName]();
    document.getElementById(
      'algorithm-info'
    ).textContent = ` ${this.currentStrategyName}`;
    this.createNewGrid();
  }

  updateInfoPanel(row, col, element, groupSize) {
    document.getElementById(
      'selectedCell'
    ).textContent = `[${row}, ${col}] = ${element}`;
    document.getElementById('groupSize').textContent = groupSize;
  }

  clearInfoPanel() {
    document.getElementById('selectedCell').textContent = '-';
    document.getElementById('groupSize').textContent = '0';
  }

  updateGridSizeDisplay() {
    document.getElementById(
      'gridSize'
    ).textContent = `${this.grid.rows}×${this.grid.cols}`;
  }

  changeGridSize() {
    let rows = parseInt(document.getElementById('gridRowsInput').value);
    let cols = parseInt(document.getElementById('gridColsInput').value);

    rows = Math.max(5, Math.min(45, rows));
    cols = Math.max(5, Math.min(45, cols));

    document.getElementById('gridRowsInput').value = rows;
    document.getElementById('gridColsInput').value = cols;

    this.currentGroup = [];
    this.totalRemoved = 0;

    this.init(rows, cols);
    this.clearInfoPanel();
    document.getElementById('removedCount').textContent = '0';
  }

  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
