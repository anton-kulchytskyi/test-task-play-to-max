export default class BfsStrategy {
  findGroup(grid, startRow, startCol) {
    const startCell = grid.getCell(startRow, startCol);
    if (!startCell || !startCell.element) {
      return [];
    }

    const targetElement = startCell.element;
    const group = [];
    const queue = [startCell];
    const visited = this.createVisitedArray(grid.rows, grid.cols);

    visited[startRow][startCol] = true;
    group.push(startCell);

    while (queue.length > 0) {
      const currentCell = queue.shift();
      const { row, col } = currentCell;

      const neighbors = [
        { r: row - 1, c: col },
        { r: row + 1, c: col },
        { r: row, c: col - 1 },
        { r: row, c: col + 1 },
      ];

      for (const neighborPos of neighbors) {
        const { r, c } = neighborPos;

        if (grid.isValidPosition(r, c) && !visited[r][c]) {
          const neighborCell = grid.getCell(r, c);
          if (neighborCell && neighborCell.matches(targetElement)) {
            visited[r][c] = true;
            group.push(neighborCell);
            queue.push(neighborCell);
          }
        }
      }
    }
    return group;
  }

  createVisitedArray(rows, cols) {
    const visited = [];
    for (let i = 0; i < rows; i++) {
      visited[i] = new Array(cols).fill(false);
    }
    return visited;
  }
}
