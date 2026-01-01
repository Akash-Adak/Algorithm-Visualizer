// algorithms/graph/bellmanFord.js
export function bellmanFord(graph, startNode = 0) {
  const steps = [];
  const distances = {};
  const previous = {};
  const nodes = Object.keys(graph).map(Number);
  
  // Initialize distances
  nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[startNode] = 0;
  
  steps.push({
    type: "init",
    distances: { ...distances },
    description: `Initializing Bellman-Ford. Distances: ${JSON.stringify(distances)}`
  });
  
  const edges = [];
  // Collect all edges
  Object.entries(graph).forEach(([from, neighbors]) => {
    neighbors.forEach(neighbor => {
      edges.push({
        from: Number(from),
        to: neighbor.node,
        weight: neighbor.weight
      });
    });
  });
  
  // Relax edges V-1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    steps.push({
      type: "iteration",
      iteration: i + 1,
      distances: { ...distances },
      description: `Iteration ${i + 1}/${nodes.length - 1}: Relaxing all edges`
    });
    
    let updated = false;
    
    edges.forEach(edge => {
      const { from, to, weight } = edge;
      
      steps.push({
        type: "relax",
        from,
        to,
        weight,
        currentDistance: distances[to],
        newDistance: distances[from] + weight,
        distances: { ...distances },
        description: `Checking edge ${from}→${to} (weight: ${weight})`
      });
      
      if (distances[from] + weight < distances[to]) {
        distances[to] = distances[from] + weight;
        previous[to] = from;
        updated = true;
        
        steps.push({
          type: "update",
          from,
          to,
          newDistance: distances[to],
          distances: { ...distances },
          description: `Updated distance to node ${to}: ${distances[to]} (via ${from})`
        });
      }
    });
    
    if (!updated) break;
  }
  
  // Check for negative cycles
  let hasNegativeCycle = false;
  edges.forEach(edge => {
    const { from, to, weight } = edge;
    if (distances[from] + weight < distances[to]) {
      hasNegativeCycle = true;
      steps.push({
        type: "negativeCycle",
        from,
        to,
        description: `⚠️ Negative cycle detected! ${distances[from]} + ${weight} < ${distances[to]}`
      });
    }
  });
  
  if (hasNegativeCycle) {
    steps.push({
      type: "complete",
      distances: { ...distances },
      hasNegativeCycle: true,
      description: "❌ Bellman-Ford completed. Graph contains negative weight cycle!"
    });
  } else {
    steps.push({
      type: "complete",
      distances: { ...distances },
      hasNegativeCycle: false,
      description: `✅ Bellman-Ford completed. Shortest distances from node ${startNode} calculated.`
    });
  }
  
  return steps;
}