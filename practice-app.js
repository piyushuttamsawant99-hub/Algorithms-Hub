const catalog = window.algorithmGroups || {};
const explanations = window.algorithmExplanations || {};
const categoryOrder = ['searching', 'sorting', 'arrays', 'recursion', 'linked-lists', 'stack-queue', 'tree', 'graph', 'dynamic', 'greedy', 'math-bit', 'advanced'];
const compilerByLanguage = {
    python: { compiler: 'cpython-3.13.8', file: 'main.py', external: 'https://www.programiz.com/python-programming/online-compiler/' },
    javascript: { compiler: 'nodejs-20.17.0', file: 'main.js', external: 'https://www.programiz.com/javascript/online-compiler/' },
    java: { compiler: 'openjdk-jdk-21+35', file: 'Main.java', external: 'https://www.programiz.com/java-programming/online-compiler/' },
    c: { compiler: 'gcc-13.2.0-c', file: 'main.c', external: 'https://www.programiz.com/c-programming/online-compiler/' },
    cpp: { compiler: 'gcc-13.2.0', file: 'main.cpp', external: 'https://www.programiz.com/cpp-programming/online-compiler/' }
};
const languages = [
    ['python', 'Python', 'PY'],
    ['javascript', 'JavaScript', 'JS'],
    ['java', 'Java', 'JAVA'],
    ['c', 'C', 'C'],
    ['cpp', 'C++', 'C++']
];
const app = document.getElementById('practiceApp');
if (!app) throw new Error('Practice workspace element is missing.');

const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const algorithms = [];
for (const categoryKey of categoryOrder) {
    const group = catalog[categoryKey];
    if (!group) continue;
    for (const [name, summary, complexity] of group.items) {
        const key = slug(name);
        if (algorithms.some(item => item.key === key)) continue;
        const explanation = explanations[key] || {};
        algorithms.push({
            key,
            name,
            category: group.label,
            categoryKey,
            summary: explanation.summary || summary,
            complexity: explanation.complexity || { worst: complexity, space: 'See explanation' },
            example: explanation.example || {},
            steps: explanation.steps || [],
            code: explanation.code || {}
        });
    }
}

const query = new URLSearchParams(location.search);
let activeKey = algorithms.some(item => item.key === query.get('algorithm')) ? query.get('algorithm') : algorithms[0]?.key;
let activeLanguage = 'python';
const draftCache = new Map();

