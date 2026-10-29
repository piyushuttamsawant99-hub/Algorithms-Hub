/* Render the catalog from the small category data modules. */
(() => {
  const groups = window.algorithmGroups || {};
  const order = ['searching', 'sorting', 'arrays', 'recursion', 'linked-lists', 'stack-queue', 'tree', 'graph', 'dynamic', 'greedy', 'math-bit', 'advanced'];
  const grid = document.getElementById('algorithmGrid');
  const input = document.getElementById('algorithmSearch');
  const result = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');
  if (!grid || !input || !result) return;
  let selectedCategory = 'all';
  let selectedDifficulty = 'all';
  const cards = [];
  const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const visualFor = category => ({
    searching: '<div class="mini-search"><i></i><i class="active"></i><i></i><i></i></div><b class="visual-label">CHECK → FIND</b>', sorting: '<div class="mini-bars"><i></i><i></i><i></i><i></i><i></i></div><b class="visual-label">COMPARE → SWAP</b>', arrays: '<div class="mini-array"><i>3</i><i class="active">7</i><i>9</i><b>←</b></div><b class="visual-label">MOVE WINDOW</b>', recursion: '<div class="mini-branch"><b>F(n)</b><i>F(n-1)</i><i>F(n-2)</i></div><b class="visual-label">SPLIT → BACKTRACK</b>', 'linked-lists': '<div class="mini-chain"><i>1</i><b>→</b><i class="active">2</i><b>→</b><i>3</i></div><b class="visual-label">REPOINT LINKS</b>', 'stack-queue': '<div class="mini-stack"><i></i><i class="active"></i><i></i></div><b class="visual-label">PUSH → POP</b>', tree: '<div class="mini-tree"><i class="root">8</i><i>4</i><i>12</i><i>2</i><i>6</i></div><b class="visual-label">TRAVERSE NODES</b>', graph: '<div class="mini-graph"><i>A</i><b>→</b><i class="active">B</i><b>→</b><i>C</i></div><b class="visual-label">VISIT → RELAX</b>', dynamic: '<div class="mini-matrix"><i></i><i></i><i class="active"></i><i></i><i></i><i></i><i></i><i></i><i></i></div><b class="visual-label">BUILD TABLE</b>', greedy: '<div class="mini-timeline"><i></i><i class="active"></i><i></i><i></i></div><b class="visual-label">BEST LOCAL CHOICE</b>', 'math-bit': '<div class="mini-bits"><i>1</i><i>0</i><i class="active">1</i><i>1</i><i>0</i></div><b class="visual-label">OPERATE ON BITS</b>', advanced: '<div class="mini-network"><i></i><i class="active"></i><i></i><i></i><i></i></div><b class="visual-label">OPTIMIZE PATH</b>'
  }[category]);
  grid.innerHTML = '';
  order.forEach((category, groupIndex) => {
    const group = groups[category];
    if (!group) return;
    group.items.forEach((item, index) => {
      const [name, description, timeComplexity, auxiliarySpace] = item;
      if (!timeComplexity || !auxiliarySpace) {
        throw new Error(`Missing complexity metadata for algorithm card: ${name}`);
      }
      const level = (index + groupIndex) % 5 === 0 ? 'easy' : (index + groupIndex) % 3 === 0 ? 'hard' : 'medium';
      const card = document.createElement('article');
      card.className = 'library-card catalog-card card-reveal';
      card.style.setProperty('--card-delay', `${(cards.length % 3) * 90}ms`);
      card.dataset.category = category;
      card.dataset.difficulty = level;
      card.dataset.name = `${name} ${group.label} ${description}`;
      card.innerHTML = `<div class="card-visual catalog-visual category-${category}">${visualFor(category)}<span class="catalog-group">${group.label}</span></div><div class="library-card-body"><div class="card-meta"><span class="category-tag">${group.label}</span><span class="level ${level}-level">${level.toUpperCase()}</span></div><h3>${name}</h3><p>${description}</p><div class="card-complexity"><div><span>Time Complexity</span><strong>${timeComplexity}</strong></div><div><span>Auxiliary Space</span><strong>${auxiliarySpace}</strong></div></div><div class="card-actions-row"><a href="explanation.html?algorithm=${slug(name)}" class="card-action-btn action-explain" title="Learn ${name} with video, steps and examples"><i class="fa-solid fa-book-open"></i> Explanation</a><a href="visualizer.html?algorithm=${slug(name)}" class="card-action-btn action-visualize" title="Open interactive visualizer for ${name}">Visualizer <i class="fa-solid fa-arrow-right"></i></a></div></div>`;
      grid.appendChild(card);
      cards.push(card);
    });
  });
  function applyFilters() {
    const query = input.value.trim().toLowerCase();
    const visible = cards.filter(card => (!query || card.dataset.name.toLowerCase().includes(query)) && (selectedCategory === 'all' || card.dataset.category === selectedCategory) && (selectedDifficulty === 'all' || card.dataset.difficulty === selectedDifficulty));
    cards.forEach(card => { card.classList.toggle('is-hidden', !visible.includes(card)); });
    result.textContent = `Showing ${visible.length} of ${cards.length} algorithms`;
    noResults?.classList.toggle('show', visible.length === 0);
  }
  const revealCards = () => {
    if (!('IntersectionObserver' in window)) { cards.forEach(card => card.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12, rootMargin: '0px 0px -35px' });
    cards.forEach(card => observer.observe(card));
  };
  document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => { selectedCategory = button.dataset.category; input.value = ''; document.querySelectorAll('.filter-btn').forEach(item => item.classList.toggle('active', item === button)); applyFilters(); }));
  document.querySelectorAll('.difficulty-btn').forEach(button => button.addEventListener('click', () => { selectedDifficulty = button.dataset.difficulty; input.value = ''; document.querySelectorAll('.difficulty-btn').forEach(item => item.classList.toggle('active', item === button)); applyFilters(); }));
  input.addEventListener('input', applyFilters);
  document.getElementById('clearBtn')?.addEventListener('click', () => { input.value = ''; applyFilters(); input.focus(); });
  document.getElementById('resetSearch')?.addEventListener('click', () => { selectedCategory = 'all'; selectedDifficulty = 'all'; input.value = ''; document.querySelectorAll('.filter-btn,.difficulty-btn').forEach(item => item.classList.toggle('active', item.dataset.category === 'all' || item.dataset.difficulty === 'all')); applyFilters(); });
  revealCards();
  applyFilters();
})();
