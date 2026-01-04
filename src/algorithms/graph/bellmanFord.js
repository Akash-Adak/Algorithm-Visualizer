export function bellmanFord(graph, startNode = 0) {
  const steps = [];
  const distances = {};
  const previous = {};
  const nodes = Object.keys(graph).map(Number);

  /* --------------------------------
     1️⃣ INITIALIZATION
  -------------------------------- */
  nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[startNode] = 0;

  steps.push({
    type: "init",
    startNode,
    distances: { ...distances },
    previous: { ...previous },
    description: "Initialize distances. Start node set to 0."
  });

  /* --------------------------------
     2️⃣ BUILD EDGE LIST
  -------------------------------- */
  const edges = [];
  Object.entries(graph).forEach(([from, neighbors]) => {
    neighbors.forEach(({ node, weight }) => {
      edges.push({
        from: Number(from),
        to: Number(node),
        weight
      });
    });
  });

  /* --------------------------------
     3️⃣ RELAX EDGES (V - 1 ITERATIONS)
  -------------------------------- */
  for (let i = 1; i <= nodes.length - 1; i++) {
    let updated = false;

    // 🔁 Iteration start (wave)
    steps.push({
      type: "iterationStart",
      iteration: i,
      totalIterations: nodes.length - 1,
      distances: { ...distances },
      description: `Iteration ${i}: relaxing all edges`
    });

    for (const { from, to, weight } of edges) {
      const fromDist = distances[from];
      const toDist = distances[to];
      const candidate =
        fromDist !== Infinity ? fromDist + weight : Infinity;

      const canRelax = candidate < toDist;

      // 🔍 Relax attempt
      steps.push({
        type: "relax",
        iteration: i,
        edge: { from, to, weight },
        fromDistance: fromDist,
        toDistance: toDist,
        candidateDistance: candidate,
        canRelax,
        distances: { ...distances },
        description: `Checking edge ${from} → ${to}`
      });

      // ✅ Relax success
      if (canRelax) {
        distances[to] = candidate;
        previous[to] = from;
        updated = true;

        steps.push({
          type: "update",
          iteration: i,
          edge: { from, to },
          distances: { ...distances },
          previous: { ...previous },
          description: `Updated distance of ${to} to ${candidate}`
        });
      }
    }

    // 🛑 Early stop
    if (!updated) {
      steps.push({
        type: "earlyStop",
        iteration: i,
        distances: { ...distances },
        description: "No updates in this iteration. Algorithm converged early."
      });
      break;
    }

    // ✔ Iteration end
    steps.push({
      type: "iterationEnd",
      iteration: i,
      distances: { ...distances },
      description: `Iteration ${i} completed`
    });
  }

  /* --------------------------------
     4️⃣ NEGATIVE CYCLE CHECK
  -------------------------------- */
  let hasNegativeCycle = false;

  for (const { from, to, weight } of edges) {
    if (
      distances[from] !== Infinity &&
      distances[from] + weight < distances[to]
    ) {
      hasNegativeCycle = true;

      steps.push({
        type: "negativeCycle",
        edge: { from, to, weight },
        description: `Negative cycle detected on edge ${from} → ${to}`
      });
    }
  }

  /* --------------------------------
     5️⃣ COMPLETION
  -------------------------------- */
  steps.push({
    type: "complete",
    distances: { ...distances },
    previous: { ...previous },
    hasNegativeCycle,
    timeComplexity: "O(V × E)",
    spaceComplexity: "O(V)",
    description: hasNegativeCycle
      ? "Algorithm stopped: graph contains a negative weight cycle."
      : "Bellman-Ford completed successfully."
  });

  return steps;
}
