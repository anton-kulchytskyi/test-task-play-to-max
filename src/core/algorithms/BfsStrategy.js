import BaseSearchStrategy from './BaseSearchStrategy.js';

export default class BfsStrategy extends BaseSearchStrategy {
  findGroup(grid, startRow, startCol) {
    const start = this.getStartTarget(grid, startRow, startCol);
    if (!start) return this.emptyResult();

    const { target } = start;
    const queue = [{ row: startRow, col: startCol }];
    const group = [];
    const steps = [];

    const visited = this.createVisitedArray(grid.rows, grid.cols);
    visited[startRow][startCol] = true;

    let head = 0;

    while (head < queue.length) {
      const { row, col } = queue[head++];
      const cell = grid.getCell(row, col);

      steps.push({ type: 'visit', cell });

      if (!cell || !cell.element || !cell.matches(target)) continue;

      group.push(cell);
      steps.push({ type: 'add', cell });

      const neighbors = this.getNeighbors4(row, col);

      for (const n of neighbors) {
        if (grid.isValidPosition(n.row, n.col) && !visited[n.row][n.col]) {
          visited[n.row][n.col] = true;
          queue.push(n);
        }
      }
    }

    return { group, steps };
  }
}
