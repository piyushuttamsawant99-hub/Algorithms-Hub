window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.arrays = {
  label: 'Arrays & Strings',
  items: [
    ['Kadane Algorithm', 'Finds the maximum-sum contiguous subarray.', 'O(n)', 'O(1)'], ['Two Pointer Technique', 'Moves two indexes inward for ordered pair problems.', 'O(n) for a single scan', 'O(1)'], ['Sliding Window', 'Maintains a moving range while scanning.', 'O(n) amortized for a single scan', 'O(k) window state; O(1) for fixed-size sums'], ['Prefix Sum', 'Precomputes cumulative totals for fast range queries.', 'O(n) preprocessing; O(1) per range query', 'O(n) prefix array'], ['Difference Array', 'Tracks range updates using boundary differences.', 'O(n + q) for build, q updates, and reconstruction', 'O(n) difference array'], ['Dutch National Flag Algorithm', 'Partitions three values in one pass.', 'O(n)', 'O(1) in-place'], ['KMP String Matching', 'Uses a prefix table to skip impossible matches.', 'O(n + m)', 'O(m) prefix table'], ['Rabin Karp Algorithm', 'Uses rolling hashes to find pattern matches.', 'Average O(n + m); worst O(nm)', 'O(1) rolling-hash state'], ['Z Algorithm', 'Builds prefix matches for linear pattern search.', 'O(n + m)', 'O(n + m) combined string and Z array']
  ]
};
