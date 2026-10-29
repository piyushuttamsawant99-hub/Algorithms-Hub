const rawDailyQuestions = [
  [
    ["A task asks for the largest score in a list. What should be specified before designing a method?", "The input, expected output, and constraints", "A favorite programming language", "The number of code comments", "A graphics library"],
    ["Which sequence is a valid finite algorithm for finding the maximum?", "Initialize from the first value, compare the rest, update the maximum", "Return the last value without inspecting input", "Repeat comparison forever", "Sort descending and return the first value without defining empty input"],
    ["For [4, 1, 3], the maximum-by-scan method returns:", "4", "1", "3", "8"],
    ["What should a maximum-finding algorithm do for an empty list?", "Report that no maximum exists, according to its defined contract", "Return index zero", "Return negative infinity in every language", "Read a value past the list end"],
    ["Which property means an algorithm eventually stops?", "Finiteness", "Stability", "Random access", "Compilation"],
    ["Two valid algorithms may solve the same task while differing in:", "Steps, resource use, and assumptions", "Required mathematical answer", "Whether the input exists", "The definition of the task"],
    ["A recipe's step says “repeat until the answer is good.” What is missing?", "A precise condition for when to stop", "An input variable name", "A sorting operation", "A programming language"],
    ["For a valid input, a correct algorithm should:", "Produce an output that satisfies the problem specification", "Always use recursion", "Always use the fewest lines", "Never check edge cases"],
    ["Why identify input constraints early?", "They guide which methods are correct and efficient", "They guarantee there are no bugs", "They remove the need for output", "They determine the font"],
    ["A test case with a one-item list is most useful for checking:", "Boundary behavior and initialization", "The speed of a graphics card", "Sorting stability only", "Network availability"],
  ],
  [
    ["A single loop visits n items once. Its time growth is:", "O(n)", "O(1)", "O(log n)", "O(n²)"],
    ["Two independent nested loops each run n times. Their combined work is:", "O(n²)", "O(n)", "O(log n)", "O(1)"],
    ["Which term dominates 3n² + 8n + 4 as n grows?", "n²", "8n", "4", "3"],
    ["A loop halves n on every iteration. The number of iterations is:", "O(log n)", "O(n)", "O(n²)", "O(1)"],
    ["An algorithm allocates a second array of n values. Its auxiliary space is:", "O(n)", "O(1)", "O(log n)", "O(n²)"],
    ["Which statement about Big-O is correct?", "It describes asymptotic growth, ignoring constant factors", "It gives exact milliseconds on every computer", "It only measures memory", "It always describes the best case"],
    ["A function performs one fixed number of operations regardless of n. Its time is:", "O(1)", "O(n)", "O(log n)", "O(n²)"],
    ["Which growth rate is generally preferable for very large n?", "O(n log n)", "O(n²)", "O(2ⁿ)", "O(n!)"],
    ["If an algorithm scans all n inputs and stores only two counters, its time/extra space are:", "O(n) / O(1)", "O(1) / O(n)", "O(n²) / O(n)", "O(log n) / O(log n)"],
    ["Why distinguish worst-case from average-case complexity?", "They describe different input-dependent resource bounds", "They are always identical", "Worst-case excludes input size", "Average-case measures only memory"],
  ],
  [
    ["In a zero-based array of length 6, the last valid index is:", "5", "6", "0", "7"],
    ["Inserting a value at index 0 of an array usually requires:", "Shifting existing values right", "Shifting values left", "Sorting the array first", "No movement for any array representation"],
    ["Deleting the element at index 2 from [8, 3, 7, 4] gives:", "[8, 3, 4]", "[8, 7, 4]", "[3, 7, 4]", "[8, 3, 7, 4, 2]"],
    ["Reading array[i] by index in a standard array takes:", "O(1)", "O(i)", "O(n)", "O(log n)"],
    ["A traversal that counts even values in n array items takes:", "O(n)", "O(1)", "O(log n)", "O(n²)"],
    ["What must be checked before accessing a[i]?", "That i is within the valid index range", "That i is a prime number", "That the array is sorted", "That the array has an even length"],
    ["After appending 9 to [2, 5], the array is:", "[2, 5, 9]", "[9, 2, 5]", "[2, 9]", "[5, 2, 9]"],
    ["Which array operation is ordinarily O(n) because elements move?", "Insert at the front", "Read the first item", "Update a known index", "Read the last item by index"],
    ["For an empty array, a traversal should execute its body:", "Zero times", "Once with index -1", "Once with index 0", "Until memory is full"],
    ["Why can arrays be preferable for repeated indexed reads?", "They provide direct index access", "They guarantee constant-time middle insertion", "They store no values", "They automatically keep values sorted"],
  ],
  [
    ["Linear search on an unsorted list is valid because it:", "Checks items one by one without relying on order", "Always halves the range", "Requires a heap", "Only checks the first and last values"],
    ["Binary search can discard the lower half when the midpoint is below target because:", "The remaining values are sorted", "The array is linked", "The target is unique", "The array length is even"],
    ["Binary search on [2, 5, 8, 12, 16] starts at midpoint index:", "2", "0", "4", "3"],
    ["Searching for 12 in [2, 5, 8, 12, 16] by binary search first compares against:", "8", "2", "12", "16"],
    ["Binary search for an absent value should stop when:", "The search boundaries cross", "The midpoint equals zero always", "The array is copied", "A duplicate is found"],
    ["Worst-case linear search on n items takes:", "O(n)", "O(1)", "O(log n)", "O(n log n)"],
    ["Worst-case binary search on a sorted array takes:", "O(log n)", "O(n)", "O(n²)", "O(1)"],
    ["Which input is suitable for binary search?", "[1, 4, 7, 9]", "[7, 1, 9, 4]", "A queue with unknown order", "A set of unrelated labels"],
    ["A common binary-search bug is updating low to mid instead of mid + 1. It may:", "Fail to make progress and loop forever", "Sort the array", "Always return the maximum", "Reduce memory to O(0)"],
    ["If equal values occur, ordinary binary search may return:", "Any matching index, unless modified to find a boundary", "Always the first match", "Always the last match", "No match"],
  ],
  [
    ["A palindrome reads the same:", "Forward and backward under the chosen normalization", "Only when sorted alphabetically", "Only when its length is even", "After reversing word order"],
    ["Ignoring case, “Level” is:", "A palindrome", "Not a palindrome", "A numeric string", "An empty string"],
    ["A frequency map for “aba” stores:", "a:2, b:1", "a:1, b:2", "a:3", "Three distinct letters"],
    ["For a string of length n, one pass to count character frequencies takes:", "O(n)", "O(1)", "O(log n)", "O(n²)"],
    ["To compare mirrored characters for a palindrome, useful indices are:", "i and length - 1 - i", "i and i + 1 only", "0 and length for every step", "i and length + i"],
    ["What is a safe result for an empty string under the common definition?", "It is a palindrome", "It always throws", "It contains one character", "It is not a string"],
    ["Why normalize spaces/punctuation before checking some phrases?", "The problem may define those characters as ignorable", "Normalization sorts letters", "It changes every vowel", "It makes all strings length one"],
    ["Which structure helps compare two strings by character counts?", "A frequency map", "A stack only", "A binary heap", "A queue with no values"],
    ["For Unicode text, what must a robust character algorithm consider?", "The language’s character/code-point representation", "Only ASCII digits", "That every character uses one byte", "That strings cannot be empty"],
    ["If a frequency counter increments the wrong key, the likely defect is:", "Using a character/index mismatch", "The string is not sorted", "The loop is constant time", "The map is necessarily full"],
  ],
  [
    ["In factorial recursion, a natural base case is:", "factorial(0) = 1", "factorial(0) calls factorial(0)", "factorial(1) = factorial(2)", "No base case is needed"],
    ["For factorial(4) = 4 × 3 × 2 × 1, the result is:", "24", "10", "12", "16"],
    ["A recursive call should generally:", "Move toward a base case on a smaller subproblem", "Repeat the same input forever", "Increase the problem without bound", "Skip returning a value"],
    ["A chain of n recursive calls uses call-stack space:", "O(n)", "O(1)", "O(log log n)", "O(n²) always"],
    ["The base case is never reached. The likely outcome is:", "Unbounded recursion until failure", "A stable sorted list", "Constant-time completion", "Automatic memoization"],
    ["For sum(n) = n + sum(n-1), with sum(0)=0, sum(3) is:", "6", "3", "9", "0"],
    ["What does the call stack remember?", "Pending function calls and their local state", "Only the final output", "Every possible input", "The source file path only"],
    ["A recursive binary search on a range of n items has call depth:", "O(log n)", "O(n)", "O(n²)", "O(1) for all cases"],
    ["Why can recursion be less memory-efficient than a loop?", "Calls retain stack frames", "Loops allocate one frame per iteration", "Recursion cannot return values", "Loops always copy the full array"],
    ["When a recursive function returns, control resumes in:", "The caller's pending frame", "The first source line of the program", "A random function", "The operating system scheduler only"],
  ],
  [
    ["A foundation solution should state its:", "Assumptions, method, and complexity", "Font and color", "Compiler brand only", "Number of variables only"],
    ["For [1, 3, 5, 7], binary search for 5 returns index:", "2", "1", "3", "5"],
    ["A single pass to count values has time:", "O(n)", "O(1)", "O(log n)", "O(n²)"],
    ["A stack is appropriate for checking:", "Balanced nested brackets", "The shortest unweighted path", "Random array index access", "Frequency order without counts"],
    ["Which array operation is O(1) in the usual model?", "Access a known index", "Insert at front", "Search unsorted data", "Delete index zero"],
    ["A linked list's kth node is found by:", "Following next pointers from the head", "Computing address as base + k", "Binary searching every node", "Sorting all nodes first"],
    ["For an empty input, a correct algorithm should:", "Follow explicitly defined edge-case behavior", "Read its first item anyway", "Always return -1", "Ignore the contract"],
    ["A base case in recursion provides:", "A stopping condition", "A sorting key", "An array capacity", "A graph edge"],
    ["Why can an O(n log n) sort outperform O(n²) on large inputs?", "Its growth increases more slowly", "It always uses less memory", "It does no comparisons", "Its best case is always O(1)"],
    ["A dry run is useful because it:", "Reveals state changes and boundary errors", "Replaces all tests", "Proves performance on every machine", "Removes input constraints"],
  ],
  [
    ["A singly linked-list node minimally contains:", "A value and a next reference", "A sorted array and hash", "Two queue ends", "A pivot and recursion depth"],
    ["To insert X after node A, first set:", "X.next = A.next", "A.next = null unconditionally", "X.next = head only", "head = X always"],
    ["After linking X after A, set:", "A.next = X", "X = A.next.next", "tail = null", "A.value = X.next"],
    ["Accessing the kth singly linked-list node takes:", "O(k)", "O(1)", "O(log k)", "O(k²)"],
    ["Inserting at the head of a singly linked list takes:", "O(1)", "O(n)", "O(log n)", "O(n log n)"],
    ["Removing a middle node generally requires knowing:", "Its previous node", "The largest value", "The array capacity", "The recursion base case"],
    ["A list traversal should stop when:", "The current node is null", "The current value is zero", "The node count is prime", "The tail points to itself"],
    ["A common pointer-update error when inserting is:", "Overwriting the successor link before saving it", "Checking null", "Allocating a node", "Updating the predecessor"],
    ["A linked list is useful when:", "Frequent insertions at known node positions matter", "Constant-time arbitrary indexing is required", "Every element must be contiguous", "Binary search by index is required"],
    ["If a list has a cycle, ordinary traversal until null:", "Never terminates", "Visits only the head", "Sorts the list", "Uses no pointers"],
  ],
  [
    ["A stack removes items in:", "Last-in, first-out order", "First-in, first-out order", "Sorted order", "Random order"],
    ["After push(A), push(B), pop(), the removed value is:", "B", "A", "Both A and B", "Neither"],
    ["Checking “([])” uses a stack by:", "Pushing openers and matching each closer with the top", "Sorting all brackets", "Enqueueing only closers", "Comparing string length only"],
    ["A stack push/pop at the top is ordinarily:", "O(1)", "O(n)", "O(log n)", "O(n²)"],
    ["Which use naturally fits a stack?", "Undo history", "Round-robin scheduling", "Shortest path in an unweighted graph", "Priority ordering"],
    ["Before popping a possibly empty stack, check:", "Whether it is empty", "Whether its size is prime", "Whether its top is the minimum", "Whether the input is sorted"],
    ["A recursive call uses which data structure conceptually?", "A call stack", "A circular queue", "A binary heap", "An adjacency matrix"],
    ["When processing a closing bracket, a mismatch means:", "The sequence is invalid", "The sequence is sorted", "The stack should be ignored", "The closer becomes the root"],
    ["If a stack is implemented by an array, overflow can happen when:", "Capacity is reached and not resized", "It is empty", "An item is popped", "Values are negative"],
    ["Why is a stack not a queue?", "It removes the newest item, not the oldest", "It always sorts values", "It allows no insertion", "It has no removal operation"],
  ],
  [
    ["A queue removes items in:", "First-in, first-out order", "Last-in, first-out order", "Descending order", "Priority order by default"],
    ["After enqueue(A), enqueue(B), dequeue(), the removed value is:", "A", "B", "Both", "Neither"],
    ["A circular queue advances an index using:", "(index + 1) modulo capacity", "index × capacity", "index - capacity forever", "index squared"],
    ["A queue is a natural model for:", "A printer's waiting jobs", "Nested function returns", "Undoing the latest edit", "Binary-search boundaries"],
    ["A circular buffer with capacity 5 wraps index 4 to:", "0", "1", "4", "5"],
    ["What distinguishes a full circular queue from an empty one?", "A count or carefully reserved slot/state flag", "The values' signs", "Sorted order", "The front always equals zero"],
    ["With front at index 2 and capacity 6, one dequeue advances front to:", "3", "1", "6", "0"],
    ["A basic queue with efficient front removal and tail insertion can do both in:", "O(1)", "O(n²)", "O(log n)", "O(n) always"],
    ["Why use modulo in a circular queue?", "To wrap indices within the fixed buffer", "To sort the values", "To detect duplicate jobs", "To halve the capacity"],
    ["A bug that increments rear without wrapping can cause:", "An out-of-range array access", "A stable ordering guarantee", "The queue to become a stack", "A lower time complexity"],
  ],
  [
    ["One bubble-sort pass on [3, 1, 2] moves the largest value to:", "The final position", "The first position", "The middle position", "A separate array"],
    ["Selection sort's outer step finds:", "The minimum of the remaining unsorted suffix", "The next adjacent inversion only", "The median of the full array", "A random pivot"],
    ["Bubble sort compares:", "Adjacent elements", "Only the first and last elements", "Every pair exactly once", "Only equal values"],
    ["Selection sort performs O(n²) comparisons in:", "Best, average, and worst cases", "Best case only", "Worst case only", "No case"],
    ["Bubble sort with an early-exit flag on sorted input can take:", "O(n)", "O(n²)", "O(log n)", "O(1)"],
    ["For [4, 2, 3], after one left-to-right bubble pass, values are:", "[2, 3, 4]", "[2, 4, 3]", "[3, 2, 4]", "[4, 3, 2]"],
    ["Selection sort usually makes at most how many swaps?", "O(n)", "O(n²)", "O(log n)", "O(1) total"],
    ["Which simple sort is stable in its usual adjacent-swap form?", "Bubble sort", "Selection sort", "Heap sort", "Quick sort"],
    ["Both bubble and selection sort typically use auxiliary space:", "O(1)", "O(n)", "O(n log n)", "O(n²)"],
    ["If bubble sort never reports a swap during a full pass, it can:", "Stop early because the list is sorted", "Restart forever", "Reverse the array", "Guarantee an empty list"],
  ],
  [
    ["Insertion sort maintains a sorted:", "Prefix of the array", "Suffix only", "Heap", "Graph"],
    ["Inserting key 2 into sorted prefix [3, 5] yields:", "[2, 3, 5]", "[3, 2, 5]", "[3, 5, 2]", "[5, 3, 2]"],
    ["During insertion, larger prefix items are shifted:", "Right to open a position for the key", "Left to delete the key", "Into a heap", "Out of the array"],
    ["Insertion sort best-case time on an already sorted array is:", "O(n)", "O(n²)", "O(log n)", "O(1)"],
    ["Insertion sort worst-case time on reverse-sorted input is:", "O(n²)", "O(n)", "O(log n)", "O(1)"],
    ["Insertion sort is often effective for:", "Small or nearly sorted inputs", "Huge random data when guaranteed O(n log n) is required", "Unweighted graph traversal", "Searching an unsorted linked list by index"],
    ["Which sort can be stable when equal keys are not shifted past one another?", "Insertion sort", "Selection sort with arbitrary swaps", "Heap sort", "Quick sort in-place"],
    ["The extra space of iterative insertion sort is:", "O(1)", "O(n)", "O(log n)", "O(n²)"],
    ["For [4, 1, 3], after inserting 1, the sorted prefix is:", "[1, 4]", "[4, 1]", "[1, 3]", "[3, 4]"],
    ["A common insertion-sort bug is stopping shifts on `>` instead of `>=`; this can:", "Preserve stability for equal keys", "Always reverse duplicates", "Break all sorted inputs", "Cause binary search"],
  ],
  [
    ["Merge sort divides until subproblems are typically:", "Single-element or empty ranges", "Sorted heaps", "Negative-sized arrays", "Graph components"],
    ["Merging [1, 4] and [2, 3] produces:", "[1, 2, 3, 4]", "[2, 1, 4, 3]", "[1, 4, 2, 3]", "[4, 3, 2, 1]"],
    ["Merge sort time in best, average, and worst cases is typically:", "O(n log n)", "O(n²)", "O(log n)", "O(1)"],
    ["Array-based merge sort usually needs auxiliary space:", "O(n)", "O(1)", "O(log n) total", "O(n²)"],
    ["Why is merge sort O(n log n)?", "O(n) merging work across O(log n) levels", "O(log n) work at each of n² levels", "It compares each pair once", "It never copies values"],
    ["When merging two sorted halves, the next output is:", "The smaller of the two front items", "Always the rightmost item", "A random item", "The median of the full array"],
    ["Merge sort is generally:", "Stable when equal left items are chosen first", "Unstable in every implementation", "In-place with O(1) space for arrays", "Only valid for distinct values"],
    ["For n=8, a balanced merge sort has about how many divide levels?", "3", "8", "16", "64"],
    ["If one side of a merge is exhausted, the remaining items on the other side are:", "Copied in order", "Discarded", "Reversed", "Compared with zero"],
    ["Merge sort is useful when predictable worst-case comparison time matters because it:", "Guarantees O(n log n) time", "Has O(1) time", "Needs no memory", "Only sorts nearly sorted input"],
  ],
  [
    ["Quick sort's partition step places values:", "On sides according to a pivot comparison", "In a queue by arrival time", "Into frequency buckets only", "In a linked list by insertion date"],
    ["For pivot 3 in [4, 1, 3], a valid partition has:", "1 left of pivot and 4 right of pivot", "4 left and 1 right only", "Both values discarded", "All values equal to pivot"],
    ["Quick sort's worst-case time is:", "O(n²)", "O(n log n)", "O(log n)", "O(1)"],
    ["Quick sort's average time with reasonably balanced partitions is:", "O(n log n)", "O(n²)", "O(log log n)", "O(1)"],
    ["Already sorted input can cause a poor pivot strategy to:", "Produce highly unbalanced partitions", "Guarantee O(1) time", "Make every pivot median", "Avoid all recursion"],
    ["A randomized pivot primarily helps by:", "Reducing the chance of consistently bad partitions", "Guaranteeing no comparisons", "Making input sorted before partition", "Removing recursion"],
    ["Recursive quick sort's worst-case call-stack space can be:", "O(n)", "O(1)", "O(log log n)", "O(n²)"],
    ["A partition invariant should ensure:", "Values on each side satisfy the pivot rule", "The list is fully sorted immediately", "The pivot is removed", "Every value is unique"],
    ["Why can quick sort be in-place in common implementations?", "It rearranges values inside the original array", "It allocates a second full array at every merge", "It uses a queue", "It stores each permutation"],
    ["For two empty/singleton subranges, recursive quick sort should:", "Stop because each range is already sorted", "Choose an invalid midpoint forever", "Call itself on the full array", "Allocate n² memory"],
  ],
  [
    ["Inorder traversal visits nodes in which order?", "Left, node, right", "Node, left, right", "Left, right, node", "Right, node, left"],
    ["For root 2 with left 1 and right 3, preorder is:", "2, 1, 3", "1, 2, 3", "1, 3, 2", "3, 2, 1"],
    ["For that same tree, postorder is:", "1, 3, 2", "2, 1, 3", "1, 2, 3", "3, 1, 2"],
    ["A binary tree node has at most:", "Two children", "One child", "Three parents", "Four roots"],
    ["Visiting every node once in a tree of n nodes takes:", "O(n)", "O(log n) always", "O(1)", "O(n²)"],
    ["Recursive traversal of a skewed tree can use stack space:", "O(n)", "O(1) always", "O(log log n)", "O(n²)"],
    ["Which traversal visits the root before its children?", "Preorder", "Inorder", "Postorder", "Level-order only"],
    ["Level-order traversal typically uses:", "A queue", "A call stack only", "A hash set only", "A sorted array"],
    ["An empty tree traversal should:", "Return without visiting a node", "Read the root value", "Create a child", "Loop forever"],
    ["Inorder traversal is sorted only if the tree has:", "Binary search tree ordering", "A complete shape", "Exactly three nodes", "No left children"],
  ],
  [
    ["In a BST, values smaller than a node are placed:", "In its left subtree", "In its right subtree", "At the root always", "In a separate queue"],
    ["Search for 6 in a BST root 8 with left child 4 and 4's right child 6 follows:", "8 → 4 → 6", "8 → null", "4 → 8 → 6", "6 → 4 → 8"],
    ["A balanced BST search has average time:", "O(log n)", "O(n²)", "O(1) always", "O(n log n)"],
    ["A completely skewed BST search can degrade to:", "O(n)", "O(log n) guaranteed", "O(1)", "O(n²) per comparison"],
    ["Inserting a key into a BST stops at:", "The appropriate empty child position", "The array midpoint", "The queue front", "A random leaf regardless of key"],
    ["Inorder traversal of a BST gives:", "Keys in sorted order", "Reverse insertion history", "Only leaves", "Random order"],
    ["When deleting a BST node with two children, a common replacement is:", "Its inorder successor or predecessor", "A random graph neighbor", "The root of another tree", "An empty string"],
    ["What assumption is needed for average O(log n) BST search?", "The tree remains reasonably balanced", "Keys are all negative", "The tree has no root", "Values are inserted in sorted order"],
    ["If duplicate keys are allowed, the BST must define:", "A consistent duplicate-placement policy", "A new root for each duplicate", "That comparisons are disabled", "That duplicates are sorted by color"],
    ["An iterative BST search using only a pointer has auxiliary space:", "O(1)", "O(n)", "O(n²)", "O(log n) stack"],
  ],
  [
    ["An adjacency list stores for each vertex:", "Its neighboring vertices", "Every possible path", "A sorted tree", "Only the graph's largest edge"],
    ["An adjacency matrix for V vertices uses space:", "O(V²)", "O(V + E)", "O(E²)", "O(1)"],
    ["An adjacency list uses space proportional to:", "O(V + E)", "O(V²) always", "O(E²)", "O(log V)"],
    ["For a sparse graph, which representation is usually more space-efficient?", "Adjacency list", "Adjacency matrix", "Complete matrix only", "A recursion tree"],
    ["In an undirected adjacency matrix, edge A-B is represented by:", "Both matrix[A][B] and matrix[B][A]", "Only matrix[A][A]", "No matrix entry", "The final row only"],
    ["A self-loop at vertex A is represented in a matrix at:", "matrix[A][A]", "matrix[A][B] for every B", "The empty cell", "The header only"],
    ["Checking whether a specific edge exists is O(1) with:", "An adjacency matrix", "A linked adjacency list in general", "DFS only", "A queue"],
    ["Iterating all neighbors of v in an adjacency list costs:", "O(degree(v))", "O(V²)", "O(1) regardless of degree", "O(E²)"],
    ["Why must graph code track visited vertices?", "Cycles can otherwise cause repeated visits", "Matrices require sorting", "Edges have no endpoints", "Vertices must be prime"],
    ["A directed edge A→B does not imply B→A because:", "Directed edges have one-way orientation", "All graphs are trees", "The matrix is symmetric by definition", "BFS reverses edges"],
  ],
  [
    ["BFS explores vertices:", "In increasing distance layers from the start", "By smallest numeric label", "Deepest first only", "In sorted-array order"],
    ["Which data structure supports BFS frontier order?", "Queue", "Stack", "Call stack only", "Binary search tree"],
    ["Marking a neighbor visited when enqueued helps:", "Avoid enqueueing it repeatedly", "Sort its neighbors", "Find negative cycles", "Make the graph directed"],
    ["With neighbors processed alphabetically, BFS from A in A-B, A-C, B-D visits:", "A, B, C, D", "A, D, C, B", "B, A, D, C", "D, B, A, C"],
    ["BFS finds shortest paths by edge count in:", "Unweighted graphs", "Any graph with negative weights", "Only complete graphs", "A binary search tree only"],
    ["Adjacency-list BFS time is:", "O(V + E)", "O(V²) for every representation", "O(log V)", "O(E²)"],
    ["BFS auxiliary space for queue and visited state is:", "O(V)", "O(1)", "O(E²)", "O(log V)"],
    ["A disconnected graph BFS from one start visits:", "Only the start's connected component", "Every vertex automatically", "No vertices", "Only the farthest vertex"],
    ["What should happen when BFS sees an already visited neighbor?", "Skip adding it to the queue again", "Delete the current vertex", "Restart at the same node", "Push it onto a recursion stack"],
    ["For weighted edges with different nonnegative costs, plain BFS:", "Does not generally guarantee the minimum-cost path", "Always is Dijkstra's algorithm", "Sorts by cost", "Requires no visited set"],
  ],
  [
    ["DFS explores by:", "Following a branch deeply before backtracking", "Processing a breadth frontier first", "Sorting all edges", "Always choosing the smallest weight"],
    ["An iterative DFS commonly uses:", "A stack", "A FIFO queue only", "A frequency table", "A circular buffer only"],
    ["Marking a vertex visited prevents:", "Repeated exploration through cycles", "A tree from having children", "An edge from existing", "Complexity analysis"],
    ["Adjacency-list DFS time is:", "O(V + E)", "O(V²) in all cases", "O(log V)", "O(1)"],
    ["Recursive DFS stack depth on a path with V vertices can be:", "O(V)", "O(1) always", "O(E²)", "O(log V) guaranteed"],
    ["DFS preorder records a vertex:", "When first discovered", "Only after all descendants", "Before the graph is created", "Only if it has no edges"],
    ["For a cycle A-B-C-A, visited state ensures DFS:", "Does not follow the cycle endlessly", "Deletes one edge", "Finds shortest weighted paths", "Must return to A immediately"],
    ["DFS from a start in a disconnected graph reaches:", "Only vertices reachable from that start", "All disconnected components automatically", "Only leaves", "No vertices"],
    ["A recursive DFS can overflow the call stack on:", "Very deep graphs", "A graph with no vertices only", "Every undirected edge", "An adjacency matrix"],
    ["Compared with BFS, DFS is not guaranteed to find:", "A shortest unweighted path", "A reachable vertex", "A cycle in every graph", "A connected component"],
  ],
  [
    ["A greedy algorithm chooses:", "A locally preferred option at each step", "Every complete solution before choosing", "A random option only", "The largest input first always"],
    ["Why must a greedy method be proved?", "A locally best choice may fail to be globally optimal", "Greedy methods never terminate", "Sorting is forbidden", "It always uses exponential time"],
    ["For interval scheduling, a common safe greedy choice is the activity with:", "Earliest finish time", "Latest start time", "Longest duration", "Largest label"],
    ["In a standard coin system, greedy repeatedly selects:", "The largest coin not exceeding the remaining amount", "The smallest coin only", "A random denomination", "Every coin once"],
    ["A counterexample to a greedy strategy demonstrates:", "A case where its local choice misses the global optimum", "That the input is empty", "That the algorithm compiled", "That complexity is constant"],
    ["Fractional knapsack can use a greedy value-to-weight ratio because:", "Items may be divided and the exchange argument supports the choice", "Items cannot be divided", "Weights are always equal", "There are no values"],
    ["Which property is commonly used to justify greedy choices?", "Greedy-choice property", "Array contiguity", "Stack overflow", "Hash collision"],
    ["A greedy algorithm's runtime depends on operations such as:", "Sorting candidates and scanning them", "The number of all possible subsets always", "Only the output size", "The operating system theme"],
    ["For denominations [1, 3, 4], greedy for amount 6 gives 4+1+1, while optimum is 3+3. This shows:", "Greedy is not optimal for every denomination set", "The amount cannot be represented", "Coins are sorted incorrectly", "Dynamic programming is impossible"],
    ["Before using greedy for optimization, one should:", "Check the problem structure and establish a correctness argument", "Assume every local choice works", "Skip edge cases", "Replace all recursion with loops"],
  ],
  [
    ["For an unweighted campus route graph, shortest path by number of edges uses:", "BFS", "DFS", "Insertion sort", "Binary search"],
    ["A visited set in graph traversal records:", "Vertices already discovered or processed", "Only edge weights", "The shortest tree height", "Array indices"],
    ["A sparse graph with many vertices is often stored as:", "Adjacency lists", "A dense V×V matrix by default", "A single stack", "A sorted queue"],
    ["For a minimum spanning tree, a greedy safe-edge rule is used by:", "Kruskal or Prim", "BFS alone", "Binary search", "Fibonacci recursion"],
    ["Kruskal's algorithm sorts edges and avoids cycles using:", "A disjoint-set structure", "A call stack only", "A character map", "A circular queue"],
    ["A nearest-neighbor route heuristic may fail to find:", "The globally shortest tour", "Any next vertex", "A graph representation", "A local choice"],
    ["On an unweighted graph, BFS distance increases by:", "One edge per layer", "The edge weight squared", "One vertex label", "No fixed amount"],
    ["A graph may contain isolated vertices; a full traversal forest needs:", "Start a traversal at each unvisited vertex", "One BFS from an arbitrary vertex only", "Delete the isolated vertices", "A binary heap of all possible edges"],
    ["A greedy proof often uses an exchange argument to show:", "An optimal solution can be transformed to include the greedy choice", "All vertices are connected", "Every edge has equal weight", "The input is sorted"],
    ["Why distinguish shortest path from minimum spanning tree?", "They optimize different graph objectives", "They are the same tree for every graph", "One is only for arrays", "Both ignore edge weights always"],
  ],
  [
    ["Dynamic programming is especially useful with:", "Overlapping subproblems and optimal substructure", "Only independent tasks", "No repeated states", "Unsorted strings exclusively"],
    ["A DP state should clearly define:", "What subproblem its stored value represents", "The programming-language version", "The color of a table cell", "The number of comments"],
    ["For Fibonacci, the recurrence is:", "F(n)=F(n-1)+F(n-2)", "F(n)=n²", "F(n)=F(n/2)", "F(n)=F(n-1)-1"],
    ["Memoization stores results to avoid:", "Recomputing the same subproblem", "Using a base case", "Returning output", "All memory use"],
    ["Tabulation generally computes states:", "In an order where dependencies are already available", "In random order", "Only after recursion overflows", "By sorting the answers"],
    ["Naive recursive Fibonacci has exponential growth because:", "It repeats many overlapping calls", "It visits each state once", "It has no branching", "It uses a queue"],
    ["A DP base case represents:", "A smallest subproblem with a directly known answer", "The largest input only", "An invalid state to ignore", "A compiler error"],
    ["If a DP table has n rows and W columns, its full storage is:", "O(nW)", "O(n+W)", "O(log n)", "O(1)"],
    ["To justify a DP recurrence, establish:", "That its transitions cover valid optimal choices", "That the table is square", "That every value is positive", "That it uses recursion"],
    ["A common DP optimization reduces space by:", "Keeping only prior states needed for the next transition", "Removing the recurrence", "Storing every possible output", "Sorting the input twice"],
  ],
  [
    ["Naive recursive Fibonacci has time approximately:", "O(2ⁿ)", "O(n)", "O(log n)", "O(1)"],
    ["Memoized Fibonacci computes each state once, giving time:", "O(n)", "O(2ⁿ)", "O(n²)", "O(log n)"],
    ["Bottom-up Fibonacci with two rolling variables uses extra space:", "O(1)", "O(n)", "O(n²)", "O(log n)"],
    ["With F0=0 and F1=1, F6 equals:", "8", "5", "13", "6"],
    ["The memoized recursive version may still use call-stack space:", "O(n)", "O(1) always", "O(n²)", "O(2ⁿ) stack frames simultaneously"],
    ["Why compute F2 before F3 in tabulation?", "F3 depends on earlier Fibonacci values", "F2 is always larger", "The array must be sorted", "The base cases are discarded"],
    ["For n=0, a robust Fibonacci implementation should return:", "0", "1", "-1", "An uninitialized value"],
    ["Memoization is a top-down method because it:", "Starts from the requested state and recursively caches dependencies", "Fills all states first", "Sorts values descending", "Avoids recursive calls"],
    ["A tabulation loop accidentally starting at i=3 may fail when:", "The requested n is 2", "n is very large only", "The input is a string", "The values are negative"],
    ["Comparing recursive, memoized, and iterative Fibonacci demonstrates:", "Different time and space trade-offs for the same recurrence", "Different mathematical sequences", "That recursion is always fastest", "That complexity is irrelevant"],
  ],
  [
    ["For minimum coin change, a useful dp[x] definition is:", "Minimum coins needed to make amount x", "Largest coin denomination", "Number of items in the input", "The first coin only"],
    ["With coins [1,3,4], the minimum coins for amount 6 is:", "2", "3", "6", "1"],
    ["For 0/1 knapsack, each item can be selected:", "At most once", "An unlimited number of times", "Only when weight is zero", "Only after sorting by name"],
    ["A 2D 0/1 knapsack table commonly has dimensions:", "Items × capacities", "Vertices × edges", "Strings × characters", "Only one cell"],
    ["A 0/1 knapsack transition compares skipping an item with:", "Taking it once if it fits", "Taking it infinitely", "Sorting the capacity", "Removing the prior row"],
    ["If every coin denomination exceeds a positive amount, the amount is:", "Unreachable", "Always one coin", "Zero coins", "A negative amount"],
    ["A full n-by-W knapsack table uses space:", "O(nW)", "O(n+W)", "O(log n)", "O(1)"],
    ["A one-dimensional 0/1 knapsack update usually iterates capacity:", "Downward, to avoid reusing the same item", "Upward always", "In random order", "Only at zero"],
    ["An unbounded knapsack differs because an item may be:", "Chosen multiple times", "Chosen at most once", "Used only if negative", "Always excluded"],
    ["Before applying a recurrence, confirm whether the objective is:", "Minimum count, maximum value, or number of combinations", "The array's color", "The recursion depth only", "The order of file names"],
  ],
  [
    ["Backtracking constructs a candidate:", "Incrementally, undoing a choice when needed", "Only after enumerating all output strings", "By sorting the input", "With no alternatives"],
    ["In N-Queens, two queens conflict on a diagonal when:", "Their row distance equals their column distance", "Their labels are equal", "They share a color", "Their row numbers multiply to 8"],
    ["A partial N-Queens board with an attack can be:", "Pruned immediately", "Accepted as a solution", "Sorted by columns", "Converted to a queue"],
    ["Backtracking differs from unpruned brute force by:", "Rejecting partial branches that cannot yield a solution", "Never trying alternatives", "Using O(1) time", "Avoiding a search tree"],
    ["After a recursive branch returns, undoing a queen placement is needed to:", "Restore state before trying the next column", "Increase board size", "Mark all columns occupied forever", "Sort the rows"],
    ["A typical N-Queens search explores choices row by row, so a state can store:", "Column positions already chosen", "Only the final board score", "Graph edge weights", "A sorted array"],
    ["If a maze move leads to a wall, the solver should:", "Reject that branch", "Mark the wall as the goal", "Continue through it", "Delete the start"],
    ["The solution depth in an n-queen placement search is:", "n queen placements", "n² completed boards always", "one placement", "unbounded"],
    ["A safe constraint check should test:", "Column and both diagonal conflicts", "Only whether row numbers are even", "Only the last cell", "The board's file size"],
    ["Why can backtracking still have exponential worst-case time?", "It may explore many combinations before pruning", "It always visits one state", "It sorts in O(n)", "It uses a queue"],
  ],
  [
    ["Two pointers on a sorted array can find a target sum in:", "O(n)", "O(n²)", "O(log n) without comparisons", "O(1) for all inputs"],
    ["For sorted [1,2,3,4] and target 6, a matching pair is:", "2 + 4", "1 + 4", "1 + 3", "3 + 4"],
    ["If the current two-pointer sum is too small, move:", "The left pointer right to increase the sum", "The right pointer left", "Both pointers to zero", "Neither pointer"],
    ["A sliding window represents a:", "Contiguous range", "Tree path only", "Set of arbitrary indices", "Sorted permutation"],
    ["For a variable-size window that exceeds a limit, a common action is:", "Move the left boundary and update window state", "Restart the whole input every time", "Sort the window", "Move the right boundary backward forever"],
    ["A fixed-size window can update its sum by:", "Adding the new right item and removing the old left item", "Resumming the entire prefix necessarily", "Multiplying by the window length", "Sorting each window"],
    ["Two pointers for pair sum on unsorted input do not generally work because:", "Moving a boundary has no guaranteed effect on the sum", "Arrays cannot contain duplicates", "Addition is not defined", "Pointers require a tree"],
    ["In a no-repeat substring window, if a duplicate appears inside the window:", "Move the left boundary past the prior duplicate", "Delete the string", "Move left to index zero always", "Stop the algorithm"],
    ["A standard two-pointer scan often achieves O(1) auxiliary space because:", "It stores only a fixed number of indices", "It copies all subarrays", "It uses a recursion tree", "It sorts a second array"],
    ["A common sliding-window bug is failing to remove outgoing data, which causes:", "Incorrect window totals", "The input to become sorted", "The window to be empty always", "The loop to run O(1)"],
  ],
  [
    ["Lower-bound binary search returns:", "First index whose value is at least target", "Any matching index", "Last array index", "Number of duplicates"],
    ["For [1,2,2,2,5], lower bound of 2 is index:", "1", "2", "3", "4"],
    ["A half-open search range [low, high) includes:", "low but excludes high", "high but excludes low", "Both endpoints always", "Neither endpoint"],
    ["Exponential search first grows its bound by:", "Doubling the index/range size", "Adding one million every step", "Halving the array without checking", "Sorting the data"],
    ["Exponential search is useful when:", "The sorted array is unbounded or target is near the beginning", "The data is unsorted", "Only one element exists", "A graph has negative edges"],
    ["Interpolation search estimates position using:", "Values and an assumed distribution", "Only the middle index", "A stack top", "Graph degree"],
    ["Interpolation search can degrade to O(n) on:", "Highly non-uniform value distributions", "Perfectly uniform data only", "Every sorted array", "An empty input only"],
    ["A comparison sort has a general lower bound of:", "Ω(n log n) comparisons in the worst case", "Ω(1) for every arbitrary input", "Ω(n²) always", "Ω(log log n)"],
    ["For an already sorted array, binary search still uses:", "O(log n) worst-case comparisons", "O(1) for every target", "O(n²)", "O(n) extra memory"],
    ["When a duplicate exists, to find its first occurrence after a match:", "Continue searching the left portion while retaining a candidate", "Return immediately unconditionally", "Search only the right portion", "Sort descending"],
  ],
  [
    ["A useful debugging first step is:", "Reproduce the failure with a small input", "Rewrite the whole application", "Change several unrelated lines", "Remove all assertions"],
    ["Two-sum input [3,3] with target 6 requires:", "Using two distinct indices", "Using one index twice", "Sorting and deleting both values", "Returning index 3"],
    ["An invariant describes:", "A condition that should remain true during an algorithm", "A random output", "A compiler warning", "A user password"],
    ["An empty-array test can expose:", "Bad initialization or index assumptions", "Only CSS errors", "A sorting stability issue always", "Network latency"],
    ["When a test fails after a code change, change:", "One likely cause at a time and rerun relevant tests", "Every function at once", "The expected answer without checking", "The test runner"],
    ["A duplicate-heavy input is valuable for testing:", "Equality and deduplication logic", "Only memory allocation", "Whether input is sorted by default", "Page navigation"],
    ["A boundary off-by-one often appears at:", "The first or last valid index", "Only the middle item", "A CSS breakpoint", "A network port"],
    ["Property-based testing checks:", "Many inputs against general correctness properties", "Only one fixed screenshot", "The application's color palette", "Only login email casing"],
    ["A regression test should:", "Preserve a previously fixed behavior", "Replace every other test", "Use no expected result", "Be run only once manually"],
    ["Why isolate a minimal failing case?", "It reduces noise and reveals the defect condition", "It proves all inputs work", "It prevents future tests", "It makes complexity constant"],
  ],
  [
    ["A timed assessment should begin by:", "Clarifying input constraints and expected output", "Writing code before reading the prompt", "Skipping examples", "Assuming all values are unique"],
    ["A focused revision topic is best chosen from:", "Recorded errors and weak quiz results", "A random badge", "The longest title", "A guessed score"],
    ["For a sorted-input search, choosing binary search yields worst-case:", "O(log n)", "O(n²)", "O(1) regardless of target", "O(n log n)"],
    ["If an edge-case test fails, the best response is to:", "Identify which assumption or boundary failed", "Ignore it if normal cases pass", "Delete the test", "Increase the timer"],
    ["A solution explanation should include:", "Approach, correctness reasoning, complexity, and edge cases", "Only the code length", "Only the variable names", "A guarantee it is fastest"],
    ["When stuck during a timed problem, a good strategy is:", "Try a simpler example and write a brute-force baseline", "Stop checking correctness", "Change languages repeatedly", "Guess the output"],
    ["Reviewing why a distractor was wrong helps:", "Correct a misconception, not just memorize a letter", "Increase the score automatically", "Skip the underlying concept", "Hide all feedback"],
    ["A complexity estimate should state its:", "Input-size variable and relevant assumptions", "IDE theme", "File extension only", "Keyboard layout"],
    ["A confidence calibration exercise compares:", "Confidence with actual correctness", "Code color with runtime", "Input names with output names", "Screen size with score"],
    ["A useful post-assessment action is:", "Retry a related problem after reviewing the missed concept", "Repeat the same answer choices from memory only", "Avoid the weak topic", "Erase the attempt record"],
  ],
  [
    ["A final algorithm report should justify:", "Correctness and resource trade-offs", "Only the language selected", "The font size", "The number of files"],
    ["For n=8, binary search needs at most roughly:", "4 comparisons", "8 comparisons", "64 comparisons", "1 comparison always"],
    ["For array merge sort, auxiliary storage is typically:", "O(n)", "O(1)", "O(log n) total", "O(n²)"],
    ["BFS over an adjacency-list graph runs in:", "O(V+E)", "O(V²+E²)", "O(log V)", "O(1)"],
    ["A balanced BST lookup is typically:", "O(log n)", "O(n²)", "O(1) guaranteed", "O(n log n)"],
    ["A DP table should be checked for:", "Correct base cases, transitions, and state meaning", "A fixed color", "The largest possible array only", "A sorted output always"],
    ["An algorithm that is correct but exceeds memory limits needs:", "A space-aware alternative or optimization", "A different problem statement", "More comments", "A longer variable name"],
    ["For a graph with weighted nonnegative edges, a shortest-path algorithm must account for:", "Edge weights, not only BFS layers", "Only vertex labels", "Array indices", "The graph's title"],
    ["Which is a meaningful final edge-case check?", "Empty input, duplicates, and boundary constraints where allowed", "Only the sample case", "Only the largest positive value", "A screenshot"],
    ["After completing the program, the strongest next step is:", "Review recorded strengths and remaining weak topics", "Assume no further practice is useful", "Delete the progress history", "Repeat only the first question"],
  ],
];

