export default class BaseSearchStrategy {
  createVisitedArray(rows, cols) {
    const visited = [];
    for (let i = 0; i < rows; i++) {
      visited[i] = new Array(cols).fill(false);
    }
    return visited;
  }

  getNeighbors4(row, col) {
    return [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];
  }

  getStartTarget(grid, startRow, startCol) {
    const startCell = grid.getCell(startRow, startCol);
    if (!startCell || !startCell.element) return null;
    return { startCell, target: startCell.element };
  }

  emptyResult() {
    return { group: [], steps: [] };
  }
}
