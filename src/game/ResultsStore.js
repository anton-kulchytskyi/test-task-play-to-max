export default class ResultsStore {
  constructor(limit = 5) {
    this.limit = limit;
    this.items = [];
  }

  reset() {
    this.items = [];
  }

  push({ algorithm, gridSize, totalSearchMs }) {
    this.items.unshift({
      at: Date.now(),
      algorithm,
      gridSize,
      totalSearchMs,
    });

    if (this.items.length > this.limit) {
      this.items.length = this.limit;
    }
  }

  list() {
    return this.items;
  }

  hasAny() {
    return this.items.length > 0;
  }
}
