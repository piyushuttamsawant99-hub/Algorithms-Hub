/* Algorithm Hub — Interactive Visualizer v2 */
(() => {
  const $ = id => document.getElementById(id);
  const select = $('algorithmSelect');
  const input = $('arrayInput');
  const generateBtn = $('generateBtn');
  const container = $('arrayContainer');
  const emptyState = $('emptyState');
  const startBtn = $('startBtn');
  const stepBtn = $('stepBtn');
  const pauseBtn = $('pauseBtn');
  const resetBtn = $('resetBtn');
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

  const DATA = {
    'bubble-sort': ['Bubble Sort','Compares adjacent values and swaps them when needed.','O(n)','O(n²)','O(n²)','O(1)','Array · compare adjacent elements'],
    'selection-sort': ['Selection Sort','Finds the minimum remaining value and places it next.','O(n²)','O(n²)','O(n²)','O(1)','Array · select minimum'],
    'insertion-sort': ['Insertion Sort','Builds a sorted prefix by inserting each new value into position.','O(n)','O(n²)','O(n²)','O(1)','Array · insert into sorted prefix'],
    'merge-sort': ['Merge Sort','Divides the array and merges sorted halves.','O(n log n)','O(n log n)','O(n log n)','O(n)','Array · divide and merge'],
    'quick-sort': ['Quick Sort','Partitions values around a pivot and recursively sorts the partitions.','O(n log n)','O(n log n)','O(n²)','O(log n) average; O(n) worst','Array · partition around pivot'],
    'linear-search': ['Linear Search','Checks values sequentially until the target is found.','O(1)','O(n)','O(n)','O(1)','Array · sequential scan'],
    'binary-search': ['Binary Search','Halves a sorted search range after every comparison.','O(1)','O(log n)','O(log n)','O(1)','Array · halve the range'],
    'heap-sort': ['Heap Sort','Builds a max heap and repeatedly moves the largest value to the end.','O(n log n)','O(n log n)','O(n log n)','O(1)','Array · heap structure'],
    'bfs': ['Breadth-First Search','Visits a graph level by level using a queue.','O(V+E)','O(V+E)','O(V+E)','O(V)','Graph · queue / level order'],
    'dfs': ['Depth-First Search','Explores a graph deeply before backtracking.','O(V+E)','O(V+E)','O(V+E)','O(V)','Graph · depth / backtracking'],
    'dijkstra': ['Dijkstra’s Algorithm','Finds shortest paths from one source with non-negative edge weights.','O((V+E) log V) heap','O((V+E) log V) heap','O((V+E) log V) heap','O(V+E) with lazy heap entries','Graph · weighted shortest path'],
    'floyd-warshall': ['Floyd-Warshall','Finds all-pairs shortest paths through dynamic programming.','O(V³)','O(V³)','O(V³)','O(V²)','Graph · distance matrix'],
    'bst-inorder': ['BST Inorder Traversal','Visits a binary search tree in left-root-right order.','O(n)','O(n)','O(n)','O(h)','Tree · depth-first traversal'],
    'bst-level-order': ['BST Level Order','Visits tree nodes one level at a time using a queue.','O(n)','O(n)','O(n)','O(n)','Tree · breadth-first traversal'],
    'activity-selection': ['Activity Selection','Chooses compatible activities by earliest finishing time.','O(n log n)','O(n log n)','O(n log n)','O(n)','Greedy · earliest finish'],
    'knapsack': ['0/1 Knapsack','Builds a DP table to maximize value under a capacity constraint.','O(nW)','O(nW)','O(nW)','O(nW)','DP · value table'],
    'lcs': ['Longest Common Subsequence','Builds a table to find the longest common subsequence.','O(mn)','O(mn)','O(mn)','O(mn)','DP · comparison matrix'],
    'fibonacci': ['Fibonacci DP','Computes Fibonacci numbers with reusable subproblem results.','O(n)','O(n)','O(n)','O(n)','DP · memoized sequence']
  };

  // Keep every library item available in the lab; unsupported concepts use the array lesson as a starting point.
  const extraAlgorithms = 'Jump Search|Interpolation Search|Exponential Search|Counting Sort|Radix Sort|Bucket Sort|Shell Sort|Kadane Algorithm|Two Pointer Technique|Sliding Window|Prefix Sum|Difference Array|Dutch National Flag Algorithm|KMP String Matching|Rabin Karp Algorithm|Z Algorithm|Factorial|Tower of Hanoi|N Queens|Rat in a Maze|Sudoku Solver|Subset Generation|Permutations|Combinations|Reverse Linked List|Detect Cycle Floyd Algorithm|Merge Two Sorted Lists|Find Middle of Linked List|Remove Nth Node|Palindrome Linked List|Balanced Parentheses|Infix to Postfix|Postfix Evaluation|Next Greater Element|Monotonic Stack|Circular Queue|Binary Tree Traversals|Binary Search Tree|AVL Tree|Lowest Common Ancestor|Tree Height Depth|Level Order Traversal|Trie|Bellman Ford Algorithm|Floyd Warshall Algorithm|Prim Algorithm|Kruskal Algorithm|Topological Sort|Union Find Disjoint Set|Cycle Detection|Unbounded Knapsack|Longest Common Subsequence|Longest Increasing Subsequence|Matrix Chain Multiplication|Coin Change|Edit Distance|Rod Cutting|House Robber|Fractional Knapsack|Job Sequencing|Huffman Coding|Minimum Coins|Interval Scheduling|Euclidean GCD|Sieve of Eratosthenes|Fast Exponentiation|Prime Factorization|Modular Arithmetic|Bit Manipulation|XOR-based Algorithms|A Search|Ford Fulkerson|Edmonds Karp|Tarjan Algorithm|Kosaraju Algorithm|Segment Tree|Fenwick Tree BIT|Sparse Table|Convex Hull'.split('|');
  const existingValues = new Set([...select.options].map(option => option.value));
  extraAlgorithms.forEach(name => {
    const value = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!existingValues.has(value)) {
      select.append(new Option(name, value));
      DATA[value] = [name, 'Follow the highlighted operations and connect each step to the core idea.', 'See guide', 'See guide', 'See guide', 'O(n)', 'Interactive concept · highlighted walkthrough'];
    }
  });

  let array = [];
  let steps = [];
  let current = 0;
  let timer = null;
  let running = false;
  let comparisons = 0;
  let swaps = 0;

  const isArrayMode = () => ['bubble-sort','selection-sort','insertion-sort','merge-sort','quick-sort','linear-search','binary-search','heap-sort'].includes(select.value);
  const isTree = () => select.value.startsWith('bst-');
  const isGraph = () => ['bfs','dfs','dijkstra','floyd-warshall'].includes(select.value);

  function parseArray() {
    const nums = input.value.split(',').map(v => Number(v.trim())).filter(Number.isFinite).slice(0, 18);
    return nums.length ? nums : [8,3,6,2,9,4,7];
  }
  function pushStep(a, compare=[], swap=[], sorted=[], currentIdx=[], message='') { steps.push({array:[...a],compare,swap,sorted,current:currentIdx,message}); }

  function arraySteps(a, type) {
    const out=[]; let b=[...a];
    const add=(arr, compare=[], swap=[], sorted=[], currentIdx=[], message='') => out.push({array:[...arr],compare,swap,sorted,current:currentIdx,message});
    if (type === 'linear-search') { const target=b[3] ?? b[0]; for(let i=0;i<b.length;i++){add(b,[i],[],[],[i],`Check ${b[i]} against target ${target}`); if(b[i]===target){add(b,[],[],[i],[],`Target ${target} found at index ${i}`);break;} } return out; }
    if (type === 'binary-search') { b=[...b].sort((x,y)=>x-y); const target=b[Math.floor(b.length/2)] ?? b[0]; let l=0,r=b.length-1; while(l<=r){const m=Math.floor((l+r)/2);add(b,[m],[],[],[m],`Check middle ${b[m]} against target ${target}`);if(b[m]===target){add(b,[],[],[m],[],`Target ${target} found`);break;} if(b[m]<target)l=m+1;else r=m-1;} return out; }
    if(type==='selection-sort'){for(let i=0;i<b.length;i++){let m=i;for(let j=i+1;j<b.length;j++){add(b,[m,j],[],[],[j],`Compare ${b[m]} and ${b[j]}`);if(b[j]<b[m])m=j;}if(m!==i){[b[i],b[m]]=[b[m],b[i]];swaps++;add(b,[],[i,m],[],[],`Swap ${b[m]} into position ${i}`);}}add(b,[],[],b.map((_,i)=>i),[],`Selection sort complete`);return out;}
    if(type==='insertion-sort'){for(let i=1;i<b.length;i++){let j=i;while(j>0&&b[j]<b[j-1]){add(b,[j-1,j],[],[],[j],`Compare ${b[j-1]} and ${b[j]}`);[b[j],b[j-1]]=[b[j-1],b[j]];j--;add(b,[],[j,j+1],[],[],`Insert value at index ${j}`);}}add(b,[],[],b.map((_,i)=>i),[],`Insertion sort complete`);return out;}
    if(type==='merge-sort'){function mergeSort(l,r){if(l>=r)return;const m=Math.floor((l+r)/2);mergeSort(l,m);mergeSort(m+1,r);const left=b.slice(l,m+1),right=b.slice(m+1,r+1);let i=0,j=0,k=l;while(i<left.length&&j<right.length){add(b,[l+i,m+1+j],[],[],[k],`Compare ${left[i]} and ${right[j]}`);b[k++]=left[i]<=right[j]?left[i++]:right[j++];add(b,[],[],[],[k-1],`Merge into position ${k-1}`);}while(i<left.length)b[k++]=left[i++];while(j<right.length)b[k++]=right[j++];add(b,[],[],[],Array.from({length:r-l+1},(_,x)=>l+x),`Merge range ${l}-${r}`);}mergeSort(0,b.length-1);add(b,[],[],b.map((_,i)=>i),[],`Merge sort complete`);return out;}
    if(type==='quick-sort'){function q(l,r){if(l>=r)return;const pivot=b[r];let i=l;for(let j=l;j<r;j++){add(b,[j,r],[],[],[j],`Compare ${b[j]} with pivot ${pivot}`);if(b[j]<=pivot){[b[i],b[j]]=[b[j],b[i]];if(i!==j)add(b,[],[i,j],[],[],`Move value left of pivot`);i++;}}[b[i],b[r]]=[b[r],b[i]];add(b,[],[i,r],[],[i],`Place pivot at index ${i}`);q(l,i-1);q(i+1,r);}q(0,b.length-1);add(b,[],[],b.map((_,i)=>i),[],`Quick sort complete`);return out;}
    if(type==='heap-sort'){for(let i=Math.floor(b.length/2)-1;i>=0;i--)heap(i,b.length);for(let end=b.length-1;end>0;end--){[b[0],b[end]]=[b[end],b[0]];add(b,[],[0,end],[],[],`Move maximum to index ${end}`);heap(0,end);}function heap(root,size){let largest=root;const l=root*2+1,r=l+1;if(l<size&&b[l]>b[largest])largest=l;if(r<size&&b[r]>b[largest])largest=r;if(largest!==root){add(b,[root,largest],[],[],[root],`Heap compare`);[b[root],b[largest]]=[b[largest],b[root]];add(b,[],[root,largest],[],[],`Heapify subtree`);heap(largest,size);}}add(b,[],[],b.map((_,i)=>i),[],`Heap sort complete`);return out;}
    for(let i=0;i<b.length;i++)for(let j=0;j<b.length-i-1;j++){add(b,[j,j+1],[],[],[j,j+1],`Compare ${b[j]} and ${b[j+1]}`);if(b[j]>b[j+1]){[b[j],b[j+1]]=[b[j+1],b[j]];add(b,[],[j,j+1],[],[],`Swap adjacent values`);}}add(b,[],[],b.map((_,i)=>i),[],`Bubble sort complete`);return out;
  }

  function graphSteps(type){
    const nodes=['A','B','C','D','E','F'];
    const edges=[['A','B',4],['A','C',2],['B','D',3],['C','D',1],['C','E',5],['D','E',2],['D','F',4],['E','F',1]];
    if(type==='floyd-warshall'){return nodes.map((_,i)=>({graph:true,active:[i],message:`Update distance matrix using intermediate ${nodes[i]}`}));}
    if(type==='dijkstra'){const order=['A','C','D','B','E','F'];return order.map((n,i)=>({graph:true,active:nodes.slice(0,i+1),message:`Select ${n} with the smallest known distance`}));}
    const order=type==='bfs'?['A','B','C','D','E','F']:['A','B','D','E','F','C'];
    return order.map((n,i)=>({graph:true,active:order.slice(0,i+1),message:`Visit ${n} using ${type==='bfs'?'queue':'depth-first stack'}`}));
  }
  function treeSteps(type){const order=type==='bst-inorder'?['2','4','6','8','10','12','14']:['8','4','12','2','6','10','14'];return order.map((n,i)=>({tree:true,active:order.slice(0,i+1),message:`Visit node ${n}`}));}
  function specialSteps(type){if(isGraph())return graphSteps(type);if(isTree())return treeSteps(type);return arraySteps(parseArray(),type);}

  function renderArray(step){
    container.style.display='flex'; container.innerHTML=''; emptyState.style.display='none';
    step.array.forEach((value,i)=>{const bar=document.createElement('div');bar.className='array-bar';bar.dataset.value=value;bar.style.height=`${Math.max(12,Math.min(290,Number(value)*15))}px`;if(step.compare?.includes(i))bar.classList.add('compare');if(step.swap?.includes(i))bar.classList.add('swap');if(step.sorted?.includes(i))bar.classList.add('sorted');if(step.current?.includes(i))bar.classList.add('search-current');container.appendChild(bar);});
  }
  function renderGraph(step){
    container.style.display='block';container.innerHTML='';emptyState.style.display='none';
    const ns={A:[15,50],B:[38,25],C:[38,75],D:[62,25],E:[62,75],F:[85,50]};
    const edges=[['A','B',4],['A','C',2],['B','D',3],['C','D',1],['C','E',5],['D','E',2],['D','F',4],['E','F',1]];
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 100');svg.classList.add('graph-svg');
    edges.forEach(([a,b,w])=>{const l=document.createElementNS(svg.namespaceURI,'line');l.setAttribute('x1',ns[a][0]);l.setAttribute('y1',ns[a][1]);l.setAttribute('x2',ns[b][0]);l.setAttribute('y2',ns[b][1]);l.classList.add('graph-edge');svg.appendChild(l);const t=document.createElementNS(svg.namespaceURI,'text');t.setAttribute('x',(ns[a][0]+ns[b][0])/2);t.setAttribute('y',(ns[a][1]+ns[b][1])/2-2);t.textContent=w;t.classList.add('graph-weight');svg.appendChild(t);});
    Object.entries(ns).forEach(([n,[x,y]])=>{const c=document.createElementNS(svg.namespaceURI,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',6);if(step.active?.includes(n))c.classList.add('active');c.classList.add('graph-node');svg.appendChild(c);const t=document.createElementNS(svg.namespaceURI,'text');t.setAttribute('x',x);t.setAttribute('y',y+1);t.textContent=n;t.classList.add('graph-label');svg.appendChild(t);});container.appendChild(svg);
  }
  function renderTree(step){container.style.display='block';container.innerHTML='';emptyState.style.display='none';const nodes={8:[50,18],4:[25,42],12:[75,42],2:[12,68],6:[38,68],10:[62,68],14:[88,68]};const edges=[[8,4],[8,12],[4,2],[4,6],[12,10],[12,14]];const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 90');svg.classList.add('graph-svg');edges.forEach(([a,b])=>{const l=document.createElementNS(svg.namespaceURI,'line');l.setAttribute('x1',nodes[a][0]);l.setAttribute('y1',nodes[a][1]);l.setAttribute('x2',nodes[b][0]);l.setAttribute('y2',nodes[b][1]);l.classList.add('tree-edge');svg.appendChild(l)});Object.entries(nodes).forEach(([n,[x,y]])=>{const c=document.createElementNS(svg.namespaceURI,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',6);if(step.active?.includes(n))c.classList.add('active');c.classList.add('tree-node');svg.appendChild(c);const t=document.createElementNS(svg.namespaceURI,'text');t.setAttribute('x',x);t.setAttribute('y',y+1);t.textContent=n;t.classList.add('graph-label');svg.appendChild(t)});container.appendChild(svg)}

  function render(step){if(step?.graph)renderGraph(step);else if(step?.tree)renderTree(step);else renderArray(step || {array});}
  function prepare(){stop();const type=select.value;array=parseArray();steps=specialSteps(type);current=0;comparisons=0;swaps=0;compareCount.textContent='0';swapCount.textContent='0';progress.style.width='0%';status.textContent='Ready to visualize';indicator.classList.remove('running');operation.textContent='Press Start to begin';stepText.textContent=`Step 0 of ${steps.length}`;modeNote.textContent=DATA[type]?.[6] || 'Interactive mode';if(steps[0])render(steps[0]);updateInfo();}
  function show(i){if(!steps[i])return;const s=steps[i];render(s);operation.textContent=s.message||'';current=i+1;stepText.textContent=`Step ${current} of ${steps.length}`;progress.style.width=`${(current/steps.length)*100}%`;if(s.compare?.length)comparisons++;if(s.swap?.length)swaps++;compareCount.textContent=comparisons;swapCount.textContent=swaps;}
  function next(){if(current>=steps.length){finish();return false;}show(current);return true;}
  function run(){if(!steps.length||current>=steps.length)prepare();running=true;indicator.classList.add('running');status.textContent='Visualization running';clearTimeout(timer);timer=setTimeout(tick,Math.max(120,1600-Number(speedRange.value)));}
  function tick(){if(!running)return;if(!next())return;timer=setTimeout(tick,Math.max(120,1600-Number(speedRange.value)));}
  function pause(){running=false;clearTimeout(timer);indicator.classList.remove('running');status.textContent='Visualization paused';}
  function stop(){running=false;clearTimeout(timer);indicator.classList.remove('running');}
  function finish(){stop();status.textContent='Visualization completed';operation.textContent='Algorithm execution finished';progress.style.width='100%';}
  function updateInfo(){const d=DATA[select.value]||DATA['bubble-sort'];title.textContent=d[0];description.textContent=d[1];best.textContent=d[2];average.textContent=d[3];worst.textContent=d[4];space.textContent=d[5];pseudocode.textContent=`${d[6]}\n\nObserve each step and connect the highlighted operation to the algorithm logic.`;}
  function randomize(){const nums=Array.from({length:7},()=>Math.floor(Math.random()*15)+1);input.value=nums.join(', ');prepare();}

  generateBtn?.addEventListener('click',randomize);select.addEventListener('change',prepare);startBtn?.addEventListener('click',run);stepBtn?.addEventListener('click',()=>{if(!steps.length||current>=steps.length)prepare();pause();next();});pauseBtn?.addEventListener('click',pause);resetBtn?.addEventListener('click',prepare);speedRange?.addEventListener('input',()=>speedValue.textContent=`${speedRange.value}ms`);input?.addEventListener('change',prepare);
  const param=new URLSearchParams(location.search).get('algorithm');if(param&&DATA[param])select.value=param;prepare();
})();
