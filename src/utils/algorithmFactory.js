// utils/algorithmFactory.js - FIXED VERSION
import { algorithms } from '../algorithms'; // Import from '../algorithms' not '../algorithms/index'

export const ALGORITHM_TYPES = {
  SORTING: 'sorting',
  GRAPH: 'graph',
  PATHFINDING: 'pathfinding'
};

export const ALGORITHMS = {
  // Sorting Algorithms
  Bubble: { type: ALGORITHM_TYPES.SORTING, fn: algorithms.Bubble },
  Selection: { type: ALGORITHM_TYPES.SORTING, fn: algorithms.Selection },
  Insertion: { type: ALGORITHM_TYPES.SORTING, fn: algorithms.Insertion },
  Merge: { type: ALGORITHM_TYPES.SORTING, fn: algorithms.Merge },
  Quick: { type: ALGORITHM_TYPES.SORTING, fn: algorithms.Quick },
  Heap: { type: ALGORITHM_TYPES.SORTING, fn: algorithms.Heap },
  
  // Graph Algorithms (placeholder for future)
//   BFS: { type: ALGORITHM_TYPES.GRAPH, fn: algorithms.BFS },
  // DFS: { type: ALGORITHM_TYPES.GRAPH, fn: algorithms.DFS },
  // Dijkstra: { type: ALGORITHM_TYPES.PATHFINDING, fn: algorithms.Dijkstra },
};

export const COMPLEXITY_MAP = {
  Bubble: { time: "O(n²)", space: "O(1)", description: "Repeatedly compares and swaps adjacent elements" },
  Selection: { time: "O(n²)", space: "O(1)", description: "Finds minimum element and places it at the beginning" },
  Insertion: { time: "O(n²)", space: "O(1)", description: "Builds sorted array one element at a time" },
  Merge: { time: "O(n log n)", space: "O(n)", description: "Divide and conquer algorithm using merging" },
  Quick: { time: "O(n log n)", space: "O(log n)", description: "Partition-based divide and conquer" },
  Heap: { time: "O(n log n)", space: "O(1)", description: "Binary heap data structure" },
};

export function getAlgorithmNames(type = ALGORITHM_TYPES.SORTING) {
  return Object.keys(ALGORITHMS).filter(name => ALGORITHMS[name].type === type);
}

export function executeAlgorithm(algorithmName, input) {
  const algo = ALGORITHMS[algorithmName];
  if (!algo) throw new Error(`Algorithm ${algorithmName} not found`);
  return algo.fn(input);
}