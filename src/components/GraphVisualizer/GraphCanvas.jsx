// components/GraphVisualizer/GraphCanvas.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import GraphNode from "./GraphNode";

export default function GraphCanvas({
  graph,
  visitedNodes = new Set(),
  exploringNodes = new Set(),
  pathNodes = new Set(),
  frontierNodes = new Set(),
  currentNode = null,
  distanceLabels = {},
  algorithm
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodePositions, setNodePositions] = useState({});
  const [isReady, setIsReady] = useState(false);

  /* -------------------------------------------
     1️⃣ Resize Observer (more stable than window resize)
  -------------------------------------------- */
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* -------------------------------------------
     2️⃣ Generate node positions (circle layout)
  -------------------------------------------- */
  useEffect(() => {
    const nodes = Object.keys(graph);
    if (!nodes.length || !dimensions.width || !dimensions.height) {
      setIsReady(false);
      return;
    }

    const positions = {};
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

    nodes.forEach((nodeId, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      positions[nodeId] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    setNodePositions(positions);
    setIsReady(true);
  }, [graph, dimensions]);

  /* -------------------------------------------
     3️⃣ Memoized edge list (performance)
  -------------------------------------------- */
  const edges = useMemo(() => {
    const list = [];
    Object.entries(graph).forEach(([from, neighbors]) => {
      neighbors.forEach(n => {
        list.push({
          from: Number(from),
          to: Number(n.node),
          weight: n.weight ?? 1
        });
      });
    });
    return list;
  }, [graph]);

  /* -------------------------------------------
     4️⃣ Draw edges on canvas
  -------------------------------------------- */
  useEffect(() => {
    if (!isReady || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach(({ from, to, weight }) => {
      const fromPos = nodePositions[from];
      const toPos = nodePositions[to];
      if (!fromPos || !toPos) return;

      let color = "#4b5563";
      let width = 1.5;

      if (pathNodes.has(from) && pathNodes.has(to)) {
        color = "#10b981";
        width = 3;
      } else if (visitedNodes.has(from) && visitedNodes.has(to)) {
        color = "#3b82f6";
        width = 2.5;
      } else if (frontierNodes.has(from) || frontierNodes.has(to)) {
        color = "#f59e0b";
        width = 2;
      }

      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();

      // Weight label
      const showWeight =
        ["Dijkstra", "BellmanFord", "Prim", "Kruskal", "TSP", "FloydWarshall"].includes(
          algorithm
        ) && weight !== 1;

      if (showWeight) {
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;

        ctx.fillStyle = "#020617";
        ctx.fillRect(midX - 14, midY - 9, 28, 18);

        ctx.fillStyle = "#e5e7eb";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(weight, midX, midY);
      }
    });
  }, [
    edges,
    nodePositions,
    visitedNodes,
    pathNodes,
    frontierNodes,
    algorithm,
    dimensions,
    isReady
  ]);

  /* -------------------------------------------
     5️⃣ Algorithm info helpers
  -------------------------------------------- */
  const algorithmInfo = {
    BFS: "Level-order traversal (unweighted)",
    DFS: "Depth-first exploration",
    Dijkstra: "Shortest paths (non-negative weights)",
    BellmanFord: "Shortest paths (supports negative weights)",
    Prim: "Minimum Spanning Tree (greedy)",
    Kruskal: "Minimum Spanning Tree (union-find)",
    FloydWarshall: "All-pairs shortest paths",
    AStar: "Heuristic guided search",
    Topological: "Linear ordering of DAG",
    TSP: "Traveling Salesman (NP-hard)"
  };

  const algorithmColor = {
    BFS: "text-blue-300",
    DFS: "text-yellow-300",
    Dijkstra: "text-purple-300",
    BellmanFord: "text-red-300",
    Prim: "text-green-300",
    Kruskal: "text-emerald-300",
    FloydWarshall: "text-indigo-300",
    AStar: "text-cyan-300",
    TSP: "text-pink-300",
    Topological: "text-amber-300"
  };

  /* -------------------------------------------
     6️⃣ Render
  -------------------------------------------- */
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-br from-gray-900 to-slate-950 rounded-xl overflow-hidden border border-gray-800"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {isReady &&
        Object.entries(nodePositions).map(([id, pos]) => {
          const n = Number(id);
          return (
            <div
              key={id}
              className="absolute transition-all duration-300"
              style={{ left: pos.x - 20, top: pos.y - 20 }}
            >
              <GraphNode
                nodeId={n}
                isVisited={visitedNodes.has(n)}
                isExploring={exploringNodes.has(n)}
                isInPath={pathNodes.has(n)}
                isFrontier={frontierNodes.has(n)}
                isCurrent={currentNode === n}
                distance={distanceLabels[n]}
                algorithm={algorithm}
              />
            </div>
          );
        })}

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-gray-300 animate-pulse">
            Calculating graph layout…
          </div>
        </div>
      )}

      {/* Algorithm badge */}
      <div
        className={`absolute top-4 left-4 px-4 py-2 rounded-lg bg-gray-900/80 border border-gray-700 backdrop-blur ${algorithmColor[algorithm]}`}
      >
        <div className="font-bold">{algorithm}</div>
        <div className="text-xs opacity-90">{algorithmInfo[algorithm]}</div>
      </div>
    </div>
  );
}
