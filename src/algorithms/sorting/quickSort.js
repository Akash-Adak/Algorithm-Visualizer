export function quickSort(array) {
  const steps = [];
  const arr = [...array];
  
  function quickSortRecursive(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortRecursive(low, pi - 1);
      quickSortRecursive(pi + 1, high);
    }
  }
  
  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    steps.push({
      type: "pivot",
      indices: [high],
      array: [...arr],
      description: `Choosing ${pivot} as pivot`
    });
    
    for (let j = low; j < high; j++) {
      steps.push({
        type: "compare",
        indices: [j, high],
        array: [...arr],
        description: `Comparing ${arr[j]} with pivot ${pivot}`
      });
      
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (i !== j) {
          steps.push({
            type: "swap",
            indices: [i, j],
            array: [...arr],
            description: `Swapping ${arr[j]} and ${arr[i]}`
          });
        }
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      type: "pivotPlace",
      indices: [i + 1, high],
      array: [...arr],
      description: `Placing pivot at position ${i + 1}`
    });
    
    return i + 1;
  }
  
  steps.push({
    type: "start",
    array: [...arr],
    description: "Starting Quick Sort"
  });
  
  quickSortRecursive(0, arr.length - 1);
  
  return steps;
}