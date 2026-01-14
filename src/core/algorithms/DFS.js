export default class DFSGroupFinder {
  constructor(grid) {
    this.grid = grid;
  }

  findConnectedGroup(row, col) {
    const startCell = this.grid.getCell(row, col);
    if (!startCell || !startCell.element) {
      return [];
    }

    const visited = this.createVisitedArray();
    const group = [];
    
    this.dfs(row, col, startCell.element, visited, group);
    
    return group;
  }

  dfs(row, col, targetElement, visited, group) {
    if (!this.grid.isValidPosition(row, col)) {
      return;
    }

    if (visited[row][col]) {
      return;
    }

    const cell = this.grid.getCell(row, col);
    
    if (!cell || !cell.element) {
      return;
    }
    
    if (!cell.matches(targetElement)) {
      return;
    }

    visited[row][col] = true;
    group.push({ row, col, element: cell.element });

    this.dfs(row - 1, col, targetElement, visited, group);
    this.dfs(row + 1, col, targetElement, visited, group);
    this.dfs(row, col - 1, targetElement, visited, group);
    this.dfs(row, col + 1, targetElement, visited, group);
  }

  createVisitedArray() {
    const visited = [];
    for (let i = 0; i < this.grid.rows; i++) {
      visited[i] = new Array(this.grid.cols).fill(false);
    }
    return visited;
  }
}