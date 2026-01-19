import Grid from '../game/Grid.js';

import MetricsTracker from './MetricsTracker.js';
import ResultsStore from './ResultsStore.js';
import Animator from './Animator.js';
import UI from './UI.js';
import GameController from './GameController.js';

export default class Game {
  constructor(gridElement, strategies, initialRows = 10, initialCols = 10) {
    this.gridElement = gridElement;
    this.strategies = strategies;

    this.ui = new UI(gridElement);
    this.metrics = new MetricsTracker();
    this.results = new ResultsStore(5);

    this.currentStrategyName = this.ui.getSelectedAlgorithm();

    this.animator = new Animator({
      getEnabled: () => this.ui.isVisualizationEnabled(),
    });

    this.controller = null;

    this.ui.bind({
      onCellClick: ({ row, col }) => this.handleGridClick(row, col),
      onNewGrid: () => this.createNewGrid(),
      onAlgorithmChange: (name) => this.selectAlgorithm(name),
      onGridSizeChange: ({ rows, cols }) => this.changeGridSize(rows, cols),
    });

    this.init(initialRows, initialCols);
  }

  async init(rows, cols) {
    this.ui.renderResults(this.results.list());

    this.metrics.reset();
    this.ui.renderMetrics(this.metrics.getViewModel());

    this.grid = new Grid(this.gridElement, rows, cols);
    this.groupFinder = new this.strategies[this.currentStrategyName]();

    if (this.controller) {
      this.controller.reset(this.grid, this.groupFinder);
    } else {
      this.controller = new GameController(this.grid, this.groupFinder);
    }

    this.ui.setupGridSizeSelects(rows, cols);

    this.grid.clearHighlights();

    if (typeof this.groupFinder.buildConnections === 'function') {
      this.isIndexing = true;

      const t0 = performance.now();
      const { steps } = this.groupFinder.buildConnections(this.grid, {
        collectSteps: true,
      });
      const indexMs = performance.now() - t0;

      this.metrics.addIndexBuild(indexMs);
      this.ui.renderMetrics(this.metrics.getViewModel());

      await this.animator.playIndexSteps(steps, {
        visitDelay: 2,
        afterDelay: 0,
      });

      this.grid.clearHighlights();
      this.isIndexing = false;
    }
  }

  async handleGridClick(row, col) {
    if (this.isIndexing) return;

    const result = this.controller.clickCell(row, col);
    if (!result) return;

    this.metrics.addSearch(result.findMs, result.groupSize);
    this.ui.renderMetrics(this.metrics.getViewModel());

    await this.animator.playSteps(result.steps, {
      visitDelay: 20,
      afterDelay: 250,
    });

    this.controller.applyRemoval(result.group);

    if (this.controller.finishSessionIfEmpty()) {
      this.results.push({
        algorithm: this.currentStrategyName,
        gridSize: `${this.grid.rows}×${this.grid.cols}`,
        totalSearchMs: this.metrics.getTotalMs(),
      });

      this.ui.renderResults(this.results.list());
    }
  }

  createNewGrid() {
    const { rows, cols } = this.ui.getGridSize();
    this.init(rows, cols);
  }

  selectAlgorithm(strategyName) {
    this.currentStrategyName = strategyName;
    this.createNewGrid();
  }

  changeGridSize(rows, cols) {
    this.init(rows, cols);
  }
}
