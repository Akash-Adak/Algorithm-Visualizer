export function heapSort(array) {
  const steps = [];
  const arr = [...array];
  const n = arr.length;
  
  function heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    
    if (left < size) {
      steps.push({
        type: "compare",
        indices: [largest, left],
        array: [...arr],
        description: `Comparing ${arr[largest]} and ${arr[left]} in heap`
      });
      
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
    
    if (right < size) {
      steps.push({
        type: "compare",
        indices: [largest, right],
        array: [...arr],
        description: `Comparing ${arr[largest]} and ${arr[right]} in heap`
      });
      
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }
    
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      steps.push({
        type: "swap",
        indices: [root, largest],
        array: [...arr],
        description: `Heapifying: swapping ${arr[largest]} and ${arr[root]}`
      });
      
      heapify(size, largest);
    }
  }
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({
      type: "swap",
      indices: [0, i],
      array: [...arr],
      description: `Moving max element ${arr[i]} to position ${i}`
    });
    
    steps.push({
      type: "sorted",
      sortedRange: [i, i],
      array: [...arr],
      description: `Position ${i} is now sorted`
    });
    
    heapify(i, 0);
  }
  
  return steps;
}