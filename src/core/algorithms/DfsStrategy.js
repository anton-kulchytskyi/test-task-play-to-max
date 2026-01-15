export default class DfsStrategy {
  findGroup(grid, startRow, startCol) {
    const startCell = grid.getCell(startRow, startCol);
    if (!startCell || !startCell.element) {
      return [];
    }
    const visited = this.createVisitedArray(grid.rows, grid.cols);
    const group = [];

    this.dfs(grid, startRow, startCol, startCell.element, visited, group);

    return group;
  }

  dfs(grid, row, col, targetElement, visited, group) {
    if (!grid.isValidPosition(row, col) || visited[row][col]) {
      return;
    }

    const cell = grid.getCell(row, col);
    if (!cell || !cell.element || !cell.matches(targetElement)) {
      return;
    }

    visited[row][col] = true;
    group.push(cell);

    this.dfs(grid, row - 1, col, targetElement, visited, group);
    this.dfs(grid, row + 1, col, targetElement, visited, group);
    this.dfs(grid, row, col - 1, targetElement, visited, group);
    this.dfs(grid, row, col + 1, targetElement, visited, group);
  }

  createVisitedArray(rows, cols) {
    const visited = [];
    for (let i = 0; i < rows; i++) {
      visited[i] = new Array(cols).fill(false);
    }
    return visited;
  }
}
