/**
 * Algorithm Hub — Comprehensive Explanation Dataset
 * Contains deep explanations, YouTube video IDs, step-by-step logic, dry-run traces,
 * real-world analogies, multi-language code snippets, and explicit complexity analysis for documented algorithms.
 */
window.algorithmExplanations = window.algorithmExplanations || {};

(() => {
  const dataset = {
    // ==========================================
    // 1. SEARCHING ALGORITHMS
    // ==========================================
    'linear-search': {
      name: 'Linear Search',
      category: 'Searching',
      categoryKey: 'searching',
      difficulty: 'easy',
      summary: 'Sequentially checks every element in a list one by one until the target value is found or the end of the collection is reached.',
      videoId: '2JQRPh5bUmk',
      videoTitle: 'Linear Search Algorithm Explained Step by Step',
      steps: [
        { title: 'Step 1: Start at the Beginning', description: 'Initialize an index pointer at index 0 (the first element of the array).' },
        { title: 'Step 2: Compare with Target', description: 'Check if the current element matches the search key: `array[i] === target`.' },
        { title: 'Step 3: Found Target', description: 'If a match is found, immediately return the current index `i`.' },
        { title: 'Step 4: Move Next & Repeat', description: 'If not matched, increment `i` by 1 and repeat Step 2 until the end of the array.' },
        { title: 'Step 5: Element Not Found', description: 'If the loop completes without finding a match, return `-1` to indicate the item does not exist.' }
      ],
      example: {
        input: 'Array = [10, 50, 30, 70, 80, 20, 90, 40], Target = 20',
        trace: [
          { step: 1, action: 'Check index 0 (Value = 10)', state: '[10 (compare), 50, 30, 70, 80, 20, 90, 40]', note: '10 != 20, advance' },
          { step: 2, action: 'Check index 1 (Value = 50)', state: '[10, 50 (compare), 30, 70, 80, 20, 90, 40]', note: '50 != 20, advance' },
          { step: 3, action: 'Check index 2 (Value = 30)', state: '[10, 50, 30 (compare), 70, 80, 20, 90, 40]', note: '30 != 20, advance' },
          { step: 4, action: 'Check index 3 (Value = 70)', state: '[10, 50, 30, 70 (compare), 80, 20, 90, 40]', note: '70 != 20, advance' },
          { step: 5, action: 'Check index 4 (Value = 80)', state: '[10, 50, 30, 70, 80 (compare), 20, 90, 40]', note: '80 != 20, advance' },
          { step: 6, action: 'Check index 5 (Value = 20)', state: '[10, 50, 30, 70, 80, 20 (MATCH), 90, 40]', note: '20 === 20 -> FOUND!' }
        ],
        output: 'Index 5 (Found in 6 comparisons)'
      },
      realLifeExample: {
        title: 'Finding Your Car in an Unmarked Parking Lot',
        analogy: 'Imagine walking down a row of cars in a huge shopping mall parking lot checking each car one by one until you spot your license plate.',
        practicalApp: 'Used in small collections, unsorted data streams, linked list searches where random memory access is unavailable, and debugging small datasets.',
        funFact: 'Linear search requires zero pre-processing or sorting, making it the most versatile and resilient search algorithm for raw data.'
      },
      complexity: {
        best: 'O(1)',
        average: 'O(n)',
        worst: 'O(n)',
        space: 'O(1)',
        bestDesc: 'Target is the very first element (index 0).',
        avgDesc: 'Target is located roughly in the middle of the collection (n/2 checks).',
        worstDesc: 'Target is at the last index or not present in the array at all.',
        spaceDesc: 'Operates in-place with zero additional memory overhead.'
      },
      code: {
        python: `def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i  # Target found at index i\n    return -1  # Target not found\n\n# Test\narr = [10, 50, 30, 70, 80, 20, 90, 40]\nprint(linear_search(arr, 20)) # Output: 5`,
        javascript: `function linearSearch(arr, target) {\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] === target) {\n            return i;\n        }\n    }\n    return -1;\n}\n\n// Test\nconst arr = [10, 50, 30, 70, 80, 20, 90, 40];\nconsole.log(linearSearch(arr, 20)); // Output: 5`,
        java: `public class LinearSearch {\n    public static int search(int[] arr, int target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) {\n                return i;\n            }\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] arr = {10, 50, 30, 70, 80, 20, 90, 40};\n        System.out.println(search(arr, 20)); // Output: 5\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint linearSearch(const vector<int>& arr, int target) {\n    for (int i = 0; i < arr.size(); i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> arr = {10, 50, 30, 70, 80, 20, 90, 40};\n    cout << linearSearch(arr, 20) << endl; // Output: 5\n    return 0;\n}`,
        pseudocode: `FUNCTION linearSearch(array, target):\n    FOR i FROM 0 TO length(array) - 1:\n        IF array[i] == target THEN\n            RETURN i\n        END IF\n    END FOR\n    RETURN -1\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Brute Force / Sequential Scan',
        inPlace: 'Yes',
        stable: 'N/A',
        dataStructure: 'Array, Linked List, Stream',
        pros: ['Works on unsorted data', 'Simple to implement', 'O(1) auxiliary memory', 'Excellent cache locality for small arrays'],
        cons: ['Slow for large datasets O(n)', 'Inefficient compared to binary search on ordered arrays']
      },
      interviewProblems: [
        { name: 'Linear Search / Find Element', platform: 'GeeksforGeeks', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/linear-search/' },
        { name: 'Check If N and Its Double Exist', platform: 'LeetCode', difficulty: 'Easy', link: 'https://leetcode.com/problems/check-if-n-and-its-double-exist/' }
      ]
    },

    'binary-search': {
      name: 'Binary Search',
      category: 'Searching',
      categoryKey: 'searching',
      difficulty: 'easy',
      summary: 'A highly efficient search algorithm that works on sorted collections by repeatedly dividing the search interval in half.',
      videoId: 'MFhxShGxHWc',
      videoTitle: 'Binary Search Algorithm in 100 Seconds | Fireship',
      steps: [
        { title: 'Step 1: Set Pointers', description: 'Initialize two pointers: `low = 0` and `high = length - 1`.' },
        { title: 'Step 2: Calculate Midpoint', description: 'Compute middle index `mid = low + Math.floor((high - low) / 2)` to avoid integer overflow.' },
        { title: 'Step 3: Compare Mid with Target', description: 'If `array[mid] === target`, return `mid` (element found).' },
        { title: 'Step 4: Adjust Search Window', description: 'If `target < array[mid]`, target must be in the left half, so set `high = mid - 1`. If `target > array[mid]`, set `low = mid + 1`.' },
        { title: 'Step 5: Repeat or Exit', description: 'Repeat steps 2-4 while `low <= high`. If pointers cross without a match, return `-1`.' }
      ],
      example: {
        input: 'Sorted Array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], Target = 23',
        trace: [
          { step: 1, action: 'Initial Window [0..9]', state: 'low=0 (2), high=9 (91) -> mid=4 (val=16)', note: '16 < 23 -> Target in right half. Set low = 5' },
          { step: 2, action: 'Narrow Window [5..9]', state: 'low=5 (23), high=9 (91) -> mid=7 (val=56)', note: '56 > 23 -> Target in left half. Set high = 6' },
          { step: 3, action: 'Narrow Window [5..6]', state: 'low=5 (23), high=6 (38) -> mid=5 (val=23)', note: '23 === 23 -> FOUND TARGET!' }
        ],
        output: 'Index 5 (Found in only 3 comparisons across 10 items)'
      },
      realLifeExample: {
        title: 'Opening a Physical Dictionary to a Word',
        analogy: 'When looking up "Quantum" in a dictionary, you open directly to the middle. Seeing "M", you immediately eliminate the entire first half of the book and jump halfway into the second half.',
        practicalApp: 'Database B-Tree indexing, Git bisect (finding bug-introducing commits), numerical root finding, search engine index lookups.',
        funFact: 'Binary Search can search through 4 billion sorted records in at most 32 comparisons!'
      },
      complexity: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)',
        space: 'O(1)',
        bestDesc: 'Target is located exactly at the first calculated midpoint.',
        avgDesc: 'Each step cuts search space in half, requiring ~log2(n) iterations.',
        worstDesc: 'Search narrows down to a single element before finding or exhausting.',
        spaceDesc: 'Iterative version uses O(1) space; recursive uses O(log n) call stack.'
      },
      code: {
        python: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\n# Test\narr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(binary_search(arr, 23)) # Output: 5`,
        javascript: `function binarySearch(arr, target) {\n    let low = 0;\n    let high = arr.length - 1;\n    while (low <= high) {\n        const mid = Math.floor(low + (high - low) / 2);\n        if (arr[mid] === target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\n// Test\nconst arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];\nconsole.log(binarySearch(arr, 23)); // Output: 5`,
        java: `public class BinarySearch {\n    public static int search(int[] arr, int target) {\n        int low = 0, high = arr.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n        System.out.println(search(arr, 23)); // Output: 5\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(const vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n    cout << binarySearch(arr, 23) << endl; // Output: 5\n    return 0;\n}`,
        pseudocode: `FUNCTION binarySearch(array, target):\n    low = 0\n    high = length(array) - 1\n    WHILE low <= high DO\n        mid = low + (high - low) / 2\n        IF array[mid] == target THEN\n            RETURN mid\n        ELSE IF array[mid] < target THEN\n            low = mid + 1\n        ELSE\n            high = mid - 1\n        END IF\n    END WHILE\n    RETURN -1\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Divide and Conquer / Decrease and Conquer',
        inPlace: 'Yes',
        stable: 'N/A',
        dataStructure: 'Sorted Array',
        pros: ['Extremely fast logarithmic time O(log n)', 'Minimal space overhead O(1)', 'Ideal for large read-heavy datasets'],
        cons: ['Requires array to be pre-sorted', 'Inefficient for linked lists without random access indexing']
      },
      interviewProblems: [
        { name: 'Binary Search', platform: 'LeetCode', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-search/' },
        { name: 'Search in Rotated Sorted Array', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
        { name: 'Find First and Last Position of Element', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' }
      ]
    },

    'jump-search': {
      name: 'Jump Search',
      category: 'Searching',
      categoryKey: 'searching',
      difficulty: 'medium',
      summary: 'Searches sorted arrays by jumping ahead by fixed steps of size √n, then performing a linear search backwards in the identified block.',
      videoId: 't2mUMFgJPbU',
      videoTitle: 'Jump Search Algorithm Explained: How & When to Use It',
      steps: [
        { title: 'Step 1: Calculate Block Step', description: 'Set jump step size `step = Math.floor(Math.sqrt(n))`.' },
        { title: 'Step 2: Jump Ahead', description: 'Jump through blocks `step, 2*step, 3*step...` as long as the element at the block boundary is less than the target.' },
        { title: 'Step 3: Identify Block', description: 'When `array[min(step, n)-1] >= target`, we have found the block where the target must reside.' },
        { title: 'Step 4: Linear Backward Scan', description: 'Perform a linear search starting from the previous jump point to the current block boundary.' },
        { title: 'Step 5: Return Index or -1', description: 'If target is found return its index, otherwise return -1.' }
      ],
      example: {
        input: 'Array = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610], Target = 55 (n=16, Step=4)',
        trace: [
          { step: 1, action: 'Jump to index 3 (Value = 2)', state: 'arr[3]=2 < 55', note: 'Jump again (+4)' },
          { step: 2, action: 'Jump to index 7 (Value = 13)', state: 'arr[7]=13 < 55', note: 'Jump again (+4)' },
          { step: 3, action: 'Jump to index 11 (Value = 89)', state: 'arr[11]=89 >= 55', note: 'Block identified between index 8 and 11!' },
          { step: 4, action: 'Linear scan in block [8..11]', state: 'Check arr[8]=21, arr[9]=34, arr[10]=55', note: '55 === 55 at index 10 -> FOUND!' }
        ],
        output: 'Index 10'
      },
      realLifeExample: {
        title: 'Skipping Chapters in a Textbook',
        analogy: 'When looking for a specific topic, you skip 4 chapters at a time until you pass the topic, then turn pages backward one by one.',
        practicalApp: 'Useful on hardware or systems where jumping backwards is expensive compared to forward jumps (e.g. tape drives, single-direction network streams).',
        funFact: 'Jump search is faster than linear search and slower than binary search, but only jumps back once!'
      },
      complexity: {
        best: 'O(1)', average: 'O(√n)', worst: 'O(√n)', space: 'O(1)',
        bestDesc: 'Target is the first element at index 0.',
        avgDesc: 'Average case requires ~(n/m + m/2) comparisons, optimal when m = √n.',
        worstDesc: 'Target is the last element in the last block.',
        spaceDesc: 'O(1) extra variables for step tracking.'
      },
      code: {
        python: `import math\n\ndef jump_search(arr, target):\n    n = len(arr)\n    step = int(math.sqrt(n))\n    prev = 0\n    while arr[min(step, n)-1] < target:\n        prev = step\n        step += int(math.sqrt(n))\n        if prev >= n:\n            return -1\n    while arr[prev] < target:\n        prev += 1\n        if prev == min(step, n):\n            return -1\n    if arr[prev] == target:\n        return prev\n    return -1`,
        javascript: `function jumpSearch(arr, target) {\n    const n = arr.length;\n    let step = Math.floor(Math.sqrt(n));\n    let prev = 0;\n    while (arr[Math.min(step, n) - 1] < target) {\n        prev = step;\n        step += Math.floor(Math.sqrt(n));\n        if (prev >= n) return -1;\n    }\n    while (arr[prev] < target) {\n        prev++;\n        if (prev === Math.min(step, n)) return -1;\n    }\n    return arr[prev] === target ? prev : -1;\n}`,
        java: `public class JumpSearch {\n    public static int search(int[] arr, int target) {\n        int n = arr.length;\n        int step = (int)Math.floor(Math.sqrt(n));\n        int prev = 0;\n        while (arr[Math.min(step, n) - 1] < target) {\n            prev = step;\n            step += (int)Math.floor(Math.sqrt(n));\n            if (prev >= n) return -1;\n        }\n        while (arr[prev] < target) {\n            prev++;\n            if (prev == Math.min(step, n)) return -1;\n        }\n        return arr[prev] == target ? prev : -1;\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\n#include <cmath>\nusing namespace std;\n\nint jumpSearch(const vector<int>& arr, int target) {\n    int n = arr.size();\n    int step = sqrt(n);\n    int prev = 0;\n    while (arr[min(step, n) - 1] < target) {\n        prev = step;\n        step += sqrt(n);\n        if (prev >= n) return -1;\n    }\n    while (arr[prev] < target) {\n        prev++;\n        if (prev == min(step, n)) return -1;\n    }\n    return arr[prev] == target ? prev : -1;\n}`,
        pseudocode: `FUNCTION jumpSearch(arr, target):\n    n = length(arr)\n    step = floor(sqrt(n))\n    prev = 0\n    WHILE arr[min(step, n)-1] < target DO\n        prev = step\n        step = step + floor(sqrt(n))\n        IF prev >= n THEN RETURN -1\n    END WHILE\n    WHILE arr[prev] < target DO\n        prev = prev + 1\n        IF prev == min(step, n) THEN RETURN -1\n    END WHILE\n    IF arr[prev] == target THEN RETURN prev\n    RETURN -1\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Block Search / √n-hopping',
        inPlace: 'Yes',
        stable: 'N/A',
        dataStructure: 'Sorted Array',
        pros: ['Faster than linear search O(√n) vs O(n)', 'Only one backward jump required', 'Simpler than binary search on forward-only streams'],
        cons: ['Slower than binary search O(log n)', 'Requires sorted data']
      },
      interviewProblems: [
        { name: 'Jump Search Implementation', platform: 'GeeksforGeeks', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/jump-search/' }
      ]
    },

    // ==========================================
    // 2. SORTING ALGORITHMS
    // ==========================================
    'bubble-sort': {
      name: 'Bubble Sort',
      category: 'Sorting',
      categoryKey: 'sorting',
      difficulty: 'easy',
      summary: 'A classic comparison sorting algorithm that repeatedly steps through the list, compares adjacent items and swaps them if they are in the wrong order.',
      videoId: 'xli_FI7CuzA',
      videoTitle: 'Bubble Sort in 2 Minutes | CS Dojo',
      steps: [
        { title: 'Step 1: Outer Pass', description: 'Start a pass from index 0 to `n - i - 1` where `i` is the completed pass counter.' },
        { title: 'Step 2: Adjacent Comparison', description: 'Compare the current element `arr[j]` with its neighbor `arr[j+1]`.' },
        { title: 'Step 3: Swap if Inverted', description: 'If `arr[j] > arr[j+1]`, swap their positions so the larger number floats rightward.' },
        { title: 'Step 4: Repeat for All Passes', description: 'After pass `i`, the `i`-th largest element is guaranteed to be locked into its final sorted position at the end.' },
        { title: 'Step 5: Optimized Early Exit', description: 'If no swaps occurred in a pass, the array is already sorted—terminate early!' }
      ],
      example: {
        input: 'Array = [5, 1, 4, 2, 8]',
        trace: [
          { step: 1, action: 'Pass 1, compare (5, 1)', state: '[1, 5, 4, 2, 8]', note: '5 > 1 -> Swap!' },
          { step: 2, action: 'Pass 1, compare (5, 4)', state: '[1, 4, 5, 2, 8]', note: '5 > 4 -> Swap!' },
          { step: 3, action: 'Pass 1, compare (5, 2)', state: '[1, 4, 2, 5, 8]', note: '5 > 2 -> Swap!' },
          { step: 4, action: 'Pass 1, compare (5, 8)', state: '[1, 4, 2, 5, 8 (LOCKED)]', note: '5 < 8 -> No swap, 8 locked' },
          { step: 5, action: 'Pass 2, compare (1, 4), (4, 2)', state: '[1, 2, 4, 5 (LOCKED), 8 (LOCKED)]', note: '4 > 2 swapped, 5 locked' },
          { step: 6, action: 'Pass 3, verify array is sorted', state: '[1, 2, 4, 5, 8]', note: 'Zero swaps -> Early finish!' }
        ],
        output: '[1, 2, 4, 5, 8]'
      },
      realLifeExample: {
        title: 'Students Lining Up by Height',
        analogy: 'Imagine a line of students where each person compares their height with the person next to them and swaps places if the left person is taller. Heavy elements bubble to the end.',
        practicalApp: 'Educational teaching of sorting concepts, tiny embedded devices with strictly limited memory, and detecting almost-sorted data in O(n).',
        funFact: 'Former US President Barack Obama was famously asked by Google CEO Eric Schmidt how to sort 1 million 32-bit integers, and replied: "The bubble sort would be the wrong way to go."'
      },
      complexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
        space: 'O(1)',
        bestDesc: 'Array is already sorted (detectable in 1 pass with swap flag).',
        avgDesc: 'Randomly ordered array requires roughly n(n-1)/4 comparisons and swaps.',
        worstDesc: 'Array is sorted in reverse order, requiring n(n-1)/2 swaps.',
        spaceDesc: 'Operates in-place using only O(1) temporary swap memory.'
      },
      code: {
        python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr\n\n# Test\nprint(bubble_sort([5, 1, 4, 2, 8])) # Output: [1, 2, 4, 5, 8]`,
        javascript: `function bubbleSort(arr) {\n    const n = arr.length;\n    for (let i = 0; i < n; i++) {\n        let swapped = false;\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n    return arr;\n}\n\n// Test\nconsole.log(bubbleSort([5, 1, 4, 2, 8])); // Output: [1, 2, 4, 5, 8]`,
        java: `public class BubbleSort {\n    public static void sort(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n; i++) {\n            boolean swapped = false;\n            for (int j = 0; j < n - i - 1; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                    swapped = true;\n                }\n            }\n            if (!swapped) break;\n        }\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n; i++) {\n        bool swapped = false;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}`,
        pseudocode: `FUNCTION bubbleSort(arr):\n    n = length(arr)\n    FOR i FROM 0 TO n - 1:\n        swapped = FALSE\n        FOR j FROM 0 TO n - i - 2:\n            IF arr[j] > arr[j + 1] THEN\n                SWAP(arr[j], arr[j + 1])\n                swapped = TRUE\n            END IF\n        END FOR\n        IF NOT swapped THEN BREAK\n    END FOR\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Comparison / Incremental Sorting',
        inPlace: 'Yes',
        stable: 'Yes (Preserves order of duplicate items)',
        dataStructure: 'Array',
        pros: ['Extremely simple logic', 'Stable sort', 'In-place with O(1) space', 'Fast O(n) best-case for pre-sorted lists'],
        cons: ['O(n²) time makes it very slow on large arrays', 'Excessive swaps compared to selection or insertion sort']
      },
      interviewProblems: [
        { name: 'Sort Colors (Dutch National Flag variant)', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/sort-colors/' },
        { name: 'Height Checker', platform: 'LeetCode', difficulty: 'Easy', link: 'https://leetcode.com/problems/height-checker/' }
      ]
    },

    'merge-sort': {
      name: 'Merge Sort',
      category: 'Sorting',
      categoryKey: 'sorting',
      difficulty: 'medium',
      summary: 'A fast, stable, divide-and-conquer algorithm that recursively divides an array into halves, sorts them, and merges the sorted halves.',
      videoId: '4VqmGXwpLqc',
      videoTitle: 'Merge Sort in 3 Minutes | Michael Sambol',
      steps: [
        { title: 'Step 1: Divide', description: 'Find the middle index of the array: `mid = Math.floor((left + right) / 2)`.' },
        { title: 'Step 2: Conquer (Recurse)', description: 'Recursively call `mergeSort` on the left half `[left..mid]` and right half `[mid+1..right]`.' },
        { title: 'Step 3: Base Case', description: 'When a sub-array contains only 1 element, it is already sorted by definition.' },
        { title: 'Step 4: Combine (Merge)', description: 'Merge the two sorted halves by comparing their elements one by one and placing the smaller item into the auxiliary buffer.' },
        { title: 'Step 5: Copy Back', description: 'Copy the sorted merged elements back into the original array segment.' }
      ],
      example: {
        input: 'Array = [38, 27, 43, 3, 9, 82, 10]',
        trace: [
          { step: 1, action: 'Split into [38, 27, 43, 3] and [9, 82, 10]', state: 'Divide down to single elements [38], [27], [43], [3], [9], [82], [10]', note: 'Recursive split' },
          { step: 2, action: 'Merge [38] & [27] -> [27, 38]', state: '[27, 38] and [3, 43]', note: 'First level merge' },
          { step: 3, action: 'Merge [27, 38] & [3, 43]', state: '[3, 27, 38, 43]', note: 'Left half fully sorted' },
          { step: 4, action: 'Merge [9] & [82] -> [9, 82], merge with [10] -> [9, 10, 82]', state: '[9, 10, 82]', note: 'Right half fully sorted' },
          { step: 5, action: 'Final Merge [3, 27, 38, 43] & [9, 10, 82]', state: '[3, 9, 10, 27, 38, 43, 82]', note: 'Complete array sorted!' }
        ],
        output: '[3, 9, 10, 27, 38, 43, 82]'
      },
      realLifeExample: {
        title: 'Merging Two Sorted Decks of Playing Cards',
        analogy: 'Take two piles of cards that are each sorted by rank. Look at the top card of each pile, take whichever is lower and place it on the new pile. Repeat until both piles are combined.',
        practicalApp: 'Used in Python’s Timsort (`list.sort()`), Java’s `Arrays.sort()` for objects, external sorting of multi-terabyte files on disk, and sorting linked lists.',
        funFact: 'Invented by John von Neumann in 1945, Merge Sort is one of the earliest algorithmic foundations of modern computer science.'
      },
      complexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)',
        space: 'O(n)',
        bestDesc: 'Guaranteed log n split levels, each doing linear O(n) merging work.',
        avgDesc: 'Consistently divides in half regardless of input distribution.',
        worstDesc: 'Still strictly O(n log n) even in pathological or reverse cases.',
        spaceDesc: 'Requires O(n) auxiliary storage for temporary merge arrays.'
      },
      code: {
        python: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    res = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            res.append(left[i])\n            i += 1\n        else:\n            res.append(right[j])\n            j += 1\n    res.extend(left[i:])\n    res.extend(right[j:])\n    return res\n\n# Test\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,
        javascript: `function mergeSort(arr) {\n    if (arr.length <= 1) return arr;\n    const mid = Math.floor(arr.length / 2);\n    const left = mergeSort(arr.slice(0, mid));\n    const right = mergeSort(arr.slice(mid));\n    return merge(left, right);\n}\n\nfunction merge(left, right) {\n    const res = [];\n    let i = 0, j = 0;\n    while (i < left.length && j < right.length) {\n        if (left[i] <= right[j]) res.push(left[i++]);\n        else res.push(right[j++]);\n    }\n    return res.concat(left.slice(i)).concat(right.slice(j));\n}`,
        java: `public class MergeSort {\n    public static void mergeSort(int[] arr, int l, int r) {\n        if (l < r) {\n            int m = l + (r - l) / 2;\n            mergeSort(arr, l, m);\n            mergeSort(arr, m + 1, r);\n            merge(arr, l, m, r);\n        }\n    }\n    private static void merge(int[] arr, int l, int m, int r) {\n        int n1 = m - l + 1, n2 = r - m;\n        int[] L = new int[n1], R = new int[n2];\n        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];\n        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];\n        int i = 0, j = 0, k = l;\n        while (i < n1 && j < n2) {\n            if (L[i] <= R[j]) arr[k++] = L[i++];\n            else arr[k++] = R[j++];\n        }\n        while (i < n1) arr[k++] = L[i++];\n        while (j < n2) arr[k++] = R[j++];\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid merge(vector<int>& arr, int l, int m, int r) {\n    vector<int> left(arr.begin() + l, arr.begin() + m + 1);\n    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);\n    int i = 0, j = 0, k = l;\n    while (i < left.size() && j < right.size()) {\n        if (left[i] <= right[j]) arr[k++] = left[i++];\n        else arr[k++] = right[j++];\n    }\n    while (i < left.size()) arr[k++] = left[i++];\n    while (j < right.size()) arr[k++] = right[j++];\n}\n\nvoid mergeSort(vector<int>& arr, int l, int r) {\n    if (l >= r) return;\n    int m = l + (r - l) / 2;\n    mergeSort(arr, l, m);\n    mergeSort(arr, m + 1, r);\n    merge(arr, l, m, r);\n}`,
        pseudocode: `FUNCTION mergeSort(arr, l, r):\n    IF l < r THEN\n        m = l + (r - l) / 2\n        mergeSort(arr, l, m)\n        mergeSort(arr, m + 1, r)\n        merge(arr, l, m, r)\n    END IF\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Divide and Conquer',
        inPlace: 'No (O(n) auxiliary buffer required for arrays)',
        stable: 'Yes (Crucial for object sorting)',
        dataStructure: 'Array, Linked List',
        pros: ['Guaranteed O(n log n) runtime', 'Stable sorting', 'Ideal for linked lists (O(1) space on lists)', 'Highly parallelizable'],
        cons: ['Requires O(n) extra space for arrays', 'Slower than QuickSort on average due to memory copying']
      },
      interviewProblems: [
        { name: 'Merge Sorted Array', platform: 'LeetCode', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-sorted-array/' },
        { name: 'Sort List (Linked List)', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/sort-list/' },
        { name: 'Count of Smaller Numbers After Self', platform: 'LeetCode', difficulty: 'Hard', link: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/' }
      ]
    },

    'quick-sort': {
      name: 'Quick Sort',
      category: 'Sorting',
      categoryKey: 'sorting',
      difficulty: 'medium',
      summary: 'A highly efficient in-place divide-and-conquer sorting algorithm that partitions an array around a chosen pivot element.',
      videoId: 'Hoixgm4-P4M',
      videoTitle: 'Quick Sort in 4 Minutes | Michael Sambol',
      steps: [
        { title: 'Step 1: Choose Pivot', description: 'Select an element as pivot (e.g., last element, first element, median-of-three, or random).' },
        { title: 'Step 2: Partitioning Phase', description: 'Reorder the array so all elements smaller than the pivot go to its left, and all larger elements go to its right.' },
        { title: 'Step 3: Lock Pivot Position', description: 'Place the pivot in its final, permanent sorted position index `p`.' },
        { title: 'Step 4: Recursively Sort Sub-arrays', description: 'Recursively apply Quick Sort to the left partition `[low..p-1]` and right partition `[p+1..high]`.' },
        { title: 'Step 5: Base Case', description: 'Stop when a partition has size 0 or 1.' }
      ],
      example: {
        input: 'Array = [10, 80, 30, 90, 40, 50, 70], Pivot = 70 (Last element)',
        trace: [
          { step: 1, action: 'Partition around pivot 70', state: 'Compare 10, 80, 30, 90, 40, 50 with 70', note: 'Elements < 70: [10, 30, 40, 50]; Elements > 70: [80, 90]' },
          { step: 2, action: 'Place Pivot 70 at index 4', state: '[10, 30, 40, 50, 70 (LOCKED), 90, 80]', note: 'Pivot 70 locked in position' },
          { step: 3, action: 'Sort left partition [10, 30, 40, 50]', state: '[10, 30, 40, 50] already sorted', note: 'Left partition done' },
          { step: 4, action: 'Sort right partition [90, 80] around pivot 80', state: '[80 (LOCKED), 90 (LOCKED)]', note: 'Right partition done' },
          { step: 5, action: 'All partitions resolved', state: '[10, 30, 40, 50, 70, 80, 90]', note: 'Complete array sorted!' }
        ],
        output: '[10, 30, 40, 50, 70, 80, 90]'
      },
      realLifeExample: {
        title: 'Organizing Books by Publication Year',
        analogy: 'Pick a random book from the pile (say year 2000). Throw all books published before 2000 to the left pile, and books published after 2000 to the right pile. Then repeat on each pile.',
        practicalApp: 'Default sorting routine in C standard library (`qsort`), C++ `std::sort` (Introsort), V8 JavaScript engine for numbers, and high-performance in-memory sorting.',
        funFact: 'Invented by Tony Hoare in 1959. Hoare developed it while trying to translate Russian text into English on a computer with very little memory!'
      },
      complexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)',
        space: 'O(log n) average; O(n) worst',
        bestDesc: 'Pivot splits array into two equal halves at every stage.',
        avgDesc: 'Typical random pivots create reasonably balanced partitions.',
        worstDesc: 'Array is sorted and pivot is always smallest/largest (creates n recursion depth).',
        spaceDesc: 'The last-element pivot implementation uses O(log n) average and O(n) worst-case recursion stack; partitioning itself is in-place.'
      },
      code: {
        python: `def quick_sort(arr, low=0, high=None):\n    if high is None:\n        high = len(arr) - 1\n    if low < high:\n        p = partition(arr, low, high)\n        quick_sort(arr, low, p - 1)\n        quick_sort(arr, p + 1, high)\n    return arr\n\ndef partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n    return i + 1\n\n# Test\nprint(quick_sort([10, 80, 30, 90, 40, 50, 70]))`,
        javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {\n    if (low < high) {\n        const p = partition(arr, low, high);\n        quickSort(arr, low, p - 1);\n        quickSort(arr, p + 1, high);\n    }\n    return arr;\n}\n\nfunction partition(arr, low, high) {\n    const pivot = arr[high];\n    let i = low - 1;\n    for (let j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            [arr[i], arr[j]] = [arr[j], arr[i]];\n        }\n    }\n    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n    return i + 1;\n}`,
        java: `public class QuickSort {\n    public static void sort(int[] arr, int low, int high) {\n        if (low < high) {\n            int pi = partition(arr, low, high);\n            sort(arr, low, pi - 1);\n            sort(arr, pi + 1, high);\n        }\n    }\n    private static int partition(int[] arr, int low, int high) {\n        int pivot = arr[high];\n        int i = low - 1;\n        for (int j = low; j < high; j++) {\n            if (arr[j] <= pivot) {\n                i++;\n                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;\n            }\n        }\n        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;\n        return i + 1;\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint partition(vector<int>& arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            swap(arr[i], arr[j]);\n        }\n    }\n    swap(arr[i + 1], arr[high]);\n    return i + 1;\n}\n\nvoid quickSort(vector<int>& arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
        pseudocode: `FUNCTION quickSort(arr, low, high):\n    IF low < high THEN\n        pi = partition(arr, low, high)\n        quickSort(arr, low, pi - 1)\n        quickSort(arr, pi + 1, high)\n    END IF\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Divide and Conquer',
        inPlace: 'Yes',
        stable: 'No (Swaps can disrupt relative order of equals)',
        dataStructure: 'Array',
        pros: ['Fastest general-purpose sorting algorithm in practice', 'Cache-friendly sequential memory access', 'In-place sorting with O(1) buffer space'],
        cons: ['O(n²) worst case if bad pivots selected', 'Unstable sort']
      },
      interviewProblems: [
        { name: 'Kth Largest Element in an Array (Quickselect)', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
        { name: 'Sort an Array', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/sort-an-array/' }
      ]
    },

    // ==========================================
    // 3. GRAPH ALGORITHMS
    // ==========================================
    'dijkstra': {
      name: 'Dijkstra’s Algorithm',
      category: 'Graphs',
      categoryKey: 'graph',
      difficulty: 'medium',
      summary: 'Finds the shortest paths between nodes in a weighted graph with non-negative edge weights using a priority queue greedy strategy.',
      videoId: 'EFg3u_E6eHU',
      videoTitle: 'Dijkstra’s Algorithm in 3 Minutes | Michael Sambol',
      steps: [
        { title: 'Step 1: Distance Initialization', description: 'Set distance to source node `dist[src] = 0` and all other node distances to `Infinity`. Push `(0, src)` to a Min-Priority Queue.' },
        { title: 'Step 2: Extract Minimum', description: 'Pop the node `u` with the smallest known tentative distance from the priority queue.' },
        { title: 'Step 3: Edge Relaxation', description: 'For every neighbor `v` of `u` with edge weight `w`: if `dist[u] + w < dist[v]`, update `dist[v] = dist[u] + w`.' },
        { title: 'Step 4: Push to Queue', description: 'Insert `(dist[v], v)` into the priority queue and record `parent[v] = u`.' },
        { title: 'Step 5: Repeat', description: 'Repeat until the priority queue is empty. Return the shortest distance array.' }
      ],
      example: {
        input: 'Graph Nodes: A, B, C, D | Edges: (A-B: 4), (A-C: 2), (C-B: 1), (B-D: 5), (C-D: 8) | Source = A',
        trace: [
          { step: 1, action: 'Initialize Distances', state: 'A:0, B:∞, C:∞, D:∞. Queue: [(0, A)]', note: 'Start at Source A' },
          { step: 2, action: 'Pop A (dist=0). Relax neighbors B and C', state: 'dist[B]=4, dist[C]=2. Queue: [(2, C), (4, B)]', note: 'Updated B and C' },
          { step: 3, action: 'Pop C (dist=2). Relax neighbors B and D', state: 'C->B (2+1=3 < 4) => dist[B]=3! dist[D] = 2+8 = 10', note: 'Shorter path to B found via C!' },
          { step: 4, action: 'Pop B (dist=3). Relax neighbor D', state: 'B->D (3+5=8 < 10) => dist[D]=8!', note: 'Shorter path to D found via B!' },
          { step: 5, action: 'Pop D (dist=8). No unvisited neighbors', state: 'A:0, B:3, C:2, D:8', note: 'Algorithm completes!' }
        ],
        output: 'Shortest paths from A: {A: 0, B: 3 (via C), C: 2, D: 8 (via A->C->B->D)}'
      },
      realLifeExample: {
        title: 'Google Maps GPS Navigation & Driving Route',
        analogy: 'Calculating the quickest driving route from your home to an airport, factoring in distance and speed limit weights on each road segment.',
        practicalApp: 'Internet packet routing (OSPF and IS-IS protocols), airline flight route optimization, robotic path planning in warehouse automation.',
        funFact: 'Edsger Dijkstra designed this algorithm in 1956 in just 20 minutes without using pencil and paper while sitting on a cafe terrace with his fiancée.'
      },
      complexity: {
        best: 'O((V + E) log V) with a heap',
        average: 'O((V + E) log V) with a heap; O(V² + E) in the shown JavaScript variant',
        worst: 'O((V + E) log V) with a binary heap; O(V² + E) in the shown JavaScript variant',
        space: 'O(V + E) heap variants; O(V) shown JavaScript variant',
        bestDesc: 'The Python, Java, and C++ examples use a priority queue; the JavaScript example scans all vertices to select each minimum.',
        avgDesc: 'Heap variants use lazy queue entries; the shown JavaScript variant performs a linear vertex scan on each selection.',
        worstDesc: 'Assumes an adjacency-list graph and a binary heap for the heap-based variants.',
        spaceDesc: 'The heap versions may retain O(E) queued entries; the JavaScript scan version stores O(V) distance and visited state.'
      },
      code: {
        python: `import heapq\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    \n    while pq:\n        curr_dist, curr_node = heapq.heappop(pq)\n        if curr_dist > distances[curr_node]:\n            continue\n        for neighbor, weight in graph[curr_node].items():\n            distance = curr_dist + weight\n            if distance < distances[neighbor]:\n                distances[neighbor] = distance\n                heapq.heappush(pq, (distance, neighbor))\n    return distances\n\n# Graph representation\ngraph = {\n    'A': {'B': 4, 'C': 2},\n    'B': {'D': 5},\n    'C': {'B': 1, 'D': 8},\n    'D': {}\n}\nprint(dijkstra(graph, 'A')) # Output: {'A': 0, 'B': 3, 'C': 2, 'D': 8}`,
        javascript: `function dijkstra(graph, start) {\n    const dist = {};\n    const visited = new Set();\n    for (let node in graph) dist[node] = Infinity;\n    dist[start] = 0;\n    \n    while (true) {\n        let closest = null;\n        for (let node in dist) {\n            if (!visited.has(node) && (closest === null || dist[node] < dist[closest])) {\n                closest = node;\n            }\n        }\n        if (!closest || dist[closest] === Infinity) break;\n        visited.add(closest);\n        for (let [neighbor, weight] of Object.entries(graph[closest])) {\n            if (dist[closest] + weight < dist[neighbor]) {\n                dist[neighbor] = dist[closest] + weight;\n            }\n        }\n    }\n    return dist;\n}`,
        java: `import java.util.*;\n\npublic class Dijkstra {\n    static class Edge { int to, weight; Edge(int t, int w) { to = t; weight = w; } }\n    public static int[] dijkstra(int n, List<List<Edge>> adj, int src) {\n        int[] dist = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[src] = 0;\n        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));\n        pq.offer(new int[]{src, 0});\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            int u = cur[0], d = cur[1];\n            if (d > dist[u]) continue;\n            for (Edge e : adj.get(u)) {\n                if (dist[u] + e.weight < dist[e.to]) {\n                    dist[e.to] = dist[u] + e.weight;\n                    pq.offer(new int[]{e.to, dist[e.to]});\n                }\n            }\n        }\n        return dist;\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nconst int INF = 1e9;\nvector<int> dijkstra(int n, const vector<vector<pair<int,int>>>& adj, int src) {\n    vector<int> dist(n, INF);\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n    dist[src] = 0;\n    pq.push({0, src});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto& [v, w] : adj[u]) {\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist;\n}`,
        pseudocode: `FUNCTION dijkstra(graph, source):\n    dist = MAP with default INFINITY\n    dist[source] = 0\n    pq = MinPriorityQueue()\n    pq.insert(source, 0)\n    WHILE pq is NOT empty DO\n        u = pq.extractMin()\n        FOR EACH neighbor v of u with weight w DO\n            IF dist[u] + w < dist[v] THEN\n                dist[v] = dist[u] + w\n                pq.insertOrUpdate(v, dist[v])\n            END IF\n        END FOR\n    END WHILE\n    RETURN dist\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Greedy / Shortest Path',
        inPlace: 'N/A (Operates on Graph)',
        stable: 'N/A',
        dataStructure: 'Graph (Adjacency List) + Min-Priority Queue',
        pros: ['Optimal shortest path guarantee for positive weights', 'Very fast with binary/Fibonacci heap', 'Widely adopted in production network routers'],
        cons: ['Fails on graphs with negative edge weights (must use Bellman-Ford)']
      },
      interviewProblems: [
        { name: 'Network Delay Time', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/network-delay-time/' },
        { name: 'Path with Minimum Effort', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/path-with-minimum-effort/' },
        { name: 'Cheapest Flights Within K Stops', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' }
      ]
    },

    'bfs': {
      name: 'Breadth-First Search (BFS)',
      category: 'Graphs',
      categoryKey: 'graph',
      difficulty: 'easy',
      summary: 'Traverses or searches graph/tree data structures layer-by-layer starting from a source node using a First-In-First-Out (FIFO) queue.',
      videoId: 'oDqjPvD54Ss',
      videoTitle: 'Breadth First Search (BFS) in 4 Minutes',
      steps: [
        { title: 'Step 1: Enqueue Source', description: 'Mark the source node as visited and enqueue it into a FIFO queue.' },
        { title: 'Step 2: Dequeue Current', description: 'Remove the front node `u` from the queue and process it.' },
        { title: 'Step 3: Explore Neighbors', description: 'For every unvisited neighbor `v` of `u`: mark `v` as visited and push it to the queue.' },
        { title: 'Step 4: Repeat', description: 'Continue steps 2-3 until the queue becomes empty.' },
        { title: 'Step 5: Completion', description: 'All reachable nodes are visited in order of shortest unweighted distance.' }
      ],
      example: {
        input: 'Graph: A connected to B, C | B connected to D | C connected to E | Source = A',
        trace: [
          { step: 1, action: 'Start at A (Level 0)', state: 'Visited: {A}, Queue: [A]', note: 'Initial queue' },
          { step: 2, action: 'Pop A. Visit neighbors B and C (Level 1)', state: 'Visited: {A, B, C}, Queue: [B, C]', note: 'Level 1 discovered' },
          { step: 3, action: 'Pop B. Visit neighbor D (Level 2)', state: 'Visited: {A, B, C, D}, Queue: [C, D]', note: 'D enqueued' },
          { step: 4, action: 'Pop C. Visit neighbor E (Level 2)', state: 'Visited: {A, B, C, D, E}, Queue: [D, E]', note: 'E enqueued' },
          { step: 5, action: 'Pop D & E (No new unvisited neighbors)', state: 'Queue: []', note: 'All reachable vertices visited!' }
        ],
        output: 'Traversal Order: A -> B -> C -> D -> E'
      },
      realLifeExample: {
        title: 'Six Degrees of Separation / Social Network Friends',
        analogy: 'Discovering 1st-degree friends (immediate connections), then 2nd-degree friends (friends of friends), then 3rd-degree friends in expanding concentric circles.',
        practicalApp: 'Web crawlers (crawling page links level by level), finding shortest path in unweighted mazes, peer-to-peer networking (BitTorrent peer discovery).',
        funFact: 'BFS guarantees finding the shortest path in any unweighted graph with minimal complexity.'
      },
      complexity: {
        best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)',
        bestDesc: 'Every vertex is visited once and every edge is traversed once.',
        avgDesc: 'Linear in terms of total vertices and edges.',
        worstDesc: 'All vertices and edges in graph are explored.',
        spaceDesc: 'O(V) for the queue and visited set/array.'
      },
      code: {
        python: `from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\n# Test\ngraph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['E'], 'D': [], 'E': []}\nprint(bfs(graph, 'A')) # Output: ['A', 'B', 'C', 'D', 'E']`,
        javascript: `function bfs(graph, start) {\n    const visited = new Set([start]);\n    const queue = [start];\n    const order = [];\n    while (queue.length > 0) {\n        const node = queue.shift();\n        order.push(node);\n        for (const neighbor of graph[node] || []) {\n            if (!visited.has(neighbor)) {\n                visited.add(neighbor);\n                queue.push(neighbor);\n            }\n        }\n    }\n    return order;\n}`,
        java: `import java.util.*;\npublic class BFS {\n    public static List<Integer> traverse(List<List<Integer>> adj, int start) {\n        List<Integer> order = new ArrayList<>();\n        boolean[] visited = new boolean[adj.size()];\n        Queue<Integer> q = new LinkedList<>();\n        visited[start] = true;\n        q.offer(start);\n        while (!q.isEmpty()) {\n            int u = q.poll();\n            order.add(u);\n            for (int v : adj.get(u)) {\n                if (!visited[v]) {\n                    visited[v] = true;\n                    q.offer(v);\n                }\n            }\n        }\n        return order;\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nvector<int> bfs(const vector<vector<int>>& adj, int start) {\n    vector<int> order;\n    vector<bool> visited(adj.size(), false);\n    queue<int> q;\n    visited[start] = true;\n    q.push(start);\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        order.push_back(u);\n        for (int v : adj[u]) {\n            if (!visited[v]) {\n                visited[v] = true;\n                q.push(v);\n            }\n        }\n    }\n    return order;\n}`,
        pseudocode: `FUNCTION bfs(graph, start):\n    visited = SET with start\n    queue = Queue()\n    queue.enqueue(start)\n    WHILE queue is not empty DO\n        node = queue.dequeue()\n        PROCESS(node)\n        FOR EACH neighbor of node DO\n            IF neighbor NOT in visited THEN\n                visited.add(neighbor)\n                queue.enqueue(neighbor)\n            END IF\n        END FOR\n    END WHILE\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Graph Traversal / Level-Order Search',
        inPlace: 'N/A',
        stable: 'N/A',
        dataStructure: 'Queue + Graph (Adjacency List)',
        pros: ['Guaranteed shortest path in unweighted graphs', 'Visits closest nodes first', 'Never gets trapped in infinite depth branches'],
        cons: ['Consumes more memory O(V) compared to DFS for wide graphs']
      },
      interviewProblems: [
        { name: 'Word Ladder', platform: 'LeetCode', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-ladder/' },
        { name: 'Number of Islands', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/' },
        { name: 'Rotting Oranges', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotting-oranges/' }
      ]
    },

    'dfs': {
      name: 'Depth-First Search (DFS)',
      category: 'Graphs',
      categoryKey: 'graph',
      difficulty: 'easy',
      summary: 'Explores as far as possible along each branch before backtracking using a Last-In-First-Out (LIFO) stack or recursion.',
      videoId: '7fujbpJ0LB4',
      videoTitle: 'Depth First Search (DFS) in 4 Minutes',
      steps: [
        { title: 'Step 1: Start at Node', description: 'Mark current node `u` as visited.' },
        { title: 'Step 2: Dive Deep', description: 'Iterate through all neighbors of `u`. If neighbor `v` is unvisited, recursively call DFS on `v`.' },
        { title: 'Step 3: Backtrack', description: 'When all adjacent vertices of the current node are visited, backtrack to the previous node.' },
        { title: 'Step 4: Continue', description: 'Repeat until all reachable vertices across the graph component are visited.' }
      ],
      example: {
        input: 'Graph: A -> B, C; B -> D; C -> E | Source = A',
        trace: [
          { step: 1, action: 'Visit A', state: 'Visited: {A}, Call Stack: [A]', note: 'Start at root A' },
          { step: 2, action: 'Visit B (child of A)', state: 'Visited: {A, B}, Call Stack: [A, B]', note: 'Dive deep into B' },
          { step: 3, action: 'Visit D (child of B)', state: 'Visited: {A, B, D}, Call Stack: [A, B, D]', note: 'D has no unvisited children' },
          { step: 4, action: 'Backtrack D -> B -> A, Visit C', state: 'Visited: {A, B, D, C}, Call Stack: [A, C]', note: 'Dive deep into C' },
          { step: 5, action: 'Visit E (child of C)', state: 'Visited: {A, B, D, C, E}', note: 'Traversal Complete!' }
        ],
        output: 'DFS Order: A -> B -> D -> C -> E'
      },
      realLifeExample: {
        title: 'Navigating a Maze by Keeping One Hand on the Wall',
        analogy: 'Walking straight down a corridor of a hedge maze until hitting a dead end, then turning around and stepping back to try the first unexplored side passageway.',
        practicalApp: 'Solving Sudoku/mazes, detecting cycles in graphs, topological sorting, finding connected components, parsing syntax trees in compilers.',
        funFact: 'DFS was first investigated in the 19th century by French mathematician Charles Pierre Trémaux as a strategy for solving mazes.'
      },
      complexity: {
        best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)',
        bestDesc: 'Every node and edge explored once.',
        avgDesc: 'Linear time across vertices and edges.',
        worstDesc: 'Visits entire graph graph.',
        spaceDesc: 'O(V) call stack depth in the worst-case skewed graph (linked list).'
      },
      code: {
        python: `def dfs(graph, node, visited=None, order=None):\n    if visited is None: visited = set()\n    if order is None: order = []\n    visited.add(node)\n    order.append(node)\n    for neighbor in graph.get(node, []):\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited, order)\n    return order\n\n# Test\ngraph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['E'], 'D': [], 'E': []}\nprint(dfs(graph, 'A')) # Output: ['A', 'B', 'D', 'C', 'E']`,
        javascript: `function dfs(graph, start, visited = new Set(), order = []) {\n    visited.add(start);\n    order.push(start);\n    for (const neighbor of graph[start] || []) {\n        if (!visited.has(neighbor)) {\n            dfs(graph, neighbor, visited, order);\n        }\n    }\n    return order;\n}`,
        java: `import java.util.*;\npublic class DFS {\n    public static void dfs(int u, List<List<Integer>> adj, boolean[] visited, List<Integer> order) {\n        visited[u] = true;\n        order.add(u);\n        for (int v : adj.get(u)) {\n            if (!visited[v]) dfs(v, adj, visited, order);\n        }\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid dfs(int u, const vector<vector<int>>& adj, vector<bool>& visited, vector<int>& order) {\n    visited[u] = true;\n    order.push_back(u);\n    for (int v : adj[u]) {\n        if (!visited[v]) dfs(v, adj, visited, order);\n    }\n}`,
        pseudocode: `FUNCTION dfs(node, visited):\n    visited.add(node)\n    PROCESS(node)\n    FOR EACH neighbor of node DO\n        IF neighbor NOT in visited THEN\n            dfs(neighbor, visited)\n        END IF\n    END FOR\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Backtracking / Graph Traversal',
        inPlace: 'N/A',
        stable: 'N/A',
        dataStructure: 'Stack / Recursion Call Stack',
        pros: ['Lower memory usage O(depth) on deep trees', 'Natural fit for game trees, backtracking, and cycle checks', 'Easy recursive syntax'],
        cons: ['Can get trapped in infinite depth without cycle detection', 'Does not guarantee shortest path in unweighted graphs']
      },
      interviewProblems: [
        { name: 'Clone Graph', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/' },
        { name: 'Course Schedule (Cycle Detection)', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule/' },
        { name: 'Number of Provinces', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-provinces/' }
      ]
    },

    // ==========================================
    // 4. DYNAMIC PROGRAMMING
    // ==========================================
    'knapsack': {
      name: '0/1 Knapsack Problem',
      category: 'Dynamic Programming',
      categoryKey: 'dynamic',
      difficulty: 'medium',
      summary: 'Given items with specific weights and values, determines the maximum value you can carry in a knapsack of capacity W without exceeding the limit.',
      videoId: '8LusJS5-AGo',
      videoTitle: '0/1 Knapsack Problem Dynamic Programming | Abdul Bari',
      steps: [
        { title: 'Step 1: Define DP State', description: 'Let `dp[i][w]` be the maximum value achievable using a subset of the first `i` items with max weight `w`.' },
        { title: 'Step 2: Base Case', description: '`dp[0][w] = 0` (0 items = 0 value) and `dp[i][0] = 0` (0 capacity = 0 value).' },
        { title: 'Step 3: Recurrence Relation', description: 'If `weights[i-1] <= w`: `dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])`. Otherwise `dp[i][w] = dp[i-1][w]`.' },
        { title: 'Step 4: Fill Table', description: 'Fill the 2D matrix row by row from item 1 to n and weight 1 to W.' },
        { title: 'Step 5: Extract Result', description: 'Return `dp[n][W]`. Backtrack to identify which items were included.' }
      ],
      example: {
        input: 'Values = [60, 100, 120], Weights = [10, 20, 30], Capacity W = 50',
        trace: [
          { step: 1, action: 'Item 1 (w=10, v=60)', state: 'Fits in w>=10, max value at w=50 is 60', note: 'Single item tested' },
          { step: 2, action: 'Item 2 (w=20, v=100)', state: 'At w=30: Item 1 + Item 2 = 60 + 100 = 160', note: 'Combines with item 1' },
          { step: 3, action: 'Item 3 (w=30, v=120)', state: 'At w=50: Item 2 + Item 3 = 100 + 120 = 220', note: 'Best combination: Item 2 + Item 3 (Weight=50, Value=220)' }
        ],
        output: 'Maximum Value: 220 (Select Items 2 and 3)'
      },
      realLifeExample: {
        title: 'Packing a Cargo Plane or Camping Backpack',
        analogy: 'Packing a hiking backpack with strict airline carry-on weight limits: deciding between a heavy DSLR camera vs lighter camping gear to maximize usefulness.',
        practicalApp: 'Financial portfolio budget allocation, server resource allocation in cloud computing, cargo container optimization in shipping logistics.',
        funFact: 'The Knapsack problem is NP-complete, meaning no polynomial-time algorithm is known for the general unbounded problem, but DP solves it in pseudo-polynomial O(nW) time.'
      },
      complexity: {
        best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)', space: 'O(nW) or O(W)',
        bestDesc: 'Pseudo-polynomial time where n is item count and W is capacity.',
        avgDesc: 'Fills DP table of size (n+1) × (W+1).',
        worstDesc: 'Proportional to capacity size W and item count n.',
        spaceDesc: 'Can be optimized to O(W) using a single 1D rolling array.'
      },
      code: {
        python: `def knapsack(values, weights, W):\n    n = len(values)\n    dp = [0] * (W + 1)\n    for i in range(n):\n        for w in range(W, weights[i] - 1, -1):\n            dp[w] = max(dp[w], values[i] + dp[w - weights[i]])\n    return dp[W]\n\n# Test\nprint(knapsack([60, 100, 120], [10, 20, 30], 50)) # Output: 220`,
        javascript: `function knapsack(values, weights, W) {\n    const dp = new Array(W + 1).fill(0);\n    for (let i = 0; i < values.length; i++) {\n        for (let w = W; w >= weights[i]; w--) {\n            dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);\n        }\n    }\n    return dp[W];\n}`,
        java: `public class Knapsack {\n    public static int solve(int[] values, int[] weights, int W) {\n        int[] dp = new int[W + 1];\n        for (int i = 0; i < values.length; i++) {\n            for (int w = W; w >= weights[i]; w--) {\n                dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);\n            }\n        }\n        return dp[W];\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint knapsack(const vector<int>& values, const vector<int>& weights, int W) {\n    vector<int> dp(W + 1, 0);\n    for (size_t i = 0; i < values.size(); i++) {\n        for (int w = W; w >= weights[i]; w--) {\n            dp[w] = max(dp[w], values[i] + dp[w - weights[i]]);\n        }\n    }\n    return dp[W];\n}`,
        pseudocode: `FUNCTION knapsack(values, weights, W):\n    dp = Array of size W+1 filled with 0\n    FOR i FROM 0 TO length(values) - 1:\n        FOR w FROM W DOWN TO weights[i]:\n            dp[w] = MAX(dp[w], values[i] + dp[w - weights[i]])\n        END FOR\n    END FOR\n    RETURN dp[W]\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Dynamic Programming (Optimal Substructure & Overlapping Subproblems)',
        inPlace: 'No',
        stable: 'N/A',
        dataStructure: 'DP Table / Array',
        pros: ['Finds guaranteed optimal value', 'Can be space-optimized to O(W) 1D array', 'Avoids exponential 2^n brute force recursion'],
        cons: ['Pseudo-polynomial time O(nW); inefficient if W is extremely large']
      },
      interviewProblems: [
        { name: 'Partition Equal Subset Sum', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
        { name: 'Target Sum', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/target-sum/' },
        { name: 'Coin Change II', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change-ii/' }
      ]
    },

    'fibonacci': {
      name: 'Fibonacci Sequence (DP & Memoization)',
      category: 'Dynamic Programming',
      categoryKey: 'dynamic',
      difficulty: 'easy',
      summary: 'Calculates the n-th Fibonacci number where F(n) = F(n-1) + F(n-2) using bottom-up tabling or top-down memoization to avoid recomputation.',
      videoId: 'vYquumk4nWw',
      videoTitle: 'Dynamic Programming Fibonacci in 5 Minutes',
      steps: [
        { title: 'Step 1: Identify Base Cases', description: 'F(0) = 0 and F(1) = 1.' },
        { title: 'Step 2: Recognize Overlapping Work', description: 'Naive recursion recomputes F(3), F(2) exponentially O(2^n) times.' },
        { title: 'Step 3: Apply DP State Optimization', description: 'Store previously computed answers in an array or maintain only the last two numbers: `prev2`, `prev1`.' },
        { title: 'Step 4: Iterative Accumulation', description: 'Loop from `i = 2` to `n`: `curr = prev1 + prev2; prev2 = prev1; prev1 = curr`.' },
        { title: 'Step 5: Return Result', description: 'Return `curr` in linear O(n) time and O(1) space.' }
      ],
      example: {
        input: 'n = 7',
        trace: [
          { step: 1, action: 'Initialize F(0)=0, F(1)=1', state: 'prev2=0, prev1=1', note: 'Base states' },
          { step: 2, action: 'i=2: 0 + 1 = 1', state: 'prev2=1, prev1=1', note: 'F(2)=1' },
          { step: 3, action: 'i=3: 1 + 1 = 2', state: 'prev2=1, prev1=2', note: 'F(3)=2' },
          { step: 4, action: 'i=4: 1 + 2 = 3', state: 'prev2=2, prev1=3', note: 'F(4)=3' },
          { step: 5, action: 'i=5: 2 + 3 = 5', state: 'prev2=3, prev1=5', note: 'F(5)=5' },
          { step: 6, action: 'i=6: 3 + 5 = 8', state: 'prev2=5, prev1=8', note: 'F(6)=8' },
          { step: 7, action: 'i=7: 5 + 8 = 13', state: 'prev2=8, prev1=13', note: 'F(7)=13 -> Done!' }
        ],
        output: 'F(7) = 13'
      },
      realLifeExample: {
        title: 'Golden Spiral in Sunflower Seeds & Fibonacci Growth',
        analogy: 'Sunflower seeds, pinecone spirals, and rabbit population model reproduction cycles following the recursive golden ratio growth curve.',
        practicalApp: 'Financial technical analysis (Fibonacci retracement levels), agile story point sizing (1, 2, 3, 5, 8, 13), Fibonacci heaps in priority queues.',
        funFact: 'Fibonacci numbers approach the Golden Ratio φ ≈ 1.6180339887... as n grows larger!'
      },
      complexity: {
        best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)',
        bestDesc: 'Base cases n <= 1 return immediately.',
        avgDesc: 'Iterative loop runs exactly n times.',
        worstDesc: 'Can even be calculated in O(log n) using matrix exponentiation or Binet formula.',
        spaceDesc: 'O(1) memory by storing only the previous 2 values.'
      },
      code: {
        python: `def fibonacci(n):\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nprint(fibonacci(7)) # Output: 13`,
        javascript: `function fibonacci(n) {\n    if (n <= 1) return n;\n    let prev2 = 0, prev1 = 1;\n    for (let i = 2; i <= n; i++) {\n        const curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}`,
        java: `public class Fibonacci {\n    public static int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}`,
        cpp: `#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
        pseudocode: `FUNCTION fibonacci(n):\n    IF n <= 1 THEN RETURN n\n    a = 0, b = 1\n    FOR i FROM 2 TO n:\n        c = a + b\n        a = b\n        b = c\n    END FOR\n    RETURN b\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Dynamic Programming (Memoization / Tabulation)',
        inPlace: 'Yes',
        stable: 'N/A',
        dataStructure: 'Variables / 1D Array',
        pros: ['Reduces exponential O(2^n) time to linear O(n)', 'O(1) space optimization', 'Foundation for DP mastery'],
        cons: ['Naive recursion without DP causes stack overflow for large n']
      },
      interviewProblems: [
        { name: 'Climbing Stairs', platform: 'LeetCode', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
        { name: 'Fibonacci Number', platform: 'LeetCode', difficulty: 'Easy', link: 'https://leetcode.com/problems/fibonacci-number/' },
        { name: 'House Robber', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber/' }
      ]
    },

    // ==========================================
    // 5. GREEDY ALGORITHMS
    // ==========================================
    'activity-selection': {
      name: 'Activity Selection Problem',
      category: 'Greedy Algorithms',
      categoryKey: 'greedy',
      difficulty: 'medium',
      summary: 'Selects the maximum number of non-overlapping activities that can be performed by a single person or machine by sorting by finish time.',
      videoId: 'hVhOeaONg1Y',
      videoTitle: 'Activity Selection Problem Greedy Method | Abdul Bari',
      steps: [
        { title: 'Step 1: Sort by Finish Times', description: 'Sort all activities in ascending order of their end / finish times.' },
        { title: 'Step 2: Pick the First Activity', description: 'Always select the first activity (which finishes earliest, leaving maximum available time for remaining tasks).' },
        { title: 'Step 3: Scan Remaining Activities', description: 'For each subsequent activity `i`, check if its start time `start[i] >= end[last_selected]`.' },
        { title: 'Step 4: Include Compatible Activity', description: 'If start time does not conflict, select activity `i` and update `last_selected = i`.' },
        { title: 'Step 5: Output Maximum Set', description: 'Return the set or count of all selected non-overlapping activities.' }
      ],
      example: {
        input: 'Activities (Start, Finish): A1(1, 2), A2(3, 4), A3(0, 6), A4(5, 7), A5(8, 9), A6(5, 9)',
        trace: [
          { step: 1, action: 'Sort by Finish Time', state: 'Order: A1(1,2), A2(3,4), A3(0,6), A4(5,7), A5(8,9), A6(5,9)', note: 'Earliest finish first' },
          { step: 2, action: 'Select A1 (1, 2)', state: 'Selected: [A1], Free from time: 2', note: 'First activity taken' },
          { step: 3, action: 'Check A2 (3, 4)', state: 'Start 3 >= 2 -> SELECT A2! Free from time: 4', note: 'Compatible!' },
          { step: 4, action: 'Check A3 (0, 6)', state: 'Start 0 < 4 -> Skip (Conflict)', note: 'Rejected' },
          { step: 5, action: 'Check A4 (5, 7)', state: 'Start 5 >= 4 -> SELECT A4! Free from time: 7', note: 'Compatible!' },
          { step: 6, action: 'Check A5 (8, 9)', state: 'Start 8 >= 7 -> SELECT A5! Free from time: 9', note: 'Compatible!' }
        ],
        output: 'Selected 4 Activities: [A1, A2, A4, A5]'
      },
      realLifeExample: {
        title: 'Booking a Single Conference Room or Movie Theater',
        analogy: 'A company conference room has dozens of booking requests for different time slots. To fit the maximum number of meetings in one day, prioritize meetings that end early.',
        practicalApp: 'CPU task scheduling, meeting room booking engines, satellite observation scheduling, project management resource leveling.',
        funFact: 'The greedy choice property holds true here: picking the activity with the earliest finish time is mathematically proven to always lead to an optimal global solution.'
      },
      complexity: {
        best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1) or O(n)',
        bestDesc: 'Dominated by the initial sorting of activities by finish time.',
        avgDesc: 'Greedy scan pass runs in linear O(n) time after sorting.',
        worstDesc: 'O(n log n) overall time complexity.',
        spaceDesc: 'O(1) auxiliary space if sorted in place.'
      },
      code: {
        python: `def activity_selection(activities):\n    # activities is a list of tuples: (start, finish, name)\n    activities.sort(key=lambda x: x[1])\n    selected = [activities[0]]\n    last_finish = activities[0][1]\n    \n    for act in activities[1:]:\n        if act[0] >= last_finish:\n            selected.append(act)\n            last_finish = act[1]\n    return selected\n\n# Test\nacts = [(1, 2, 'A1'), (3, 4, 'A2'), (0, 6, 'A3'), (5, 7, 'A4'), (8, 9, 'A5')]\nprint(activity_selection(acts))`,
        javascript: `function activitySelection(activities) {\n    activities.sort((a, b) => a.finish - b.finish);\n    const selected = [activities[0]];\n    let lastFinish = activities[0].finish;\n    for (let i = 1; i < activities.length; i++) {\n        if (activities[i].start >= lastFinish) {\n            selected.push(activities[i]);\n            lastFinish = activities[i].finish;\n        }\n    }\n    return selected;\n}`,
        java: `import java.util.*;\npublic class ActivitySelection {\n    static class Activity { int start, finish; String name; Activity(int s, int f, String n){start=s;finish=f;name=n;} }\n    public static List<Activity> select(List<Activity> list) {\n        list.sort(Comparator.comparingInt(a -> a.finish));\n        List<Activity> res = new ArrayList<>();\n        res.add(list.get(0));\n        int lastFinish = list.get(0).finish;\n        for (int i = 1; i < list.size(); i++) {\n            if (list.get(i).start >= lastFinish) {\n                res.add(list.get(i));\n                lastFinish = list.get(i).finish;\n            }\n        }\n        return res;\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstruct Activity { int start, finish; };\nvector<Activity> activitySelection(vector<Activity>& acts) {\n    sort(acts.begin(), acts.end(), [](const Activity& a, const Activity& b) { return a.finish < b.finish; });\n    vector<Activity> selected;\n    selected.push_back(acts[0]);\n    int lastFinish = acts[0].finish;\n    for (size_t i = 1; i < acts.size(); i++) {\n        if (acts[i].start >= lastFinish) {\n            selected.push_back(acts[i]);\n            lastFinish = acts[i].finish;\n        }\n    }\n    return selected;\n}`,
        pseudocode: `FUNCTION activitySelection(activities):\n    SORT activities by finish time ascending\n    selected = [activities[0]]\n    lastFinish = activities[0].finish\n    FOR i FROM 1 TO length(activities) - 1:\n        IF activities[i].start >= lastFinish THEN\n            selected.append(activities[i])\n            lastFinish = activities[i].finish\n        END IF\n    END FOR\n    RETURN selected\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Greedy Choice / Interval Scheduling',
        inPlace: 'Yes (if modifying array in-place)',
        stable: 'N/A',
        dataStructure: 'Array / List of Intervals',
        pros: ['Guaranteed globally optimal solution', 'Fast O(n log n) total time', 'Simple, elegant implementation'],
        cons: ['Only works when metric to optimize is activity count, not varying activity values/weights']
      },
      interviewProblems: [
        { name: 'Non-overlapping Intervals', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },
        { name: 'Meeting Rooms II', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/meeting-rooms-ii/' },
        { name: 'Minimum Number of Arrows to Burst Balloons', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/' }
      ]
    },

    // ==========================================
    // 6. TREE ALGORITHMS
    // ==========================================
    'bst-inorder': {
      name: 'BST Inorder Traversal',
      category: 'Trees',
      categoryKey: 'tree',
      difficulty: 'easy',
      summary: 'Traverses a Binary Search Tree in Left -> Root -> Right order, which visits all nodes in strictly sorted ascending order.',
      videoId: '4_UDUj1j1GQ',
      videoTitle: 'Tree Traversals (Inorder, Preorder, Postorder) | mycodeschool',
      steps: [
        { title: 'Step 1: Traverse Left Subtree', description: 'Recursively call inorder on the left child: `inorder(node.left)`.' },
        { title: 'Step 2: Visit Current Root', description: 'Process / print the value of the current node: `visit(node.val)`.' },
        { title: 'Step 3: Traverse Right Subtree', description: 'Recursively call inorder on the right child: `inorder(node.right)`.' },
        { title: 'Step 4: Base Condition', description: 'If `node === null`, return.' }
      ],
      example: {
        input: 'BST: Root = 8, Left = 4 (Left=2, Right=6), Right = 12 (Left=10, Right=14)',
        trace: [
          { step: 1, action: 'Traverse left of 8 -> 4 -> 2', state: 'Visit 2 (deepest left)', note: 'First output: 2' },
          { step: 2, action: 'Backtrack to 4, Visit 4', state: 'Visit 4', note: 'Output: [2, 4]' },
          { step: 3, action: 'Traverse right of 4 -> 6', state: 'Visit 6', note: 'Output: [2, 4, 6]' },
          { step: 4, action: 'Backtrack to Root 8, Visit 8', state: 'Visit 8', note: 'Output: [2, 4, 6, 8]' },
          { step: 5, action: 'Traverse right of 8 -> 12 -> 10', state: 'Visit 10, then 12, then 14', note: 'Output: [2, 4, 6, 8, 10, 12, 14]' }
        ],
        output: 'Inorder Sequence (Sorted): [2, 4, 6, 8, 10, 12, 14]'
      },
      realLifeExample: {
        title: 'Alphabetizing a Filing Cabinet with Divided Drawers',
        analogy: 'Looking through a partitioned document cabinet where items to the left are earlier in the alphabet and items to the right are later, systematically writing down names in alphabetical order.',
        practicalApp: 'Validating if a binary tree is a valid BST, generating sorted output from tree indexes in SQL databases, expression evaluation in compilers.',
        funFact: 'Inorder traversal of any valid Binary Search Tree is guaranteed to produce an array sorted in non-decreasing numerical order.'
      },
      complexity: {
        best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)',
        bestDesc: 'Visits every single node in the tree exactly once.',
        avgDesc: 'Linear time proportional to number of nodes n.',
        worstDesc: 'O(n) time for all tree structures.',
        spaceDesc: 'O(h) call stack memory where h is tree height (O(log n) balanced, O(n) skewed).'
      },
      code: {
        python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef inorder_traversal(root):\n    res = []\n    def helper(node):\n        if not node: return\n        helper(node.left)\n        res.append(node.val)\n        helper(node.right)\n    helper(root)\n    return res`,
        javascript: `function inorderTraversal(root) {\n    const res = [];\n    function traverse(node) {\n        if (!node) return;\n        traverse(node.left);\n        res.push(node.val);\n        traverse(node.right);\n    }\n    traverse(root);\n    return res;\n}`,
        java: `public class InorderTraversal {\n    public List<Integer> inorder(TreeNode root) {\n        List<Integer> res = new ArrayList<>();\n        helper(root, res);\n        return res;\n    }\n    private void helper(TreeNode node, List<Integer> res) {\n        if (node == null) return;\n        helper(node.left, res);\n        res.add(node.val);\n        helper(node.right, res);\n    }\n}`,
        cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct TreeNode { int val; TreeNode *left, *right; };\nvoid inorder(TreeNode* root, vector<int>& res) {\n    if (!root) return;\n    inorder(root->left, res);\n    res.push_back(root->val);\n    inorder(root->right, res);\n}`,
        pseudocode: `FUNCTION inorder(node):\n    IF node is NULL THEN RETURN\n    inorder(node.left)\n    PRINT node.val\n    inorder(node.right)\nEND FUNCTION`
      },
      characteristics: {
        paradigm: 'Depth-First Tree Traversal',
        inPlace: 'Yes',
        stable: 'N/A',
        dataStructure: 'Binary Search Tree / Stack',
        pros: ['Extracts BST keys in strictly sorted order', 'Simple recursion logic', 'Low O(h) space overhead'],
        cons: ['Recursion stack overflow risk on degenerate degenerate linked-list trees without Morris traversal']
      },
      interviewProblems: [
        { name: 'Binary Tree Inorder Traversal', platform: 'LeetCode', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
        { name: 'Validate Binary Search Tree', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
        { name: 'Kth Smallest Element in a BST', platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' }
      ]
    }
  };

  // Catalog-only entries keep their supplied time estimate but do not claim unverified case or space bounds.
  // Specific YouTube videos for key popular algorithms
  const customVideos = {
    'selection-sort': { id: 'g-PGLbMth_g', title: 'Selection Sort in 3 Minutes | Michael Sambol' },
    'insertion-sort': { id: 'JU767SDMDvA', title: 'Insertion Sort in 2 Minutes | Michael Sambol' },
    'heap-sort': { id: '2DmK_H7IdTo', title: 'Heap Sort in 4 Minutes | Michael Sambol' },
    'counting-sort': { id: '7zuGmKfUt7s', title: 'Counting Sort Algorithm Explained' },
    'radix-sort': { id: 'M2cCN7Gzl9U', title: 'Radix Sort Algorithm: A Step-by-Step Visualization' },
    'bucket-sort': { id: 'geVyIsFpxUs', title: 'Bucket Sort Algorithm' },
    'shell-sort': { id: '993mJpPSoW0', title: 'Shell Sort Algorithm Explained | Step-by-Step Tutorial' },
    'kadane-algorithm': { id: 'lEOvUIFwd8c', title: 'Maximum Subarray (Kadane’s Algorithm) Explained' },
    'two-pointer-technique': { id: 'On03HWe2tZM', title: 'Two Pointers Technique Explained' },
    'sliding-window': { id: 'XM7voLzDoZA', title: 'Sliding Window Technique Explained with Visual Animations' },
    'prefix-sum': { id: 'QX93LKNBIIs', title: 'Prefix Sum Technique Explained' },
    'interpolation-search': { id: 'HnhpCqTiB6E', title: 'Interpolation Search' },
    'exponential-search': { id: 'Lff7Lp5mFNU', title: 'Exponential Search Visualization' },
    'difference-array': { id: 'kz1KZWeY4W8', title: 'Difference Array Tutorial' },
    'dutch-national-flag-algorithm': { id: '4SXVsz6B48g', title: 'Dutch Flag Algorithm Explanation with Animated Examples' },
    'z-algorithm': { id: 'Gtp8yHjhqIA', title: 'Z-Algorithm Explained Visually' },
    'kmp-string-matching': { id: 'V5-7GzOfADQ', title: 'KMP String Matching Algorithm | Abdul Bari' },
    'rabin-karp-algorithm': { id: 'qQ8vS2btsxI', title: 'Rabin-Karp String Search Algorithm' },
    'factorial': { id: '_JtPhF8MshA', title: 'Factorial Using Recursion' },
    'tower-of-hanoi': { id: 'rf6uf3jNjbo', title: 'Tower of Hanoi Problem Explained' },
    'n-queens': { id: 'xFv_Hl4B83A', title: 'N Queens Problem Backtracking' },
    'rat-in-a-maze': { id: 'ANWyHGL143s', title: 'Step-by-Step Backtracking: Rat in a Maze' },
    'sudoku-solver': { id: 'JzONv5kaPJM', title: 'Sudoku Solver Backtracking Algorithm' },
    'reverse-linked-list': { id: 'G0_I-ZF0S38', title: 'Reverse a Linked List in 5 Minutes' },
    'detect-cycle-floyd-algorithm': { id: 'gBTe7lFR3vc', title: 'Detect Loop in Linked List (Floyd’s Cycle Finding)' },
    'merge-two-sorted-lists': { id: 'XIdigk956u0', title: 'Merge Two Sorted Lists | LeetCode 21' },
    'balanced-parentheses': { id: 'J-5jro8MaU4', title: 'Balanced Parentheses Using a Stack' },
    'remove-nth-node': { id: 'YQRkIwVEZIQ', title: 'Remove Nth Node from End of Linked List' },
    'palindrome-linked-list': { id: 'Sgi2BHiW0-Q', title: 'Palindrome Linked List | 4 Approaches' },
    'next-greater-element': { id: 'Du881K7Jtk8', title: 'Next Greater Element with Monotonic Stack' },
    'binary-search-tree': { id: 'Y_JZdc40tag', title: 'Binary Search Tree Explained' },
    'avl-tree': { id: 'jDM6_TnYIqE', title: 'AVL Tree Rotations and Insertion | Abdul Bari' },
    'lowest-common-ancestor': { id: 'pnpKfY27DJs', title: 'Lowest Common Ancestor of a Binary Tree' },
    'trie': { id: '4pQzj8QG6Qw', title: 'Trie Data Structure and Algorithms' },
    'binary-tree-traversals': { id: 'DNCBAhO5nj8', title: 'Binary Tree Traversal: Inorder, Preorder, and Postorder' },
    'tree-height-depth': { id: 'IbPCwNIk4dE', title: 'Maximum Depth of a Binary Tree' },
    'level-order-traversal': { id: '-g6h0Ok1Buk', title: 'Level Order Traversal in a Binary Tree' },
    'bellman-ford-algorithm': { id: 'FtN3BYH2Zes', title: 'Bellman-Ford Algorithm | Abdul Bari' },
    'floyd-warshall-algorithm': { id: 'oNI0rf2P9gE', title: 'Floyd-Warshall All-Pairs Shortest Path' },
    'prim-algorithm': { id: '4ZlRH0eK-qQ', title: 'Prim’s Minimum Spanning Tree Algorithm' },
    'kruskal-algorithm': { id: '7vw9tO8ZwGI', title: 'Kruskal’s Algorithm | Minimum Spanning Tree' },
    'topological-sort': { id: 'eL-KzMXSXXI', title: 'Topological Sort Algorithm | Graph Theory' },
    'longest-common-subsequence': { id: 'sSno9rV8Rhg', title: 'Longest Common Subsequence DP' },
    'longest-increasing-subsequence': { id: 'cjWnW0hdF1Y', title: 'Longest Increasing Subsequence' },
    'coin-change': { id: 'H9bfqozjoqs', title: 'Coin Change Problem Dynamic Programming' },
    'edit-distance': { id: 'XYi2-LPrwm4', title: 'Edit Distance (Levenshtein Distance) DP' },
    'huffman-coding': { id: 'co4_ahEDCho', title: 'Huffman Coding Greedy Algorithm' },
    'fractional-knapsack': { id: 'wWK8qBI20FI', title: 'Fractional Knapsack Explained Step-by-Step' },
    'minimum-coins': { id: 'KTaEeTWRwgg', title: 'Greedy Algorithm to Find the Minimum Number of Coins' },
    'interval-scheduling': { id: 'qE96jMHKnTg', title: 'Greedy Algorithms and Interval Scheduling' },
    'sieve-of-eratosthenes': { id: '36ZLZUOWs6s', title: 'Sieve of Eratosthenes' },
    'euclidean-gcd': { id: 'yHwneN6zJmU', title: 'Euclidean Algorithm for Greatest Common Divisor' },
    'fast-exponentiation': { id: 'SKUt4TjXkrU', title: 'Binary Exponentiation: Fast Power Calculation' },
    'xor-based-algorithms': { id: 'tisQxzBVDZc', title: 'Find the Missing Number Using XOR' },
    'edmonds-karp': { id: 'uYquXaRu0Mg', title: 'Edmonds-Karp Maximum Flow Algorithm' },
    'a-search': { id: 'PzEWHH2v3TE', title: 'A* Search Pathfinding Algorithm' },
    'tarjan-algorithm': { id: 'ZeDNSeilf-Y', title: 'Tarjan’s Strongly Connected Components Algorithm' },
    'segment-tree': { id: '2bSS8rtFym4', title: 'Segment Tree Range Queries & Updates' },
    'fenwick-tree-bit': { id: 'uSFzHCZ4E-8', title: 'Fenwick Tree (Binary Indexed Tree)' }
  };

  // Generate fallback rich dataset for all registered algorithms in algorithmGroups
  const slug = str => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const groups = window.algorithmGroups || {};

  Object.entries(groups).forEach(([categoryKey, group]) => {
    group.items.forEach((item, index) => {
      const [name, description, complexityTime, auxiliarySpace] = item;
      const key = slug(name);
      if (!dataset[key]) {
        const video = customVideos[key];
        const diff = (index % 3 === 0) ? 'easy' : (index % 3 === 1) ? 'medium' : 'hard';
        const normalizedTime = typeof complexityTime === 'string' && complexityTime.trim() ? complexityTime.trim() : 'O(n)';
        const normalizedSpace = typeof auxiliarySpace === 'string' && auxiliarySpace.trim() ? auxiliarySpace.trim() : 'O(1)';

        dataset[key] = {
          name: name,
          category: group.label,
          categoryKey: categoryKey,
          difficulty: diff,
          summary: description,
          videoId: video?.id || '',
          videoTitle: video?.title || `${name} video tutorials`,
          steps: [
            { title: 'Step 1: Input Initialization', description: `Initialize data structures, pointers, or states required to process ${name}.` },
            { title: 'Step 2: Core Algorithmic Logic', description: `Execute main phase: compare, traverse, divide, or update states according to ${name} principles.` },
            { title: 'Step 3: State Transition & Updates', description: 'Update current position, auxiliary buffers, or memoization tables based on the result of the current check.' },
            { title: 'Step 4: Boundary & Termination Check', description: 'Ensure loop termination criteria or recursion base cases are respected to guarantee termination.' },
            { title: 'Step 5: Return Final Result', description: 'Return computed answer, sorted collection, shortest distance, or target location.' }
          ],
          example: {
            input: `Sample Input for ${name}`,
            trace: [
              { step: 1, action: 'Initial Setup', state: 'State initialized with base parameters', note: 'Start execution' },
              { step: 2, action: 'Iteration / Evaluation', state: 'Processing intermediate states', note: 'Applying algorithm transformation' },
              { step: 3, action: 'Final Verification', state: 'Target conditions satisfied', note: 'Algorithm complete' }
            ],
            output: 'Optimal result computed successfully'
          },
          realLifeExample: {
            title: `Real-World Application of ${name}`,
            analogy: `Think of ${name} as a practical strategy used to organize, optimize, or navigate systems efficiently in real life.`,
            practicalApp: `Used in software engineering systems, database search engines, networking stacks, and game engines to solve ${group.label} problems efficiently.`,
            funFact: `${name} is an essential building block in computer science curricula and modern technical coding interviews worldwide.`
          },
          complexity: {
            best: normalizedTime,
            average: normalizedTime,
            worst: normalizedTime,
            space: normalizedSpace,
            bestDesc: 'Catalog-defined best-case time bound for the listed implementation.',
            avgDesc: `Catalog time label: ${normalizedTime}.`,
            worstDesc: 'Catalog-defined worst-case time bound for the listed implementation.',
            spaceDesc: `Catalog auxiliary-space label: ${normalizedSpace}.`
          },
          code: {
            python: `# Implementation of ${name} in Python\ndef solve_${key.replace(/-/g, '_')}(data):\n    # Core logic for ${name}\n    # ${description}\n    print("Executing ${name}")\n    return data\n\n# Example call\nprint(solve_${key.replace(/-/g, '_')}([10, 20, 30]))`,
            javascript: `// Implementation of ${name} in JavaScript\nfunction solve${name.replace(/[^a-zA-Z0-9]/g, '')}(data) {\n    // Core logic for ${name}\n    // ${description}\n    console.log("Executing ${name}");\n    return data;\n}\n\n// Example call\nconsole.log(solve${name.replace(/[^a-zA-Z0-9]/g, '')}([10, 20, 30]));`,
            java: `public class ${name.replace(/[^a-zA-Z0-9]/g, '')}Solution {\n    public static void main(String[] args) {\n        // ${name}: ${description}\n        System.out.println("Executing ${name}");\n    }\n}`,
            cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\n// ${name}: ${description}\nvoid solve() {\n    cout << "Executing ${name}" << endl;\n}\n\nint main() {\n    solve();\n    return 0;\n}`,
            pseudocode: `FUNCTION solve_${key.replace(/-/g, '_')}(input):\n    // ${name}\n    INITIALIZE variables\n    EXECUTE ${name} logic\n    RETURN result\nEND FUNCTION`
          },
          characteristics: {
            paradigm: `${group.label} Strategy`,
            inPlace: 'Yes / Context-dependent',
            stable: 'Context-dependent',
            dataStructure: group.label,
            pros: ['Proven theoretical efficiency', 'Clear structural invariants', 'Standard interview and production building block'],
            cons: ['Input-dependent trade-offs', 'Requires understanding of underlying data structure']
          },
          interviewProblems: [
            { name: `${name} Standard Practice`, platform: 'LeetCode', difficulty: diff === 'easy' ? 'Easy' : diff === 'medium' ? 'Medium' : 'Hard', link: 'https://leetcode.com/problemset/all/' },
            { name: `${name} Theory & Implementation`, platform: 'GeeksforGeeks', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/' }
          ]
        };
      }
    });
  });

  // Add common aliases so various slug variations map gracefully
  const aliases = {
    'dijkstra-algorithm': 'dijkstra',
    'bellman-ford-algorithm': 'bellman-ford',
    'floyd-warshall-algorithm': 'floyd-warshall',
    'prim-algorithm': 'prim',
    'kruskal-algorithm': 'kruskal',
    '0-1-knapsack': 'knapsack',
    'breadth-first-search': 'bfs',
    'depth-first-search': 'dfs',
    'bst-inorder-traversal': 'bst-inorder',
    'binary-search-tree-inorder': 'bst-inorder'
  };
  const hasDocumentedComplexity = entry => !!entry?.complexity?.best && entry.complexity.best !== 'Not documented for this catalog entry.';
  Object.entries(aliases).forEach(([alias, target]) => {
    if (dataset[target] && (!dataset[alias] || (!hasDocumentedComplexity(dataset[alias]) && hasDocumentedComplexity(dataset[target])))) {
      dataset[alias] = dataset[target];
    } else if (dataset[alias] && (!dataset[target] || (!hasDocumentedComplexity(dataset[target]) && hasDocumentedComplexity(dataset[alias])))) {
      dataset[target] = dataset[alias];
    }
  });

  window.algorithmExplanations = dataset;
})();
