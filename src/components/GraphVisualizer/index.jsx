// components/GraphVisualizer/index.jsx
import { useState, useEffect, useCallback } from "react";
import GraphCanvas from "./GraphCanvas";
import { Play, Pause, SkipForward, SkipBack, RefreshCw, FastForward, BarChart2, GitMerge } from "lucide-react";
import { generateRandomGraph } from "../../utils/graphGenerator";
import { bfs } from "../../algorithms/graph/bfs";
import { dfs } from "../../algorithms/graph/dfs";
import { dijkstra } from "../../algorithms/graph/dijkstra";
import { algorithms } from "../../algorithms";
export default function GraphVisualizer() {
  const [graph, setGraph] = useState(() => generateRandomGraph(8, 0.4));
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [algorithm, setAlgorithm] = useState("BFS");
  
  // Visualization states
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [exploringNodes, setExploringNodes] = useState(new Set());
  const [pathNodes, setPathNodes] = useState(new Set());
  const [frontierNodes, setFrontierNodes] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [distanceLabels, setDistanceLabels] = useState({});
  const [queue, setQueue] = useState([]);
  const [stack, setStack] = useState([]);
  
  const [status, setStatus] = useState("Ready to visualize");
  const [statistics, setStatistics] = useState({
    totalSteps: 0,
    visited: 0,
    comparisons: 0,
    operations: 0
  });

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
    const nodeCount = Math.floor(Math.random() * 7) + 6; // 6-12 nodes
    setGraph(generateRandomGraph(nodeCount, 0.4));
    resetVisualization();
    setStatus(`🎯 New graph with ${nodeCount} nodes generated`);
  }, [resetVisualization]);

  // Prepare algorithm
const prepareAlgorithm = useCallback(() => {
  resetVisualization();
  
  let algorithmSteps;
  let stats = { comparisons: 0, operations: 0 };
  
  switch (algorithm) {
    case "BFS":
      algorithmSteps =algorithms.BFS(graph, 0);
      break;
    case "DFS":
      algorithmSteps = algorithms.DFS(graph, 0);
      break;
    case "Dijkstra":
      algorithmSteps = algorithms.Dijkstra(graph, 0);
      break;
    case "BellmanFord":
      algorithmSteps = algorithms.BellmanFord(graph, 0);
      break;
    case "Topological":
      algorithmSteps = algorithms.TopologicalSort(graph);
      break;
    case "Prim":
      algorithmSteps = algorithms.Prim(graph, 0);
      break;
    case "Kruskal":
      algorithmSteps = algorithms.Kruskal(graph);
      break;
    case "FloydWarshall":
      algorithmSteps = algorithms.FloydWarshall(graph);
      break;
    case "AStar":
      // For A*, use first and last nodes as start/end
      const nodes = Object.keys(graph).map(Number);
      algorithmSteps = algorithms.AStar(graph, 0, nodes[nodes.length - 1]);
      break;
    case "TSP":
      algorithmSteps = algorithms.Tsp(graph, 0);
      break;
    default:
      algorithmSteps = bfs(graph, 0);
  }
  
  stats.comparisons = algorithmSteps.filter(step => step.type === "compare" || step.type === "consider").length;
  stats.operations = algorithmSteps.length;
  
  setSteps(algorithmSteps);
  setStatistics(prev => ({
    ...prev,
    totalSteps: algorithmSteps.length,
    comparisons: stats.comparisons,
    operations: stats.operations
  }));
  setStatus(`✅ Prepared ${algorithm}. Click Play ▶️ to start visualization.`);
}, [graph, algorithm, resetVisualization]);

  // Animation
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length || steps.length === 0) {
      if (currentStep >= steps.length && steps.length > 0) {
        setIsPlaying(false);
        setStatus("🏁 Algorithm completed! All nodes explored.");
      }
      return;
    }

    const timer = setTimeout(() => {
      const step = steps[currentStep];
      
      // Update visualization states based on step type
      if (step.visited) setVisitedNodes(step.visited);
      if (step.frontier) setFrontierNodes(step.frontier);
      if (step.current) setCurrentNode(step.current);
      if (step.exploring) setExploringNodes(new Set([step.exploring]));
      if (step.distances) setDistanceLabels(step.distances);
      if (step.path) setPathNodes(new Set(step.path));
      if (step.queue) setQueue(step.queue);
      if (step.stack) setStack(step.stack);
      
      // Update description
      if (step.description) setStatus(step.description);
      
      // Update statistics
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
    resetVisualization();
    setStatus(`📊 Selected ${algo}. Click "Prepare ${algo}" to generate steps.`);
  }, [resetVisualization]);

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

  // Get algorithm details
