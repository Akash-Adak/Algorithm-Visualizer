// algorithms/graph/dijkstra.js
export function dijkstra(graph, startNode = 0) {
  const steps = [];
  const distances = {};
  const visited = new Set();
  const unvisited = new Set();
  const previous = {};
  
  // Initialize distances
  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    unvisited.add(Number(node));
  });
  distances[startNode] = 0;
  
  steps.push({
    type: "start",
    current: startNode,
    distances: { ...distances },
    visited: new Set(visited),
    description: `Starting Dijkstra from node ${startNode}. All distances set to infinity except start node (0).`
  });
  
  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current = null;
    let smallestDistance = Infinity;
    
    unvisited.forEach(node => {
      if (distances[node] < smallestDistance) {
        smallestDistance = distances[node];
        current = node;
      }
    });
    
    if (current === null || distances[current] === Infinity) break;
    
    visited.add(current);
    unvisited.delete(current);
    
    steps.push({
      type: "explore",
      current: current,
      distances: { ...distances },
      visited: new Set(visited),
      description: `Exploring node ${current} (distance: ${distances[current]})`
    });
    
    // Update distances to neighbors
    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.node)) {
        const newDistance = distances[current] + neighbor.weight;
        
        steps.push({
          type: "compare",
          current: current,
          neighbor: neighbor.node,
          currentDistance: distances[neighbor.node],
          newDistance: newDistance,
          distances: { ...distances },
          visited: new Set(visited),
          description: `Checking edge ${current}→${neighbor.node} (weight: ${neighbor.weight})`
        });
        
        if (newDistance < distances[neighbor.node]) {
          distances[neighbor.node] = newDistance;
          previous[neighbor.node] = current;
          
          steps.push({
            type: "updateDistance",
            current: current,
            neighbor: neighbor.node,
            distances: { ...distances },
            visited: new Set(visited),
            description: `Updated distance to node ${neighbor.node}: ${newDistance} (via ${current})`
          });
        }
      }
    }
  }
  
  steps.push({
    type: "complete",
    distances: { ...distances },
    visited: new Set(visited),
    description: `Dijkstra complete! Shortest distances from node ${startNode} calculated.`
  });
  
  return steps;
}