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
    const nodes = Object.keys(graph);
    if (nodes.length === 0) return;

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
  }, [graph, dimensions]);

  // Draw edges on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(nodePositions).length === 0) return;

    // Set canvas size to match container
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    Object.entries(graph).forEach(([fromNode, neighbors]) => {
      const fromPos = nodePositions[fromNode];

      neighbors.forEach(neighbor => {
        const toPos = nodePositions[neighbor.node];
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

        // Show edge weight for Dijkstra
        if (algorithm === "Dijkstra" && neighbor.weight) {
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
  }, [graph, nodePositions, visitedNodes, pathNodes, frontierNodes, algorithm, dimensions]);

  // Get algorithm explanation
  const getAlgorithmInfo = () => {
    switch (algorithm) {
      case "BFS":
        return "Explores level by level";
      case "DFS":
        return "Explores deep paths first";
      case "Dijkstra":
        return "Finds shortest weighted paths";
      default:
        return "";
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Canvas for edges */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Nodes */}
      {Object.entries(nodePositions).map(([nodeId, position]) => {
        const nodeIdNum = Number(nodeId);
        return (
          <div
            key={nodeId}
            className="absolute"
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

      {/* Top Info Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-3 items-center">
        <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="font-bold text-lg">{algorithm}</div>
          <div className="text-gray-300 text-sm">{getAlgorithmInfo()}</div>
        </div>
        
        <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="text-sm text-gray-400">Nodes: {Object.keys(graph).length}</div>
          <div className="text-sm text-gray-400">Edges: {Object.values(graph).reduce((sum, edges) => sum + edges.length, 0) / 2}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
        <div className="font-medium mb-2 text-gray-200">Colors:</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-300 text-sm">Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-300 text-sm">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300 text-sm">Exploring</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-gray-300 text-sm">Frontier</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            <span className="text-gray-300 text-sm">Unvisited</span>
          </div>
        </div>
      </div>

      {/* Current State Info */}
      <div className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-gray-700 max-w-xs">
        <div className="font-medium mb-2 text-gray-200">Current State:</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Visited:</span>
            <span className="text-blue-400 font-medium">{visitedNodes.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Exploring:</span>
            <span className="text-yellow-400 font-medium">{exploringNodes.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Frontier:</span>
            <span className="text-orange-400 font-medium">{frontierNodes.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">In Path:</span>
            <span className="text-green-400 font-medium">{pathNodes.size}</span>
          </div>
        </div>
      </div>
    </div>
  );
}