app.innerHTML = `
    <div class="practice-shell">
        <header class="practice-topline">
            <div>
                <span class="practice-eyebrow">PRACTICE WORKSPACE</span>
                <h2>Algorithm library <span id="practiceCount"></span></h2>
            </div>
            <label class="practice-search">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <input id="algorithmSearch" type="search" placeholder="Find an algorithm" autocomplete="off" aria-label="Search algorithms">
                <kbd>/</kbd>
            </label>
        </header>
        <div class="practice-tabs" id="categoryTabs" role="tablist" aria-label="Algorithm categories"></div>
        <div class="practice-main-grid">
            <aside class="practice-catalog" aria-label="Algorithm list">
                <div class="catalog-heading"><span>ALGORITHMS</span><span id="visibleCount"></span></div>
                <div id="algorithmList" class="algorithm-list"></div>
                <p id="emptySearch" class="empty-search" hidden>No algorithms match this search.</p>
            </aside>
            <section class="practice-workarea" aria-label="Selected algorithm editor">
                <div class="task-panel">
                    <div class="task-heading">
                        <div>
                            <div class="task-meta"><span id="taskCategory"></span><span class="meta-dot"></span><span id="taskNumber"></span></div>
                            <h1 id="taskTitle"></h1>
                        </div>
                        <a id="explanationLink" class="explanation-link" href="explanation.html"><i class="fa-solid fa-book-open" aria-hidden="true"></i><span>Explanation</span></a>
                    </div>
                    <p id="taskSummary" class="task-summary"></p>
                    <div class="task-facts"><div><span>WORST-CASE TIME</span><strong id="taskTime"></strong></div><div><span>AUXILIARY SPACE</span><strong id="taskSpace"></strong></div></div>
                    <details class="task-details"><summary>Example and approach</summary><div class="task-example"><span>EXAMPLE INPUT</span><code id="taskInput"></code></div><div class="task-example"><span>EXPECTED RESULT</span><code id="taskOutput"></code></div><ol id="taskSteps"></ol></details>
                </div>
                <section class="editor-frame" aria-label="Code editor">
                    <div class="editor-toolbar">
                        <div class="language-tabs" id="languageTabs" role="tablist" aria-label="Programming language"></div>
                        <div class="editor-tools"><span id="snippetLabel" class="snippet-label"></span><button id="resetEditor" class="editor-icon-button" type="button" title="Restore starter code" aria-label="Restore starter code"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></button><button id="copyEditor" class="editor-icon-button" type="button" title="Copy code" aria-label="Copy code"><i class="fa-regular fa-copy" aria-hidden="true"></i></button></div>
                    </div>
                    <label class="stdin-field"><span>STANDARD INPUT <small>Optional</small></span><textarea id="programInput" rows="2" placeholder="Enter program input here"></textarea></label>
                    <div class="editor-fileline"><span class="file-indicator"></span><span id="editorFilename"></span><span id="editorLines"></span></div>
                    <div class="editor-code-wrap"><div id="lineNumbers" class="editor-line-numbers" aria-hidden="true"></div><textarea id="codeEditor" class="practice-code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Source code editor"></textarea></div>
                    <div class="editor-runbar"><span class="run-service"><i class="fa-solid fa-cloud" aria-hidden="true"></i> Wandbox compiler</span><div class="run-actions"><a id="externalCompiler" class="external-compiler" href="#" target="_blank" rel="noopener noreferrer">Open compiler <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a><button id="runCode" class="compile-button" type="button"><i class="fa-solid fa-play" aria-hidden="true"></i><span>Run code</span></button></div></div>
                </section>
                <section class="console-panel" aria-live="polite">
                    <div class="console-toolbar"><div><i class="fa-solid fa-terminal" aria-hidden="true"></i><span>RUN OUTPUT</span><span id="runState" class="run-state">Idle</span></div><span id="runDuration" class="run-duration"></span></div>
                    <pre id="consoleOutput" class="console-output">Run your code to see standard output, compiler messages, or runtime errors.</pre>
                </section>
                <p class="compiler-note">Code is sent to a public online compiler to execute. Do not include passwords, keys, or other private data.</p>
            </section>
        </div>
    </div>`;

const listElement = document.getElementById('algorithmList');
const searchInput = document.getElementById('algorithmSearch');
const tabs = document.getElementById('categoryTabs');
const codeEditor = document.getElementById('codeEditor');
const runButton = document.getElementById('runCode');
const consoleOutput = document.getElementById('consoleOutput');
const runState = document.getElementById('runState');
const runDuration = document.getElementById('runDuration');
const languageTabs = document.getElementById('languageTabs');
let activeCategory = 'all';

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function starterFor(algorithm, language) {
    const snippet = algorithm.code[language];
    if (snippet) {
        const starter = /Core logic for |Executing |INITIALIZE variables/.test(snippet);
        return { code: snippet, starter };
    }
    if (language === 'c') {
        return {
            code: `#include <stdio.h>\n\nint main(void) {\n    /* TODO: implement ${algorithm.name}.\n       ${algorithm.summary.replace(/\n/g, ' ')} */\n    return 0;\n}\n`,
            starter: true
        };
    }
    const snippets = {
        python: `# TODO: implement ${algorithm.name}\n# ${algorithm.summary}\n\ndef solve(data):\n    raise NotImplementedError("Add the ${algorithm.name} implementation")\n\nif __name__ == "__main__":\n    print(solve([]))\n`,
        javascript: `// TODO: implement ${algorithm.name}\n// ${algorithm.summary}\n\nfunction solve(data) {\n    throw new Error("Add the ${algorithm.name} implementation");\n}\n\nconsole.log(solve([]));\n`,
        java: `// TODO: implement ${algorithm.name}\n// ${algorithm.summary}\n\nclass Main {\n    static Object solve(int[] data) {\n        throw new UnsupportedOperationException("Add the ${algorithm.name} implementation");\n    }\n\n    public static void main(String[] args) {\n        System.out.println(solve(new int[0]));\n    }\n}\n`,
        cpp: `#include <iostream>\n#include <vector>\n\n// TODO: implement ${algorithm.name}\n// ${algorithm.summary}\n\nint main() {\n    std::cout << "Add the ${algorithm.name} implementation" << std::endl;\n    return 0;\n}\n`
    };
    return { code: snippets[language], starter: true };
}

