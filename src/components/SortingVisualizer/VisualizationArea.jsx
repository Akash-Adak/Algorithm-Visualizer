import BarGraph from "../common/BarGraph";
import Legend from "../common/Legend";

const MAX_HEIGHT = 280;

export default function VisualizationArea({ visualArray, currentStep, stepIndex, steps }) {
  const getBarState = (index) => {
    if (!currentStep) return { color: "blue", isActive: false };
    
    const { type, indices = [], sortedRange } = currentStep;
    const isActive = indices.includes(index);
    const isSorted = sortedRange && index >= sortedRange[0] && index <= sortedRange[1];
    
    if (isSorted) return { color: "green", isActive: true };
    if (isActive) {
      switch (type) {
        case 'swap': return { color: "orange", isActive: true };
        case 'compare': return { color: "amber", isActive: true };
        case 'mergeMove': return { color: "purple", isActive: true };
        case 'pivot': return { color: "rose", isActive: true };
        default: return { color: "purple", isActive: true };
      }
    }
    
    return { color: "blue", isActive: false };
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700">
      <div className="flex items-end h-[320px] bg-slate-900/50 rounded-xl p-6 relative">
        {/* Value Labels */}
        <div className="absolute -top-8 left-0 right-0 flex px-6">
          {visualArray.map((value, index) => (
            <div 
              key={`label-${index}`}
              className="text-center text-xs text-gray-500 font-mono"
              style={{ width: `${100 / visualArray.length}%` }}
            >
              {value}
            </div>
          ))}
        </div>

        {/* Bars */}
        {visualArray.map((value, index) => {
          const { color, isActive } = getBarState(index);
          const barHeight = (value / Math.max(...visualArray)) * MAX_HEIGHT;
          
          return (
            <BarGraph
              key={index}
              index={index}
              value={value}
              height={barHeight}
              color={color}
              isActive={isActive}
              width={100 / visualArray.length}
              showArrow={isActive}
            />
          );
        })}
      </div>

      <Legend />
    </div>
  );
}