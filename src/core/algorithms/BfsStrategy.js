export default class BfsStrategy {
  findGroup(grid, startRow, startCol) {
    const startCell = grid.getCell(startRow, startCol);
    if (!startCell || !startCell.element) return { group: [], steps: [] };

    const target = startCell.element;
    const visited = this.createVisitedArray(grid.rows, grid.cols);
    const queue = [{ row: startRow, col: startCol }];
    const group = [];
    const steps = [];

    visited[startRow][startCol] = true;

    while (queue.length > 0) {
      const { row, col } = queue.shift();
      const cell = grid.getCell(row, col);

      steps.push({ type: 'visit', cell });

      if (!cell || !cell.element || !cell.matches(target)) continue;

      group.push(cell);
      steps.push({ type: 'add', cell });

      const neighbors = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 },
      ];

      for (const n of neighbors) {
        if (grid.isValidPosition(n.row, n.col) && !visited[n.row][n.col]) {
          visited[n.row][n.col] = true;
          queue.push(n);
        }
      }
    }

    return { group, steps };
  }

  createVisitedArray(rows, cols) {
    const visited = [];
    for (let i = 0; i < rows; i++) {
      visited[i] = new Array(cols).fill(false);
    }
    return visited;
  }
}
