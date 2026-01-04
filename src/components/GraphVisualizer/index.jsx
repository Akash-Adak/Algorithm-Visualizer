// components/GraphVisualizer/index.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import GraphCanvas from "./GraphCanvas";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RefreshCw, 
  FastForward, 
  BarChart2,
  Cpu,
  Database,
  Info,
  Zap,
  Target,
  Settings,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { generateRandomGraph } from "../../utils/graphGenerator";
import { algorithms } from "../../algorithms";

// Algorithm metadata
const ALGORITHM_DETAILS = {
  BFS: {
    complexity: "O(V + E)",
    space: "O(V)",
    description: "Explores neighbors first before moving deeper.",
    dataStructure: "Queue",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  DFS: {
    complexity: "O(V + E)",
    space: "O(V)",
    description: "Explores deep before backtracking.",
    dataStructure: "Stack",
    color: "text-green-400",
    bgColor: "bg-green-500/10"
  },
  Dijkstra: {
    complexity: "O(E log V)",
    space: "O(V)",
    description: "Shortest path with non-negative weights.",
    dataStructure: "Priority Queue",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  BellmanFord: {
    complexity: "O(VE)",
    space: "O(V)",
    description: "Shortest path with negative weights.",
    dataStructure: "Array",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10"
  },
  Topological: {
    complexity: "O(V + E)",
    space: "O(V)",
    description: "Linear ordering of vertices in DAG.",
    dataStructure: "Queue/Stack",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10"
  },
  Prim: {
    complexity: "O(E log V)",
    space: "O(V)",
    description: "Minimum Spanning Tree.",
    dataStructure: "Priority Queue",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10"
  },
  Kruskal: {
    complexity: "O(E log E)",
    space: "O(V)",
    description: "MST using Union-Find.",
    dataStructure: "Union-Find",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10"
  }
};

export default function GraphVisualizer() {
  // Graph state
  const [graph, setGraph] = useState(() => generateRandomGraph(8, 0.4));
  
  // Animation control
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [algorithm, setAlgorithm] = useState("BFS");
  const [showAlgoDropdown, setShowAlgoDropdown] = useState(false);
  
  // Visualization states
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [exploringNodes, setExploringNodes] = useState(new Set());
  const [pathNodes, setPathNodes] = useState(new Set());
  const [frontierNodes, setFrontierNodes] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [distanceLabels, setDistanceLabels] = useState({});
  const [queue, setQueue] = useState([]);
  const [stack, setStack] = useState([]);
  
  // UI states
  const [status, setStatus] = useState("Ready to visualize. Select an algorithm.");
  const [statistics, setStatistics] = useState({
    totalSteps: 0,
    visited: 0,
    comparisons: 0,
    operations: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset everything
  const resetVisualization = useCallback(() => {
    setVisitedNodes(new Set());
    setExploringNodes(new Set());
    setPathNodes(new Set());
    setFrontierNodes(new Set());
    setCurrentNode(null);
    setDistanceLabels({});
    setQueue([]);
    setStack([]);
    setCurrentStep(0);
    setSteps([]);
    setIsPlaying(false);
    setStatistics({
      totalSteps: 0,
      visited: 0,
      comparisons: 0,
      operations: 0
    });
  }, []);

  // Generate new graph
  const handleNewGraph = useCallback(() => {
    setIsLoading(true);
    const nodeCount = Math.floor(Math.random() * 7) + 6;
    const density = 0.4 + Math.random() * 0.3;
    
    setTimeout(() => {
      setGraph(generateRandomGraph(nodeCount, density));
      resetVisualization();
      setStatus(`🎯 New graph with ${nodeCount} nodes generated`);
      setIsLoading(false);
    }, 300);
  }, [resetVisualization]);

  // Prepare algorithm when algorithm changes
  useEffect(() => {
    if (graph && Object.keys(graph).length > 0) {
      prepareAlgorithm();
    }
  }, [algorithm, graph]);

  const prepareAlgorithm = useCallback(() => {
    if (!graph || Object.keys(graph).length === 0) {
      setStatus("No graph available. Generate a new graph first.");
      return;
    }

    resetVisualization();
    setIsLoading(true);

    setTimeout(() => {
      try {
        let algorithmSteps = [];
        const nodes = Object.keys(graph).map(Number);
        const startNode = nodes[0];

        switch (algorithm) {
          case "BFS":
            algorithmSteps = algorithms.BFS(graph, startNode);
            break;
          case "DFS":
            algorithmSteps = algorithms.DFS(graph, startNode);
            break;
          case "Dijkstra":
            algorithmSteps = algorithms.Dijkstra(graph, startNode);
            break;
          case "BellmanFord":
            algorithmSteps = algorithms.BellmanFord(graph, startNode);
            break;
          case "Topological":
            algorithmSteps = algorithms.TopologicalSort(graph);
            break;
          case "Prim":
            algorithmSteps = algorithms.Prim(graph, startNode);
            break;
          case "Kruskal":
            algorithmSteps = algorithms.Kruskal(graph);
            break;
          default:
            algorithmSteps = algorithms.BFS(graph, startNode);
        }

        if (!algorithmSteps || !Array.isArray(algorithmSteps)) {
          algorithmSteps = [];
        }

        setSteps(algorithmSteps);
        setStatistics(prev => ({
          ...prev,
          totalSteps: algorithmSteps.length,
          comparisons: algorithmSteps.filter(s => s.type === "compare").length,
          operations: algorithmSteps.length
        }));
        
        setStatus(`✅ ${algorithm} prepared with ${algorithmSteps.length} steps. Click Play to start.`);
        setIsLoading(false);

      } catch (error) {
        console.error("Error:", error);
        setStatus(`❌ Failed to prepare ${algorithm}`);
        setIsLoading(false);
      }
    }, 100);
  }, [graph, algorithm, resetVisualization]);

  // Animation effect
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length || steps.length === 0) {
      if (currentStep >= steps.length && steps.length > 0) {
        setIsPlaying(false);
        setStatus("🏁 Algorithm completed!");
      }
      return;
    }

    const timer = setTimeout(() => {
      const step = steps[currentStep];
      if (!step) return;

      if (step.visited) setVisitedNodes(new Set(step.visited));
      if (step.frontier) setFrontierNodes(new Set(step.frontier));
      if (step.current !== undefined) setCurrentNode(step.current);
      if (step.exploring !== undefined) setExploringNodes(new Set([step.exploring]));
      if (step.distances) setDistanceLabels(step.distances);
      if (step.path) setPathNodes(new Set(step.path));
      if (step.queue) setQueue(step.queue);
      if (step.stack) setStack(step.stack);
      
      if (step.description) {
        setStatus(step.description);
      }
      
      if (step.visited) {
        setStatistics(prev => ({
          ...prev,
          visited: step.visited.size
        }));
      }
      
      setCurrentStep(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]);

  // Handle algorithm change
  const handleAlgorithmChange = useCallback((algo) => {
    setAlgorithm(algo);
    setShowAlgoDropdown(false);
  }, []);

  // Navigation controls
  const handleStepForward = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      setIsPlaying(false);
    }
  }, [currentStep, steps.length]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setIsPlaying(false);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setVisitedNodes(new Set());
    setExploringNodes(new Set());
    setPathNodes(new Set());
    setFrontierNodes(new Set());
    setCurrentNode(null);
    setDistanceLabels({});
    setQueue([]);
    setStack([]);
    setStatus("🔄 Restarted. Click Play to begin.");
  }, []);

  const progress = steps.length > 0 ? (currentStep / steps.length) * 100 : 0;
  const algoDetails = ALGORITHM_DETAILS[algorithm] || ALGORITHM_DETAILS.BFS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with controls */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Graph Algorithm Visualizer
              </h1>
              <p className="text-gray-400 text-sm mt-1">Interactive step-by-step visualization</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Algorithm Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAlgoDropdown(!showAlgoDropdown)}
                  className={`px-4 py-2.5 ${algoDetails.bgColor} border border-gray-700 rounded-lg font-medium flex items-center gap-2 min-w-[180px]`}
                >
                  <Zap size={18} />
                  <span className="flex-1 text-left">{algorithm}</span>
                  <ChevronDown size={18} />
                </button>
                
                {showAlgoDropdown && (
                  <>
                    <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                      {Object.keys(ALGORITHM_DETAILS).map((algo) => (
                        <button
                          key={algo}
                          onClick={() => handleAlgorithmChange(algo)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                            algorithm === algo ? 'bg-gray-700' : ''
                          }`}
                        >
                          <div className="font-medium">{algo}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            {ALGORITHM_DETAILS[algo].description}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowAlgoDropdown(false)}
                    />
                  </>
                )}
              </div>
              
              <button
                onClick={handleNewGraph}
                disabled={isLoading}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                New Graph
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin text-blue-400" />
              ) : status.includes("✅") ? (
                <CheckCircle size={18} className="text-green-400" />
              ) : status.includes("❌") ? (
                <AlertCircle size={18} className="text-red-400" />
              ) : (
                <Info size={18} className="text-blue-400" />
              )}
              <p className="text-sm">{status}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/20 rounded-xl border border-gray-700/50 p-2 h-[500px] md:h-[550px]">
              <GraphCanvas
                graph={graph}
                visitedNodes={visitedNodes}
                exploringNodes={exploringNodes}
                pathNodes={pathNodes}
                frontierNodes={frontierNodes}
                currentNode={currentNode}
                distanceLabels={distanceLabels}
                algorithm={algorithm}
              />
            </div>

            {/* Data Structure Display */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {(algorithm === "BFS" || algorithm === "Dijkstra") && queue.length > 0 && (
                <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/50">
                  <h3 className="font-medium mb-2 text-blue-300">Queue</h3>
                  <div className="flex flex-wrap gap-2">
                    {queue.map((node, index) => (
                      <div 
                        key={`${node}-${index}`}
                        className={`px-3 py-2 rounded font-medium ${
                          index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {node}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {algorithm === "DFS" && stack.length > 0 && (
                <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/50">
                  <h3 className="font-medium mb-2 text-orange-300">Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {stack.map((node, index) => (
                      <div 
                        key={`${node}-${index}`}
                        className={`px-3 py-2 rounded font-medium ${
                          index === stack.length - 1 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {node}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {algorithm === "Dijkstra" && Object.keys(distanceLabels).length > 0 && (
                <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/50">
                  <h3 className="font-medium mb-2 text-green-300">Distances</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(distanceLabels)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([node, distance]) => (
                        <div 
                          key={node}
                          className={`p-2 rounded text-center ${
                            visitedNodes.has(Number(node))
                              ? 'bg-green-900/30 text-green-300'
                              : 'bg-gray-800 text-gray-300'
                          }`}
                        >
                          <div className="font-bold">{node}</div>
                          <div className="text-sm">
                            {distance === Infinity ? "∞" : distance}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Animation Controls */}
            <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/50">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Settings size={18} />
                Controls
              </h3>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={steps.length === 0}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    isPlaying 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  } disabled:opacity-50`}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Restart
                </button>
                
                <div className="flex gap-1">
                  <button
                    onClick={handleStepBackward}
                    disabled={currentStep === 0}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <SkipBack size={18} />
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={currentStep >= steps.length}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <SkipForward size={18} />
                  </button>
                </div>
              </div>

              {/* Speed Control */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Speed</span>
                  <span className="text-sm font-mono">{speed}ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-xs text-gray-400 mt-1">
                  Step {currentStep} of {steps.length}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/50">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <BarChart2 size={18} />
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-xl font-bold text-blue-400">{visitedNodes.size}</div>
                  <div className="text-xs text-gray-400">Visited</div>
                </div>
                <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-xl font-bold text-yellow-400">{exploringNodes.size}</div>
                  <div className="text-xs text-gray-400">Exploring</div>
                </div>
                <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-xl font-bold text-green-400">{pathNodes.size}</div>
                  <div className="text-xs text-gray-400">In Path</div>
                </div>
                <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-xl font-bold text-purple-400">{statistics.totalSteps}</div>
                  <div className="text-xs text-gray-400">Total Steps</div>
                </div>
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-700/50">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Info size={18} />
                Algorithm Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-900/30 rounded">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm">Time</span>
                  </div>
                  <div className="font-mono text-blue-300">{algoDetails.complexity}</div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-900/30 rounded">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-gray-400" />
                    <span className="text-sm">Space</span>
                  </div>
                  <div className="font-mono text-blue-300">{algoDetails.space}</div>
                </div>
                
                <div className="flex justify-between items-center p-2 bg-gray-900/30 rounded">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-gray-400" />
                    <span className="text-sm">Structure</span>
                  </div>
                  <div className="font-medium text-blue-300">{algoDetails.dataStructure}</div>
                </div>
                
                <div className="pt-3 border-t border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">Description</div>
                  <p className="text-sm text-gray-300">{algoDetails.description}</p>
                </div>
                
                <div className="pt-3 border-t border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">Current</div>
                  <p className="text-sm text-gray-300">
                    {currentNode !== null ? `Exploring node ${currentNode}` : "Ready"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>Graph: {Object.keys(graph).length} nodes, {Object.values(graph).reduce((acc, edges) => acc + edges.length, 0)} edges</p>
        </div>
      </div>
    </div>
  );
}