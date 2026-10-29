import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

test('algorithm library complexity metadata is explicit and avoids unsupported claims', async () => {
  const dataDirectory = path.join(projectRoot, 'data');
  const files = (await readdir(dataDirectory)).filter(file => file.endsWith('.js'));
  const context = { window: {} };
  for (const file of files.filter(name => name !== 'explanations.js')) {
    vm.runInNewContext(await readFile(path.join(dataDirectory, file), 'utf8'), context, { filename: file });
  }
  vm.runInNewContext(await readFile(path.join(dataDirectory, 'explanations.js'), 'utf8'), context, { filename: 'explanations.js' });

  const groups = context.window.algorithmGroups;
  const algorithms = Object.values(groups).flatMap(group => group.items.map(([name]) => name));
  const explanations = context.window.algorithmExplanations;
  assert.equal(algorithms.length, 93);
  assert.equal(new Set(algorithms.map(slug)).size, algorithms.length, 'catalog algorithm names must be unique');
  assert.ok(Object.values(groups).every(group => group.items.every(item =>
    typeof item[2] === 'string' && item[2].length > 0 &&
    typeof item[3] === 'string' && item[3].length > 0
  )), 'every catalog entry must provide card time and auxiliary-space complexity');
  assert.ok(algorithms.every(name => {
    const complexity = explanations[slug(name)]?.complexity;
    return complexity && ['best', 'average', 'worst', 'space'].every(field =>
      typeof complexity[field] === 'string' && complexity[field].length > 0
    );
  }));

  const catalogEntries = new Map(Object.values(groups).flatMap(group => group.items.map(item => [slug(item[0]), item])));
  assert.match(catalogEntries.get('a-search')[2], /heuristic-dependent/i);
  assert.match(catalogEntries.get('ford-fulkerson')[2], /integer capacities/i);
  assert.match(catalogEntries.get('sparse-table')[2], /min\/max query/i);
  assert.match(catalogEntries.get('dijkstra-algorithm')[2], /scan-based implementation/i);
  assert.match(catalogEntries.get('longest-increasing-subsequence')[2], /O\(n log n\).*O\(n²\)/i);
  assert.match(catalogEntries.get('minimum-coins')[3], /not always optimal/i);
  assert.match(catalogEntries.get('binary-search')[3], /iterative/i);
  assert.match(catalogEntries.get('fibonacci')[3], /iterative/i);

  const quickSort = explanations['quick-sort'].complexity;
  assert.match(quickSort.space, /O\(n\).*worst/i);
  assert.match(quickSort.spaceDesc, /worst-case recursion stack/i);
  const dijkstra = explanations.dijkstra.complexity;
  assert.match(dijkstra.average, /O\(V² \+ E\).*JavaScript/i);
  assert.match(dijkstra.space, /O\(V\).*JavaScript/i);

  assert.ok(!JSON.stringify({ groups, explanations }).includes('Not documented for this catalog entry.'));

  assert.deepEqual({
    linear: explanations['linear-search'].complexity.worst,
    binary: explanations['binary-search'].complexity.worst,
    bubbleBest: explanations['bubble-sort'].complexity.best,
    bubbleWorst: explanations['bubble-sort'].complexity.worst,
    merge: explanations['merge-sort'].complexity.worst,
    quick: quickSort.worst,
    dijkstraHeap: dijkstra.best,
  }, {
    linear: 'O(n)',
    binary: 'O(log n)',
    bubbleBest: 'O(n)',
    bubbleWorst: 'O(n²)',
    merge: 'O(n log n)',
    quick: 'O(n²)',
    dijkstraHeap: 'O((V + E) log V) with a heap',
  });
});
