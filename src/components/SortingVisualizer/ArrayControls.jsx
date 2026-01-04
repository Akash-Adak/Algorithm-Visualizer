import { RefreshCw } from "lucide-react";

export default function ArrayControls({
  inputArray,
  setInputArray,
  onApply,
  onReset
}) {
  const handleApply = () => {
    const arr = inputArray
      .split(",")
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n));

    if (arr.length > 1) {
      onApply(arr);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-slate-700 w-full">
      
      {/* Header */}
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        Array Controls
      </h2>

      <div className="space-y-4">
        
        {/* Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Custom Array
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="e.g. 34, 12, 78, 45, 23"
              className="
                w-full px-3 py-2.5
                rounded-lg bg-slate-900 border border-slate-700
                text-sm sm:text-base
                focus:outline-none focus:border-cyan-500
                focus:ring-2 focus:ring-cyan-500/20
              "
            />

            <button
              onClick={handleApply}
              className="
                w-full sm:w-auto
                px-4 py-2.5
                bg-purple-600 hover:bg-purple-700
                rounded-lg font-medium
                transition-colors
              "
            >
              Apply
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Enter numbers separated by commas
          </p>
        </div>

        {/* Generate */}
        <button
          onClick={onReset}
          className="
            w-full px-4 py-3
            bg-gradient-to-r from-blue-600 to-cyan-600
            hover:from-blue-700 hover:to-cyan-700
            rounded-lg font-medium
            transition-all
            flex items-center justify-center gap-2
            text-sm sm:text-base
          "
        >
          <RefreshCw size={18} />
          Generate New Array
        </button>
      </div>
    </div>
  );
}
