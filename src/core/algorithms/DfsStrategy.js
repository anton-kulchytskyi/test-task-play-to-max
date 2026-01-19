import BaseSearchStrategy from './BaseSearchStrategy.js';

export default class DfsStrategy extends BaseSearchStrategy {
  findGroup(grid, startRow, startCol) {
    const start = this.getStartTarget(grid, startRow, startCol);
    if (!start) return this.emptyResult();

    const { target } = start;
    const group = [];
    const steps = [];

    const visited = this.createVisitedArray(grid.rows, grid.cols);

    this.dfs(grid, startRow, startCol, target, visited, group, steps);

    return { group, steps };
  }

  dfs(grid, row, col, target, visited, group, steps) {
    if (!grid.isValidPosition(row, col) || visited[row][col]) return;

    visited[row][col] = true;

    const cell = grid.getCell(row, col);
    steps.push({ type: 'visit', cell });

    if (!cell || !cell.element || !cell.matches(target)) return;

    group.push(cell);
    steps.push({ type: 'add', cell });

    const neighbors = this.getNeighbors4(row, col);
    for (const n of neighbors) {
      this.dfs(grid, n.row, n.col, target, visited, group, steps);
    }
  }
}
