// components/GraphVisualizer/AlgorithmSelector.jsx
import { useState } from "react";
import { ChevronDown, Search, Filter } from "lucide-react";

export default function AlgorithmSelector({ 
  selectedAlgorithm, 
  onAlgorithmChange,
  algorithms 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlgorithms = Object.entries(algorithms).filter(([name, details]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    details.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentAlgo = algorithms[selectedAlgorithm] || algorithms.BFS;

  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        {/* Current selection display */}
        <div 
          className={`p-4 rounded-xl ${currentAlgo.bgColor} border ${currentAlgo.borderColor} cursor-pointer transition-all duration-300 hover:opacity-90`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl">{currentAlgo.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{selectedAlgorithm}</h3>
                <p className="text-sm opacity-80 mt-1">{currentAlgo.description}</p>
              </div>
            </div>
            <ChevronDown 
              size={24} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Algorithm grid when open */}
        {isOpen && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Algorithm grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {filteredAlgorithms.map(([name, details]) => (
                <button
                  key={name}
                  onClick={() => {
                    onAlgorithmChange(name);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                    selectedAlgorithm === name
                      ? `${details.bgColor} ${details.borderColor} ring-2 ring-offset-2 ring-offset-gray-900 ring-opacity-50`
                      : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="text-2xl mb-2">{details.icon}</div>
                    <div className="font-bold text-sm mb-1">{name}</div>
                    <div className={`text-xs ${details.color} font-medium mb-1`}>
                      {details.complexity}
                    </div>
                    <div className="text-xs text-gray-400 truncate w-full">
                      {details.dataStructure}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredAlgorithms.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Filter size={32} className="mx-auto mb-2 opacity-50" />
                <p>No algorithms found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}