function renderTabs() {
    const categories = [['all', 'All'], ...categoryOrder.map(key => [key, catalog[key]?.label]).filter(([, label]) => label)];
    tabs.innerHTML = categories.map(([key, label]) => `<button class="category-tab ${key === activeCategory ? 'active' : ''}" type="button" role="tab" aria-selected="${key === activeCategory}" data-category="${escapeHtml(key)}">${escapeHtml(label)}</button>`).join('');
    tabs.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
        activeCategory = button.dataset.category;
        renderTabs();
        renderList();
    }));
}

function renderList() {
    const needle = searchInput.value.trim().toLowerCase();
    const matching = algorithms.filter(item => (activeCategory === 'all' || item.categoryKey === activeCategory) && (!needle || `${item.name} ${item.category} ${item.summary}`.toLowerCase().includes(needle)));
    document.getElementById('visibleCount').textContent = `${matching.length}`;
    document.getElementById('practiceCount').textContent = `${algorithms.length} topics`;
    document.getElementById('emptySearch').hidden = matching.length > 0;
    listElement.innerHTML = matching.map(item => `<button type="button" class="algorithm-row ${item.key === activeKey ? 'active' : ''}" data-key="${escapeHtml(item.key)}"><span class="algorithm-row-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)}</small></span><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>`).join('');
    listElement.querySelectorAll('.algorithm-row').forEach(button => button.addEventListener('click', () => selectAlgorithm(button.dataset.key)));
}

function selectAlgorithm(key) {
    if (!algorithms.some(item => item.key === key)) return;
    if (codeEditor.value) draftCache.set(`${activeKey}:${activeLanguage}`, codeEditor.value);
    activeKey = key;
    const url = new URL(location.href);
    url.searchParams.set('algorithm', key);
    history.replaceState({ algorithm: key }, '', url);
    renderList();
    renderTask();
}

function renderLanguageTabs() {
    languageTabs.innerHTML = languages.map(([key, label, short]) => `<button type="button" role="tab" aria-selected="${key === activeLanguage}" class="language-tab ${key === activeLanguage ? 'active' : ''}" data-language="${key}" title="${label}">${short}</button>`).join('');
    languageTabs.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
        if (codeEditor.value) draftCache.set(`${activeKey}:${activeLanguage}`, codeEditor.value);
        activeLanguage = button.dataset.language;
        renderLanguageTabs();
        renderCode();
        clearOutput();
    }));
}

function renderTask() {
    const algorithm = algorithms.find(item => item.key === activeKey);
    if (!algorithm) return;
    document.title = `${algorithm.name} Practice | Algorithm Hub`;
    document.getElementById('taskCategory').textContent = algorithm.category;
    document.getElementById('taskNumber').textContent = `${algorithms.findIndex(item => item.key === activeKey) + 1} / ${algorithms.length}`;
    document.getElementById('taskTitle').textContent = algorithm.name;
    document.getElementById('taskSummary').textContent = algorithm.summary;
    document.getElementById('taskTime').textContent = algorithm.complexity.worst || 'Not specified';
    document.getElementById('taskSpace').textContent = algorithm.complexity.space || 'Not specified';
    const sample = algorithm.example || {};
    document.getElementById('taskInput').textContent = sample.input || 'Choose a sample input and try your solution.';
    document.getElementById('taskOutput').textContent = sample.output || 'Output depends on your implementation.';
    document.getElementById('taskSteps').innerHTML = (algorithm.steps || []).slice(0, 5).map(step => `<li>${escapeHtml(step.title)}${step.description ? `: ${escapeHtml(step.description)}` : ''}</li>`).join('');
    const explanationLink = document.getElementById('explanationLink');
    explanationLink.href = `explanation.html?algorithm=${encodeURIComponent(algorithm.key)}`;
    renderCode();
    clearOutput();
}

function renderCode() {
    const algorithm = algorithms.find(item => item.key === activeKey);
    if (!algorithm) return;
    const cacheKey = `${activeKey}:${activeLanguage}`;
    const starter = starterFor(algorithm, activeLanguage);
    codeEditor.value = draftCache.has(cacheKey) ? draftCache.get(cacheKey) : starter.code;
    document.getElementById('snippetLabel').textContent = starter.starter ? 'STARTER TEMPLATE' : 'REFERENCE IMPLEMENTATION';
    const compiler = compilerByLanguage[activeLanguage];
    document.getElementById('editorFilename').textContent = compiler.file;
    document.getElementById('externalCompiler').href = compiler.external;
    updateLineNumbers();
}

