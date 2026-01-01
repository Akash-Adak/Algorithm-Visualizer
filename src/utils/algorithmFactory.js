import { algorithms as sortingAlgorithms } from '../algorithms';
import { bfs } from '../algorithms/graph/bfs';
import { dfs } from '../algorithms/graph/dfs';
// import { dijkstra } from '../algorithms/graph/dijkstra';

export const ALGORITHM_TYPES = {
  SORTING: 'sorting',
  GRAPH: 'graph',
  PATHFINDING: 'pathfinding'
};

export const ALGORITHMS = {
  // Sorting Algorithms
  Bubble: { type: ALGORITHM_TYPES.SORTING, fn: sortingAlgorithms.Bubble },
  Selection: { type: ALGORITHM_TYPES.SORTING, fn: sortingAlgorithms.Selection },
  Insertion: { type: ALGORITHM_TYPES.SORTING, fn: sortingAlgorithms.Insertion },
  Merge: { type: ALGORITHM_TYPES.SORTING, fn: sortingAlgorithms.Merge },
  Quick: { type: ALGORITHM_TYPES.SORTING, fn: sortingAlgorithms.Quick },
  Heap: { type: ALGORITHM_TYPES.SORTING, fn: sortingAlgorithms.Heap },
  
  // Graph Algorithms
  BFS: { 
    type: ALGORITHM_TYPES.GRAPH, 
    fn: bfs,
    inputType: 'graph',
    description: "Breadth-First Search explores neighbors first"
  },
  DFS: { 
    type: ALGORITHM_TYPES.GRAPH, 
    fn: dfs,
    inputType: 'graph',
    description: "Depth-First Search explores deep paths first"
  },
  
  // Pathfinding Algorithms
  Dijkstra: { 
    type: ALGORITHM_TYPES.PATHFINDING, 
    fn: sortingAlgorithms.dijkstra,
    inputType: 'graph',
    description: "Finds shortest path in weighted graphs"
  },
};

export const COMPLEXITY_MAP = {
  // Sorting complexities (same as before)
  Bubble: { time: "O(n²)", space: "O(1)", description: "Repeatedly compares and swaps adjacent elements" },
  Selection: { time: "O(n²)", space: "O(1)", description: "Finds minimum element and places it at the beginning" },
  Insertion: { time: "O(n²)", space: "O(1)", description: "Builds sorted array one element at a time" },
  Merge: { time: "O(n log n)", space: "O(n)", description: "Divide and conquer algorithm using merging" },
  Quick: { time: "O(n log n)", space: "O(log n)", description: "Partition-based divide and conquer" },
  Heap: { time: "O(n log n)", space: "O(1)", description: "Binary heap data structure" },
  
  // Graph algorithm complexities
  BFS: { time: "O(V + E)", space: "O(V)", description: "Explores all neighbors at current depth before moving deeper" },
  DFS: { time: "O(V + E)", space: "O(V)", description: "Explores as far as possible along each branch before backtracking" },
  Dijkstra: { time: "O(E log V)", space: "O(V)", description: "Finds shortest paths from source to all vertices" },
};

export function getAlgorithmNames(type = ALGORITHM_TYPES.SORTING) {
  return Object.keys(ALGORITHMS).filter(name => ALGORITHMS[name].type === type);
}

export function executeAlgorithm(algorithmName, input, options = {}) {
  const algo = ALGORITHMS[algorithmName];
  if (!algo) throw new Error(`Algorithm ${algorithmName} not found`);
  
  // Handle different input types
  if (algo.inputType === 'graph') {
    return algo.fn(input.graph, input.start, input.end);
  }
  
  // Default: sorting algorithm
  return algo.fn(input);
}