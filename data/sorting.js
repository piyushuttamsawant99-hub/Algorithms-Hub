window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.sorting = {
  label: 'Sorting',
  items: [
    ['Bubble Sort', 'Compares adjacent values and swaps them when out of order.', 'Best O(n) with early exit; average/worst O(n²)', 'O(1)'], ['Selection Sort', 'Finds the smallest remaining value and places it next.', 'O(n²) in all cases', 'O(1)'], ['Insertion Sort', 'Builds a sorted prefix by inserting each new value.', 'Best O(n); average/worst O(n²)', 'O(1)'], ['Merge Sort', 'Divides the array, sorts halves, and merges them.', 'O(n log n)', 'O(n) standard array merge'], ['Quick Sort', 'Partitions around a pivot and sorts both sides.', 'Average O(n log n); worst O(n²)', 'Average O(log n); worst O(n) recursion stack'], ['Heap Sort', 'Builds a heap and repeatedly extracts the maximum.', 'O(n log n)', 'O(1) in-place'], ['Counting Sort', 'Counts occurrences when values come from a small range.', 'O(n + k)', 'O(n + k) output and counts'], ['Radix Sort', 'Sorts numbers digit by digit.', 'O(d(n + k))', 'O(n + k) buckets and output'], ['Bucket Sort', 'Distributes values into buckets before concatenating.', 'Average O(n + k) uniform input; worst O(n²)', 'O(n + k) buckets and output'], ['Shell Sort', 'Insertion-sorts elements separated by decreasing gaps.', 'Gap-dependent; halving gaps worst O(n²)', 'O(1) in-place']
  ]
};
