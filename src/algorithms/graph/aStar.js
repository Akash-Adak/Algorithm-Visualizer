// algorithms/graph/aStar.js
export function aStar(graph, startNode = 0, endNode = null) {
  const steps = [];
  const openSet = new Set([startNode]);
  const closedSet = new Set();
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const nodes = Object.keys(graph).map(Number);
  
  // Heuristic function (Manhattan distance for grid, or simple difference for this demo)
  function heuristic(node, goal) {
    // Simple heuristic: absolute difference
    return Math.abs(node - goal);
  }
  
  // Initialize scores
  nodes.forEach(node => {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  });
  gScore[startNode] = 0;
  fScore[startNode] = heuristic(startNode, endNode || nodes[nodes.length - 1]);
  
  steps.push({
    type: "init",
    startNode,
    endNode: endNode || nodes[nodes.length - 1],
    openSet: [...openSet],
    description: `Starting A* search from ${startNode} to ${endNode || nodes[nodes.length - 1]}`
  });
  
  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current = null;
    let lowestFScore = Infinity;
    
    openSet.forEach(node => {
      if (fScore[node] < lowestFScore) {
        lowestFScore = fScore[node];
        current = node;
      }
    });
    
    // If we reached the goal
    if (current === endNode) {
      // Reconstruct path
      const path = [];
      let temp = current;
      while (temp !== undefined) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }
      
      steps.push({
        type: "found",
        current,
        path,
        gScore: gScore[current],
        openSet: [...openSet],
        closedSet: [...closedSet],
        description: `🎯 Found path to ${current}! Cost: ${gScore[current]}, Path: ${path.join(' → ')}`
      });
      
      break;
    }
    
    openSet.delete(current);
    closedSet.add(current);
    
    steps.push({
      type: "explore",
      current,
      gScore: gScore[current],
      fScore: fScore[current],
      openSet: [...openSet],
      closedSet: [...closedSet],
      description: `Exploring node ${current} (g=${gScore[current]}, f=${fScore[current]})`
    });
    
    // Check neighbors
    const neighbors = graph[current] || [];
    neighbors.forEach(neighbor => {
      const neighborNode = neighbor.node;
      
      if (closedSet.has(neighborNode)) return;
      
      const tentativeGScore = gScore[current] + neighbor.weight;
      
      steps.push({
        type: "checkNeighbor",
        current,
        neighbor: neighborNode,
        edgeWeight: neighbor.weight,
        tentativeGScore,
        currentGScore: gScore[neighborNode],
        description: `Checking neighbor ${neighborNode}: ${gScore[current]} + ${neighbor.weight} = ${tentativeGScore}`
      });
      
      if (tentativeGScore < gScore[neighborNode]) {
        cameFrom[neighborNode] = current;
        gScore[neighborNode] = tentativeGScore;
        fScore[neighborNode] = gScore[neighborNode] + heuristic(neighborNode, endNode || nodes[nodes.length - 1]);
        
        if (!openSet.has(neighborNode)) {
          openSet.add(neighborNode);
        }
        
        steps.push({
          type: "update",
          current,
          neighbor: neighborNode,
          newGScore: gScore[neighborNode],
          newFScore: fScore[neighborNode],
          description: `Updated scores for ${neighborNode}: g=${gScore[neighborNode]}, f=${fScore[neighborNode]}`
        });
      }
    });
  }
  
  if (!closedSet.has(endNode || nodes[nodes.length - 1])) {
    steps.push({
      type: "noPath",
      openSet: [...openSet],
      closedSet: [...closedSet],
      description: "❌ No path found to target node!"
    });
  }
  
  return steps;
}