const hintFor = (day, question) => {
  const lower = question.toLowerCase();
  if (lower.includes('binary search')) {
    return 'Check that the data is sorted, identify the current midpoint, and decide which half can still contain the target.';
  }
  if (lower.includes('linear search') || lower.includes('scan') || lower.includes('traversal')) {
    return 'Count how many elements may need to be inspected, including the case where the target is absent.';
  }
  if (lower.includes('quick sort') || lower.includes('pivot')) {
    return 'Consider how the pivot divides the input and how many recursive levels that split can create.';
  }
  if (lower.includes('merge sort') || lower.includes('merge')) {
    return 'Track the number of divide levels and the total work needed to combine values at each level.';
  }
  if (lower.includes('graph') || lower.includes('bfs') || lower.includes('dfs') || lower.includes('dijkstra') || lower.includes('vertex') || lower.includes('edge')) {
    return 'Identify the graph representation, the vertices or edges processed, and the data structure used to choose the next step.';
  }
  if (lower.includes('dynamic program') || lower.includes('dp') || lower.includes('table') || lower.includes('subproblem')) {
    return 'Name the state, its base cases, and how many table entries or transitions are evaluated.';
  }
  if (lower.includes('stack') || lower.includes('queue') || lower.includes('heap')) {
    return 'Apply the structure’s ordering rule: LIFO for a stack, FIFO for a queue, or priority order for a heap.';
  }
  if (lower.includes('sort') || lower.includes('sorting')) {
    return 'Follow the algorithm’s comparison or placement rule, then account for input order and any extra storage.';
  }
  if (lower.includes('recursion') || lower.includes('recursive') || lower.includes('base case')) {
    return 'Trace one call toward the base case and check whether each call makes progress.';
  }
  if (lower.includes("complexity") || lower.includes("growth") || lower.includes("time") || lower.includes("space")) {
    return `Name the input-size variable and count how the repeated work or stored state grows for Day ${day}.`;
  }
  if (lower.includes("trace") || lower.includes("after") || lower.includes("result") || lower.includes("returns")) {
    return `Trace the stated small example one operation at a time; write down the state after each step.`;
  }
  if (lower.includes("empty") || lower.includes("boundary") || lower.includes("index")) {
    return `Check the smallest valid input and the first/last legal position before choosing.`;
  }
  return `Recall the Day ${day} invariant, then eliminate options that violate it.`;
};

