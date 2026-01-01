import { Play, Pause, SkipForward, SkipBack, FastForward } from "lucide-react";
import StepDescription from "../common/StepDescription";

export default function ControlBar({
  isPlaying,
  setIsPlaying,
  onStepForward,
  onStepBackward,
  stepIndex,
  totalSteps,
  speed,
  setSpeed,
  showComparison,
  setShowComparison,
  currentStep,
  visualArray
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
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
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            onClick={() => setIsPlaying(false)}
          >
            Stop
          </button>
          
          <div className="flex items-center gap-1">
            <button
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
              onClick={onStepBackward}
              disabled={stepIndex === 0}
            >
              <SkipBack size={20} />
            </button>
            <button
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
              onClick={onStepForward}
              disabled={stepIndex >= totalSteps}
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FastForward size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Speed:</span>
            <input
              type="range"
              min="50"
              max="1000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded">
              {Math.round(1000 / speed)}x
            </span>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showComparison}
              onChange={(e) => setShowComparison(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors ${showComparison ? 'bg-cyan-600' : 'bg-slate-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${showComparison ? 'translate-x-5' : 'translate-x-1'} mt-0.5`} />
            </div>
            <span className="text-sm">Compare</span>
          </label>
        </div>
      </div>

      <StepDescription 
        currentStep={currentStep}
        visualArray={visualArray}
        showComparison={showComparison}
      />
    </div>
  );
}