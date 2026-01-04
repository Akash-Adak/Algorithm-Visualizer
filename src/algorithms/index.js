// algorithms/index.js - This should be exactly like you have it
import { bubbleSort } from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";
import { heapSort } from "./sorting/heapSort";
import { bfs } from "./graph/bfs";
import { dfs } from "./graph/dfs";
import { dijkstra } from "./graph/dijkstra";
import { aStar } from "./graph/aStar";
import { bellmanFord } from "./graph/bellmanFord";
import { floydWarshall } from "./graph/floydWarshall";
import { kruskal } from "./graph/kruskal";
import { prim } from "./graph/prim";

export const algorithms = {
  Bubble: bubbleSort,
  Selection: selectionSort,
  Insertion: insertionSort,
  Merge: mergeSort,
  Quick: quickSort,
  Heap: heapSort,
  BFS: bfs,
  DFS: dfs,
  Dijkstra :dijkstra,
  AStar:aStar,
  BellmanFord:bellmanFord,
  FloydWarshall:floydWarshall,
  Kruskal:kruskal,
  Prim:prim
};