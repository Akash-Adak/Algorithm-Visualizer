export function selectionSort(array) {
  const steps = [];
  const arr = [...array];

  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;

    for (let j = i + 1; j < arr.length; j++) {
      steps.push({
        type: "compare",
        indices: [minIdx, j],
        array: [...arr],
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

      steps.push({
        type: "swap",
        indices: [i, minIdx],
        array: [...arr],
      });
    }
  }

  return steps;
}
