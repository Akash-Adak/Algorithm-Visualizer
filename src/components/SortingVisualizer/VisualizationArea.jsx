import BarGraph from "../common/BarGraph";
import Legend from "../common/Legend";

const MAX_HEIGHT_DESKTOP = 280;
const MAX_HEIGHT_MOBILE = 200;

export default function VisualizationArea({
  visualArray,
  currentStep,
  stepIndex,
  steps
}) {
  const getBarState = (index) => {
    if (!currentStep) return { color: "blue", isActive: false };

    const { type, indices = [], sortedRange } = currentStep;
    const isActive = indices.includes(index);
    const isSorted =
      sortedRange &&
      index >= sortedRange[0] &&
      index <= sortedRange[1];

    if (isSorted) return { color: "green", isActive: true };

    if (isActive) {
      switch (type) {
        case "swap":
          return { color: "orange", isActive: true };
        case "compare":
          return { color: "amber", isActive: true };
        case "mergeMove":
          return { color: "purple", isActive: true };
        case "pivot":
          return { color: "rose", isActive: true };
        default:
          return { color: "purple", isActive: true };
      }
    }

    return { color: "blue", isActive: false };
  };

  const maxValue = Math.max(...visualArray, 1);
  const barWidth = 100 / visualArray.length;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-5 border border-slate-700 w-full">
      
      {/* ===== VISUAL AREA ===== */}
      <div className="relative bg-slate-900/50 rounded-xl p-3 sm:p-6">
        
        {/* VALUE LABELS (hide on very small screens) */}
        <div className="hidden sm:flex absolute -top-6 left-0 right-0 px-6">
          {visualArray.map((value, index) => (
            <div
              key={`label-${index}`}
              className="text-center text-[10px] sm:text-xs text-gray-500 font-mono truncate"
              style={{ width: `${barWidth}%` }}
            >
              {value}
            </div>
          ))}
        </div>

        {/* BARS */}
        <div
          className="
            flex items-end justify-center
            gap-[2px] sm:gap-1
            min-h-[220px] sm:min-h-[320px]
            max-h-[360px]
          "
        >
          {visualArray.map((value, index) => {
            const { color, isActive } = getBarState(index);

            const maxHeight =
              window.innerWidth < 640
                ? MAX_HEIGHT_MOBILE
                : MAX_HEIGHT_DESKTOP;

            const barHeight = (value / maxValue) * maxHeight;

            return (
              <BarGraph
                key={index}
                index={index}
                value={value}
                height={barHeight}
                color={color}
                isActive={isActive}
                width={barWidth}
                showArrow={isActive && visualArray.length <= 30}
              />
            );
          })}
        </div>
      </div>

      {/* ===== LEGEND ===== */}
      <div className="mt-4">
        <Legend />
      </div>
    </div>
  );
}
