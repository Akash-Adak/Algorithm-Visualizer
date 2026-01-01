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
  // Get node color based on state
  const getNodeColor = () => {
    if (isInPath) return "bg-green-500 border-green-300";
    if (isExploring) return "bg-yellow-500 border-yellow-300";
    if (isFrontier) return "bg-orange-500 border-orange-300";
    if (isVisited) return "bg-blue-500 border-blue-300";
    return "bg-gray-600 border-gray-400";
  };

  // Get node size based on state
  const getNodeSize = () => {
    if (isCurrent) return "w-12 h-12";
    if (isInPath || isExploring) return "w-11 h-11";
    return "w-10 h-10";
  };

  // Show distance for certain algorithms
  const showDistance = algorithm === "Dijkstra" || algorithm === "BFS";
  const displayDistance = distance !== undefined && distance !== Infinity ? distance : "∞";

  return (
    <div className="relative group">
      {/* Main node */}
      <div
        className={`${getNodeColor()} ${getNodeSize()} rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 ${
          isCurrent ? "scale-110 ring-2 ring-white" : ""
        }`}
      >
        <span className="font-bold text-white">{nodeId}</span>
      </div>

      {/* Distance label */}
      {showDistance && (isVisited || isExploring || isInPath) && (
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white font-mono border border-gray-600">
          {displayDistance}
        </div>
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-xl border border-gray-700 whitespace-nowrap">
          <div className="font-medium">Node {nodeId}</div>
          {distance !== undefined && (
            <div className="text-blue-300 mt-1">
              Distance: {displayDistance}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}