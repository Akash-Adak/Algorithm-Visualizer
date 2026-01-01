// components/GraphVisualizer/GraphControls.jsx
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Settings } from "lucide-react";

export default function GraphControls({
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  onGenerateGraph,
  currentStep,
  totalSteps,
  visitedCount,
  exploringCount,
  onSpeedChange,
  onStepForward,
  onStepBackward
}) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Settings size={20} />
        Controls
      </h3>
      
      {/* Play/Pause Controls */}
      <div className="flex gap-2 mb-6">
        <button
          className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isPlaying 
              ? 'bg-amber-600 hover:bg-amber-700' 
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          onClick={onStepBackward}
          disabled={currentStep === 0}
        >
          <SkipBack size={20} />
        </button>
        
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps}
        >
          <SkipForward size={20} />
        </button>
      </div>
      
      {/* Speed Control */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">
          Animation Speed
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs">Slow</span>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs">Fast</span>
          <span className="text-sm font-mono bg-gray-900 px-2 py-1 rounded">
            {speed}ms
          </span>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>
            {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ 
              width: totalSteps > 0 ? `${(currentStep / totalSteps) * 100}%` : '0%' 
            }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Visited Nodes:</span>
          <span className="font-mono text-blue-400">{visitedCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Exploring:</span>
          <span className="font-mono text-yellow-400">{exploringCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Current Step:</span>
          <span className="font-mono">{currentStep}</span>
        </div>
      </div>
      
      {/* Graph Controls */}
      <div className="space-y-3">
        <button
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          onClick={onGenerateGraph}
        >
          <RefreshCw size={18} />
          Generate New Graph
        </button>
        
        <button
          className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          onClick={() => {
            setIsPlaying(false);
            // Reset to step 0
          }}
        >
          Reset Visualization
        </button>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Instructions:</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Click nodes to select start/end points</li>
          <li>• Watch BFS explore nodes level by level</li>
          <li>• Blue nodes are visited</li>
          <li>• Yellow nodes are currently exploring</li>
          <li>• Green path shows shortest route</li>
        </ul>
      </div>
    </div>
  );
}