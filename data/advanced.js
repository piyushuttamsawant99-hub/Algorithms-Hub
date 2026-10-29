window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.advanced = {
  label: 'Advanced Algorithms',
  items: [
    ['A* Search', 'Combines path cost and a heuristic to guide search.', 'Worst-case exponential; heuristic-dependent', 'Worst-case exponential; frontier and visited nodes'], ['Ford Fulkerson', 'Finds maximum flow by augmenting paths.', 'O(EF) for integer capacities', 'O(V + E) residual graph'], ['Edmonds Karp', 'Uses BFS augmenting paths for maximum flow.', 'O(VE²)', 'O(V + E) residual graph and BFS state'], ['Tarjan Algorithm', 'Finds strong components in one DFS.', 'O(V + E)', 'O(V) discovery, low-link, and stack state'], ['Kosaraju Algorithm', 'Uses two DFS passes for strong components.', 'O(V + E)', 'O(V + E) including transposed graph'], ['Segment Tree', 'Answers range queries while supporting updates.', 'O(log n) per query or update', 'O(n) tree storage'], ['Fenwick Tree BIT', 'Maintains prefix sums with compact updates.', 'O(log n) per query or update', 'O(n) tree storage'], ['Sparse Table', 'Answers static range queries using powers of two.', 'O(1) min/max query; O(n log n) preprocessing', 'O(n log n) table'], ['Convex Hull', 'Finds the outer boundary of a point set.', 'O(n log n)', 'O(n) sorted points and hull']
  ]
};
