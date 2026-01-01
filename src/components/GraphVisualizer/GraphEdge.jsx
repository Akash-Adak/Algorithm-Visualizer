export default function GraphEdge({ 
  from, 
  to, 
  isVisited, 
  weight,
  showWeights,
  direction = 'bidirectional'
}) {
  const getEdgeClasses = () => {
    return isVisited 
      ? "stroke-blue-500 stroke-2" 
      : "stroke-gray-600 stroke-1";
  };

  // This component will be used in conjunction with SVG
  return null;
}