const getAlgorithmDetails = () => {
  const details = {
    BFS: {
      complexity: "O(V + E)",
      space: "O(V)",
      description: "Explores all neighbors at current depth before moving deeper. Ideal for finding shortest paths in unweighted graphs.",
      dataStructure: "Queue (FIFO)"
    },
    DFS: {
      complexity: "O(V + E)",
      space: "O(V)",
      description: "Explores as far as possible along each branch before backtracking. Good for topology sorting, cycle detection.",
      dataStructure: "Stack (LIFO)"
    },
    Dijkstra: {
      complexity: "O(E log V)",
      space: "O(V)",
      description: "Finds shortest paths from source to all vertices in weighted graphs with non-negative edges.",
      dataStructure: "Priority Queue"
    },
    BellmanFord: {
      complexity: "O(VE)",
      space: "O(V)",
      description: "Finds shortest paths in weighted graphs with negative edges. Can detect negative cycles.",
      dataStructure: "Array"
    },
    Topological: {
      complexity: "O(V + E)",
      space: "O(V)",
      description: "Linear ordering of vertices in DAG such that for every directed edge u→v, u comes before v.",
      dataStructure: "Queue + Stack"
    },
    Prim: {
      complexity: "O(E log V)",
      space: "O(V)",
      description: "Finds Minimum Spanning Tree (MST) by growing tree from starting node.",
      dataStructure: "Priority Queue"
    },
    Kruskal: {
      complexity: "O(E log E)",
      space: "O(V)",
      description: "Finds MST by sorting edges and adding them without forming cycles.",
      dataStructure: "Union-Find"
    },
    FloydWarshall: {
      complexity: "O(V³)",
      space: "O(V²)",
      description: "Finds shortest paths between all pairs of vertices. Works with negative edges (no negative cycles).",
      dataStructure: "Adjacency Matrix"
    },
    AStar: {
      complexity: "O(E)",
      space: "O(V)",
      description: "Best-first search using heuristics to find shortest path to goal. More efficient than Dijkstra.",
      dataStructure: "Priority Queue"
    },
    TSP: {
      complexity: "O(n²2ⁿ)",
      space: "O(n2ⁿ)",
      description: "Finds shortest Hamiltonian cycle visiting all cities exactly once (NP-hard problem).",
      dataStructure: "DP Table"
    }
  };
  return details[algorithm] || details.BFS;
};

  const algoDetails = getAlgorithmDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitMerge className="text-blue-400" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Graph Algorithm Visualizer
            </h1>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-300 text-lg">{status}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span>Nodes: {Object.keys(graph).length}</span>
                <span>•</span>
                <span>Edges: {Object.values(graph).reduce((sum, edges) => sum + edges.length, 0) / 2}</span>
                <span>•</span>
                <span>Step: {currentStep}/{steps.length}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select 
                className="bg-gray-800/70 border border-gray-700 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                value={algorithm}
                onChange={(e) => handleAlgorithmChange(e.target.value)}
              >
                 <option value="BFS">Breadth-First Search</option>
                <option value="DFS">Depth-First Search</option>
                <option value="Dijkstra">Dijkstra's Algorithm</option>
                <option value="BellmanFord">Bellman-Ford Algorithm</option>
                <option value="Topological">Topological Sort</option>
                <option value="Prim">Prim's MST</option>
                <option value="Kruskal">Kruskal's MST</option>
                <option value="FloydWarshall">Floyd-Warshall</option>
                <option value="AStar">A* Search</option>
                <option value="TSP">Traveling Salesman</option>
              </select>
              
              <button
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={prepareAlgorithm}
                disabled={isPlaying}
              >
                <BarChart2 size={18} />
                Prepare {algorithm}
              </button>
              
              <button
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all flex items-center gap-2"
                onClick={handleNewGraph}
                disabled={isPlaying}
              >
                <RefreshCw size={18} />
                New Graph
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 h-[500px] md:h-[550px] lg:h-[600px]">
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
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <h3 className="font-medium mb-3 text-blue-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Queue (Frontier)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {queue.map((node, index) => (
                      <div 
                        key={`${node}-${index}`}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                          index === 0 
                            ? 'bg-blue-600 text-white scale-105' 
                            : 'bg-gray-700/70 text-gray-300'
                        }`}
                      >
                        {node}
                        {index === 0 && <span className="ml-2 text-xs">← Next</span>}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    {queue.length === 0 ? "Queue is empty" : `${queue.length} nodes in queue`}
                  </div>
                </div>
              )}

              {algorithm === "DFS" && stack.length > 0 && (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <h3 className="font-medium mb-3 text-orange-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Stack (DFS)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stack.map((node, index) => (
                      <div 
                        key={`${node}-${index}`}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                          index === stack.length - 1 
                            ? 'bg-orange-600 text-white scale-105' 
                            : 'bg-gray-700/70 text-gray-300'
                        }`}
                      >
                        {node}
                        {index === stack.length - 1 && <span className="ml-2 text-xs">← Top</span>}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    {stack.length === 0 ? "Stack is empty" : `${stack.length} nodes in stack`}
                  </div>
                </div>
              )}

              {/* Distance Labels for Dijkstra */}
              {algorithm === "Dijkstra" && Object.keys(distanceLabels).length > 0 && (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <h3 className="font-medium mb-3 text-green-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Shortest Distances
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Object.entries(distanceLabels)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([node, distance]) => (
                        <div 
                          key={node}
                          className={`p-2 rounded text-center ${
                            distance === Infinity 
                              ? 'bg-gray-700/50 text-gray-400' 
                              : visitedNodes.has(Number(node))
                              ? 'bg-green-900/30 text-green-300 border border-green-800/50'
                              : 'bg-gray-800/50 text-gray-300'
                          }`}
                        >
                          <div className="font-bold">{node}</div>
                          <div className="text-xs">
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
          <div className="space-y-6">
            {/* Control Buttons */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-4">Animation Controls</h3>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isPlaying 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  onClick={handleRestart}
                >
                  Restart
                </button>
                
                <div className="flex gap-1">
                  <button
                    className="p-3 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    onClick={handleStepBackward}
                    disabled={currentStep === 0}
                  >
                    <SkipBack size={20} />
                  </button>
                  <button
                    className="p-3 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    onClick={handleStepForward}
                    disabled={currentStep >= steps.length}
                  >
                    <SkipForward size={20} />
                  </button>
                </div>
              </div>

              {/* Speed Control */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 flex items-center gap-2">
                    <FastForward size={16} />
                    Speed
                  </span>
                  <span className="text-sm font-mono bg-gray-900 px-2 py-1 rounded">
                    {speed}ms
                  </span>
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
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-sm text-gray-400 mt-1">
                  Step {currentStep} of {steps.length}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{visitedNodes.size}</div>
                  <div className="text-sm text-gray-400">Visited Nodes</div>
                </div>
                <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{exploringNodes.size}</div>
                  <div className="text-sm text-gray-400">Exploring</div>
                </div>
                <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">{pathNodes.size}</div>
                  <div className="text-sm text-gray-400">In Path</div>
                </div>
                <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{statistics.totalSteps}</div>
                  <div className="text-sm text-gray-400">Total Steps</div>
                </div>
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-4">Algorithm Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Time Complexity</div>
                  <div className="font-mono text-lg text-cyan-300">{algoDetails.complexity}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Space Complexity</div>
                  <div className="font-mono text-lg text-cyan-300">{algoDetails.space}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Data Structure</div>
                  <div className="font-medium text-blue-300">{algoDetails.dataStructure}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Description</div>
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {algoDetails.description}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-700/50">
                  <div className="text-gray-400 text-sm mb-2">Current Operation:</div>
                  <div className="text-gray-300 text-sm">
                    {currentNode !== null ? `Exploring node ${currentNode}` : "Waiting to start..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800/50 text-center text-gray-500 text-sm">
          <p>Click on nodes to see details. Use controls to visualize step by step.</p>
        </div>
      </div>
    </div>
  );
}