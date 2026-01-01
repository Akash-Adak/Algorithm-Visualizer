// components/GraphVisualizer/GraphNode.jsx
export default function GraphNode({
  nodeId,
  isVisited,
  isExploring,
  isInPath,
  isFrontier,
  isCurrent,
  distance,
  algorithm
}) {
  // Get node color based on state with fallbacks
  const getNodeColor = () => {
    if (isInPath) return "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400";
    if (isExploring) return "bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-400";
    if (isFrontier) return "bg-gradient-to-br from-orange-500 to-red-500 border-orange-400";
    if (isVisited) return "bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-400";
    return "bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500";
  };

  // Get node size based on state
  const getNodeSize = () => {
    if (isCurrent) return "w-14 h-14 text-lg";
    if (isInPath || isExploring || isFrontier) return "w-12 h-12";
    return "w-11 h-11";
  };

  // Get node ring based on state
  const getNodeRing = () => {
    if (isCurrent) return "ring-4 ring-purple-400 ring-opacity-60";
    if (isInPath) return "ring-2 ring-green-400";
    if (isExploring) return "ring-2 ring-yellow-400";
    if (isFrontier) return "ring-2 ring-orange-400";
    if (isVisited) return "ring-2 ring-blue-400";
    return "ring-1 ring-gray-500";
  };

  // Show distance for algorithms that track it
  const showDistance = algorithm === "Dijkstra" || algorithm === "BellmanFord" || 
                      algorithm === "FloydWarshall" || algorithm === "TSP" || 
                      algorithm === "AStar";
  
  const displayDistance = distance !== undefined && distance !== Infinity ? distance : "∞";

  return (
    <div className="relative group">
      {/* Main node */}
      <div
        className={`${getNodeColor()} ${getNodeSize()} ${getNodeRing()} rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 hover:scale-110`}
      >
        <span className="font-bold text-white drop-shadow-md">{nodeId}</span>
      </div>

      {/* Distance label */}
      {showDistance && distance !== undefined && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/90 px-2 py-1 rounded text-xs text-white font-mono border border-gray-700 whitespace-nowrap shadow-lg">
          {displayDistance}
        </div>
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-2xl border border-gray-700 whitespace-nowrap min-w-[140px]">
          <div className="font-bold mb-1 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isInPath ? 'bg-green-500' :
              isExploring ? 'bg-yellow-500' :
              isFrontier ? 'bg-orange-500' :
              isVisited ? 'bg-blue-500' : 'bg-gray-500'
            }`}></div>
            Node {nodeId}
          </div>
          
          {distance !== undefined && showDistance && (
            <div className="text-cyan-300 mb-1">
              <span className="text-gray-400">Distance: </span>
              {displayDistance}
            </div>
          )}
          
          <div className="text-xs text-gray-400 border-t border-gray-700 pt-1 mt-1">
            {isInPath && "✅ In shortest path"}
            {isExploring && "🔍 Currently exploring"}
            {isFrontier && "📌 In frontier"}
            {isVisited && !isExploring && "✓ Visited"}
            {!isVisited && !isExploring && "○ Unvisited"}
            {isCurrent && " ⭐ Current"}
          </div>
        </div>
      </div>
    </div>
  );
}