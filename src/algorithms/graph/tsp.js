// algorithms/graph/tsp.js
export function tsp(graph, startNode = 0) {
  const steps = [];
  const nodes = Object.keys(graph).map(Number);
  const n = nodes.length;
  
  // Create adjacency matrix
  const adjMatrix = Array(n).fill().map(() => Array(n).fill(Infinity));
  Object.entries(graph).forEach(([from, neighbors]) => {
    const i = Number(from);
    neighbors.forEach(neighbor => {
      const j = neighbor.node;
      adjMatrix[i][j] = neighbor.weight;
      adjMatrix[j][i] = neighbor.weight; // Assuming undirected
    });
  });
  
  steps.push({
    type: "init",
    nodes: [...nodes],
    startNode,
    description: `Starting TSP with ${n} cities, starting at ${startNode}`
  });
  
  // DP table: dp[mask][i] = minimum cost visiting cities in mask ending at i
  const dp = Array(1 << n).fill().map(() => Array(n).fill(Infinity));
  const parent = Array(1 << n).fill().map(() => Array(n).fill(-1));
  
  // Base case: starting node
  dp[1 << startNode][startNode] = 0;
  
  steps.push({
    type: "dpInit",
    mask: 1 << startNode,
    currentNode: startNode,
    cost: 0,
    description: `DP initialized: dp[${1 << startNode}][${startNode}] = 0`
  });
  
  // DP computation
  for (let mask = 1; mask < (1 << n); mask++) {
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last))) continue;
      if (dp[mask][last] === Infinity) continue;
      
      for (let next = 0; next < n; next++) {
        if (mask & (1 << next)) continue;
        if (adjMatrix[last][next] === Infinity) continue;
        
        const newMask = mask | (1 << next);
        const newCost = dp[mask][last] + adjMatrix[last][next];
        
        steps.push({
          type: "consider",
          mask,
          newMask,
          last,
          next,
          currentCost: dp[mask][last],
          edgeCost: adjMatrix[last][next],
          newCost,
          description: `Considering path: mask=${mask.toString(2)} → ${next}, cost=${dp[mask][last]} + ${adjMatrix[last][next]} = ${newCost}`
        });
        
        if (newCost < dp[newMask][next]) {
          dp[newMask][next] = newCost;
          parent[newMask][next] = last;
          
          steps.push({
            type: "updateDP",
            mask: newMask,
            node: next,
            newCost,
            parent: last,
            description: `Updated dp[${newMask.toString(2)}][${next}] = ${newCost}`
          });
        }
      }
    }
  }
  
  // Find minimum cost Hamiltonian cycle
  const fullMask = (1 << n) - 1;
  let minCost = Infinity;
  let lastNode = -1;
  
  for (let i = 0; i < n; i++) {
    if (i === startNode) continue;
    const cycleCost = dp[fullMask][i] + adjMatrix[i][startNode];
    
    steps.push({
      type: "finalConsider",
      lastNode: i,
      costToEnd: dp[fullMask][i],
      returnCost: adjMatrix[i][startNode],
      totalCost: cycleCost,
      description: `Complete path ending at ${i}: ${dp[fullMask][i]} + ${adjMatrix[i][startNode]} = ${cycleCost}`
    });
    
    if (cycleCost < minCost) {
      minCost = cycleCost;
      lastNode = i;
    }
  }
  
  // Reconstruct path
  const path = [];
  if (lastNode !== -1) {
    let mask = fullMask;
    let current = lastNode;
    
    while (current !== -1) {
      path.unshift(current);
      const prev = parent[mask][current];
      mask ^= (1 << current);
      current = prev;
    }
    
    // Add start node at the end to complete cycle
    path.push(startNode);
  }
  
  if (minCost === Infinity) {
    steps.push({
      type: "complete",
      minCost: "∞",
      path: [],
      description: "❌ No Hamiltonian cycle found!"
    });
  } else {
    steps.push({
      type: "complete",
      minCost,
      path: [...path],
      visited: new Set(path),
      description: `✅ TSP completed! Minimum cost: ${minCost}, Path: ${path.join(' → ')}`
    });
  }
  
  return steps;
}