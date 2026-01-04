import { useState } from "react";
import SortingVisualizer from "../SortingVisualizer";
import GraphVisualizer from "../GraphVisualizer";
import { ALGORITHM_TYPES } from "../../utils/algorithmFactory";
import { 
  Cpu, 
  GitBranch, 
  Sparkles, 
  Code2, 
  Zap, 
  TrendingUp,
  BookOpen,
  Grid3x3,
  ListOrdered
} from "lucide-react";

export default function AlgorithmVisualizer() {
  const [visualizerType, setVisualizerType] = useState(ALGORITHM_TYPES.SORTING);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        
        {/* Main Header */}
        <header className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg">
                  <Cpu className="text-cyan-400" size={28} />
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  Algorithm <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">Visualizer Pro</span>
                </h1>
              </div>
              <p className="text-gray-400 max-w-2xl">
                Interactive visualization tool for understanding algorithms through step-by-step execution
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <Sparkles size={16} className="text-yellow-400" />
                <span>Live Visualization</span>
              </div>
              <div className="h-4 w-px bg-gray-700"></div>
              <div className="flex items-center gap-2 px-3 py-1.5">
                <Code2 size={16} className="text-green-400" />
                <span>Real-time Code</span>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-1 border border-gray-700/50 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-1">
              <button
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  visualizerType === ALGORITHM_TYPES.SORTING
                    ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 shadow-lg shadow-blue-500/20'
                    : 'hover:bg-gray-700/50'
                }`}
                onClick={() => setVisualizerType(ALGORITHM_TYPES.SORTING)}
              >
                <div className={`p-2 rounded-lg ${
                  visualizerType === ALGORITHM_TYPES.SORTING 
                    ? 'bg-white/10' 
                    : 'bg-gray-700/50'
                }`}>
                  <ListOrdered size={22} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sorting</div>
                  <div className="text-xs text-gray-400">Array Algorithms</div>
                </div>
                {visualizerType === ALGORITHM_TYPES.SORTING && (
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  visualizerType === ALGORITHM_TYPES.GRAPH
                    ? 'bg-gradient-to-r from-emerald-600/90 to-green-600/90 shadow-lg shadow-green-500/20'
                    : 'hover:bg-gray-700/50'
                }`}
                onClick={() => setVisualizerType(ALGORITHM_TYPES.GRAPH)}
              >
                <div className={`p-2 rounded-lg ${
                  visualizerType === ALGORITHM_TYPES.GRAPH 
                    ? 'bg-white/10' 
                    : 'bg-gray-700/50'
                }`}>
                  <GitBranch size={22} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Graph</div>
                  <div className="text-xs text-gray-400">Network Algorithms</div>
                </div>
                {visualizerType === ALGORITHM_TYPES.GRAPH && (
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          {/* Active Mode Indicator */}
          <div className="px-6 py-3 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                visualizerType === ALGORITHM_TYPES.SORTING 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {visualizerType === ALGORITHM_TYPES.SORTING ? (
                  <ListOrdered size={20} />
                ) : (
                  <GitBranch size={20} />
                )}
              </div>
              <div>
                <h2 className="font-semibold">
                  {visualizerType === ALGORITHM_TYPES.SORTING ? 'Sorting Algorithms' : 'Graph Algorithms'}
                </h2>
                <p className="text-sm text-gray-400">
                  {visualizerType === ALGORITHM_TYPES.SORTING 
                    ? 'Visualize array sorting techniques' 
                    : 'Explore graph traversal and pathfinding'}
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
                <Zap size={16} className="text-yellow-400" />
                <span>Interactive</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
                <TrendingUp size={16} className="text-cyan-400" />
                <span>Step-by-step</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
                <BookOpen size={16} className="text-purple-400" />
                <span>Educational</span>
              </div>
            </div>
          </div>
          
          {/* Visualizer Component */}
          <div className="p-2 md:p-4 lg:p-6">
            {visualizerType === ALGORITHM_TYPES.SORTING ? (
              <SortingVisualizer />
            ) : (
              <GraphVisualizer />
            )}
          </div>
        </main>

        {/* Info Section */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Grid3x3 size={20} className="text-blue-400" />
              </div>
              <h3 className="font-semibold">What is Algorithm Visualization?</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A powerful educational tool that helps you understand how algorithms work by 
              showing their step-by-step execution with visual feedback and real-time statistics.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Sparkles size={20} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold">Learning Benefits</h3>
            </div>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Understand algorithmic thinking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Compare algorithm performance
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Debug and optimize algorithms
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Code2 size={20} className="text-purple-400" />
              </div>
              <h3 className="font-semibold">Features</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-800/50 text-xs rounded-full text-gray-300">Step Control</span>
              <span className="px-3 py-1 bg-gray-800/50 text-xs rounded-full text-gray-300">Speed Adjustment</span>
              <span className="px-3 py-1 bg-gray-800/50 text-xs rounded-full text-gray-300">Real-time Stats</span>
              <span className="px-3 py-1 bg-gray-800/50 text-xs rounded-full text-gray-300">Multiple Algorithms</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              <p>Algorithm Visualizer Pro • Interactive Learning Tool</p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  visualizerType === ALGORITHM_TYPES.SORTING ? 'bg-blue-500' : 'bg-emerald-500'
                }`}></div>
                <span>
                  {visualizerType === ALGORITHM_TYPES.SORTING 
                    ? 'Sorting Mode Active' 
                    : 'Graph Mode Active'}
                </span>
              </div>
              
              <div className="hidden md:block h-4 w-px bg-gray-700"></div>
              
              <div>
                <span className="text-gray-500">Made with </span>
                <span className="text-red-400">♥</span>
                <span className="text-gray-500"> for learning</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}