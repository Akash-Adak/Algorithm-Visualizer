export function dfs(graph, startNode, endNode = null) {
  const steps = [];
  const visited = new Set();
  const stack = [startNode];
  const parent = new Map();
  
  steps.push({
    type: "start",
    visited: new Set(),
    stack: [...stack],
    current: startNode,
    description: `Starting DFS from node ${startNode}`
  });
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (!visited.has(current)) {
      visited.add(current);
      
      steps.push({
        type: "visit",
        visited: new Set(visited),
        stack: [...stack],
        current: current,
        description: `Visiting node ${current}`
      });
      
      // If we found the end node
      if (endNode !== null && current === endNode) {
        const path = reconstructPath(parent, startNode, endNode);
        steps.push({
          type: "found",
          visited: new Set(visited),
          path: [...path],
          description: `Found target node ${endNode}! Path: ${path.join(" → ")}`
        });
        break;
      }
      
      // Add neighbors to stack (in reverse order for visualization)
      const neighbors = graph[current] || [];
      const unvisitedNeighbors = neighbors.filter(n => !visited.has(n.node));
      
      for (const neighbor of unvisitedNeighbors.reverse()) {
        if (!visited.has(neighbor.node)) {
          stack.push(neighbor.node);
          if (!parent.has(neighbor.node)) {
            parent.set(neighbor.node, current);
          }
          
          steps.push({
            type: "push",
            visited: new Set(visited),
            stack: [...stack],
            current: current,
            pushed: neighbor.node,
            description: `Pushing neighbor ${neighbor.node} to stack`
          });
        }
      }
    }
  }
  
  if (endNode !== null && !visited.has(endNode)) {
    steps.push({
      type: "notFound",
      visited: new Set(visited),
      description: `Target node ${endNode} not reachable from ${startNode}`
    });
  } else {
    steps.push({
      type: "complete",
      visited: new Set(visited),
      description: `DFS completed. Visited ${visited.size} nodes.`
    });
  }
  
  return steps;
}

function reconstructPath(parent, start, end) {
  const path = [end];
  let current = end;
  
  while (current !== start) {
    current = parent.get(current);
    if (current === undefined) return [];
    path.unshift(current);
  }
  
  return path;
}