import { RefreshCw } from "lucide-react";

export default function ArrayControls({ inputArray, setInputArray, onApply, onReset }) {
  const handleApply = () => {
    const arr = inputArray
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    if (arr.length > 1) {
      onApply(arr);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700">
      <h2 className="text-lg font-semibold mb-4">Array Controls</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Custom Array</label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700"
              placeholder="e.g., 34, 12, 78, 45, 23"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter numbers separated by commas</p>
        </div>
        
        <button
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          onClick={onReset}
        >
          <RefreshCw size={18} />
          Generate New Array
        </button>
      </div>
    </div>
  );
}