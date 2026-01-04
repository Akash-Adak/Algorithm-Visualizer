export function kruskal(graph) {
  const steps = [];
  const mstEdges = [];
  const visited = new Set();

  /* ================= 1️⃣ COLLECT UNIQUE EDGES ================= */

  const edges = [];
  const seen = new Set();

  Object.entries(graph).forEach(([from, neighbors]) => {
    neighbors.forEach(({ node: to, weight }) => {
      const u = Number(from);
      const v = Number(to);
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;

      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ from: u, to: v, weight });
      }
    });
  });

  edges.sort((a, b) => a.weight - b.weight);

  steps.push({
    type: "init",
    edges: [...edges],
    mstEdges: [],
    description: `Collected ${edges.length} unique edges and sorted by weight`
  });

  /* ================= 2️⃣ UNION FIND ================= */

  const parent = {};
  const rank = {};

  Object.keys(graph).forEach(n => {
    parent[n] = Number(n);
    rank[n] = 0;
  });

  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;

    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else {
      parent[rb] = ra;
      rank[ra]++;
    }
    return true;
  };

  /* ================= 3️⃣ KRUSKAL PROCESS ================= */

  for (const edge of edges) {
    steps.push({
      type: "consider",
      currentEdge: edge,
      mstEdges: [...mstEdges],
      description: `Considering edge ${edge.from} → ${edge.to} (w=${edge.weight})`
    });

    if (union(edge.from, edge.to)) {
      mstEdges.push(edge);
      visited.add(edge.from);
      visited.add(edge.to);

      steps.push({
        type: "addEdge",
        currentEdge: edge,
        mstEdges: [...mstEdges],
        visited: new Set(visited),
        description: `Added edge ${edge.from} → ${edge.to} to MST`
      });
    } else {
      steps.push({
        type: "skip",
        currentEdge: edge,
        mstEdges: [...mstEdges],
        description: `Skipped edge ${edge.from} → ${edge.to} (cycle)`
      });
    }

    if (mstEdges.length === Object.keys(graph).length - 1) break;
  }

  /* ================= 4️⃣ FINAL RESULT ================= */

  const totalWeight = mstEdges.reduce((s, e) => s + e.weight, 0);

  steps.push({
    type: "complete",
    mstEdges: [...mstEdges],
    totalWeight,
    visited: new Set(visited),
    description: `✅ MST completed | Weight = ${totalWeight}`
  });

  return steps;
}
