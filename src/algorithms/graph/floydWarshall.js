// algorithms/graph/floydWarshall.js
export function floydWarshall(graph) {
  const steps = [];
  const nodes = Object.keys(graph).map(Number);
  const n = nodes.length;
  
  // Initialize distance matrix
  const dist = Array(n).fill().map(() => Array(n).fill(Infinity));
  const next = Array(n).fill().map(() => Array(n).fill(null));
  
  // Set diagonal to 0
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }
  
  // Set initial edges
  Object.entries(graph).forEach(([from, neighbors]) => {
    const i = Number(from);
    neighbors.forEach(neighbor => {
      const j = neighbor.node;
      dist[i][j] = neighbor.weight;
      next[i][j] = j;
    });
  });
  
  steps.push({
    type: "init",
    matrix: dist.map(row => [...row]),
    description: "Initialized distance matrix"
  });
  
  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    steps.push({
      type: "iteration",
      intermediate: k,
      description: `Using node ${k} as intermediate vertex`
    });
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          const oldDist = dist[i][j];
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
          
          steps.push({
            type: "update",
            i,
            j,
            k,
            oldDist,
            newDist: dist[i][j],
            description: `Updated dist[${i}][${j}] = dist[${i}][${k}] + dist[${k}][${j}] = ${dist[i][j]}`
          });
        }
      }
    }
  }
  
  // Check for negative cycles
  let hasNegativeCycle = false;
  for (let i = 0; i < n; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      steps.push({
        type: "negativeCycle",
        node: i,
        description: `⚠️ Negative cycle detected at node ${i}! dist[${i}][${i}] = ${dist[i][i]}`
      });
    }
  }
  
  steps.push({
    type: "complete",
    matrix: dist.map(row => [...row]),
    hasNegativeCycle,
    description: hasNegativeCycle 
      ? "❌ Floyd-Warshall completed. Graph contains negative cycles!"
      : "✅ Floyd-Warshall completed. All-pairs shortest paths calculated."
  });
  
  return steps;
}