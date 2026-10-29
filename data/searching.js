window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.searching = {
  label: 'Searching',
  items: [
    ['Linear Search', 'Checks each value until the target is found.', 'Best O(1); average/worst O(n)', 'O(1)'], ['Binary Search', 'Halves a sorted range after every comparison.', 'O(log n), sorted input', 'O(1) iterative'], ['Jump Search', 'Jumps through sorted blocks, then scans one block.', 'O(√n), sorted input', 'O(1)'], ['Interpolation Search', 'Estimates a target position in uniform data.', 'Average O(log log n) uniform data; worst O(n)', 'O(1)'], ['Exponential Search', 'Doubles a range, then applies binary search.', 'O(log n), sorted input', 'O(1)']
  ]
};
