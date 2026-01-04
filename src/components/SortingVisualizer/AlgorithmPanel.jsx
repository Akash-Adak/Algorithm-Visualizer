import { Zap } from "lucide-react";
import { getAlgorithmNames } from "../../utils/algorithmFactory";

export default function AlgorithmPanel({
  algorithm,
  setAlgorithm,
  algorithmInfo
}) {
  const sortingAlgorithms = getAlgorithmNames();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-slate-700 w-full">
      
      {/* Header */}
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
        <Zap className="text-cyan-400 shrink-0" size={18} />
        <span>Algorithm Settings</span>
      </h2>

      {/* Select */}
      <label className="block text-sm text-gray-400 mb-1">
        Select Algorithm
      </label>
      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        className="
          w-full px-3 sm:px-4 py-2.5 sm:py-3
          rounded-lg bg-slate-900 border border-slate-700
          text-sm sm:text-base
          focus:outline-none focus:border-cyan-500
          focus:ring-2 focus:ring-cyan-500/20
          mb-4
        "
      >
        {sortingAlgorithms.map((algo) => (
          <option key={algo} value={algo}>
            {algo} Sort
          </option>
        ))}
      </select>

      {/* Info */}
      <div className="space-y-3 text-sm sm:text-base">
        
        {/* Time */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-gray-400">Time Complexity</span>
          <span className="font-mono text-cyan-300 px-2.5 py-1 bg-slate-900 rounded">
            {algorithmInfo.time}
          </span>
        </div>

        {/* Space */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-gray-400">Space Complexity</span>
          <span className="font-mono text-cyan-300 px-2.5 py-1 bg-slate-900 rounded">
            {algorithmInfo.space}
          </span>
        </div>

        {/* Description */}
        <div className="pt-3 border-t border-slate-700">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
            {algorithmInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
}
