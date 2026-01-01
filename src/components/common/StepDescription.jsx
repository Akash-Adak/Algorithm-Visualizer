export default function StepDescription({ currentStep, visualArray, showComparison }) {
  if (!currentStep) {
    return (
      <div className="bg-slate-900/70 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-slate-700 text-gray-300">📊</div>
          <div>
            <h3 className="font-medium">Ready</h3>
            <p className="text-lg text-cyan-300 mt-1">Click Play to start visualization</p>
          </div>
        </div>
      </div>
    );
  }

  const { type, indices = [], description } = currentStep;

  const getIcon = () => {
    switch (type) {
      case 'compare': return '🔍';
      case 'swap': return '🔄';
      case 'mergeMove': return '🔀';
      case 'divide': return '✂️';
      case 'pivot': return '🎯';
      default: return '📊';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'compare': return 'bg-blue-900/30 text-blue-300';
      case 'swap': return 'bg-orange-900/30 text-orange-300';
      case 'mergeMove': return 'bg-purple-900/30 text-purple-300';
      default: return 'bg-slate-700 text-gray-300';
    }
  };

  return (
    <div className="bg-slate-900/70 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${getBgColor()}`}>
          {getIcon()}
        </div>
        <div>
          <h3 className="font-medium">Current Operation</h3>
          <p className="text-lg text-cyan-300 mt-1">{description}</p>
        </div>
      </div>
      
      {showComparison && type === 'compare' && indices.length >= 2 && (
        <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/50">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">{visualArray[indices[0]]}</div>
              <div className="text-sm text-gray-400">Index {indices[0]}</div>
            </div>
            <div className="text-3xl text-amber-400">
              {visualArray[indices[0]] > visualArray[indices[1]] ? ">" : "<="}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">{visualArray[indices[1]]}</div>
              <div className="text-sm text-gray-400">Index {indices[1]}</div>
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-400">
            {visualArray[indices[0]] > visualArray[indices[1]] 
              ? "Will swap in next step" 
              : "No swap needed"}
          </div>
        </div>
      )}
    </div>
  );
}