import { GitCompare } from "lucide-react";

export default function ArrayDisplay({
  visualArray,
  currentStep,
  stepIndex,
  totalSteps
}) {
  const getCellStyle = (index) => {
    if (!currentStep) return "bg-slate-800 text-gray-300";

    const { type, indices = [], sortedRange } = currentStep;
    const isActive = indices.includes(index);
    const isSorted =
      sortedRange &&
      index >= sortedRange[0] &&
      index <= sortedRange[1];

    if (isSorted)
      return "bg-emerald-900/50 text-emerald-300 border border-emerald-800";

    if (isActive) {
      return type === "swap"
        ? "bg-orange-900/50 text-orange-300 border border-orange-800"
        : "bg-amber-900/50 text-amber-300 border border-amber-800";
    }

    return "bg-slate-800 text-gray-300";
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-5 border border-slate-700 w-full">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <GitCompare size={18} />
          Current Array State
        </h3>
        <div className="text-xs sm:text-sm text-gray-400">
          Step {stepIndex} of {totalSteps}
        </div>
      </div>

      {/* ===== ARRAY DISPLAY ===== */}
      <div className="font-mono text-xs sm:text-sm bg-slate-900/50 p-3 sm:p-4 rounded-lg overflow-x-auto">
        <div className="flex flex-wrap gap-2 min-w-max">
          {visualArray.map((value, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${getCellStyle(
                index
              )}`}
            >
              <div className="text-center">
                <div className="font-bold">{value}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">
                  [{index}]
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
