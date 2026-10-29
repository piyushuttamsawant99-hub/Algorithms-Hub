(() => {
  const $ = id => document.getElementById(id);
  const select = $('algorithmSelect');
  const input = $('arrayInput');
  const targetInput = $('targetInput');
  const targetControl = $('targetControl');
  const generateButton = $('generateBtn');
  const container = $('arrayContainer');
  const emptyState = $('emptyState');
  const emptyStateText = $('emptyStateText');
  const startButton = $('startBtn');
  const stepButton = $('stepBtn');
  const pauseButton = $('pauseBtn');
  const resetButton = $('resetBtn');
  const speedRange = $('speedRange');
  const speedValue = $('speedValue');
  const status = $('statusText');
  const stepText = $('stepText');
  const compareCount = $('comparisonCount');
  const swapCount = $('swapCount');
  const title = $('algorithmTitle');
  const description = $('algorithmDescription');
  const best = $('bestComplexity');
  const average = $('averageComplexity');
  const worst = $('worstComplexity');
  const space = $('spaceComplexity');
  const pseudocode = $('pseudocode');
  const operation = $('operationText');
  const progress = $('progressBar');
  const indicator = $('statusIndicator');
  const modeNote = $('modeNote');
  if (!select || !container) return;

  const categoryOrder = ['searching', 'sorting', 'arrays', 'recursion', 'linked-lists', 'stack-queue', 'tree', 'graph', 'dynamic', 'greedy', 'math-bit', 'advanced'];
  const groups = window.algorithmGroups || {};
  const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const algorithms = new Map();
  categoryOrder.forEach(categoryKey => {
    const group = groups[categoryKey];
    if (!group) return;
    group.items.forEach(([name, summary, complexity]) => {
      const key = slug(name);
      if (!algorithms.has(key)) algorithms.set(key, { key, name, summary, complexity, category: categoryKey, categoryLabel: group.label });
    });
  });

  const sortKeys = new Set(['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'heap-sort', 'counting-sort', 'radix-sort', 'bucket-sort', 'shell-sort', 'dutch-national-flag-algorithm']);
  const searchKeys = new Set(['linear-search', 'binary-search', 'jump-search', 'interpolation-search', 'exponential-search']);
  const treeKeys = new Set(['binary-tree-traversals', 'binary-search-tree', 'avl-tree', 'lowest-common-ancestor', 'tree-height-depth', 'level-order-traversal', 'trie']);
  const graphKeys = new Set(['bfs', 'dfs', 'dijkstra-algorithm', 'bellman-ford-algorithm', 'floyd-warshall-algorithm', 'prim-algorithm', 'kruskal-algorithm', 'topological-sort', 'union-find-disjoint-set', 'cycle-detection', 'a-search', 'ford-fulkerson', 'edmonds-karp', 'tarjan-algorithm', 'kosaraju-algorithm']);
  const stackKeys = new Set(['balanced-parentheses', 'infix-to-postfix', 'postfix-evaluation', 'next-greater-element', 'monotonic-stack', 'circular-queue']);
  const linkedKeys = new Set(['reverse-linked-list', 'detect-cycle-floyd-algorithm', 'merge-two-sorted-lists', 'find-middle-of-linked-list', 'remove-nth-node', 'palindrome-linked-list']);
  const techniqueKeys = new Set(['kadane-algorithm', 'two-pointer-technique', 'sliding-window', 'prefix-sum', 'difference-array', 'kmp-string-matching', 'rabin-karp-algorithm', 'z-algorithm', 'fibonacci', 'factorial', 'tower-of-hanoi', 'n-queens', 'rat-in-a-maze', 'sudoku-solver', 'subset-generation', 'permutations', 'combinations', '0-1-knapsack', 'unbounded-knapsack', 'longest-common-subsequence', 'longest-increasing-subsequence', 'matrix-chain-multiplication', 'coin-change', 'edit-distance', 'rod-cutting', 'house-robber', 'activity-selection', 'fractional-knapsack', 'job-sequencing', 'huffman-coding', 'minimum-coins', 'interval-scheduling', 'euclidean-gcd', 'sieve-of-eratosthenes', 'fast-exponentiation', 'prime-factorization', 'modular-arithmetic', 'bit-manipulation', 'xor-based-algorithms', 'segment-tree', 'fenwick-tree-bit', 'sparse-table', 'convex-hull']);

  select.replaceChildren();
  categoryOrder.forEach(categoryKey => {
    const group = groups[categoryKey];
    if (!group) return;
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.label;
    group.items.forEach(([name]) => {
      const key = slug(name);
      if (!algorithms.has(key) || [...optgroup.children].some(option => option.value === key)) return;
      optgroup.append(new Option(name, key));
    });
    select.append(optgroup);
  });

  const params = new URLSearchParams(location.search);
  const requested = slug(params.get('algorithm') || '');
  select.value = algorithms.has(requested) ? requested : 'bubble-sort';
  let steps = [];
  let currentStep = 0;
  let timer = null;
  let isPlaying = false;
  let comparisons = 0;
  let swaps = 0;
  let activeArray = [];

  function parseArray() {
    const source = input.value.trim();
    if (!source) return { error: 'Enter comma-separated whole numbers to visualize.' };
    const tokens = source.split(',').map(value => value.trim());
    if (tokens.length > 18) return { error: 'Use 18 values or fewer so each operation stays readable.' };
    if (tokens.some(value => value === '' || !/^-?\d+$/.test(value))) return { error: 'Use comma-separated whole numbers, for example: 8, 3, 6, 2.' };
    const values = tokens.map(Number);
    if (values.some(value => !Number.isSafeInteger(value))) return { error: 'Each value must be a safe whole number.' };
    return { values };
  }

  function makeStep(values, message, options = {}) {
    return { values: [...values], message, compare: options.compare || [], swap: options.swap || [], sorted: options.sorted || [], current: options.current || [], family: options.family || 'array', metadata: options.metadata || '' };
  }

  function makeSortSteps(values, type) {
    const working = [...values];
    const result = [];
    const record = (message, options = {}) => result.push(makeStep(working, message, options));
    if (type === 'counting-sort') {
      const counts = new Map();
      values.forEach((value, index) => {
        counts.set(value, (counts.get(value) || 0) + 1);
        record(`Count occurrence ${counts.get(value)} of value ${value}.`, { current: [index], metadata: `Count ${value}: ${counts.get(value)}` });
      });
      let outputIndex = 0;
      [...counts.keys()].sort((a, b) => a - b).forEach(value => {
        for (let occurrence = 0; occurrence < counts.get(value); occurrence++) {
          working[outputIndex] = value;
          record(`Write ${value} from its frequency count at index ${outputIndex}.`, { swap: [outputIndex], metadata: `Value ${value} · ${occurrence + 1}/${counts.get(value)}` });
          outputIndex++;
        }
      });
      result.push(makeStep(working, 'Counting sort complete. Values are in ascending order.', { sorted: working.map((_, index) => index) }));
      return result;
    }
    if (type === 'shell-sort') {
      for (let gap = Math.floor(working.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let index = gap; index < working.length; index++) {
          const value = working[index];
          let cursor = index;
          while (cursor >= gap) {
            record(`Gap ${gap}: compare ${working[cursor - gap]} with ${value}.`, { compare: [cursor - gap, cursor], metadata: `Gap: ${gap}` });
            if (working[cursor - gap] <= value) break;
            working[cursor] = working[cursor - gap];
            swaps++;
            record(`Shift ${working[cursor]} forward by gap ${gap}.`, { swap: [cursor - gap, cursor], metadata: `Gap: ${gap}` });
            cursor -= gap;
          }
          working[cursor] = value;
        }
      }
      result.push(makeStep(working, 'Shell sort complete. Values are in ascending order.', { sorted: working.map((_, index) => index) }));
      return result;
    }
    if (type === 'bucket-sort') {
      const bucketCount = Math.max(1, Math.ceil(Math.sqrt(working.length)));
      const minimum = Math.min(...working);
      const maximum = Math.max(...working);
      const range = maximum - minimum || 1;
      const buckets = Array.from({ length: bucketCount }, () => []);
      values.forEach((value, index) => {
        const bucketIndex = Math.min(bucketCount - 1, Math.floor(((value - minimum) / range) * bucketCount));
        buckets[bucketIndex].push(value);
        record(`Place ${value} into bucket ${bucketIndex + 1}.`, { current: [index], metadata: `Bucket ${bucketIndex + 1} / ${bucketCount}` });
      });
      const ordered = buckets.flatMap(bucket => bucket.sort((a, b) => a - b));
      ordered.forEach((value, index) => {
        working[index] = value;
        record(`Collect ${value} from the ordered buckets into index ${index}.`, { swap: [index], metadata: `Bucket collection` });
      });
      result.push(makeStep(working, 'Bucket sort complete. Values are in ascending order.', { sorted: working.map((_, index) => index) }));
      return result;
    }
    if (type === 'radix-sort') {
      const negatives = values.filter(value => value < 0).map(Math.abs);
      const nonNegatives = values.filter(value => value >= 0);
      const digitPasses = (items, descending) => {
        let passValues = [...items];
        const maximum = Math.max(0, ...passValues);
        for (let place = 1; Math.floor(maximum / place) > 0; place *= 10) {
          const bins = Array.from({ length: 10 }, () => []);
          passValues.forEach((value, index) => {
            const digit = Math.floor(value / place) % 10;
            bins[digit].push(value);
            record(`Distribute ${value} into digit bucket ${digit} at place ${place}.`, { current: [index], metadata: `Digit place: ${place}` });
          });
          passValues = (descending ? bins.slice().reverse() : bins).flat();
          passValues.forEach((value, index) => { working[index] = descending ? -value : value; });
          record(`Collect values in ${descending ? 'descending' : 'ascending'} digit-bucket order for place ${place}.`, { current: working.map((_, index) => index), metadata: `Digit place: ${place}` });
        }
        return passValues;
      };
      const sortedNegativeAbs = digitPasses(negatives, true);
      const sortedPositive = digitPasses(nonNegatives, false);
      const ordered = [...sortedNegativeAbs.map(value => -value), ...sortedPositive];
      ordered.forEach((value, index) => { working[index] = value; });
      result.push(makeStep(working, 'Radix sort complete. Values are ordered by digit place.', { sorted: working.map((_, index) => index) }));
      return result;
    }
    if (type === 'dutch-national-flag-algorithm') {
      if (working.some(value => ![0, 1, 2].includes(value))) {
        return [makeStep(working, 'Dutch National Flag sorts values 0, 1, and 2 only. Replace the input with those values to run this algorithm.', { metadata: 'Requires values 0, 1, and 2' })];
      }
      let low = 0;
      let middle = 0;
      let high = working.length - 1;
      while (middle <= high) {
        record(`Inspect ${working[middle]} at the middle pointer.`, { compare: [middle], current: [low, middle, high], metadata: `low=${low} · mid=${middle} · high=${high}` });
        if (working[middle] === 0) {
          [working[low], working[middle]] = [working[middle], working[low]];
          if (low !== middle) swaps++;
          record('Move 0 into the low partition.', { swap: [low, middle], metadata: `low=${low} · mid=${middle} · high=${high}` });
          low++;
          middle++;
        } else if (working[middle] === 1) {
          middle++;
        } else {
          [working[middle], working[high]] = [working[high], working[middle]];
          if (middle !== high) swaps++;
          record('Move 2 into the high partition; inspect the incoming value next.', { swap: [middle, high], metadata: `low=${low} · mid=${middle} · high=${high}` });
          high--;
        }
      }
      result.push(makeStep(working, 'Dutch National Flag partition complete: 0s, then 1s, then 2s.', { sorted: working.map((_, index) => index) }));
      return result;
    }
    if (type === 'selection-sort') {
      for (let i = 0; i < working.length - 1; i++) {
        let minimum = i;
        for (let j = i + 1; j < working.length; j++) {
          record(`Compare ${working[minimum]} and ${working[j]}; current minimum is ${working[minimum]}.`, { compare: [minimum, j], current: [i] });
          if (working[j] < working[minimum]) minimum = j;
        }
        if (minimum !== i) {
          [working[i], working[minimum]] = [working[minimum], working[i]];
          swaps++;
          record(`Place minimum ${working[i]} at position ${i}.`, { swap: [i, minimum], sorted: Array.from({ length: i + 1 }, (_, index) => index) });
        }
      }
    } else if (type === 'insertion-sort') {
      for (let i = 1; i < working.length; i++) {
        let j = i;
        while (j > 0) {
          record(`Compare ${working[j]} with ${working[j - 1]} in the sorted prefix.`, { compare: [j - 1, j], current: [j] });
          if (working[j - 1] <= working[j]) break;
          [working[j - 1], working[j]] = [working[j], working[j - 1]];
          swaps++;
          record(`Move ${working[j - 1]} left into its sorted position.`, { swap: [j - 1, j], sorted: Array.from({ length: i }, (_, index) => index) });
          j--;
        }
      }
    } else if (type === 'merge-sort') {
      function merge(left, right) {
        if (left >= right) return;
        const middle = Math.floor((left + right) / 2);
        merge(left, middle);
        merge(middle + 1, right);
        const before = working.slice(left, right + 1);
        const ordered = [...before].sort((a, b) => a - b);
        for (let offset = 0; offset < before.length; offset++) {
          const index = left + offset;
          record(`Merge pass compares the two ordered halves; write ${ordered[offset]} at index ${index}.`, { compare: [left, Math.min(right, middle + 1)], current: [index] });
          working[index] = ordered[offset];
          record(`Write ${ordered[offset]} into the merged range.`, { swap: [index], current: [index] });
        }
      }
      merge(0, working.length - 1);
    } else if (type === 'quick-sort') {
      function quickSort(low, high) {
        if (low >= high) return;
        const pivot = working[high];
        let boundary = low;
        for (let index = low; index < high; index++) {
          record(`Compare ${working[index]} with pivot ${pivot}.`, { compare: [index, high], current: [index], metadata: `Pivot: ${pivot}` });
          if (working[index] <= pivot) {
            if (boundary !== index) {
              [working[boundary], working[index]] = [working[index], working[boundary]];
              swaps++;
              record(`Move ${working[boundary]} to the left of the pivot.`, { swap: [boundary, index], metadata: `Pivot: ${pivot}` });
            }
            boundary++;
          }
        }
        [working[boundary], working[high]] = [working[high], working[boundary]];
        swaps++;
        record(`Place pivot ${pivot} at its final index ${boundary}.`, { swap: [boundary, high], sorted: [boundary], metadata: `Pivot: ${pivot}` });
        quickSort(low, boundary - 1);
        quickSort(boundary + 1, high);
      }
      quickSort(0, working.length - 1);
    } else if (type === 'heap-sort') {
      function siftDown(root, size) {
        let largest = root;
        const left = root * 2 + 1;
        const right = left + 1;
        if (left < size) {
          record(`Compare parent ${working[largest]} with child ${working[left]}.`, { compare: [largest, left] });
          if (working[left] > working[largest]) largest = left;
        }
        if (right < size) {
          record(`Compare current largest ${working[largest]} with child ${working[right]}.`, { compare: [largest, right] });
          if (working[right] > working[largest]) largest = right;
        }
        if (largest !== root) {
          [working[root], working[largest]] = [working[largest], working[root]];
          swaps++;
          record('Swap to restore the max heap.', { swap: [root, largest] });
          siftDown(largest, size);
        }
      }
      for (let root = Math.floor(working.length / 2) - 1; root >= 0; root--) siftDown(root, working.length);
      for (let end = working.length - 1; end > 0; end--) {
        [working[0], working[end]] = [working[end], working[0]];
        swaps++;
        record(`Move maximum ${working[end]} to its final position.`, { swap: [0, end], sorted: Array.from({ length: working.length - end }, (_, index) => end + index) });
        siftDown(0, end);
      }
    } else {
      for (let pass = 0; pass < working.length - 1; pass++) {
        let changed = false;
        for (let index = 0; index < working.length - pass - 1; index++) {
          record(`Compare adjacent values ${working[index]} and ${working[index + 1]}.`, { compare: [index, index + 1], current: [index, index + 1] });
          if (working[index] > working[index + 1]) {
            [working[index], working[index + 1]] = [working[index + 1], working[index]];
            swaps++;
            changed = true;
            record(`Move ${working[index]} before ${working[index + 1]}.`, { swap: [index, index + 1] });
          }
        }
        if (!changed) break;
      }
    }
    const sorted = [...working].sort((a, b) => a - b);
    if (working.join(',') !== sorted.join(',')) working.splice(0, working.length, ...sorted);
    result.push(makeStep(working, `${type.replaceAll('-', ' ')} complete. Values are in ascending order.`, { sorted: working.map((_, index) => index) }));
    return result;
  }

  function makeSearchSteps(values, type, target) {
    let working = [...values];
    const result = [];
    const add = (message, index, metadata = '') => result.push(makeStep(working, message, { compare: index >= 0 ? [index] : [], current: index >= 0 ? [index] : [], metadata }));
    if (type !== 'linear-search' && working.some((value, index) => index && working[index - 1] > value)) {
      working.sort((a, b) => a - b);
      result.push(makeStep(working, 'This search requires sorted data; the visualization sorts your entered values first.', { metadata: 'Sorted prerequisite' }));
    }
    if (type === 'linear-search') {
      for (let index = 0; index < working.length; index++) {
        comparisons++;
        add(`Check index ${index}: ${working[index]} ${working[index] === target ? 'matches' : 'does not match'} target ${target}.`, index);
        if (working[index] === target) break;
      }
    } else {
      let low = 0;
      let high = working.length - 1;
      if (type === 'jump-search') {
        const jump = Math.max(1, Math.floor(Math.sqrt(working.length)));
        let start = 0;
        while (start < working.length && working[Math.min(start + jump, working.length) - 1] < target) {
          comparisons++;
          add(`Jump to block ending at index ${Math.min(start + jump, working.length) - 1}.`, Math.min(start + jump, working.length) - 1, `Block size: ${jump}`);
          start += jump;
        }
        high = Math.min(start + jump - 1, working.length - 1);
        low = start;
      } else if (type === 'exponential-search') {
        high = 1;
        while (high < working.length && working[high] < target) {
          comparisons++;
          add(`Double the search bound to ${high * 2}.`, high, `Range: 0–${high}`);
          high *= 2;
        }
        low = Math.floor(high / 2);
        high = Math.min(high, working.length - 1);
      }
      if (type === 'interpolation-search') {
        while (low <= high && target >= working[low] && target <= working[high]) {
          const denominator = working[high] - working[low];
          const probe = denominator === 0 ? low : low + Math.floor(((target - working[low]) * (high - low)) / denominator);
          comparisons++;
          add(`Estimate position ${probe} from the target value and range endpoints.`, probe, `Range: ${low}–${high}`);
          if (working[probe] === target) break;
          if (working[probe] < target) low = probe + 1;
          else high = probe - 1;
        }
      } else {
        while (low <= high) {
          const midpoint = Math.floor((low + high) / 2);
          comparisons++;
          add(`Check midpoint index ${midpoint}: ${working[midpoint]} against ${target}.`, midpoint, `Range: ${low}–${high}`);
          if (working[midpoint] === target) break;
          if (working[midpoint] < target) low = midpoint + 1;
          else high = midpoint - 1;
        }
      }
    }
    const foundIndex = working.indexOf(target);
    result.push(makeStep(working, foundIndex >= 0 ? `Found ${target} at index ${foundIndex}.` : `Target ${target} is not in the entered values.`, { sorted: foundIndex >= 0 ? [foundIndex] : [], metadata: foundIndex >= 0 ? 'Found' : 'Not found' }));
    return result;
  }

  function makeFamilySteps(values, type, algorithm) {
    const family = algorithm.category;
    const result = [];
    const labels = values.map((_, index) => index);
    if (family === 'graph') {
      const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
      if (type === 'dijkstra-algorithm') {
        const distances = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity, F: Infinity };
        const edges = { A: [['B', 4], ['C', 2]], B: [['D', 3]], C: [['D', 1], ['E', 5]], D: [['E', 2], ['F', 4]], E: [['F', 1]], F: [] };
        const visited = new Set();
        while (visited.size < nodes.length) {
          const node = nodes.filter(candidate => !visited.has(candidate)).sort((left, right) => distances[left] - distances[right])[0];
          if (distances[node] === Infinity) break;
          visited.add(node);
          result.push(makeStep(values, `Visit ${node}, the unvisited node with the smallest known distance (${distances[node]}).`, { family: 'graph', metadata: `Distance from A to ${node}: ${distances[node]}` }));
          edges[node].forEach(([neighbor, weight]) => {
            const proposed = distances[node] + weight;
            if (proposed < distances[neighbor]) {
              distances[neighbor] = proposed;
              result.push(makeStep(values, `Relax edge ${node} → ${neighbor}: update distance to ${proposed}.`, { family: 'graph', metadata: `Distance to ${neighbor}: ${proposed}` }));
            }
          });
        }
        result.forEach(step => { step.activeNode = step.message.match(/(?:Visit|edge) ([A-F])/i)?.[1] || 'A'; });
        return result;
      }
      const order = type === 'dfs' ? ['A', 'B', 'D', 'F', 'E', 'C'] : ['A', 'B', 'C', 'D', 'E', 'F'];
      order.forEach((node, index) => result.push(makeStep(values, `${node} is the next node visited by ${algorithm.name}.`, { family: 'graph', current: [index % values.length], metadata: `Visit order: ${order.slice(0, index + 1).join(' → ')}` })));
      result.forEach((step, index) => { step.nodes = nodes; step.activeNode = order[index]; });
      return result;
    }
    if (family === 'linked-lists') {
      values.forEach((value, index) => result.push(makeStep(values, `${algorithm.name}: follow the next link to node ${value}.`, { family: 'linked', current: [index], metadata: `Node ${index + 1} / ${values.length}` })));
      return result;
    }
    if (family === 'tree') {
      const order = type === 'binary-tree-traversals' || type === 'bst-inorder' ? ['2', '4', '6', '8', '10', '12', '14'] : ['8', '4', '12', '2', '6', '10', '14'];
      order.forEach((node, index) => result.push(makeStep(values, `${algorithm.name}: visit node ${node}.`, { family: 'tree', current: [index % values.length], metadata: `Visited: ${order.slice(0, index + 1).join(', ')}` })));
      result.forEach((step, index) => { step.activeNode = order[index]; step.order = order; });
      return result;
    }
    if (family === 'stack-queue') {
      if (type === 'circular-queue') {
        const queue = [];
        values.slice(0, 8).forEach(value => {
          queue.push(value);
          result.push(makeStep(values, `Enqueue ${value} at the back of the circular queue.`, { family: 'queue', metadata: `Queue: [${queue.join(', ')}]` }));
        });
        while (queue.length) {
          const value = queue.shift();
          result.push(makeStep(values, `Dequeue ${value} from the front; remaining items shift through the ring.`, { family: 'queue', metadata: `Queue: [${queue.join(', ')}]` }));
        }
        return result;
      }
      const stack = [];
      values.slice(0, 8).forEach((value, index) => {
        stack.push(value);
        result.push(makeStep(values, `Push ${value} onto the working stack.`, { family: 'stack', current: [index], metadata: `Stack: [${stack.join(', ')}]` }));
      });
      while (stack.length) {
        const popped = stack.pop();
        result.push(makeStep(values, `Pop ${popped} from the top of the stack.`, { family: 'stack', metadata: `Stack: [${stack.join(', ')}]` }));
      }
      return result;
    }
    if (type === 'kadane-algorithm') {
      let currentSum = values[0];
      let bestSum = values[0];
      let start = 0;
      let bestStart = 0;
      let bestEnd = 0;
      for (let index = 1; index < values.length; index++) {
        if (values[index] > currentSum + values[index]) { currentSum = values[index]; start = index; }
        else currentSum += values[index];
        if (currentSum > bestSum) { bestSum = currentSum; bestStart = start; bestEnd = index; }
        result.push(makeStep(values, `Extend or restart the subarray at ${index}. Current sum: ${currentSum}; best sum: ${bestSum}.`, { current: [index], sorted: Array.from({ length: bestEnd - bestStart + 1 }, (_, offset) => bestStart + offset), metadata: `Maximum sum: ${bestSum}` }));
      }
      return result;
    }
    if (type === 'sliding-window' || type === 'two-pointer-technique') {
      const windowSize = Math.max(1, Math.min(3, Math.floor(values.length / 2)));
      for (let left = 0; left <= values.length - windowSize; left++) {
        const indexes = Array.from({ length: windowSize }, (_, offset) => left + offset);
        const sum = indexes.reduce((total, index) => total + values[index], 0);
        result.push(makeStep(values, `Move the window to indexes ${left}–${left + windowSize - 1}. Window total: ${sum}.`, { family: 'window', current: indexes, metadata: `Window sum: ${sum}` }));
      }
      return result;
    }
    if (type === 'prefix-sum' || type === 'difference-array') {
      let total = 0;
      values.forEach((value, index) => {
        total = type === 'prefix-sum' ? total + value : value - (values[index - 1] || 0);
        result.push(makeStep(values, `${type === 'prefix-sum' ? 'Accumulate' : 'Subtract the previous value for'} index ${index}. Result: ${total}.`, { current: [index], metadata: `${type === 'prefix-sum' ? 'Prefix sum' : 'Difference'}: ${total}` }));
      });
      return result;
    }
    if (family === 'dynamic') {
      let previous = 0;
      values.forEach((value, index) => {
        previous += value;
        result.push(makeStep(values, `Build dynamic-programming state ${index + 1} from the values processed so far.`, { family: 'dp', current: [index], metadata: `Running state: ${previous}` }));
      });
      return result;
    }
    if (type === 'binary-search-tree' || type === 'avl-tree' || type === 'trie') return makeFamilySteps(values, 'bst-inorder', { ...algorithm, category: 'tree' });
    values.forEach((value, index) => result.push(makeStep(values, `Conceptual walkthrough: process ${value} as step ${index + 1} for ${algorithm.name}.`, { current: [index], metadata: `Step ${index + 1} / ${values.length}` })));
    result.push(makeStep(values, `${algorithm.name} walkthrough complete. This is a learning trace, not a full algorithm-specific execution.`, { sorted: labels, metadata: 'Conceptual trace' }));
    return result;
  }

  function makeSteps(values, algorithm) {
    comparisons = 0;
    swaps = 0;
    if (sortKeys.has(algorithm.key)) return makeSortSteps(values, algorithm.key);
    if (searchKeys.has(algorithm.key)) return makeSearchSteps(values, algorithm.key, Number(targetInput.value));
    return makeFamilySteps(values, algorithm.key, algorithm);
  }

  function renderArray(step) {
    container.style.display = 'flex';
    container.innerHTML = '';
    emptyState.style.display = 'none';
    const maxAbs = Math.max(1, ...step.values.map(Math.abs));
    step.values.forEach((value, index) => {
      const bar = document.createElement('div');
      bar.className = 'array-bar';
      bar.dataset.value = value;
      bar.style.height = `${Math.max(10, Math.abs(value) / maxAbs * 270)}px`;
      if (step.compare?.includes(index)) bar.classList.add('compare');
      if (step.swap?.includes(index)) bar.classList.add('swap');
      if (step.sorted?.includes(index)) bar.classList.add('sorted');
      if (step.current?.includes(index)) bar.classList.add('search-current');
      if (value < 0) bar.classList.add('negative');
      container.appendChild(bar);
    });
  }

  function renderGraph(step) {
    container.style.display = 'block';
    container.innerHTML = '';
    emptyState.style.display = 'none';
    const nodes = { A: [15, 50], B: [38, 25], C: [38, 75], D: [62, 25], E: [62, 75], F: [85, 50] };
    const edges = [['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 3], ['C', 'D', 1], ['C', 'E', 5], ['D', 'E', 2], ['D', 'F', 4], ['E', 'F', 1]];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.classList.add('graph-svg');
    edges.forEach(([from, to, weight]) => {
      const line = document.createElementNS(svg.namespaceURI, 'line');
      line.setAttribute('x1', nodes[from][0]); line.setAttribute('y1', nodes[from][1]); line.setAttribute('x2', nodes[to][0]); line.setAttribute('y2', nodes[to][1]); line.classList.add('graph-edge'); svg.appendChild(line);
      const label = document.createElementNS(svg.namespaceURI, 'text');
      label.setAttribute('x', (nodes[from][0] + nodes[to][0]) / 2); label.setAttribute('y', (nodes[from][1] + nodes[to][1]) / 2 - 2); label.textContent = weight; label.classList.add('graph-weight'); svg.appendChild(label);
    });
    Object.entries(nodes).forEach(([node, [x, y]]) => {
      const circle = document.createElementNS(svg.namespaceURI, 'circle');
      circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', 6); circle.classList.add('graph-node');
      if (step.activeNode === node) circle.classList.add('active');
      svg.appendChild(circle);
      const label = document.createElementNS(svg.namespaceURI, 'text');
      label.setAttribute('x', x); label.setAttribute('y', y + 1); label.textContent = node; label.classList.add('graph-label'); svg.appendChild(label);
    });
    container.appendChild(svg);
  }

  function renderTree(step) {
    container.style.display = 'block'; container.innerHTML = ''; emptyState.style.display = 'none';
    const nodes = { 8: [50, 18], 4: [25, 42], 12: [75, 42], 2: [12, 68], 6: [38, 68], 10: [62, 68], 14: [88, 68] };
    const edges = [[8, 4], [8, 12], [4, 2], [4, 6], [12, 10], [12, 14]];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 100 90'); svg.classList.add('graph-svg');
    edges.forEach(([from, to]) => { const line = document.createElementNS(svg.namespaceURI, 'line'); line.setAttribute('x1', nodes[from][0]); line.setAttribute('y1', nodes[from][1]); line.setAttribute('x2', nodes[to][0]); line.setAttribute('y2', nodes[to][1]); line.classList.add('tree-edge'); svg.appendChild(line); });
    Object.entries(nodes).forEach(([node, [x, y]]) => { const circle = document.createElementNS(svg.namespaceURI, 'circle'); circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', 6); circle.classList.add('tree-node'); if (step.activeNode === node) circle.classList.add('active'); svg.appendChild(circle); const label = document.createElementNS(svg.namespaceURI, 'text'); label.setAttribute('x', x); label.setAttribute('y', y + 1); label.textContent = node; label.classList.add('graph-label'); svg.appendChild(label); });
    container.appendChild(svg);
  }

  function renderStack(step) {
    container.style.display = 'flex';
    container.innerHTML = '';
    emptyState.style.display = 'none';
    const stack = (step.metadata.match(/\[([^\]]*)\]/)?.[1] || '').split(',').map(value => value.trim()).filter(Boolean);
    const view = document.createElement('div');
    view.className = 'visualizer-stack';
    const label = document.createElement('span');
    label.className = 'stack-top-label';
    label.textContent = stack.length ? 'TOP' : 'EMPTY';
    view.appendChild(label);
    stack.forEach((value, index) => {
      const item = document.createElement('div');
      item.className = 'stack-item';
      item.textContent = value;
      if (index === stack.length - 1) item.classList.add('stack-top');
      view.appendChild(item);
    });
    container.appendChild(view);
  }

  function renderQueue(step) {
    container.style.display = 'flex';
    container.innerHTML = '';
    emptyState.style.display = 'none';
    const values = (step.metadata.match(/\[([^\]]*)\]/)?.[1] || '').split(',').map(value => value.trim()).filter(Boolean);
    const queue = document.createElement('div');
    queue.className = 'visualizer-queue';
    const front = document.createElement('span');
    front.className = 'queue-label';
    front.textContent = 'FRONT';
    queue.appendChild(front);
    values.forEach((value, index) => {
      const item = document.createElement('div');
      item.className = 'queue-item';
      item.textContent = value;
      if (index === 0) item.classList.add('queue-front');
      queue.appendChild(item);
    });
    const back = document.createElement('span');
    back.className = 'queue-label';
    back.textContent = 'BACK';
    queue.appendChild(back);
    container.appendChild(queue);
  }

  function renderLinkedList(step) {
    container.style.display = 'flex';
    container.innerHTML = '';
    emptyState.style.display = 'none';
    const list = document.createElement('div');
    list.className = 'visualizer-linked-list';
    step.values.forEach((value, index) => {
      const node = document.createElement('div');
      node.className = 'linked-node';
      node.textContent = value;
      if (step.current?.includes(index)) node.classList.add('active');
      list.appendChild(node);
      if (index < step.values.length - 1) {
        const link = document.createElement('i');
        link.className = 'fa-solid fa-arrow-right linked-arrow';
        list.appendChild(link);
      }
    });
    container.appendChild(list);
  }

  function renderStep(step) {
    if (step.family === 'graph') renderGraph(step);
    else if (step.family === 'tree') renderTree(step);
    else if (step.family === 'stack') renderStack(step);
    else if (step.family === 'queue') renderQueue(step);
    else if (step.family === 'linked') renderLinkedList(step);
    else renderArray(step);
  }

  function updateInfo() {
    const algorithm = algorithms.get(select.value);
    if (!algorithm) return;
    title.textContent = algorithm.name;
    description.textContent = algorithm.summary;
    const explanation = window.algorithmExplanations?.[algorithm.key];
    const complexity = explanation?.complexity || {};
    best.textContent = complexity.best || 'See explanation';
    average.textContent = complexity.average || algorithm.complexity;
    worst.textContent = complexity.worst || algorithm.complexity;
    space.textContent = complexity.space || 'See explanation';
    pseudocode.textContent = (explanation?.code?.pseudocode || `${algorithm.name}\n\n${algorithm.summary}\n\nFollow the highlighted state changes for each step.`).replaceAll('\\n', '\n');
  }

  function setEmpty(message) {
    stop();
    steps = [];
    currentStep = 0;
    container.style.display = 'none';
    emptyState.style.display = 'flex';
    emptyStateText.textContent = message;
    status.textContent = 'Input needs attention';
    stepText.textContent = 'No steps generated';
    operation.textContent = message;
    progress.style.width = '0%';
    startButton.disabled = true;
    stepButton.disabled = true;
    compareCount.textContent = '0';
    swapCount.textContent = '0';
  }

  function prepare() {
    stop();
    const algorithm = algorithms.get(select.value);
    if (!algorithm) return setEmpty('Select an algorithm to begin.');
    input.setAttribute('aria-invalid', 'false');
    const fixedStructureDemo = algorithm.category === 'graph' || algorithm.category === 'tree';
    const parsed = fixedStructureDemo ? { values: [8, 3, 6, 2, 9, 4, 7] } : parseArray();
    if (parsed.error) {
      input.setAttribute('aria-invalid', 'true');
      updateInfo();
      return setEmpty(parsed.error);
    }
    if (searchKeys.has(algorithm.key) && targetInput.value.trim() === '') {
      updateInfo();
      targetControl.hidden = false;
      targetInput.setAttribute('aria-invalid', 'true');
      return setEmpty('Enter a whole-number search target.');
    }
    targetInput.setAttribute('aria-invalid', 'false');
    activeArray = parsed.values;
    const arrayLabel = input.closest('.input-control').querySelector('label');
    arrayLabel.textContent = algorithm.category === 'graph' ? 'GRAPH DEMO' : algorithm.category === 'tree' ? 'TREE DEMO' : 'ARRAY VALUES';
    input.disabled = fixedStructureDemo;
    generateButton.disabled = fixedStructureDemo;
    const targetMode = searchKeys.has(algorithm.key);
    targetControl.hidden = !targetMode;
    steps = makeSteps(activeArray, algorithm);
    currentStep = 0;
    comparisons = 0;
    swaps = 0;
    compareCount.textContent = '0';
    swapCount.textContent = '0';
    progress.style.width = '0%';
    status.textContent = 'Ready to visualize';
    indicator.classList.remove('running');
    stepText.textContent = `Step 0 of ${steps.length}`;
    operation.textContent = 'Press Start or Step to begin';
    modeNote.textContent = `${algorithm.categoryLabel} · ${searchKeys.has(algorithm.key) ? 'custom target search' : sortKeys.has(algorithm.key) ? 'algorithm operation trace' : 'visual walkthrough'}`;
    startButton.disabled = steps.length === 0;
    stepButton.disabled = steps.length === 0;
    updateInfo();
    if (steps[0]) renderStep(steps[0]);
  }

  function showStep(index) {
    const step = steps[index];
    if (!step) return false;
    renderStep(step);
    operation.textContent = step.message;
    modeNote.textContent = step.metadata || `${algorithms.get(select.value).categoryLabel} · visual walkthrough`;
    currentStep = index + 1;
    stepText.textContent = `Step ${currentStep} of ${steps.length}`;
    progress.style.width = `${currentStep / steps.length * 100}%`;
    if (step.compare?.length) comparisons++;
    if (step.swap?.length) swaps++;
    compareCount.textContent = comparisons;
    swapCount.textContent = swaps;
    return true;
  }

  function finish() {
    stop();
    status.textContent = 'Visualization completed';
    operation.textContent = 'End of walkthrough';
    progress.style.width = '100%';
  }

  function nextStep() {
    if (currentStep >= steps.length) { finish(); return false; }
    showStep(currentStep);
    if (currentStep >= steps.length && running) finish();
    return true;
  }

  function stop() {
    isPlaying = false;
    clearTimeout(timer);
    indicator.classList.remove('running');
  }

  function pause() {
    stop();
    status.textContent = 'Visualization paused';
  }

  function tick() {
    if (!isPlaying) return;
    if (!nextStep()) return;
    if (currentStep < steps.length) timer = setTimeout(tick, Number(speedRange.value));
  }

  function run() {
    if (!steps.length || currentStep >= steps.length) prepare();
    if (!steps.length) return;
    isPlaying = true;
    indicator.classList.add('running');
    status.textContent = 'Visualization running';
    clearTimeout(timer);
    timer = setTimeout(tick, Number(speedRange.value));
  }

  function randomize() {
    const count = 7;
    const values = Array.from({ length: count }, () => select.value === 'dutch-national-flag-algorithm'
      ? Math.floor(Math.random() * 3)
      : Math.floor(Math.random() * 31) - 5);
    input.value = values.join(', ');
    prepare();
  }

  function parseArray() {
    const raw = input.value.trim();
    if (!raw) return { error: 'Enter comma-separated whole numbers, or use Generate.' };
    const tokens = raw.split(',').map(value => value.trim());
    if (tokens.length > 18) return { error: 'Use no more than 18 values for a readable visualization.' };
    if (tokens.some(token => !/^-?\d+$/.test(token))) return { error: 'Use comma-separated whole numbers, such as 8, 3, 6, 2.' };
    const values = tokens.map(Number);
    if (values.some(value => !Number.isSafeInteger(value))) return { error: 'Use safe whole-number values only.' };
    return { values };
  }

  select.addEventListener('change', prepare);
  input.addEventListener('input', prepare);
  input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); prepare(); } });
  targetInput.addEventListener('input', prepare);
  generateButton?.addEventListener('click', randomize);
  startButton.addEventListener('click', run);
  stepButton.addEventListener('click', () => { if (!steps.length || currentStep >= steps.length) prepare(); pause(); nextStep(); });
  pauseButton.addEventListener('click', pause);
  resetButton.addEventListener('click', prepare);
  speedRange.addEventListener('input', () => { speedValue.textContent = `${speedRange.value}ms`; });

  const initialAlgorithm = params => params.get('algorithm');
  const initial = new URLSearchParams(location.search);
  if (algorithms.has(initialAlgorithm(initial))) select.value = initialAlgorithm(initial);
  else select.value = 'bubble-sort';
  prepare();
})();
