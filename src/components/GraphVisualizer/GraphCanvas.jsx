// components/GraphVisualizer/GraphCanvas.jsx
import { useState, useEffect, useRef } from "react";
import GraphNode from "./GraphNode";

export default function GraphCanvas({
  graph,
  visitedNodes,
  exploringNodes,
  pathNodes,
  frontierNodes,
  currentNode,
  distanceLabels,
  algorithm
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodePositions, setNodePositions] = useState({});
  const [isReady, setIsReady] = useState(false);

  // Update container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Generate node positions in a circle
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const nodes = Object.keys(graph);
    if (nodes.length === 0) {
      setNodePositions({});
      setIsReady(true);
      return;
    }

    const positions = {};
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.3;

    nodes.forEach((nodeId, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions[nodeId] = { x, y };
    });

    setNodePositions(positions);
    setIsReady(true);
  }, [graph, dimensions]);

  // Draw edges on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady || Object.keys(nodePositions).length === 0) return;

    // Set canvas size to match container
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges with error handling
    Object.entries(graph).forEach(([fromNode, neighbors]) => {
      const fromPos = nodePositions[fromNode];
      if (!fromPos) return; // Skip if position not found

      neighbors.forEach(neighbor => {
        const toPos = nodePositions[neighbor.node];
        if (!toPos) return; // Skip if position not found
        
        const fromNum = Number(fromNode);
        const toNum = neighbor.node;

        // Choose edge color based on state
        let color = "#4b5563"; // Gray for unvisited
        let width = 1.5;

        if (pathNodes.has(fromNum) && pathNodes.has(toNum)) {
          color = "#10b981"; // Green for path
          width = 3;
        } else if (visitedNodes.has(fromNum) && visitedNodes.has(toNum)) {
          color = "#3b82f6"; // Blue for visited
          width = 2.5;
        } else if (frontierNodes.has(fromNum) || frontierNodes.has(toNum)) {
          color = "#f59e0b"; // Yellow for frontier
          width = 2;
        }

        // Draw edge line
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();

        // Show edge weight for Dijkstra and other weighted algorithms
        if ((algorithm === "Dijkstra" || algorithm === "BellmanFord" || 
             algorithm === "Prim" || algorithm === "Kruskal" || 
             algorithm === "TSP" || algorithm === "FloydWarshall") && 
            neighbor.weight && neighbor.weight !== 1) {
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2;

          // Draw weight background
          ctx.fillStyle = "#1f2937";
          ctx.fillRect(midX - 12, midY - 8, 24, 16);

          // Draw weight text
          ctx.fillStyle = "white";
          ctx.font = "bold 11px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(neighbor.weight, midX, midY);
        }
      });
    });
  }, [graph, nodePositions, visitedNodes, pathNodes, frontierNodes, algorithm, dimensions, isReady]);

  // Get algorithm explanation
  const getAlgorithmInfo = () => {
    const info = {
      BFS: "Explores level by level (unweighted)",
      DFS: "Explores deep paths first",
      Dijkstra: "Finds shortest weighted paths",
      BellmanFord: "Handles negative weights",
      Topological: "Linear ordering of DAG",
      Prim: "Minimum Spanning Tree (greedy)",
      Kruskal: "Minimum Spanning Tree (union-find)",
      FloydWarshall: "All-pairs shortest paths",
      AStar: "Heuristic search",
      TSP: "Traveling Salesman (NP-hard)"
    };
    return info[algorithm] || "Graph Algorithm";
  };

  // Get algorithm-specific color coding
  const getAlgorithmColors = () => {
    const colors = {
      Dijkstra: "text-purple-300",
      BellmanFord: "text-red-300",
      Prim: "text-green-300",
      Kruskal: "text-emerald-300",
      TSP: "text-pink-300",
      FloydWarshall: "text-indigo-300",
      AStar: "text-cyan-300",
      Topological: "text-amber-300",
      BFS: "text-blue-300",
      DFS: "text-yellow-300"
    };
    return colors[algorithm] || "text-gray-300";
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-gray-900 to-slate-950 rounded-xl overflow-hidden border border-gray-800">
      {/* Canvas for edges */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Nodes - Only render when positions are ready */}
      {isReady && Object.entries(nodePositions).map(([nodeId, position]) => {
        if (!position) return null; // Skip if position is undefined
        
        const nodeIdNum = Number(nodeId);
        return (
          <div
            key={nodeId}
            className="absolute transition-all duration-300"
            style={{
              left: position.x - 20,
              top: position.y - 20,
            }}
          >
            <GraphNode
              nodeId={nodeIdNum}
              isVisited={visitedNodes.has(nodeIdNum)}
              isExploring={exploringNodes.has(nodeIdNum)}
              isInPath={pathNodes.has(nodeIdNum)}
              isFrontier={frontierNodes.has(nodeIdNum)}
              isCurrent={currentNode === nodeIdNum}
              distance={distanceLabels[nodeId]}
              algorithm={algorithm}
            />
          </div>
        );
      })}

      {/* Loading state */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-300">Calculating node positions...</div>
          </div>
        </div>
      )}

      {/* Top Info Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-3 items-center z-10">
        <div className={`bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 ${getAlgorithmColors()}`}>
          <div className="font-bold text-lg">{algorithm}</div>
          <div className="text-sm opacity-90">{getAlgorithmInfo()}</div>
        </div>
        
        <div className="bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-300">
            <span className="font-medium">Nodes:</span> {Object.keys(graph).length}
          </div>
          <div className="text-sm text-gray-300">
            <span className="font-medium">Edges:</span> {Object.values(graph).reduce((sum, edges) => sum + edges.length, 0) / 2}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700 z-10">
        <div className="font-medium mb-3 text-gray-200">Legend:</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>
            <span className="text-gray-300 text-sm">Shortest Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30"></div>
            <span className="text-gray-300 text-sm">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30"></div>
            <span className="text-gray-300 text-sm">Exploring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30"></div>
            <span className="text-gray-300 text-sm">Frontier</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-600"></div>
            <span className="text-gray-300 text-sm">Unvisited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500 shadow-lg shadow-purple-500/30"></div>
            <span className="text-gray-300 text-sm">Current</span>
          </div>
        </div>
      </div>

      {/* Current State Info */}
      <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700 max-w-xs z-10">
        <div className="font-medium mb-3 text-gray-200">Current State:</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Visited:</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-medium">{visitedNodes.size}</span>
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Exploring:</span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-medium">{exploringNodes.size}</span>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Frontier:</span>
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-medium">{frontierNodes.size}</span>
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">In Path:</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-medium">{pathNodes.size}</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
          {currentNode !== null && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <span className="text-gray-400">Current Node:</span>
              <span className="text-purple-400 font-medium">{currentNode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm-specific overlay */}
      {algorithm === "Dijkstra" && Object.keys(distanceLabels).length > 0 && (
        <div className="absolute top-20 left-4 bg-gray-900/80 backdrop-blur-sm p-3 rounded-xl border border-gray-700 max-w-xs z-10">
          <div className="font-medium mb-2 text-green-300">Distances:</div>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {Object.entries(distanceLabels)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([node, distance]) => (
                <div 
                  key={node}
                  className={`px-2 py-1 rounded text-xs ${
                    visitedNodes.has(Number(node))
                      ? 'bg-green-900/40 text-green-300'
                      : 'bg-gray-800/60 text-gray-400'
                  }`}
                >
                  {node}: {distance === Infinity ? "∞" : distance}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}