import Grid from '../game/Grid.js';

export default class Game {
  constructor(gridElement, strategies, initialRows = 10, initialCols = 10) {
    this.gridElement = gridElement;
    this.strategies = strategies;
    this.currentStrategyName = 'DFS';
    this.currentGroup = [];
    this.totalRemoved = 0;

    this.totalSearchMs = 0;
    this.lastSearchMs = null;
    this.lastGroupSize = null;
    this.lastResults = [];
    this.sessionFinished = false;

    this.init(initialRows, initialCols);
    this.setupEventListeners();
  }

  async init(rows, cols) {
    this.grid = new Grid(this.gridElement, rows, cols);
    this.groupFinder = new this.strategies[this.currentStrategyName]();
    this.setupGridSizeSelects(rows, cols);

    this.grid.clearHighlights();

    this.totalSearchMs = 0;
    this.lastSearchMs = null;
    this.lastGroupSize = null;
    this.renderMetrics();

    this.sessionFinished = false;

    if (typeof this.groupFinder.buildConnections === 'function') {
      this.isIndexing = true;

      const t0 = performance.now();
      const { steps } = this.groupFinder.buildConnections(this.grid, {
        collectSteps: true,
      });
      const indexMs = performance.now() - t0;

      this.totalSearchMs += indexMs;
      this.renderMetrics();

      for (const step of steps) {
        if (step.type === 'visit') step.cell?.markVisited();
        await this.delay(2);
      }

      this.grid.clearHighlights();
      this.isIndexing = false;
    }
  }

  setupEventListeners() {
    this.gridElement.addEventListener('click', (e) => this.handleGridClick(e));

    document
      .getElementById('newGridBtn')
      .addEventListener('click', () => this.createNewGrid());

    document
      .getElementById('algorithmSelector')
      .addEventListener('change', (e) => this.selectAlgorithm(e));

    document
      .getElementById('gridRowsSelect')
      .addEventListener('change', () => this.changeGridSize());

    document
      .getElementById('gridColsSelect')
      .addEventListener('change', () => this.changeGridSize());
  }

  setupGridSizeSelects(initialRows, initialCols) {
    const rowsSelect = document.getElementById('gridRowsSelect');
    const colsSelect = document.getElementById('gridColsSelect');
    if (!rowsSelect || !colsSelect) return;

    const options = [];
    for (let v = 5; v <= 45; v += 5) options.push(v);

    rowsSelect.innerHTML = options
      .map((v) => `<option value="${v}">${v}</option>`)
      .join('');
    colsSelect.innerHTML = options
      .map((v) => `<option value="${v}">${v}</option>`)
      .join('');

    rowsSelect.value = String(initialRows);
    colsSelect.value = String(initialCols);
  }

  async handleGridClick(e) {
    if (this.isIndexing) return;
    const cellElement = e.target.closest('.cell');
    if (!cellElement) return;

    const row = parseInt(cellElement.dataset.row);
    const col = parseInt(cellElement.dataset.col);
    const cell = this.grid.getCell(row, col);

    if (!cell || !cell.element) {
      return;
    }

    this.grid.clearHighlights();

    const t0 = performance.now();
    const { group, steps } = this.groupFinder.findGroup(this.grid, row, col);
    const findMs = performance.now() - t0;

    if (group.length === 0) return;

    this.lastSearchMs = findMs;
    this.lastGroupSize = group.length;
    this.totalSearchMs += findMs;
    this.renderMetrics();

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
    this.currentGroup = [];

    if (!this.sessionFinished && this.isGridEmpty()) {
      this.sessionFinished = true;

      this.pushResult({
        algorithm: this.currentStrategyName,
        gridSize: `${this.grid.rows}×${this.grid.cols}`,
        totalSearchMs: this.totalSearchMs,
        lastGroupSize: group.length,
      });
    }
  }

  createNewGrid() {
    const rows = this.grid.rows;
    const cols = this.grid.cols;
    this.currentGroup = [];
    this.totalRemoved = 0;

    this.init(rows, cols);
  }

  selectAlgorithm(e) {
    this.currentStrategyName = e.target.value;
    this.groupFinder = new this.strategies[this.currentStrategyName]();
    this.createNewGrid();
  }

  renderMetrics() {
    const totalEl = document.getElementById('totalSearchTime');
    const lastEl = document.getElementById('lastSearchTime');
    const sizeEl = document.getElementById('lastGroupSize');

    if (totalEl) {
      totalEl.textContent =
        this.totalSearchMs > 0 ? `${this.totalSearchMs.toFixed(3)} ms` : '-';
    }
    if (lastEl) {
      lastEl.textContent =
        this.lastSearchMs != null ? `${this.lastSearchMs.toFixed(3)} ms` : '-';
    }
    if (sizeEl) {
      sizeEl.textContent =
        this.lastGroupSize != null ? String(this.lastGroupSize) : '-';
    }
  }

  changeGridSize() {
    const rows = parseInt(document.getElementById('gridRowsSelect').value);
    const cols = parseInt(document.getElementById('gridColsSelect').value);

    this.currentGroup = [];
    this.totalRemoved = 0;

    this.init(rows, cols);
  }

  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  pushResult({ algorithm, gridSize, totalSearchMs, lastGroupSize }) {
    this.lastResults.unshift({
      at: Date.now(),
      algorithm,
      gridSize,
      totalSearchMs,
      lastGroupSize,
    });
    this.lastResults = this.lastResults.slice(0, 5);
    this.renderResultsTable();
  }

  renderResultsTable() {
    const body = document.getElementById('resultsBody');
    if (!body) return;

    if (this.lastResults.length === 0) {
      body.innerHTML = `<tr><td colspan="5" class="muted">No results yet</td></tr>`;
      return;
    }

    body.innerHTML = this.lastResults
      .map((r, idx) => {
        return `
        <tr>
          <td>${idx + 1}</td>
          <td>${r.algorithm}</td>
          <td>${r.gridSize}</td>
          <td>${r.totalSearchMs.toFixed(3)} ms</td>
          <td>${r.lastGroupSize ?? '-'}</td>
        </tr>
      `;
      })
      .join('');
  }

  isGridEmpty() {
    for (let r = 0; r < this.grid.rows; r++) {
      for (let c = 0; c < this.grid.cols; c++) {
        const cell = this.grid.getCell(r, c);
        if (cell && cell.element) return false;
      }
    }
    return true;
  }
}
