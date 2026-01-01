export function mergeSort(array) {
  const steps = [];
  const arr = [...array];
  
  function mergeSortRecursive(low, high) {
    if (low >= high) return;
    
    const mid = Math.floor((low + high) / 2);
    
    steps.push({
      type: "divide",
      indices: [low, mid, high],
      array: [...arr],
      description: `Dividing [${low}-${high}] at index ${mid}`
    });
    
    mergeSortRecursive(low, mid);
    mergeSortRecursive(mid + 1, high);
    merge(low, mid, high);
  }
  
  function merge(low, mid, high) {
    const temp = [];
    let i = low, j = mid + 1;
    
    steps.push({
      type: "mergeStart",
      indices: [low, high],
      array: [...arr],
      description: `Merging [${low}-${mid}] and [${mid+1}-${high}]`
    });
    
    while (i <= mid && j <= high) {
      steps.push({
        type: "compare",
        indices: [i, j],
        array: [...arr],
        description: `Comparing ${arr[i]} and ${arr[j]} for merge`
      });
      
      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }
    
    while (i <= mid) temp.push(arr[i++]);
    while (j <= high) temp.push(arr[j++]);
    
    for (let k = 0; k < temp.length; k++) {
      arr[low + k] = temp[k];
      steps.push({
        type: "mergeMove",
        indices: [low + k],
        array: [...arr],
        description: `Placing ${temp[k]} at position ${low + k}`
      });
    }
    
    steps.push({
      type: "sorted",
      sortedRange: [low, high],
      array: [...arr],
      description: `Range [${low}-${high}] is now sorted`
    });
  }
  
  steps.push({
    type: "start",
    array: [...arr],
    description: "Starting Merge Sort - Divide and Conquer"
  });
  
  mergeSortRecursive(0, arr.length - 1);
  
  return steps;
}