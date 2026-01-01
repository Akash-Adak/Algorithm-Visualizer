export default function Legend() {
  const items = [
    { color: "from-blue-600 to-blue-500", label: "Unsorted" },
    { color: "from-emerald-600 to-emerald-500", label: "Sorted" },
    { color: "from-amber-600 to-amber-500", label: "Comparing" },
    { color: "from-orange-600 to-orange-500", label: "Swapping" },
    { color: "from-purple-600 to-purple-500", label: "Merging" },
    { color: "from-rose-600 to-rose-500", label: "Pivot" },
    { color: "from-indigo-600 to-indigo-500", label: "Dividing" },
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-6 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`w-4 h-4 bg-gradient-to-t ${item.color} rounded`}></div>
          <span className="text-gray-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}