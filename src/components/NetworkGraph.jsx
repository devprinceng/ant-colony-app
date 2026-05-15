import { motion } from 'framer-motion';
import { useState } from 'react';

const MovingAnt = ({ path, nodes, onComplete, label, dist, color = "#4facfe" }) => {
  const pathCoordinates = path.map(nodeId => nodes.find(n => n.id === nodeId));
  const [isFinished, setIsFinished] = useState(false);

  const handleAnimationComplete = () => {
    setIsFinished(true);
    setTimeout(() => {
      onComplete();
    }, 2000); // Show result for 2 seconds
  };

  return (
    <motion.g
      initial={{ x: pathCoordinates[0].x, y: pathCoordinates[0].y }}
      animate={{
        x: pathCoordinates.map(p => p.x),
        y: pathCoordinates.map(p => p.y),
      }}
      transition={{
        duration: path.length * 0.8,
        ease: "linear",
      }}
      onAnimationComplete={handleAnimationComplete}
    >
      <motion.circle 
        r={isFinished ? 10 : 6} 
        fill={color} 
        animate={isFinished ? { scale: [1, 1.2, 1] } : {}}
        transition={isFinished ? { repeat: Infinity, duration: 0.5 } : {}}
        className="node-shadow" 
      />
      {label && (
        <text
          y={isFinished ? -25 : -12}
          fill="white"
          fontSize={isFinished ? "12" : "10"}
          fontWeight="bold"
          textAnchor="middle"
          className="pointer-events-none"
        >
          {isFinished && dist ? `${label} (Dist: ${dist})` : label}
        </text>
      )}
      {isFinished && (
        <motion.text
          y={-12}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -45 }}
          fill="#fbbf24"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
        >
          DONE!
        </motion.text>
      )}
    </motion.g>
  );
};

const NetworkGraph = ({ nodes, edges, activeAnts = [], bestPathNodes = [], onAntComplete }) => {
  const isInBestPath = (source, target) => {
    if (!bestPathNodes || bestPathNodes.length < 2) return false;
    for (let i = 0; i < bestPathNodes.length - 1; i++) {
      const n1 = bestPathNodes[i];
      const n2 = bestPathNodes[i + 1];
      if ((n1 === source && n2 === target) || (n1 === target && n2 === source)) return true;
    }
    return false;
  };

  return (
    <div className="relative w-full h-[500px] glass-card overflow-hidden rounded-2xl">
      <svg className="w-full h-full" viewBox="0 0 600 500">
        {/* Draw Edges */}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const isBest = isInBestPath(edge.source, edge.target);
          const opacity = isBest ? 0.8 : Math.min(0.1 + (edge.pheromone / 10), 0.9);
          const strokeWidth = isBest ? 4 : 2 + (edge.pheromone / 5);
          const strokeColor = isBest ? "#fbbf24" : "white";

          return (
            <g key={`edge-${index}`}>
              <motion.line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={strokeColor}
                strokeOpacity={opacity}
                strokeWidth={strokeWidth}
                className={isBest ? "best-path-glow" : "edge-glow"}
              />
              <text
                x={(sourceNode.x + targetNode.x) / 2}
                y={(sourceNode.y + targetNode.y) / 2 - 10}
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                textAnchor="middle"
              >
                d:{edge.dist}
              </text>
              <text
                x={(sourceNode.x + targetNode.x) / 2}
                y={(sourceNode.y + targetNode.y) / 2 + 5}
                fill="#4facfe"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                τ:{edge.pheromone.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Animated Ants */}
        {activeAnts.map(ant => (
          <MovingAnt 
            key={ant.id} 
            path={ant.path} 
            nodes={nodes} 
            label={ant.label}
            dist={ant.dist}
            color={ant.type === 'data' ? '#10b981' : ant.type === 'scout' ? '#4facfe' : '#fbbf24'}
            onComplete={() => onAntComplete(ant.id)} 
          />
        ))}

        {/* Draw Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={24}
              fill="rgba(20, 20, 30, 0.8)"
              stroke={node.id === 'A' ? '#4facfe' : node.id === 'E' ? '#00f2fe' : 'rgba(255,255,255,0.2)'}
              strokeWidth={3}
              className="node-shadow"
              whileHover={{ scale: 1.1 }}
            />
            <text
              x={node.x}
              y={node.y + 5}
              fill="white"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
            >
              {node.id}
            </text>
            <text
              x={node.x}
              y={node.y + 45}
              fill="rgba(255,255,255,0.6)"
              textAnchor="middle"
              fontSize="12"
            >
              {node.label}
            </text>
          </g>
        ))}
        {/* Graph Legend */}
        <g transform="translate(20, 460)">
          <rect width="230" height="30" fill="rgba(255,255,255,0.05)" rx="8" />
          <text x="12" y="20" fill="rgba(255,255,255,0.4)" fontSize="10">
            <tspan fontWeight="bold" fill="white">d</tspan> = Distance (Dist) | 
            <tspan fontWeight="bold" fill="#4facfe" dx="5">τ</tspan> = Pheromone (Pher)
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NetworkGraph;
