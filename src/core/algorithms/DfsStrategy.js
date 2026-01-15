export default class DfsStrategy {
  findGroup(grid, startRow, startCol) {
    const startCell = grid.getCell(startRow, startCol);
    if (!startCell || !startCell.element) return { group: [], steps: [] };

    const visited = this.createVisitedArray(grid.rows, grid.cols);
    const group = [];
    const steps = [];
    const target = startCell.element;

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

    this.dfs(grid, row - 1, col, target, visited, group, steps);
    this.dfs(grid, row + 1, col, target, visited, group, steps);
    this.dfs(grid, row, col - 1, target, visited, group, steps);
    this.dfs(grid, row, col + 1, target, visited, group, steps);
  }

  createVisitedArray(rows, cols) {
    const visited = [];
    for (let i = 0; i < rows; i++) {
      visited[i] = new Array(cols).fill(false);
    }
    return visited;
  }
}
