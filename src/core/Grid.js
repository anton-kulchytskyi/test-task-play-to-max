import Cell from './Cell.js';

export default class Grid {
  constructor(gridElement, rows = 10, cols = 10, elements = ['A', 'B', 'C', 'D', 'E']) {
    this.gridElement = gridElement;
    this.rows = rows;
    this.cols = cols;
    this.elements = elements;
    
    this.setupGrid();
    this.cells = this.initializeCells();
  }

  setupGrid() {
    this.gridElement.style.setProperty('--grid-rows', this.rows);
    this.gridElement.style.setProperty('--grid-cols', this.cols);
    this.gridElement.innerHTML = '';
  }

  initializeCells() {
    const cells = [];
    
    for (let row = 0; row < this.rows; row++) {
      cells[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.row = row;
        cellElement.dataset.col = col;
        
        const randomElement = this.elements[
          Math.floor(Math.random() * this.elements.length)
        ];
        
        cells[row][col] = new Cell(cellElement, row, col, randomElement);
        this.gridElement.appendChild(cellElement);
      }
    }
    
    return cells;
  }

  getCell(row, col) {
    if (!this.isValidPosition(row, col)) {
      return null;
    }
    return this.cells[row][col];
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  removeGroup(group) {
    group.forEach(cell => {
      const gridCell = this.getCell(cell.row, cell.col);
      if (gridCell) {
        gridCell.remove();
      }
    });
    this.clearHighlights();
  }

  clearHighlights() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells[row][col].removeHighlight();
      }
    }
  }

  highlightGroup(group) {
    this.clearHighlights();
    group.forEach(cell => {
      const gridCell = this.getCell(cell.row, cell.col);
      if (gridCell) {
        gridCell.highlight();
      }
    });
  }
}