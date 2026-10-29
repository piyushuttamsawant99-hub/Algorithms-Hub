window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.greedy = {
  label: 'Greedy Algorithms',
  items: [
    ['Activity Selection', 'Chooses compatible activities by earliest finish.', 'O(n log n) including sorting', 'O(1) extra with in-place sorting'], ['Fractional Knapsack', 'Takes the highest value-per-weight fraction first.', 'O(n log n) including sorting', 'O(1) extra in-place; O(n) if sorting a copy'], ['Job Sequencing', 'Schedules profitable jobs before deadlines.', 'O(n²) for the standard deadline scan', 'O(n) schedule slots'], ['Huffman Coding', 'Merges rare symbols to build a prefix code.', 'O(n log n) with a min-heap', 'O(n) tree and heap'], ['Minimum Coins', 'Uses the largest useful denomination at each step.', 'O(k log k + c), including sorting and c coins', 'O(1) extra, excluding output; greedy is not always optimal'], ['Interval Scheduling', 'Selects the largest compatible interval set.', 'O(n log n) including sorting', 'O(1) extra with in-place sorting']
  ]
};
