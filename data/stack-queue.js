window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups['stack-queue'] = {
  label: 'Stack & Queue',
  items: [
    ['Balanced Parentheses', 'Checks that every opening bracket closes correctly.', 'O(n)', 'O(n) worst-case stack'], ['Infix to Postfix', 'Uses precedence to rewrite an expression.', 'O(n)', 'O(n) operator stack and output'], ['Postfix Evaluation', 'Evaluates operands with a stack.', 'O(n)', 'O(n) worst-case operand stack'], ['Next Greater Element', 'Finds the next larger value with a monotonic stack.', 'O(n)', 'O(n) stack and output'], ['Monotonic Stack', 'Maintains ordered candidates efficiently.', 'O(n) amortized', 'O(n) stack'], ['Circular Queue', 'Reuses queue space by wrapping indexes around.', 'O(1) per enqueue/dequeue', 'O(C) fixed-capacity queue']
  ]
};
