import { useState } from "react";
import SortingVisualizer from "../SortingVisualizer";
import GraphVisualizer from "../GraphVisualizer";
import { ALGORITHM_TYPES } from "../../utils/algorithmFactory";
import { Cpu, GitBranch, ListOrdered } from "lucide-react";

export default function AlgorithmVisualizer() {
  const [activeTab, setActiveTab] = useState(ALGORITHM_TYPES.SORTING);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Cpu className="text-cyan-400" size={22} />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap">
              Algorithm{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Visualizer
              </span>
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-800/70 rounded-xl p-1 border border-gray-700 shadow-inner">
            <HeaderTab
              active={activeTab === ALGORITHM_TYPES.SORTING}
              icon={ListOrdered}
              label="Sorting"
              onClick={() => setActiveTab(ALGORITHM_TYPES.SORTING)}
            />
            <HeaderTab
              active={activeTab === ALGORITHM_TYPES.GRAPH}
              icon={GitBranch}
              label="Graph"
              onClick={() => setActiveTab(ALGORITHM_TYPES.GRAPH)}
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN SCROLL AREA ================= */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative w-full">

          {/* SLIDE CONTAINER */}
          <div
            className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
              activeTab === ALGORITHM_TYPES.SORTING
                ? "translate-x-0"
                : "-translate-x-1/2"
            }`}
          >
            {/* Sorting Page */}
            <section className="w-1/2 min-h-full px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4">
              <SortingVisualizer />
            </section>

            {/* Graph Page */}
            <section className="w-1/2 min-h-full px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4">
              <GraphVisualizer />
            </section>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-800 py-2 sm:py-3 text-center text-xs sm:text-sm text-gray-500">
        Built for learning • Responsive Algorithm Visualization
      </footer>
    </div>
  );
}

/* ================= HEADER TAB (RESPONSIVE) ================= */

function HeaderTab({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-blue-600 shadow text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
      }`}
    >
      <Icon size={18} />

      {/* Hide text on very small screens */}
      <span className="hidden xs:inline sm:inline">
        {label}
      </span>
    </button>
  );
}
