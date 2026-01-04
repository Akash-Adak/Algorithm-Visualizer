import { useEffect, useState, useRef } from "react";
import { BarChart2 } from "lucide-react";
import AlgorithmPanel from "./AlgorithmPanel";
import ArrayControls from "./ArrayControls";
import ControlBar from "./ControlBar";
import VisualizationArea from "./VisualizationArea";
import ArrayDisplay from "./ArrayDisplay";
import {
  COMPLEXITY_MAP,
  executeAlgorithm
} from "../../utils/algorithmFactory";

const BAR_COUNT = 10;

function generateArray(size = BAR_COUNT) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 90) + 10
  );
}

export default function SortingVisualizer() {
  const [originalArray, setOriginalArray] = useState(generateArray());
  const [visualArray, setVisualArray] = useState([]);
  const [algorithm, setAlgorithm] = useState("Bubble");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [inputArray, setInputArray] = useState("");
  const [showComparison, setShowComparison] = useState(true);
  const [algorithmInfo, setAlgorithmInfo] = useState(
    COMPLEXITY_MAP["Bubble"]
  );
  const [currentStep, setCurrentStep] = useState(null);

  const timerRef = useRef(null);

  /* ---------- INIT ---------- */
  useEffect(() => {
    const s = executeAlgorithm(algorithm, [...originalArray]) || [];
    setSteps(s);
    setVisualArray([...originalArray]);
    setStepIndex(0);
    setIsPlaying(false);
    setCurrentStep(null);
    setAlgorithmInfo(COMPLEXITY_MAP[algorithm]);
  }, [originalArray, algorithm]);

  /* ---------- PLAY ENGINE ---------- */
  useEffect(() => {
    if (!isPlaying || stepIndex >= steps.length) return;

    timerRef.current = setTimeout(() => {
      const step = steps[stepIndex];
      setCurrentStep(step);

      if (step?.array) setVisualArray([...step.array]);

      setStepIndex(i => i + 1);
    }, speed);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, stepIndex, steps, speed]);

  /* ---------- HANDLERS ---------- */
  const handleApplyInput = arr => {
    setOriginalArray(arr);
    setInputArray("");
  };

  const handleReset = () => {
    setOriginalArray(generateArray());
  };

  const handleStepForward = () => {
    if (stepIndex < steps.length) {
      setStepIndex(i => i + 1);
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (stepIndex > 0) {
      setStepIndex(i => i - 1);
      setIsPlaying(false);
    }
  };

  const progress =
    steps.length > 0 ? Math.round((stepIndex / steps.length) * 100) : 0;

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-slate-950 text-white px-3 py-4 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="mb-6 space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-3">
            <BarChart2 className="text-cyan-400 shrink-0" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Sorting Algorithm Visualizer
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Step-by-step visualization of sorting algorithms
          </p>
        </header>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

          {/* LEFT PANEL */}
          <div className="space-y-4 lg:space-y-6">
            <AlgorithmPanel
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              algorithmInfo={algorithmInfo}
            />

            <ArrayControls
              inputArray={inputArray}
              setInputArray={setInputArray}
              onApply={handleApplyInput}
              onReset={handleReset}
            />
          </div>

          {/* VISUALIZATION */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">

            <ControlBar
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              stepIndex={stepIndex}
              totalSteps={steps.length}
              speed={speed}
              setSpeed={setSpeed}
              showComparison={showComparison}
              setShowComparison={setShowComparison}
              currentStep={currentStep}
              visualArray={visualArray}
            />

            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-2 sm:p-3">
              <VisualizationArea
                visualArray={visualArray}
                currentStep={currentStep}
                stepIndex={stepIndex}
                steps={steps}
              />
            </div>

            <ArrayDisplay
              visualArray={visualArray}
              currentStep={currentStep}
              stepIndex={stepIndex}
              totalSteps={steps.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
