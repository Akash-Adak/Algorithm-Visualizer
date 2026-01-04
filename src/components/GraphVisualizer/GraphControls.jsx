import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RefreshCw,
  RotateCcw,
  Settings
} from "lucide-react";

export default function GraphControls({
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  onGenerateGraph,
  onReset,
  currentStep,
  totalSteps,
  visitedCount = 0,
  exploringCount = 0,
  onStepForward,
  onStepBackward,
  algorithm
}) {
  const isAtStart = currentStep <= 0;
  const isAtEnd = currentStep >= totalSteps;

  return (
    <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700 space-y-6">
      {/* Header */}
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Settings size={20} />
        Controls
      </h3>

      {/* ▶ Play / Pause / Step */}
      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isPlaying
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
          onClick={() => setIsPlaying(prev => !prev)}
          disabled={isAtEnd}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-40"
          onClick={onStepBackward}
          disabled={isAtStart}
          title="Step backward"
        >
          <SkipBack size={18} />
        </button>

        <button
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-40"
          onClick={onStepForward}
          disabled={isAtEnd}
          title="Step forward"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* ⚡ Speed */}
      {/* <div>
        <label className="block text-sm text-gray-400 mb-2">
          Animation Speed
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400"></span>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-400">Slow</span>
          <span className="text-sm font-mono bg-gray-900 px-2 py-1 rounded">
            {speed} ms
          </span>
        </div>
      </div> */}

      {/* 📊 Progress */}
      <div>
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
              width:
                totalSteps > 0
                  ? `${(currentStep / totalSteps) * 100}%`
                  : "0%"
            }}
          />
        </div>
      </div>

      {/* 📈 Stats */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Visited Nodes</span>
          <span className="font-mono text-blue-400">{visitedCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Exploring</span>
          <span className="font-mono text-yellow-400">{exploringCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Current Step</span>
          <span className="font-mono">{currentStep}</span>
        </div>
      </div>

      {/* 🔄 Graph Actions */}
      <div className="space-y-3">
        <button
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          onClick={onGenerateGraph}
        >
          <RefreshCw size={18} />
          Generate New Graph
        </button>

        <button
          className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          onClick={() => {
            setIsPlaying(false);
            onReset?.();
          }}
        >
          <RotateCcw size={18} />
          Reset Visualization
        </button>
      </div>

      {/* ℹ Instructions */}
      <div className="pt-4 border-t border-gray-700">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          How it works
        </h4>
        <ul className="text-xs text-gray-400 space-y-1 leading-relaxed">
          <li>• Play runs the algorithm automatically</li>
          <li>• Step buttons move one operation at a time</li>
          <li>• Colors indicate algorithm state</li>
          <li>
            • Visualization adapts to <span className="text-gray-300">{algorithm}</span>
          </li>
          <li>• Reset returns to the initial state</li>
        </ul>
      </div>
    </div>
  );
}
