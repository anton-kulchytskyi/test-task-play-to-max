export default class UI {
  constructor(gridElement) {
    this.gridElement = gridElement;

    this.newGridBtn = document.getElementById('newGridBtn');
    this.algorithmSelector = document.getElementById('algorithmSelector');
    this.gridRowsSelect = document.getElementById('gridRowsSelect');
    this.gridColsSelect = document.getElementById('gridColsSelect');
    this.visualizeCheckbox = document.getElementById('visualizeCheckbox');

    this.totalEl = document.getElementById('totalSearchTime');
    this.lastEl = document.getElementById('lastSearchValue');

    this.resultsBody = document.getElementById('resultsBody');
  }

  bind({ onCellClick, onNewGrid, onAlgorithmChange, onGridSizeChange }) {
    this.gridElement.addEventListener('click', (e) => {
      const cellEl = e.target.closest('.cell');
      if (!cellEl) return;

      onCellClick({
        row: parseInt(cellEl.dataset.row),
        col: parseInt(cellEl.dataset.col),
      });
    });

    this.newGridBtn?.addEventListener('click', onNewGrid);

    this.algorithmSelector?.addEventListener('change', (e) => {
      onAlgorithmChange(e.target.value);
    });

    const onSizeChange = () => onGridSizeChange(this.getGridSize());
    this.gridRowsSelect?.addEventListener('change', onSizeChange);
    this.gridColsSelect?.addEventListener('change', onSizeChange);
  }

  getSelectedAlgorithm() {
    return this.algorithmSelector?.value ?? 'DFS';
  }

  getGridSize() {
    return {
      rows: parseInt(this.gridRowsSelect?.value ?? '10'),
      cols: parseInt(this.gridColsSelect?.value ?? '10'),
    };
  }

  isVisualizationEnabled() {
    return Boolean(this.visualizeCheckbox?.checked);
  }

  setupGridSizeSelects(initialRows, initialCols) {
    if (!this.gridRowsSelect || !this.gridColsSelect) return;

    const options = [];
    for (let v = 5; v <= 45; v += 5) options.push(v);

    this.gridRowsSelect.innerHTML = options
      .map((v) => `<option value="${v}">${v}</option>`)
      .join('');

    this.gridColsSelect.innerHTML = options
      .map((v) => `<option value="${v}">${v}</option>`)
      .join('');

    this.gridRowsSelect.value = String(initialRows);
    this.gridColsSelect.value = String(initialCols);
  }

  renderMetrics({ totalText, lastText }) {
    if (this.totalEl) this.totalEl.textContent = totalText;
    if (this.lastEl) this.lastEl.textContent = lastText;
  }

  renderResults(items) {
    if (!this.resultsBody) return;

    if (!items || items.length === 0) {
      this.resultsBody.innerHTML = `<tr><td colspan="4" class="muted">No results yet</td></tr>`;
      return;
    }

    this.resultsBody.innerHTML = items
      .map((r, idx) => {
        return `
          <tr>
            <td>${idx + 1}</td>
            <td>${r.algorithm}</td>
            <td>${r.gridSize}</td>
            <td>${r.totalSearchMs.toFixed(2)} ms</td>
          </tr>
        `;
      })
      .join('');
  }
}
