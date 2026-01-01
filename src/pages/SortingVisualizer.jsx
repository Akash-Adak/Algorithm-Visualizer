import { useEffect, useState } from "react";
import { algorithms } from "../algorithms";

const BAR_COUNT = 20;
const MAX_HEIGHT = 260;

const complexityMap = {
  Bubble: {
    time: "O(n²)",
    space: "O(1)",
  },
  Selection: {
    time: "O(n²)",
    space: "O(1)",
  },
  Insertion: {
    time: "O(n²)",
    space: "O(1)",
  },
};

function generateArray() {
  return Array.from({ length: BAR_COUNT }, () =>
    Math.floor(Math.random() * 90) + 10
  );
}

export default function SortingVisualizer() {
  const [originalArray, setOriginalArray] = useState(generateArray());
  const [visualArray, setVisualArray] = useState([]);
  const [algorithm, setAlgorithm] = useState("Bubble");

  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [active, setActive] = useState([]);
  const [stepType, setStepType] = useState("");
  const [description, setDescription] = useState("");
  const [sortedIndex, setSortedIndex] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [inputArray, setInputArray] = useState("");

  // Generate steps
  useEffect(() => {
    const s = algorithms[algorithm](originalArray);
    setSteps(s);
    setVisualArray(originalArray);
    setStepIndex(0);
    setActive([]);
    setSortedIndex(-1);
    setIsPlaying(false);
    setDescription("");
  }, [originalArray, algorithm]);

  // Animation engine
  useEffect(() => {
    if (!isPlaying || stepIndex >= steps.length) {
      if (stepIndex >= steps.length && steps.length > 0) {
        setSortedIndex(visualArray.length);
        setDescription("✅ Array is fully sorted");
      }
      return;
    }

    const timer = setTimeout(() => {
      const step = steps[stepIndex];
      setVisualArray(step.array);
      setActive(step.indices);
      setStepType(step.type);

      if (step.type === "compare") {
        setDescription(
          `Comparing ${step.array[step.indices[0]]} and ${step.array[step.indices[1]]}`
        );
      } else if (step.type === "swap") {
        setDescription(
          `Swapping ${step.array[step.indices[0]]} and ${step.array[step.indices[1]]}`
        );
      } else {
        setDescription("Updating position");
      }

      setStepIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps, speed, visualArray]);

  // User input array
  const handleApplyInput = () => {
    const arr = inputArray
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    if (arr.length > 1) {
      setOriginalArray(arr);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">
        🔢 Sorting Algorithm Visualizer
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <select
          className="px-3 py-1 rounded bg-slate-800"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          {Object.keys(algorithms).map((algo) => (
            <option key={algo} value={algo}>
              {algo} Sort
            </option>
          ))}
        </select>

        <button
          className="bg-green-600 px-3 py-1 rounded"
          onClick={() => setIsPlaying(true)}
        >
          ▶ Play
        </button>
        <button
          className="bg-yellow-600 px-3 py-1 rounded"
          onClick={() => setIsPlaying(false)}
        >
          ⏸ Pause
        </button>
        <button
          className="bg-blue-600 px-3 py-1 rounded"
          onClick={() => setOriginalArray(generateArray())}
        >
          🔄 New Array
        </button>

        <input
          className="px-2 py-1 rounded bg-slate-800 w-56"
          placeholder="e.g. 5,3,8,1"
          value={inputArray}
          onChange={(e) => setInputArray(e.target.value)}
        />
        <button
          className="bg-purple-600 px-3 py-1 rounded"
          onClick={handleApplyInput}
        >
          Apply
        </button>

        <input
          type="range"
          min="50"
          max="800"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      {/* Step Description */}
      <div className="mb-3 text-lg font-medium text-cyan-400">
        {description}
      </div>

      {/* Complexity */}
      <div className="mb-4 text-sm opacity-80">
        ⏱ Time: {complexityMap[algorithm].time} &nbsp; | &nbsp; 💾 Space:{" "}
        {complexityMap[algorithm].space}
      </div>

      {/* Bars */}
      <div className="flex items-end h-[320px] bg-black p-4 rounded-xl">
        {visualArray.map((value, index) => {
          let color = "bg-blue-500";
          if (index < sortedIndex) color = "bg-green-500";
          else if (active.includes(index))
            color = stepType === "swap" ? "bg-orange-400" : "bg-red-500";

          return (
            <div
              key={index}
              className={`mx-1 rounded-t ${color} transition-all duration-300`}
              style={{
                width: "24px",
                height: `${(value / Math.max(...visualArray)) * MAX_HEIGHT}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
