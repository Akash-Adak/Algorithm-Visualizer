// utils/graphGenerator.js
export function generateRandomGraph(nodeCount = 8, edgeProbability = 0.4) {
  const graph = {};
  
  // Initialize nodes
  for (let i = 0; i < nodeCount; i++) {
    graph[i] = [];
  }
  
  // Create edges
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (Math.random() < edgeProbability) {
        const weight = Math.floor(Math.random() * 10) + 1;
        
        // Add bidirectional edge
        graph[i].push({ node: j, weight });
        graph[j].push({ node: i, weight });
      }
    }
  }
  
  // Ensure graph is connected
  for (let i = 0; i < nodeCount; i++) {
    if (graph[i].length === 0 && i < nodeCount - 1) {
      const j = (i + 1) % nodeCount;
      const weight = Math.floor(Math.random() * 10) + 1;
      graph[i].push({ node: j, weight });
      graph[j].push({ node: i, weight });
    }
  }
  
  return graph;
}

export function generateGridGraph(rows = 4, cols = 4) {
  const graph = {};
  const totalNodes = rows * cols;
  
  for (let i = 0; i < totalNodes; i++) {
    graph[i] = [];
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // Right neighbor
    if (col < cols - 1) {
      graph[i].push({ node: i + 1, weight: 1 });
    }
    
    // Down neighbor
    if (row < rows - 1) {
      graph[i].push({ node: i + cols, weight: 1 });
    }
    
    // Left neighbor
    if (col > 0) {
      graph[i].push({ node: i - 1, weight: 1 });
    }
    
    // Up neighbor
    if (row > 0) {
      graph[i].push({ node: i - cols, weight: 1 });
    }
  }
  
  return graph;
}

export function generateStarGraph(nodeCount = 7) {
  const graph = {};
  
  // Initialize nodes
  for (let i = 0; i < nodeCount; i++) {
    graph[i] = [];
  }
  
  // Connect all nodes to center (node 0)
  for (let i = 1; i < nodeCount; i++) {
    const weight = Math.floor(Math.random() * 10) + 1;
    graph[0].push({ node: i, weight });
    graph[i].push({ node: 0, weight });
  }
  
  return graph;
}

export function generateTreeGraph(levels = 3) {
  const graph = {};
  let nodeId = 0;
  
  function generateLevel(parentId, currentLevel, maxLevel) {
    if (currentLevel >= maxLevel) return;
    
    const numChildren = Math.floor(Math.random() * 3) + 1; // 1-3 children
    
    for (let i = 0; i < numChildren; i++) {
      nodeId++;
      const weight = Math.floor(Math.random() * 10) + 1;
      
      // Add edge from parent to child
      if (!graph[parentId]) graph[parentId] = [];
      graph[parentId].push({ node: nodeId, weight });
      
      // Add edge from child to parent (for undirected)
      if (!graph[nodeId]) graph[nodeId] = [];
      graph[nodeId].push({ node: parentId, weight });
      
      // Recursively generate children
      generateLevel(nodeId, currentLevel + 1, maxLevel);
    }
  }
  
  // Start with root node
  graph[0] = [];
  generateLevel(0, 0, levels);
  
  return graph;
}