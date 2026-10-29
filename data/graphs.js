window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.graph = {
  label: 'Graphs',
  items: [
    ['BFS', 'Explores a graph level by level using a queue.', 'O(V + E), adjacency list', 'O(V) queue and visited state'], ['DFS', 'Explores as far as possible before backtracking.', 'O(V + E), adjacency list', 'O(V) visited state and stack'], ['Dijkstra Algorithm', 'Finds shortest paths with non-negative edge weights.', 'O(V² + E), scan-based implementation', 'O(V) distance and visited state'], ['Bellman Ford Algorithm', 'Relaxes every edge to support negative weights.', 'O(VE)', 'O(V) distance array'], ['Floyd Warshall Algorithm', 'Finds shortest paths between every pair.', 'O(V³)', 'O(V²) distance matrix'], ['Prim Algorithm', 'Grows a minimum spanning tree from one vertex.', 'O(E log V) with a binary heap', 'O(V + E) with lazy heap'], ['Kruskal Algorithm', 'Adds the cheapest safe edge to a spanning forest.', 'O(E log E)', 'O(V + E) sorted edges and disjoint set'], ['Topological Sort', 'Orders DAG tasks by dependency.', 'O(V + E), adjacency list', 'O(V) output, visited state, and stack'], ['Union Find Disjoint Set', 'Tracks connected components with fast merging.', 'O(α(n)) amortized per operation', 'O(n) parent and rank arrays'], ['Cycle Detection', 'Detects loops using visited states or sets.', 'O(V + E), adjacency list', 'O(V) visited state']
  ]
};
