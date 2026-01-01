// algorithms/graph/topologicalSort.js
export function topologicalSort(graph) {
  const steps = [];
  const inDegree = {};
  const queue = [];
  const result = [];
  const visited = new Set();
  
  // Calculate in-degree for each node
  Object.keys(graph).forEach(node => {
    inDegree[node] = 0;
  });
  
  Object.entries(graph).forEach(([from, neighbors]) => {
    neighbors.forEach(neighbor => {
      inDegree[neighbor.node] = (inDegree[neighbor.node] || 0) + 1;
    });
  });
  
  steps.push({
    type: "init",
    inDegree: { ...inDegree },
    description: "Calculated in-degree for all nodes"
  });
  
  // Find nodes with 0 in-degree
  Object.entries(inDegree).forEach(([node, degree]) => {
    if (degree === 0) {
      queue.push(Number(node));
      steps.push({
        type: "enqueue",
        node: Number(node),
        queue: [...queue],
        description: `Node ${node} has in-degree 0, added to queue`
      });
    }
  });
  
  // Process nodes
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);
    visited.add(current);
    
    steps.push({
      type: "process",
      current,
      result: [...result],
      queue: [...queue],
      visited: new Set(visited),
      description: `Processing node ${current}, added to topological order`
    });
    
    // Reduce in-degree of neighbors
    const neighbors = graph[current] || [];
    neighbors.forEach(neighbor => {
      inDegree[neighbor.node]--;
      
      steps.push({
        type: "reduce",
        current,
        neighbor: neighbor.node,
        newDegree: inDegree[neighbor.node],
        inDegree: { ...inDegree },
        description: `Reduced in-degree of node ${neighbor.node} to ${inDegree[neighbor.node]}`
      });
      
      if (inDegree[neighbor.node] === 0 && !visited.has(neighbor.node) && !queue.includes(neighbor.node)) {
        queue.push(neighbor.node);
        steps.push({
          type: "enqueue",
          node: neighbor.node,
          queue: [...queue],
          description: `Node ${neighbor.node} now has in-degree 0, added to queue`
        });
      }
    });
  }
  
  // Check for cycles
  if (result.length !== Object.keys(graph).length) {
    steps.push({
      type: "cycle",
      result: [...result],
      description: "⚠️ Graph contains a cycle! Not all nodes processed."
    });
  } else {
    steps.push({
      type: "complete",
      result: [...result],
      visited: new Set(visited),
      description: `✅ Topological sort completed: [${result.join(' → ')}]`
    });
  }
  
  return steps;
}