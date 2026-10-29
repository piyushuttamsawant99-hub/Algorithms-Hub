window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.recursion = {
  label: 'Recursion & Backtracking',
  items: [
    ['Factorial', 'Builds n! through a recursive base case.', 'O(n)', 'O(n) recursive call stack'], ['Fibonacci', 'Builds a sequence from the two previous values.', 'O(n) iterative DP', 'O(1) iterative state'], ['Tower of Hanoi', 'Moves disks while respecting size constraints.', 'O(2^n)', 'O(n) recursive call stack'], ['N Queens', 'Places queens so no two attack each other.', 'O(n!) worst-case backtracking', 'O(n²) board'], ['Rat in a Maze', 'Backtracks through open cells to reach the goal.', 'O(4^(r·c)) worst-case bound', 'O(r·c) visited state and recursion'], ['Sudoku Solver', 'Tries valid digits and backtracks when a choice fails.', 'O(9^E), E empty cells', 'O(E) recursion stack; board is updated in place'], ['Subset Generation', 'Generates every include-or-skip choice.', 'O(n·2^n) including output', 'O(n) recursion, excluding output'], ['Permutations', 'Explores every possible ordering.', 'O(n·n!) including output', 'O(n) recursion, excluding output'], ['Combinations', 'Chooses groups without repeating earlier choices.', 'O(n·2^n) for all sizes, including output', 'O(n) recursion, excluding output']
  ]
};
