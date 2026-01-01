// algorithms/graph/prim.js
export function prim(graph, startNode = 0) {
  const steps = [];
  const visited = new Set();
  const mst = [];
  const edges = [];
  const key = {};
  const parent = {};
  const nodes = Object.keys(graph).map(Number);
  
  // Initialize keys
  nodes.forEach(node => {
    key[node] = Infinity;
    parent[node] = null;
  });
  key[startNode] = 0;
  
  steps.push({
    type: "init",
    startNode,
    key: { ...key },
    description: `Starting Prim's algorithm from node ${startNode}`
  });
  
  // Priority queue (simulated with array)
  const pq = [...nodes];
  
  while (pq.length > 0) {
    // Find node with minimum key
    pq.sort((a, b) => key[a] - key[b]);
    const current = pq.shift();
    
    if (key[current] === Infinity) break;
    
    visited.add(current);
    
    steps.push({
      type: "select",
      current,
      key: key[current],
      visited: new Set(visited),
      description: `Selected node ${current} with key ${key[current]}`
    });
    
    // Add edge to MST if not start node
    if (parent[current] !== null) {
      mst.push({ from: parent[current], to: current, weight: key[current] });
      steps.push({
        type: "addEdge",
        from: parent[current],
        to: current,
        weight: key[current],
        mst: [...mst],
        description: `Added edge ${parent[current]}→${current} (weight: ${key[current]}) to MST`
      });
    }
    
    // Update keys of adjacent nodes
    const neighbors = graph[current] || [];
    neighbors.forEach(neighbor => {
      if (!visited.has(neighbor.node) && neighbor.weight < key[neighbor.node]) {
        key[neighbor.node] = neighbor.weight;
        parent[neighbor.node] = current;
        
        steps.push({
          type: "updateKey",
          current,
          neighbor: neighbor.node,
          newKey: neighbor.weight,
          key: { ...key },
          description: `Updated key of node ${neighbor.node} to ${neighbor.weight} (via ${current})`
        });
      }
    });
  }
  
  const totalWeight = mst.reduce((sum, edge) => sum + edge.weight, 0);
  steps.push({
    type: "complete",
    mst: [...mst],
    totalWeight,
    visited: new Set(visited),
    description: `✅ Prim's algorithm completed! MST weight: ${totalWeight}, Edges: ${mst.map(e => `${e.from}-${e.to}`).join(', ')}`
  });
  
  return steps;
}