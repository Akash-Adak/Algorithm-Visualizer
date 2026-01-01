export default function StatsPanel({ stats }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700">
      <h2 className="text-lg font-semibold mb-4">Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-slate-900/50 rounded-xl">
          <div className="text-2xl font-bold text-cyan-400 mb-1">{stats.comparisonCount}</div>
          <div className="text-sm text-gray-400">Comparisons</div>
        </div>
        <div className="text-center p-4 bg-slate-900/50 rounded-xl">
          <div className="text-2xl font-bold text-orange-400 mb-1">{stats.swapCount}</div>
          <div className="text-sm text-gray-400">Swaps</div>
        </div>
        <div className="text-center p-4 bg-slate-900/50 rounded-xl">
          <div className="text-2xl font-bold text-blue-400 mb-1">{stats.stepIndex}</div>
          <div className="text-sm text-gray-400">Current Step</div>
        </div>
        <div className="text-center p-4 bg-slate-900/50 rounded-xl">
          <div className="text-2xl font-bold text-purple-400 mb-1">{stats.totalSteps}</div>
          <div className="text-sm text-gray-400">Total Steps</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="font-mono">{Math.round(stats.progress)}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}