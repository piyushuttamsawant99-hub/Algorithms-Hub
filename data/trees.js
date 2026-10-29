window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.tree = {
  label: 'Trees',
  items: [
    ['Binary Tree Traversals', 'Visits nodes in standard depth or breadth orders.', 'O(n)', 'O(h) recursive stack; h can be n'], ['Binary Search Tree', 'Organizes smaller values left and larger values right.', 'O(h) search/insert; h can be n', 'O(1) iterative; O(h) recursive stack'], ['AVL Tree', 'Balances a search tree with rotations.', 'O(log n) search/insert/delete', 'O(1) iterative; O(log n) recursive stack'], ['Lowest Common Ancestor', 'Finds the deepest node shared by two paths.', 'O(n) generic binary tree; O(h) BST', 'O(h) recursive stack'], ['Tree Height Depth', 'Computes the longest path to a leaf.', 'O(n)', 'O(h) recursive stack; h can be n'], ['Level Order Traversal', 'Visits each tree level using a queue.', 'O(n)', 'O(w) queue; w can be n'], ['Trie', 'Stores strings by shared character prefixes.', 'O(L) per operation, key length L', 'O(1) iterative auxiliary space; trie storage excluded']
  ]
};
