// algorithms/index.js - This should be exactly like you have it
import { bubbleSort } from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";
import { heapSort } from "./sorting/heapSort";

export const algorithms = {
  Bubble: bubbleSort,
  Selection: selectionSort,
  Insertion: insertionSort,
  Merge: mergeSort,
  Quick: quickSort,
  Heap: heapSort
};