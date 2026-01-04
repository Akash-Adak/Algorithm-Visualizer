export function prim(graph, startNode = 0) {
  const steps = [];
  const visited = new Set();
  const mstEdges = [];

  const nodes = Object.keys(graph).map(Number);
  const key = {};
  const parent = {};

  /* ================= 1️⃣ INITIALIZATION ================= */

  nodes.forEach(node => {
    key[node] = Infinity;
    parent[node] = null;
  });

  key[startNode] = 0;

  let pq = [...nodes];

  steps.push({
    type: "init",
    startNode,
    key: { ...key },
    visited: new Set(),
    mstEdges: [],
    frontier: new Set(pq),
    description: `Starting Prim's algorithm from node ${startNode}`
  });

  /* ================= 2️⃣ MAIN LOOP ================= */

  while (pq.length > 0) {
    // Extract min key node
    pq.sort((a, b) => key[a] - key[b]);
    const current = pq.shift();

    if (key[current] === Infinity) break;

    visited.add(current);

    steps.push({
      type: "select",
      current,
      key: key[current],
      visited: new Set(visited),
      mstEdges: [...mstEdges],
      frontier: new Set(pq),
      description: `Selected node ${current} with minimum key ${key[current]}`
    });

    // Add edge to MST
    if (parent[current] !== null) {
      const edge = {
        from: parent[current],
        to: current,
        weight: key[current]
      };

      mstEdges.push(edge);

      steps.push({
        type: "addEdge",
        current,
        mstEdges: [...mstEdges],
        visited: new Set(visited),
        frontier: new Set(pq),
        description: `Added edge ${edge.from} → ${edge.to} (w=${edge.weight}) to MST`
      });
    }

    // Relax neighbors
    for (const neighbor of graph[current] || []) {
      const v = neighbor.node;
      const w = neighbor.weight;

      if (!visited.has(v) && w < key[v]) {
        key[v] = w;
        parent[v] = current;

        steps.push({
          type: "updateKey",
          from: current,
          to: v,
          newKey: w,
          key: { ...key },
          visited: new Set(visited),
          mstEdges: [...mstEdges],
          frontier: new Set(pq),
          description: `Updated key of node ${v} to ${w} via ${current}`
        });
      }
    }
  }

  /* ================= 3️⃣ FINAL RESULT ================= */

  const totalWeight = mstEdges.reduce((s, e) => s + e.weight, 0);

  steps.push({
    type: "complete",
    mstEdges: [...mstEdges],
    totalWeight,
    visited: new Set(visited),
    description: `✅ Prim's algorithm completed. MST weight = ${totalWeight}`
  });

  return steps;
}
