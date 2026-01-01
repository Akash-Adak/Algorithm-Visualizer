export default function BarGraph({ index, value, height, color, isActive, width, showArrow }) {
  const colorClasses = {
    blue: "bg-gradient-to-t from-blue-600 to-blue-500",
    green: "bg-gradient-to-t from-emerald-600 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    orange: "bg-gradient-to-t from-orange-600 to-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]",
    amber: "bg-gradient-to-t from-amber-600 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    purple: "bg-gradient-to-t from-purple-600 to-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    rose: "bg-gradient-to-t from-rose-600 to-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]",
    indigo: "bg-gradient-to-t from-indigo-600 to-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]",
  };

  return (
    <div
      className="relative transition-all duration-300 rounded-t-lg mx-0.5"
      style={{
        width: `calc(${width}% - 2px)`,
        height: `${height}px`,
      }}
    >
      <div className={`absolute inset-0 ${colorClasses[color]} rounded-t-lg`} />
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-400">
        {index}
      </div>
      
      {showArrow && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="text-2xl text-amber-400">↑</div>
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-black/80 text-white text-sm font-bold px-2 py-1 rounded">
          {value}
        </div>
      </div>
    </div>
  );
}