function updateLineNumbers() {
    const lines = codeEditor.value.split('\n').length;
    document.getElementById('lineNumbers').innerHTML = Array.from({ length: lines }, (_, index) => `<span>${index + 1}</span>`).join('');
    document.getElementById('editorLines').textContent = `${lines} lines`;
}

function clearOutput() {
    runState.textContent = 'Idle';
    runState.className = 'run-state';
    runDuration.textContent = '';
    consoleOutput.className = 'console-output';
    consoleOutput.textContent = 'Run your code to see standard output, compiler messages, or runtime errors.';
}

function resolveWandboxFile(code, filename) {
    if (activeLanguage !== 'java') return { name: filename, content: code };
    const publicClass = code.match(/public\s+class\s+([A-Za-z_$][\w$]*)/);
    const source = publicClass
        ? code.replace(/public\s+class\s+[A-Za-z_$][\w$]*/, 'class Main')
        : code.replace(/class\s+[A-Za-z_$][\w$]*/, 'class Main');
    return { name: 'Main.java', content: source };
}

async function runCode() {
    const compiler = compilerByLanguage[activeLanguage];
    const file = resolveWandboxFile(codeEditor.value, compiler.file);
    const startedAt = performance.now();
    runButton.disabled = true;
    runState.textContent = 'Compiling';
    runState.className = 'run-state running';
    consoleOutput.className = 'console-output';
    consoleOutput.textContent = 'Sending source to the online compiler…';

    try {
        const response = await fetch('https://wandbox.org/api/compile.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                compiler: compiler.compiler,
                code: file.content,
                stdin: document.getElementById('programInput').value,
                'compiler-option-raw': '',
                'runtime-option-raw': ''
            }),
            signal: AbortSignal.timeout(30000)
        });
        if (!response.ok) throw new Error(`Compiler service returned HTTP ${response.status}.`);
        const result = await response.json();
        const output = [result.program_output, result.program_error && `Runtime error:\n${result.program_error}`, result.compiler_error && `Compiler diagnostics:\n${result.compiler_error}`].filter(Boolean).join('\n').trim();
        const runtimeFailed = result.program_error || result.signal;
        const compileFailed = Boolean(result.compiler_error) || (result.status !== '0' && !runtimeFailed);
        runState.textContent = compileFailed ? 'Compile error' : runtimeFailed ? 'Runtime error' : 'Finished';
        runState.className = `run-state ${compileFailed || runtimeFailed ? 'failed' : 'success'}`;
        consoleOutput.className = `console-output ${compileFailed || runtimeFailed ? 'has-error' : ''}`;
        consoleOutput.textContent = output || (compileFailed ? result.compiler_message : runtimeFailed ? result.program_message : '(Program completed with no output)') || '(No output)';
        runDuration.textContent = `${Math.round(performance.now() - startedAt)} ms`;
    } catch (error) {
        runState.textContent = 'Unavailable';
        runState.className = 'run-state failed';
        consoleOutput.className = 'console-output has-error';
        consoleOutput.textContent = error.name === 'TimeoutError'
            ? 'Compilation took too long and was stopped. Check for an infinite loop and run again.'
            : `Could not run code: ${error.message}\n\nCheck your internet connection, or open the selected language in Programiz using the link above.`;
        runDuration.textContent = `${Math.round(performance.now() - startedAt)} ms`;
    } finally {
        runButton.disabled = false;
    }
}

function resetCode() {
    draftCache.delete(`${activeKey}:${activeLanguage}`);
    renderCode();
    clearOutput();
}

renderTabs();
renderList();
renderLanguageTabs();
renderTask();

searchInput.addEventListener('input', renderList);
codeEditor.addEventListener('input', () => {
    draftCache.set(`${activeKey}:${activeLanguage}`, codeEditor.value);
    updateLineNumbers();
});
codeEditor.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
        event.preventDefault();
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        codeEditor.setRangeText('    ', start, end, 'end');
        codeEditor.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') runCode();
});
runButton.addEventListener('click', runCode);
document.getElementById('resetEditor').addEventListener('click', resetCode);
document.getElementById('copyEditor').addEventListener('click', async event => {
    try {
        await navigator.clipboard.writeText(codeEditor.value);
        event.currentTarget.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
        setTimeout(() => { event.currentTarget.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>'; }, 1200);
    } catch {
        runState.textContent = 'Clipboard unavailable';
    }
});
document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        searchInput.focus();
    }
});