const explanationFor = (prompt, answer) => {
  const question = prompt.toLowerCase();
  if (question.includes('binary search')) {
    return `Binary search depends on sorted order and the midpoint comparison; ${answer} follows from the remaining search interval.`;
  }
  if (question.includes('quick sort') || question.includes('pivot')) {
    return `The pivot partitions the current range, and the recursion depth depends on how balanced those partitions are; ${answer} matches that behavior.`;
  }
  if (question.includes('merge sort') || question.includes('merge')) {
    return `The divide-and-merge process performs work across logarithmically many levels; ${answer} reflects those levels and the merge work.`;
  }
  if (question.includes('graph') || question.includes('bfs') || question.includes('dfs') || question.includes('dijkstra') || question.includes('vertex') || question.includes('edge')) {
    return `Graph traversal or relaxation must account for the relevant vertices, edges, and representation; ${answer} is consistent with the stated method.`;
  }
  if (question.includes('dynamic program') || question.includes('dp') || question.includes('table') || question.includes('subproblem')) {
    return `The recurrence is evaluated from its base cases over the required states; ${answer} is the property or bound implied by those states.`;
  }
  if (question.includes('stack') || question.includes('queue') || question.includes('heap')) {
    return `The data structure follows its ordering invariant; applying it to the stated operations gives ${answer}.`;
  }
  if (question.includes("time") || question.includes("growth") || question.includes("complexity")) {
    return `The repeated work grows as ${answer}; the other choices either omit a loop/state factor or over-count the operations.`;
  }
  if (question.includes("space") || question.includes("memory") || question.includes("storage")) {
    return `The additional stored state grows as ${answer} under the stated implementation assumptions.`;
  }
  if (question.includes("input") || question.includes("returns") || question.includes("result") || question.includes("produces") || question.includes("gives")) {
    return `Tracing the stated input through the operation yields ${answer}.`;
  }
  if (question.includes("why") || question.includes("because")) {
    return `${answer} is the property that makes the described step correct for this algorithm.`;
  }
  return `The stated algorithm rule and input conditions lead to ${answer}; the alternatives violate that rule or assumption.`;
};

