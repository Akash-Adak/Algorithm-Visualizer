import { useState } from "react";
import SortingVisualizer from "../SortingVisualizer";
import GraphVisualizer from "../GraphVisualizer";
import { ALGORITHM_TYPES } from "../../utils/algorithmFactory";

export default function AlgorithmVisualizer() {
  const [visualizerType, setVisualizerType] = useState(ALGORITHM_TYPES.SORTING);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Algorithm Visualization Playground
          </h1>
          
          {/* Mode Selector */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                visualizerType === ALGORITHM_TYPES.SORTING
                  ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => setVisualizerType(ALGORITHM_TYPES.SORTING)}
            >
              🔢 Sorting Algorithms
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                visualizerType === ALGORITHM_TYPES.GRAPH
                  ? 'bg-green-600 shadow-lg shadow-green-500/30'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => setVisualizerType(ALGORITHM_TYPES.GRAPH)}
            >
              📊 Graph Algorithms
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          {visualizerType === ALGORITHM_TYPES.SORTING ? (
            <SortingVisualizer />
          ) : (
            <GraphVisualizer />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            {visualizerType === ALGORITHM_TYPES.SORTING
              ? "Visualize how different sorting algorithms rearrange elements"
              : "Explore graph traversal and pathfinding algorithms"}
          </p>
        </div>
      </div>
    </div>
  );
}