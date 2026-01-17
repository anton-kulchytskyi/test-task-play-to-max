export default class BaseSearchStrategy {
  createVisitedArray(rows, cols) {
    const visited = [];
    for (let i = 0; i < rows; i++) {
      visited[i] = new Array(cols).fill(false);
    }
    return visited;
  }
}
