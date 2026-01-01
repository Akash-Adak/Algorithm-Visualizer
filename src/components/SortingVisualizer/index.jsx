import { useEffect, useState, useRef } from "react";
import { BarChart2 } from "lucide-react";
import AlgorithmPanel from "./AlgorithmPanel";
import ArrayControls from "./ArrayControls";
import StatsPanel from "./StatsPanel";
import ControlBar from "./ControlBar";
import VisualizationArea from "./VisualizationArea";
import ArrayDisplay from "./ArrayDisplay";
import { ALGORITHMS, COMPLEXITY_MAP, executeAlgorithm } from "../../utils/algorithmFactory";

const BAR_COUNT = 10;

function generateArray(size = BAR_COUNT) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
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
  const [comparisonCount, setComparisonCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  const [showComparison, setShowComparison] = useState(true);
  const [algorithmInfo, setAlgorithmInfo] = useState(COMPLEXITY_MAP["Bubble"]);
  const [currentStep, setCurrentStep] = useState(null);

  const timerRef = useRef(null);

  // Initialize
  useEffect(() => {
    try {
      const steps = executeAlgorithm(algorithm, [...originalArray]);
      setSteps(steps);
      setVisualArray([...originalArray]);
      setStepIndex(0);
      setIsPlaying(false);
      setComparisonCount(0);
      setSwapCount(0);
      setCurrentStep(null);
      setAlgorithmInfo(COMPLEXITY_MAP[algorithm]);
    } catch (error) {
      console.error("Error executing algorithm:", error);
    }
  }, [originalArray, algorithm]);

  // Animation engine
  useEffect(() => {
    if (!isPlaying || stepIndex >= steps.length) return;

    timerRef.current = setTimeout(() => {
      const step = steps[stepIndex];
      setCurrentStep(step);
      
      if (step.array) setVisualArray([...step.array]);
      
      // Update statistics
      if (step.type === "compare") setComparisonCount(prev => prev + 1);
      if (step.type === "swap") setSwapCount(prev => prev + 1);
      
      setStepIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, stepIndex, steps, speed]);

  const handleApplyInput = (arr) => {
    setOriginalArray(arr);
    setInputArray("");
  };

  const handleReset = () => {
    setOriginalArray(generateArray());
  };

  const handleStepForward = () => {
    if (stepIndex < steps.length) {
      setStepIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const progress = steps.length > 0 ? (stepIndex / steps.length) * 100 : 0;

  const stats = {
    comparisonCount,
    swapCount,
    stepIndex,
    totalSteps: steps.length,
    progress
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart2 className="text-cyan-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Algorithm Visualizer
            </span>
          </h1>
          <p className="text-gray-400">Visualize sorting algorithms step by step</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="space-y-6">
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
            
            <StatsPanel stats={stats} />
          </div>

          {/* Center Panel */}
          <div className="lg:col-span-2 space-y-6">
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

            <VisualizationArea 
              visualArray={visualArray}
              currentStep={currentStep}
              stepIndex={stepIndex}
              steps={steps}
            />

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