window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.dynamic = {
  label: 'Dynamic Programming',
  items: [
    ['0/1 Knapsack', 'Maximizes value without exceeding capacity.', 'O(nW)', 'O(W) space-optimized; O(nW) table'], ['Unbounded Knapsack', 'Allows each item to be chosen repeatedly.', 'O(nW)', 'O(W) space-optimized; O(nW) table'], ['Longest Common Subsequence', 'Finds a shared sequence preserving order.', 'O(mn)', 'O(min(m,n)) optimized; O(mn) table'], ['Longest Increasing Subsequence', 'Finds the longest increasing subsequence.', 'O(n log n) tails method; O(n²) DP', 'O(n)'], ['Matrix Chain Multiplication', 'Chooses order to minimize scalar operations.', 'O(n³)', 'O(n²) DP table'], ['Coin Change', 'Finds ways or fewest coins for a sum.', 'O(nA)', 'O(A) optimized; O(nA) table'], ['Edit Distance', 'Counts string insert, delete, and replace operations.', 'O(mn)', 'O(min(m,n)) optimized; O(mn) table'], ['Rod Cutting', 'Maximizes revenue by choosing profitable cuts.', 'O(n²)', 'O(n) DP array'], ['House Robber', 'Maximizes non-adjacent house values.', 'O(n)', 'O(1) rolling state']
  ]
};
