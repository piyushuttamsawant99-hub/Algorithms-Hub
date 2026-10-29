window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups['math-bit'] = {
  label: 'Mathematical & Bit',
  items: [
    ['Euclidean GCD', 'Repeatedly replaces a pair with remainder values.', 'O(log min(a,b))', 'O(1) iterative'], ['Sieve of Eratosthenes', 'Marks multiples to find all primes up to a limit.', 'O(N log log N)', 'O(N) sieve array'], ['Fast Exponentiation', 'Squares the base while halving the exponent.', 'O(log n)', 'O(1) iterative'], ['Prime Factorization', 'Breaks a number into prime building blocks.', 'O(√n)', 'O(1) iterative'], ['Modular Arithmetic', 'Keeps calculations bounded under a modulus.', 'O(1) per fixed-width operation; big integers depend on bit length', 'O(1) for fixed-width values'], ['Bit Manipulation', 'Uses binary operators directly on bits.', 'O(1) per fixed-width operation', 'O(1)'], ['XOR-based Algorithms', 'Uses XOR cancellation to isolate values.', 'O(n)', 'O(1)']
  ]
};
