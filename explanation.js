/**
 * Algorithm Hub — Explanation Page Controller
 * Handles dynamic rendering of all 93 algorithm explanations, YouTube embeds,
 * multi-language code tabs, dry-run traces, real-world analogies, and sidebar navigation.
 */

(() => {
  const dataset = window.algorithmExplanations || {};
  const groups = window.algorithmGroups || {};
  const categoryOrder = ['searching', 'sorting', 'arrays', 'recursion', 'linked-lists', 'stack-queue', 'tree', 'graph', 'dynamic', 'greedy', 'math-bit', 'advanced'];

  // Helper slug function matching other scripts
  const slug = str => str ? str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';

  // Collect all ordered algorithm keys
  const allAlgorithmKeys = [];
  const allAlgorithmsMetadata = [];

  categoryOrder.forEach(catKey => {
    const group = groups[catKey];
    if (!group || !group.items) return;
    group.items.forEach(item => {
      const name = item[0];
      const key = slug(name);
      if (!allAlgorithmKeys.includes(key)) {
        allAlgorithmKeys.push(key);
        allAlgorithmsMetadata.push({
          key: key,
          name: name,
          category: group.label,
          categoryKey: catKey,
          description: item[1],
          complexity: item[2]
        });
      }
    });
  });

  // DOM Elements
  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  const breadcrumbName = document.getElementById('breadcrumbName');

  const heroCategory = document.getElementById('heroCategory');
  const heroDifficulty = document.getElementById('heroDifficulty');
  const heroParadigm = document.getElementById('heroParadigm');
  const heroTime = document.getElementById('heroTime');
  const heroSpace = document.getElementById('heroSpace');
  const heroTitle = document.getElementById('heroTitle');
  const heroSummary = document.getElementById('heroSummary');
  const heroVisualizeBtn = document.getElementById('heroVisualizeBtn');
  const heroPracticeBtn = document.getElementById('heroPracticeBtn');

  const videoIframe = document.getElementById('videoIframe');
  const videoFallback = document.getElementById('videoFallback');
  const videoSearchLink = document.getElementById('videoSearchLink');
  const videoHelpSearchLink = document.getElementById('videoHelpSearchLink');
  const videoTitleText = document.getElementById('videoTitleText');
  const videoExternalLink = document.getElementById('videoExternalLink');

  const stepsContainer = document.getElementById('stepsContainer');

  const exampleInputText = document.getElementById('exampleInputText');
  const traceStepsList = document.getElementById('traceStepsList');
  const exampleOutputText = document.getElementById('exampleOutputText');

  const analogyTitle = document.getElementById('analogyTitle');
  const analogyText = document.getElementById('analogyText');
  const practicalAppText = document.getElementById('practicalAppText');
  const funFactText = document.getElementById('funFactText');

  const compBest = document.getElementById('compBest');
  const compBestDesc = document.getElementById('compBestDesc');
  const compAvg = document.getElementById('compAvg');
  const compAvgDesc = document.getElementById('compAvgDesc');
  const compWorst = document.getElementById('compWorst');
  const compWorstDesc = document.getElementById('compWorstDesc');
  const compSpace = document.getElementById('compSpace');
  const compSpaceDesc = document.getElementById('compSpaceDesc');

  const codeLangTabs = document.getElementById('codeLangTabs');
  const codeDisplay = document.getElementById('codeDisplay');
  const copyCodeBtn = document.getElementById('copyCodeBtn');

  const propParadigm = document.getElementById('propParadigm');
  const propInPlace = document.getElementById('propInPlace');
  const propStable = document.getElementById('propStable');
  const propDataStructure = document.getElementById('propDataStructure');
  const prosList = document.getElementById('prosList');
  const consList = document.getElementById('consList');

  const problemsGrid = document.getElementById('problemsGrid');

  const bottomPrevBtn = document.getElementById('bottomPrevBtn');
  const bottomPrevName = document.getElementById('bottomPrevName');
  const bottomNextBtn = document.getElementById('bottomNextBtn');
  const bottomNextName = document.getElementById('bottomNextName');
  const bottomVisualizeCta = document.getElementById('bottomVisualizeCta');

  const topPrevBtn = document.getElementById('topPrevBtn');
  const topNextBtn = document.getElementById('topNextBtn');

  // Sidebar Elements
  const algoSidebar = document.getElementById('algoSidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarSearchInput = document.getElementById('sidebarSearchInput');
  const sidebarSearchClear = document.getElementById('sidebarSearchClear');
  const sidebarCategorySelect = document.getElementById('sidebarCategorySelect');
  const sidebarList = document.getElementById('sidebarList');
  const sidebarCount = document.getElementById('sidebarCount');

  let currentAlgoKey = 'binary-search';
  let currentLanguage = 'python';
  let activeExplanation = null;

  // Initialize from URL Query Parameter
  function getUrlAlgorithm() {
    const params = new URLSearchParams(window.location.search);
    const paramKey = params.get('algorithm') || params.get('algo') || params.get('name');
    if (paramKey) {
      const cleanKey = slug(paramKey);
      if (dataset[cleanKey]) return cleanKey;
      // Search by partial match or metadata
      const found = allAlgorithmsMetadata.find(m => m.key === cleanKey || slug(m.name) === cleanKey);
      if (found) return found.key;
    }
    return 'binary-search';
  }

  // Load and Render the Algorithm Explanation
  function loadAlgorithm(key, updateHistory = true) {
    let algo = dataset[key];
    if (!algo) {
      const meta = allAlgorithmsMetadata.find(m => m.key === key);
      if (meta && dataset[meta.key]) {
        algo = dataset[meta.key];
        key = meta.key;
      } else {
        key = 'binary-search';
        algo = dataset['binary-search'];
      }
    }

    currentAlgoKey = key;
    activeExplanation = algo;

    if (updateHistory) {
      const url = new URL(window.location);
      url.searchParams.set('algorithm', key);
      window.history.pushState({ algorithm: key }, '', url);
    }

    document.title = `${algo.name} Explanation | Algorithm Hub`;

    // 1. Breadcrumbs
    if (breadcrumbCategory) breadcrumbCategory.textContent = algo.category || 'Algorithms';
    if (breadcrumbName) breadcrumbName.textContent = algo.name;

    // 2. Hero Section
    if (heroTitle) heroTitle.textContent = algo.name;
    if (heroCategory) heroCategory.textContent = algo.category;
    if (heroDifficulty) {
      const diff = (algo.difficulty || 'medium').toLowerCase();
      heroDifficulty.textContent = diff.toUpperCase();
      heroDifficulty.className = `difficulty-pill ${diff}`;
    }
    if (heroParadigm) heroParadigm.textContent = (algo.characteristics && algo.characteristics.paradigm) ? algo.characteristics.paradigm : algo.category;
    if (heroTime) heroTime.textContent = (algo.complexity && algo.complexity.worst) ? algo.complexity.worst : 'O(n)';
    if (heroSpace) heroSpace.textContent = (algo.complexity && algo.complexity.space) ? algo.complexity.space : 'O(1)';
    if (heroSummary) heroSummary.textContent = algo.summary;

    if (heroVisualizeBtn) heroVisualizeBtn.href = `visualizer.html?algorithm=${key}`;
    if (heroPracticeBtn) heroPracticeBtn.href = `practice.html?algorithm=${key}`;
    if (bottomVisualizeCta) bottomVisualizeCta.href = `visualizer.html?algorithm=${key}`;

    // 3. YouTube Video Section
    const videoId = /^[\w-]{11}$/.test(algo.videoId || '') ? algo.videoId : '';
    const videoSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${algo.name} algorithm tutorial`)}`;
    if (videoIframe) {
      videoIframe.style.display = videoId ? '' : 'none';
      if (videoId) {
        videoIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
      } else {
        videoIframe.removeAttribute('src');
      }
    }
    if (videoFallback) videoFallback.hidden = Boolean(videoId);
    if (videoSearchLink) videoSearchLink.href = videoSearchUrl;
    if (videoHelpSearchLink) videoHelpSearchLink.href = videoSearchUrl;
    if (videoTitleText) videoTitleText.textContent = algo.videoTitle || `${algo.name} Explanation & Code`;
    if (videoExternalLink) {
      videoExternalLink.href = videoId ? `https://www.youtube.com/watch?v=${videoId}` : videoSearchUrl;
      const externalLinkText = videoExternalLink.querySelector('span');
      if (externalLinkText) externalLinkText.textContent = videoId ? 'Open on YouTube' : 'Search on YouTube';
    }

    // 4. Steps Section
    if (stepsContainer) {
      stepsContainer.innerHTML = '';
      if (algo.steps && algo.steps.length > 0) {
        algo.steps.forEach((step, index) => {
          const stepEl = document.createElement('div');
          stepEl.className = 'step-card';
          stepEl.innerHTML = `
            <div class="step-num-badge">${index + 1}</div>
            <div class="step-content">
              <h4 class="step-title">${step.title}</h4>
              <p class="step-desc">${formatCodeHighlights(step.description)}</p>
            </div>
          `;
          stepsContainer.appendChild(stepEl);
        });
      }
    }

    // 5. Worked Example & Trace
    if (algo.example) {
      if (exampleInputText) exampleInputText.textContent = algo.example.input || 'N/A';
      if (exampleOutputText) exampleOutputText.textContent = algo.example.output || 'Complete';

      if (traceStepsList) {
        traceStepsList.innerHTML = '';
        if (algo.example.trace && algo.example.trace.length > 0) {
          algo.example.trace.forEach(item => {
            const row = document.createElement('div');
            row.className = 'trace-row';
            row.innerHTML = `
              <div class="trace-step-badge">STEP ${item.step}</div>
              <div class="trace-action">${item.action || ''}</div>
              <div class="trace-state">${item.state || ''}</div>
              <div class="trace-note">${item.note || ''}</div>
            `;
            traceStepsList.appendChild(row);
          });
        }
      }
    }

    // 6. Real-Life Analogy
    if (algo.realLifeExample) {
      if (analogyTitle) analogyTitle.textContent = algo.realLifeExample.title || 'Intuitive Metaphor';
      if (analogyText) analogyText.textContent = algo.realLifeExample.analogy || 'Conceptual analogy connecting logic to physical intuition.';
      if (practicalAppText) practicalAppText.textContent = algo.realLifeExample.practicalApp || 'Used across modern production computing systems.';
      if (funFactText) funFactText.textContent = algo.realLifeExample.funFact || 'Key foundational concept in computer science.';
    }

    // 7. Complexity Analysis
    if (algo.complexity) {
      if (compBest) compBest.textContent = algo.complexity.best || 'O(1)';
      if (compBestDesc) compBestDesc.textContent = algo.complexity.bestDesc || 'Best scenario when minimal work is required.';

      if (compAvg) compAvg.textContent = algo.complexity.average || 'O(n)';
      if (compAvgDesc) compAvgDesc.textContent = algo.complexity.avgDesc || 'Average operational cost over random distributions.';

      if (compWorst) compWorst.textContent = algo.complexity.worst || 'O(n)';
      if (compWorstDesc) compWorstDesc.textContent = algo.complexity.worstDesc || 'Upper bound performance under worst conditions.';

      if (compSpace) compSpace.textContent = algo.complexity.space || 'O(1)';
      if (compSpaceDesc) compSpaceDesc.textContent = algo.complexity.spaceDesc || 'Auxiliary memory required during runtime.';
    }

    // 8. Multi-Language Code
    renderCode(currentLanguage);

    // 9. Characteristics & Trade-offs
    if (algo.characteristics) {
      if (propParadigm) propParadigm.textContent = algo.characteristics.paradigm || 'Algorithmic Pattern';
      if (propInPlace) propInPlace.textContent = algo.characteristics.inPlace || 'Yes';
      if (propStable) propStable.textContent = algo.characteristics.stable || 'N/A';
      if (propDataStructure) propDataStructure.textContent = algo.characteristics.dataStructure || algo.category;

      if (prosList) {
        prosList.innerHTML = '';
        (algo.characteristics.pros || ['Efficient execution', 'Widely supported standard']).forEach(pro => {
          const li = document.createElement('li');
          li.textContent = pro;
          prosList.appendChild(li);
        });
      }

      if (consList) {
        consList.innerHTML = '';
        (algo.characteristics.cons || ['Requires specific preconditions', 'Memory or compute trade-offs']).forEach(con => {
          const li = document.createElement('li');
          li.textContent = con;
          consList.appendChild(li);
        });
      }
    }

    // 10. Interview Problems
    if (problemsGrid) {
      problemsGrid.innerHTML = '';
      const problems = algo.interviewProblems || [
        { name: `${algo.name} Standard Problem`, platform: 'LeetCode', difficulty: 'Medium', link: 'https://leetcode.com/' },
        { name: `${algo.name} Theory & Practice`, platform: 'GeeksforGeeks', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/' }
      ];

      problems.forEach(prob => {
        const card = document.createElement('a');
        card.className = 'problem-card';
        card.href = prob.link || '#';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.innerHTML = `
          <div class="problem-info">
            <span class="problem-name">${prob.name}</span>
            <div class="problem-meta">
              <span><i class="fa-solid fa-code-branch"></i> ${prob.platform}</span>
              <span>•</span>
              <span class="problem-diff ${prob.difficulty}">${prob.difficulty}</span>
            </div>
          </div>
          <i class="fa-solid fa-arrow-up-right-from-square problem-link-icon"></i>
        `;
        problemsGrid.appendChild(card);
      });
    }

    // 11. Previous & Next Navigation
    updatePrevNextNav(key);

    // 12. Highlight active sidebar item
    updateActiveSidebarItem(key);

    // Scroll to top of main content on change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Format inline code highlights like `code`
  function formatCodeHighlights(text) {
    if (!text) return '';
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  // Render Code Snippet based on active tab
  function renderCode(lang) {
    currentLanguage = lang;
    if (!activeExplanation || !activeExplanation.code) return;

    const codeSnippet = activeExplanation.code[lang] || activeExplanation.code['python'] || '# Code not available';
    if (codeDisplay) {
      codeDisplay.textContent = codeSnippet;
    }

    if (codeLangTabs) {
      codeLangTabs.querySelectorAll('.code-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.lang === lang);
      });
    }
  }

  // Update Bottom & Top Prev/Next Navigation Buttons
  function updatePrevNextNav(currentKey) {
    const currentIndex = allAlgorithmKeys.indexOf(currentKey);
    const prevIndex = (currentIndex > 0) ? currentIndex - 1 : allAlgorithmKeys.length - 1;
    const nextIndex = (currentIndex < allAlgorithmKeys.length - 1) ? currentIndex + 1 : 0;

    const prevMeta = allAlgorithmsMetadata[prevIndex];
    const nextMeta = allAlgorithmsMetadata[nextIndex];

    if (bottomPrevName && prevMeta) bottomPrevName.textContent = prevMeta.name;
    if (bottomNextName && nextMeta) bottomNextName.textContent = nextMeta.name;

    if (bottomPrevBtn && prevMeta) {
      bottomPrevBtn.onclick = (e) => { e.preventDefault(); loadAlgorithm(prevMeta.key); };
    }
    if (bottomNextBtn && nextMeta) {
      bottomNextBtn.onclick = (e) => { e.preventDefault(); loadAlgorithm(nextMeta.key); };
    }

    if (topPrevBtn && prevMeta) {
      topPrevBtn.onclick = () => loadAlgorithm(prevMeta.key);
      topPrevBtn.title = `Previous: ${prevMeta.name}`;
    }
    if (topNextBtn && nextMeta) {
      topNextBtn.onclick = () => loadAlgorithm(nextMeta.key);
      topNextBtn.title = `Next: ${nextMeta.name}`;
    }
  }

  // Populate Algorithm Switcher Sidebar
  function renderSidebar() {
    if (!sidebarList) return;
    sidebarList.innerHTML = '';

    const query = (sidebarSearchInput?.value || '').trim().toLowerCase();
    const selectedCat = sidebarCategorySelect?.value || 'all';

    let count = 0;

    categoryOrder.forEach(catKey => {
      if (selectedCat !== 'all' && selectedCat !== catKey) return;
      const group = groups[catKey];
      if (!group || !group.items) return;

      const matchingItems = group.items.filter(item => {
        const name = item[0].toLowerCase();
        const desc = item[1].toLowerCase();
        return !query || name.includes(query) || desc.includes(query) || group.label.toLowerCase().includes(query);
      });

      if (matchingItems.length > 0) {
        const groupHeader = document.createElement('div');
        groupHeader.className = 'sidebar-group-header';
        groupHeader.textContent = group.label;
        sidebarList.appendChild(groupHeader);

        matchingItems.forEach((item, idx) => {
          count++;
          const name = item[0];
          const itemKey = slug(name);
          const diff = (idx % 3 === 0) ? 'easy' : (idx % 3 === 1) ? 'medium' : 'hard';

          const itemLink = document.createElement('a');
          itemLink.className = `sidebar-item ${itemKey === currentAlgoKey ? 'active' : ''}`;
          itemLink.dataset.key = itemKey;
          itemLink.innerHTML = `
            <span class="sidebar-item-name">${name}</span>
            <span class="sidebar-diff-tag ${diff}">${diff}</span>
          `;

          itemLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadAlgorithm(itemKey);
            closeSidebarMobile();
          });

          sidebarList.appendChild(itemLink);
        });
      }
    });

    if (sidebarCount) {
      sidebarCount.textContent = `Showing ${count} of ${allAlgorithmKeys.length} algorithms`;
    }
  }

  // Highlight Active Item in Sidebar
  function updateActiveSidebarItem(key) {
    if (!sidebarList) return;
    sidebarList.querySelectorAll('.sidebar-item').forEach(item => {
      const isActive = item.dataset.key === key;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  // Mobile Sidebar Drawer Handlers
  function openSidebarMobile() {
    algoSidebar?.classList.add('open');
    sidebarBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebarMobile() {
    algoSidebar?.classList.remove('open');
    sidebarBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Code Tab Event Listeners
  if (codeLangTabs) {
    codeLangTabs.querySelectorAll('.code-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        renderCode(tab.dataset.lang);
      });
    });
  }

  // Copy Code to Clipboard
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', async () => {
      const code = codeDisplay?.textContent || '';
      try {
        await navigator.clipboard.writeText(code);
        copyCodeBtn.classList.add('copied');
        copyCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
        setTimeout(() => {
          copyCodeBtn.classList.remove('copied');
          copyCodeBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>Copy Code</span>';
        }, 2200);
      } catch (err) {
        console.error('Failed to copy code: ', err);
      }
    });
  }

  // Sidebar Controls
  sidebarToggleBtn?.addEventListener('click', openSidebarMobile);
  sidebarCloseBtn?.addEventListener('click', closeSidebarMobile);
  sidebarBackdrop?.addEventListener('click', closeSidebarMobile);

  sidebarSearchInput?.addEventListener('input', () => {
    if (sidebarSearchClear) {
      sidebarSearchClear.style.display = sidebarSearchInput.value ? 'block' : 'none';
    }
    renderSidebar();
  });

  sidebarSearchClear?.addEventListener('click', () => {
    if (sidebarSearchInput) sidebarSearchInput.value = '';
    if (sidebarSearchClear) sidebarSearchClear.style.display = 'none';
    renderSidebar();
    sidebarSearchInput?.focus();
  });

  sidebarCategorySelect?.addEventListener('change', renderSidebar);

  // Popstate handler for browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    const key = (e.state && e.state.algorithm) ? e.state.algorithm : getUrlAlgorithm();
    loadAlgorithm(key, false);
  });

  // Initialize
  const initialKey = getUrlAlgorithm();
  renderSidebar();
  loadAlgorithm(initialKey, false);

})();