const makeQuestion = (row, id, day, answerOffset) => {
  const [prompt, correct, ...distractors] = row;
  const answerIndex = answerOffset % 4;
  const options = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === answerIndex ? correct : distractors[distractorIndex++]);
  }
  return {
    id,
    day,
    type: "single-choice",
    prompt,
    options,
    answer: answerIndex,
    explanation: explanationFor(prompt, correct),
    hint: hintFor(day, prompt),
  };
};

export const dailyQuizzes = rawDailyQuestions.map((rows, dayIndex) => rows.map((row, questionIndex) => {
  return makeQuestion(row, `day-${dayIndex + 1}-q-${questionIndex + 1}`, dayIndex + 1, questionIndex + dayIndex);
}));

const rawAssessmentQuestions = {
  foundation: [
    ["A scan of an unsorted list may inspect every item when the target is absent. What is its worst-case time?", "O(n)", "O(1)", "O(log n)", "O(n²)"],
    ["A sorted array has 64 values. Binary search repeatedly halves its active range. How many halvings reach a single candidate?", "6", "32", "64", "7"],
    ["Which operation on a singly linked list is O(1) when the node reference is already known?", "Insert a node after that referenced node", "Find the node at index n/2", "Search for a value", "Read the last node without a tail pointer"],
    ["A stack receives push(A), push(B), pop(). What value is removed?", "B", "A", "Both A and B", "No value"],
    ["A queue receives enqueue(A), enqueue(B), dequeue(). What value is removed?", "A", "B", "Both A and B", "No value"],
    ["A recursive function calls itself with n-1 and stops at n=0. What must be true for termination on n>=0?", "Each recursive call moves toward the base case", "Every call must allocate an array", "The base case must call itself", "The function must use two recursive calls"],
    ["For a linear scan, the best case occurs when:", "The target is at the first position", "The target is absent", "The target is last", "The list is reversed"],
    ["Which change makes binary search invalid without adding other logic?", "Allowing the array to become unsorted", "Using a midpoint index", "Checking equality", "Updating the lower bound after a smaller midpoint"],
    ["An algorithm uses a fixed number of variables while scanning n inputs. Its auxiliary space is:", "O(1)", "O(n)", "O(log n)", "O(n²)"],
    ["A correct algorithm specification should define:", "Valid inputs, required output, and behavior on edge cases", "Only its preferred variable names", "Only the expected runtime", "Only the number of functions"],
  ],
  sorting: [
    ["Merge sort divides an array into halves and merges the results. Its worst-case time is:", "O(n log n)", "O(n²)", "O(log n)", "O(1)"],
    ["Insertion sort on an already sorted array is typically:", "O(n)", "O(n²)", "O(n log n)", "O(2ⁿ)"],
    ["A stable sort preserves the relative order of:", "Equal-key records", "All unequal values", "The input indices after reversal", "Only the minimum values"],
    ["Quicksort repeatedly chooses a pivot. With consistently extreme pivots, the recursion depth can reach:", "O(n)", "O(log n)", "O(1)", "O(n log n)"],
    ["For a heap of n values, removing the maximum and restoring heap order takes:", "O(log n)", "O(1)", "O(n)", "O(n log n)"],
    ["A hash table with separate chaining handles collisions by:", "Keeping multiple entries in a bucket structure", "Rejecting all repeated hash values", "Sorting the entire table", "Expanding every key into a tree automatically"],
    ["An array-based min-heap stores each parent's children at indices:", "2i+1 and 2i+2 (zero-based)", "i-1 and i+1", "i/2 and i/3", "2i and 2i-1 only"],
    ["Why is a balanced binary search tree useful?", "It keeps search, insertion, and deletion height near O(log n)", "It makes every traversal O(1)", "It removes the ordering invariant", "It guarantees no duplicate values"],
    ["A sorting method that repeatedly compares adjacent values and swaps inverted pairs is:", "Bubble sort", "Binary search", "Depth-first search", "Counting sort"],
    ["When counting sort is applied to integer keys in a small range k, its typical time is:", "O(n+k)", "O(n log n) regardless of k", "O(kⁿ)", "O(1)"],
  ],
  graphs: [
    ["With an adjacency list, BFS processes all vertices and edges in:", "O(V+E)", "O(V²)", "O(E log E)", "O(1)"],
    ["BFS finds shortest paths by number of edges in an unweighted graph because it:", "Explores vertices in nondecreasing distance layers", "Always selects the smallest label", "Uses recursion", "Sorts all edges by weight"],
    ["DFS is commonly used to detect a cycle in a directed graph by tracking:", "The current recursion/path state", "Only the total edge count", "The smallest vertex label", "The queue length"],
    ["Dijkstra's algorithm requires edge weights to be:", "Nonnegative", "All negative", "Distinct", "Exactly one"],
    ["For a dense graph represented by an adjacency matrix, scanning all vertices for each Dijkstra minimum can take:", "O(V²)", "O(E log V) in every implementation", "O(log V)", "O(1)"],
    ["A topological ordering exists for a directed graph when it is:", "A directed acyclic graph", "A connected undirected graph", "A weighted tree only", "A graph with a self-loop"],
    ["Union-Find is especially useful for:", "Tracking connected components as edges are added", "Finding a weighted shortest path by itself", "Sorting an array", "Calculating all-pairs distances"],
    ["Kruskal's minimum spanning tree algorithm typically considers edges in:", "Nondecreasing weight order", "Vertex discovery order", "Reverse input order", "Random order without checks"],
    ["A tree with V vertices has how many edges?", "V-1", "V", "V+1", "2V"],
    ["Floyd-Warshall computes all-pairs shortest paths using:", "O(V³) time and O(V²) distance storage", "O(E) time and O(1) storage", "O(log V) time", "O(V+E) time only"],
  ],
  final: [
    ["A dynamic program has overlapping subproblems and optimal substructure. A common implementation choice is:", "Memoization or tabulation", "Random pivot selection only", "Linear probing only", "A FIFO queue only"],
    ["For an n by m LCS table, the standard algorithm uses:", "O(nm) time and O(nm) space", "O(n+m) time and O(1) space", "O(2ⁿ) time and O(1) space", "O(log nm) time"],
    ["Greedy activity selection maximizes the number of compatible activities by choosing the next activity with:", "Earliest finish time", "Latest start time", "Longest duration", "Largest identifier"],
    ["A 0/1 knapsack item may be selected:", "At most once", "Any fractional number of times", "An unlimited number of times", "Only when its value is zero"],
    ["For a graph with negative edge weights but no negative cycle, which single-source method is appropriate among these choices?", "Bellman-Ford", "Dijkstra", "BFS", "Binary search"],
    ["A monotonic stack is often used to solve next-greater-element problems in:", "O(n) time", "O(n² log n) time", "O(1) total time", "O(2ⁿ) space"],
    ["For a sliding window over an array, maintaining a running sum can reduce repeated range-sum work from:", "O(nk) to O(n)", "O(log n) to O(1)", "O(n) to O(2ⁿ)", "O(1) to O(n²)"],
    ["When comparing algorithms, an asymptotic bound should be interpreted together with:", "Input assumptions and implementation details", "The developer's screen size", "The number of comments", "The chosen file extension"],
    ["A robust algorithm test suite should include:", "Boundary, typical, and adversarial cases", "Only one successful example", "Only random positive integers", "Only a screenshot"],
    ["If a solution exceeds the memory limit, the most relevant next step is to:", "Review auxiliary storage and consider a more space-efficient method", "Increase the input until it crashes", "Change all variable names", "Remove correctness checks"],
  ],
};

export const assessmentDefinitions = [
  { id: "foundation", title: "Foundation Assessment", days: [1, 2, 3, 4, 5, 6, 7] },
  { id: "sorting", title: "Sorting and Data Structures Assessment", days: [8, 9, 10, 11, 12, 13, 14] },
  { id: "graphs", title: "Trees, Graphs, and Greedy Assessment", days: [15, 16, 17, 18, 19, 20, 21] },
  { id: "final", title: "Comprehensive Final Assessment", days: Array.from({ length: 30 }, (_, index) => index + 1) },
];

export const assessments = assessmentDefinitions.map(definition => {
  const day = definition.days.at(-1);
  const questions = rawAssessmentQuestions[definition.id].map((row, index) =>
    makeQuestion(row, `${definition.id}-assessment-q-${index + 1}`, day, index + day)
  );
  return { ...definition, questions };
});
