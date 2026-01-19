export default class GameController {
  constructor(grid, groupFinder) {
    this.grid = grid;
    this.groupFinder = groupFinder;
    this.sessionFinished = false;
  }

  reset(grid, groupFinder) {
    this.grid = grid;
    this.groupFinder = groupFinder;
    this.sessionFinished = false;
  }

  clickCell(row, col) {
    const cell = this.grid.getCell(row, col);
    if (!cell || !cell.element) return null;

    this.grid.clearHighlights();

    const t0 = performance.now();
    const { group, steps } = this.groupFinder.findGroup(this.grid, row, col);
    const findMs = performance.now() - t0;

    if (!group || group.length === 0) return null;

    return {
      group,
      steps,
      findMs,
      groupSize: group.length,
    };
  }

  applyRemoval(group) {
    this.grid.removeGroup(group);
  }

  isGridEmpty() {
    return this.grid.isEmpty();
  }

  finishSessionIfEmpty() {
    if (this.sessionFinished) return false;

    if (!this.isGridEmpty()) return false;

    this.sessionFinished = true;
    return true;
  }
}
