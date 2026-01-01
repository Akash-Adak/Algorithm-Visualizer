// algorithms/graph/kruskal.js
export function kruskal(graph) {
  const steps = [];
  const edges = [];
  const mst = [];
  
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
  
  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);
  
  steps.push({
    type: "init",
    edges: edges.length,
    description: `Collected ${edges.length} edges, sorted by weight`
  });
  
  // Union-Find data structure
  const parent = {};
  const rank = {};
  
  Object.keys(graph).forEach(node => {
    parent[node] = Number(node);
    rank[node] = 0;
  });
  
  function find(node) {
    if (parent[node] !== node) {
      parent[node] = find(parent[node]);
    }
    return parent[node];
  }
  
  function union(a, b) {
    const rootA = find(a);
    const rootB = find(b);
    
    if (rootA === rootB) return false;
    
    if (rank[rootA] < rank[rootB]) {
      parent[rootA] = rootB;
    } else if (rank[rootA] > rank[rootB]) {
      parent[rootB] = rootA;
    } else {
      parent[rootB] = rootA;
      rank[rootA]++;
    }
    
    return true;
  }
  
  // Process edges
  for (const edge of edges) {
    const { from, to, weight } = edge;
    
    steps.push({
      type: "consider",
      from,
      to,
      weight,
      parent: { ...parent },
      description: `Considering edge ${from}→${to} (weight: ${weight})`
    });
    
    if (find(from) !== find(to)) {
      union(from, to);
      mst.push(edge);
      
      steps.push({
        type: "addEdge",
        from,
        to,
        weight,
        mst: [...mst],
        description: `Added edge ${from}→${to} to MST (no cycle formed)`
      });
    } else {
      steps.push({
        type: "skip",
        from,
        to,
        description: `Skipped edge ${from}→${to} (would create cycle)`
      });
    }
    
    if (mst.length === Object.keys(graph).length - 1) break;
  }
  
  const totalWeight = mst.reduce((sum, edge) => sum + edge.weight, 0);
  steps.push({
    type: "complete",
    mst: [...mst],
    totalWeight,
    description: `✅ Kruskal's algorithm completed! MST weight: ${totalWeight}, ${mst.length} edges`
  });
  
  return steps;
}