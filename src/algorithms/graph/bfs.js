// algorithms/graph/bfs.js
export function bfs(graph, startNode = 0) {
  const steps = [];
  const visited = new Set();
  const queue = [startNode];
  const frontier = new Set([startNode]);
  
  visited.add(startNode);
  
  steps.push({
    type: "start",
    current: startNode,
    visited: new Set(visited),
    frontier: new Set(frontier),
    description: `Starting BFS from node ${startNode}`
  });
  
  let level = 0;
  let nodesInCurrentLevel = 1;
  let nodesInNextLevel = 0;
  
  while (queue.length > 0) {
    const current = queue.shift();
    frontier.delete(current);
    
    steps.push({
      type: "explore",
      current: current,
      visited: new Set(visited),
      frontier: new Set(frontier),
      description: `Exploring node ${current} (Level ${level})`
    });
    
    // Visit neighbors
    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.node)) {
        visited.add(neighbor.node);
        queue.push(neighbor.node);
        frontier.add(neighbor.node);
        nodesInNextLevel++;
        
        steps.push({
          type: "discover",
          current: current,
          discovered: neighbor.node,
          visited: new Set(visited),
          frontier: new Set(frontier),
          description: `Discovered neighbor ${neighbor.node} from ${current}`
        });
      }
    }
    
    nodesInCurrentLevel--;
    if (nodesInCurrentLevel === 0) {
      level++;
      nodesInCurrentLevel = nodesInNextLevel;
      nodesInNextLevel = 0;
    }
  }
  
  steps.push({
    type: "complete",
    visited: new Set(visited),
    description: `BFS complete! Visited ${visited.size} nodes across ${level} levels`
  });
  
  return steps;
}