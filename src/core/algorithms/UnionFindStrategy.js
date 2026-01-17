export default class UnionFindStrategy {
  constructor() {
    this.parent = [];
    this.size = [];
    this.groups = new Map();
    this.rows = 0;
    this.cols = 0;
  }

  getIndex(row, col) {
    return row * this.cols + col;
  }

  find(index) {
    if (this.parent[index] === index) return index;
    this.parent[index] = this.find(this.parent[index]);
    return this.parent[index];
  }

  union(indexA, indexB) {
    let rootA = this.find(indexA);
    let rootB = this.find(indexB);
    if (rootA === rootB) return false;

    if (this.size[rootA] < this.size[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }
    this.parent[rootB] = rootA;
    this.size[rootA] += this.size[rootB];
    return true;
  }

  buildConnections(grid, { collectSteps = false } = {}) {
    this.rows = grid.rows;
    this.cols = grid.cols;

    const totalCells = this.rows * this.cols;
    this.parent = Array.from({ length: totalCells }, (_, idx) => idx);
    this.size = new Array(totalCells).fill(1);
    this.groups.clear();

    const steps = collectSteps ? [] : null;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = grid.getCell(row, col);
        if (!cell || !cell.element) continue;

        if (steps) steps.push({ type: 'visit', cell });

        const rightCell = grid.getCell(row, col + 1);
        if (rightCell && rightCell.element && rightCell.matches(cell.element)) {
          const didUnion = this.union(
            this.getIndex(row, col),
            this.getIndex(row, col + 1)
          );
          if (didUnion && steps)
            steps.push({ type: 'union', cell, otherCell: rightCell });
        }

        const bottomCell = grid.getCell(row + 1, col);
        if (
          bottomCell &&
          bottomCell.element &&
          bottomCell.matches(cell.element)
        ) {
          const didUnion = this.union(
            this.getIndex(row, col),
            this.getIndex(row + 1, col)
          );
          if (didUnion && steps)
            steps.push({ type: 'union', cell, otherCell: bottomCell });
        }
      }
    }

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = grid.getCell(row, col);
        if (!cell || !cell.element) continue;

        const root = this.find(this.getIndex(row, col));
        if (!this.groups.has(root)) {
          this.groups.set(root, []);
        }
        this.groups.get(root).push(cell);
      }
    }

    return { steps: steps ?? [] };
  }

  findGroup(grid, startRow, startCol) {
    const startCell = grid.getCell(startRow, startCol);
    if (!startCell || !startCell.element) {
      return { group: [], steps: [] };
    }

    const root = this.find(this.getIndex(startRow, startCol));
    const group = this.groups.get(root) || [];

    const steps = group.map((cell) => ({ type: 'add', cell }));
    return { group, steps };
  }
}
