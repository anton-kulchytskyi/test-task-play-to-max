export default class Animator {
  constructor({ getEnabled } = {}) {
    this.getEnabled =
      typeof getEnabled === 'function' ? getEnabled : () => true;
  }

  isEnabled() {
    return Boolean(this.getEnabled());
  }

  async playSteps(steps, { visitDelay = 20, afterDelay = 250 } = {}) {
    if (!this.isEnabled()) return;

    for (const step of steps) {
      if (!step || !step.cell) continue;

      if (step.type === 'visit') step.cell.markVisited();
      if (step.type === 'add') step.cell.markInGroup();

      await this.delay(visitDelay);
    }

    await this.delay(afterDelay);
  }

  async playIndexSteps(steps, { visitDelay = 2, afterDelay = 0 } = {}) {
    if (!this.isEnabled()) return;

    for (const step of steps) {
      if (!step || !step.cell) continue;

      if (step.type === 'visit') step.cell.markVisited();
      await this.delay(visitDelay);
    }

    if (afterDelay > 0) await this.delay(afterDelay);
  }

  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
