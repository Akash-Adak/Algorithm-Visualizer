export function insertionSort(array) {
  const steps = [];
  const arr = [...array];

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];

      steps.push({
        type: "swap",
        indices: [j, j + 1],
        array: [...arr],
      });

      j--;
    }

    arr[j + 1] = key;
    steps.push({
      type: "insert",
      indices: [j + 1],
      array: [...arr],
    });
  }

  return steps;
}
