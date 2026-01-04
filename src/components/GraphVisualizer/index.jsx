import { useState, useEffect, useCallback } from "react";
import GraphCanvas from "./GraphCanvas";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RefreshCw,
  Info,
  Zap,
  CheckCircle,
  Clock,
  Settings
} from "lucide-react";
import { generateRandomGraph } from "../../utils/graphGenerator";
import { algorithms } from "../../algorithms";

/* ================= ALGORITHM META ================= */

const ALGORITHMS = {
  BFS: {
    time: "O(V + E)",
    space: "O(V)",
    desc: "Level-order traversal using a queue",
    resultType: "order"
  },
  DFS: {
    time: "O(V + E)",
    space: "O(V)",
    desc: "Depth-first traversal using recursion/stack",
    resultType: "order"
  },
  Dijkstra: {
    time: "O(E log V)",
    space: "O(V)",
    desc: "Shortest path with non-negative weights",
    resultType: "distance"
  },
  BellmanFord: {
    time: "O(VE)",
    space: "O(V)",
    desc: "Shortest path with negative weights",
    resultType: "distance"
  },
  AStar: {
    time: "O(E)",
    space: "O(V)",
    desc: "Heuristic-based shortest path",
    resultType: "path"
  },
  FloydWarshall: {
    time: "O(V³)",
    space: "O(V²)",
    desc: "All-pairs shortest paths",
    resultType: "matrix"
  },
  Prim: {
    time: "O(E log V)",
    space: "O(V)",
    desc: "Minimum Spanning Tree (greedy)",
    resultType: "edges"
  },
  Kruskal: {
    time: "O(E log E)",
    space: "O(V)",
    desc: "MST using Union-Find",
    resultType: "edges"
  }
};

export default function GraphVisualizer() {
  /* ================= CORE STATE ================= */

  const [graph, setGraph] = useState(() => generateRandomGraph(8, 0.4));
  const [algorithm, setAlgorithm] = useState("BFS");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [status, setStatus] = useState("Ready");

  /* ================= VISUAL STATE ================= */

  const [visited, setVisited] = useState(new Set());
  const [frontier, setFrontier] = useState(new Set());
  const [path, setPath] = useState(new Set());
  const [current, setCurrent] = useState(null);
  const [distances, setDistances] = useState({});

  /* ================= RESULT ================= */

  const [result, setResult] = useState(null);

  /* ================= RESET ================= */

  const reset = useCallback(() => {
    setVisited(new Set());
    setFrontier(new Set());
    setPath(new Set());
    setCurrent(null);
    setDistances({});
    setStepIndex(0);
    setIsPlaying(false);
    setResult(null);
  }, []);

  /* ================= PREPARE ================= */

  useEffect(() => {
    reset();
    const start = Number(Object.keys(graph)[0]);
    const fn = algorithms[algorithm];
    if (fn) {
      const s = fn(graph, start) || [];
      setSteps(s);
      setStatus(`${algorithm} ready (${s.length} steps)`);
    }
  }, [algorithm, graph, reset]);

  /* ================= PLAY ================= */

  useEffect(() => {
    if (!isPlaying || stepIndex >= steps.length) {
      if (stepIndex >= steps.length && steps.length) {
        setIsPlaying(false);
        setStatus("Completed");

        setResult({
          visited: Array.from(visited),
          distances,
          path: Array.from(path)
        });
      }
      return;
    }

    const t = setTimeout(() => {
      const s = steps[stepIndex];
      if (!s) return;

      if (s.visited) setVisited(new Set(s.visited));
      if (s.frontier) setFrontier(new Set(s.frontier));
      if (s.path) setPath(new Set(s.path));
      if (s.current !== undefined) setCurrent(s.current);
      if (s.distances) setDistances(s.distances);
      if (s.description) setStatus(s.description);

      setStepIndex(i => i + 1);
    }, speed);

    return () => clearTimeout(t);
  }, [isPlaying, stepIndex, steps, speed, visited, distances, path]);

  const meta = ALGORITHMS[algorithm];
  const progress =
    steps.length > 0 ? Math.round((stepIndex / steps.length) * 100) : 0;

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-slate-950 text-white p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="mb-4 space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-400">
            Graph Algorithm Visualizer
          </h1>
          <div className="flex flex-wrap gap-2">
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value)}
              className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg"
            >
              {Object.keys(ALGORITHMS).map(a => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setGraph(generateRandomGraph(8, 0.4));
                reset();
              }}
              className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw size={16} />
              New Graph
            </button>
          </div>

          <div className="bg-gray-800/40 border border-gray-700 p-2 rounded text-sm flex items-center gap-2">
            <Info size={14} />
            {status}
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* GRAPH */}
          <div className="lg:col-span-2 bg-gray-800/30 border border-gray-700 rounded-xl p-2 h-[300px] sm:h-[420px] md:h-[520px]">
            <GraphCanvas
              graph={graph}
              visitedNodes={visited}
              frontierNodes={frontier}
              pathNodes={path}
              currentNode={current}
              distanceLabels={distances}
              algorithm={algorithm}
            />
          </div>

          {/* CONTROLS */}
          <div className="space-y-3">

            {/* PLAY */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-3">
              <button
                onClick={() => setIsPlaying(p => !p)}
                className={`w-full py-2 rounded-lg flex justify-center gap-2 ${
                  isPlaying ? "bg-amber-600" : "bg-emerald-600"
                }`}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setStepIndex(i => Math.max(0, i - 1))}
                  className="flex-1 bg-gray-700 py-2 rounded"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={() => setStepIndex(i => Math.min(steps.length, i + 1))}
                  className="flex-1 bg-gray-700 py-2 rounded"
                >
                  <SkipForward size={16} />
                </button>
              </div>
            </div>

            {/* SPEED */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Speed</span>
                <span>{speed} ms</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="100"
                value={speed}
                onChange={e => setSpeed(+e.target.value)}
                className="w-full"
              />
            </div>

            {/* PROGRESS */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-center text-gray-400 mt-1">
                Step {stepIndex} / {steps.length}
              </div>
            </div>

            {/* RESULT */}
            {result && (
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-3">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  Result
                </h3>

                {meta.resultType === "order" && (
                  <div className="flex flex-wrap gap-2">
                    {result.visited.map(n => (
                      <span key={n} className="px-2 py-1 bg-gray-700 rounded">
                        {n}
                      </span>
                    ))}
                  </div>
                )}

                {meta.resultType === "distance" && (
                  <ul className="text-sm">
                    {Object.entries(result.distances).map(([n, d]) => (
                      <li key={n}>
                        Node {n}: {d === Infinity ? "∞" : d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* INFO */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-3 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} />
                <b>Time:</b> {meta.time}
              </div>
              <div><b>Space:</b> {meta.space}</div>
              <div className="text-gray-400 mt-1">{meta.desc}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
