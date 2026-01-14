export default class Cell {
  constructor(cellElement, row, col, element) {
    this.cellElement = cellElement;
    this.row = row;
    this.col = col;
    this.element = element;
    
    this.render();
  }

  matches(element) {
    return this.element === element;
  }

  render() {
    if (this.element) {
      this.cellElement.textContent = this.element;
      this.cellElement.dataset.element = this.element;
      this.cellElement.classList.remove('empty');
    } else {
      this.cellElement.textContent = '';
      this.cellElement.classList.add('empty');
    }
  }

  highlight() {
    this.cellElement.classList.add('highlighted');
  }

  removeHighlight() {
    this.cellElement.classList.remove('highlighted');
  }

  remove() {
    this.element = null;
    this.cellElement.textContent = '';
    this.cellElement.classList.add('empty');
  }
}