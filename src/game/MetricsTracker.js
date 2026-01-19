export default class MetricsTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalSearchMs = 0;
    this.lastSearchMs = null;
    this.lastGroupSize = null;
  }

  addIndexBuild(ms) {
    this.totalSearchMs += ms;
  }

  addSearch(ms, groupSize) {
    this.lastSearchMs = ms;
    this.lastGroupSize = groupSize;
    this.totalSearchMs += ms;
  }

  getTotalMs() {
    return this.totalSearchMs;
  }

  getViewModel() {
    const totalText =
      this.totalSearchMs > 0 ? `${this.totalSearchMs.toFixed(2)} ms` : '-';

    const time = this.lastSearchMs != null ? this.lastSearchMs.toFixed(2) : '-';
    const size = this.lastGroupSize != null ? String(this.lastGroupSize) : '-';

    const lastText = `${time} ms / ${size} cells`;

    return { totalText, lastText };
  }
}
