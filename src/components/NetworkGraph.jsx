import { motion } from 'framer-motion';

const MovingAnt = ({ path, nodes, onComplete, color = "#4facfe" }) => {
  const pathCoordinates = path.map(nodeId => nodes.find(n => n.id === nodeId));

  return (
    <motion.circle
      r={4}
      fill={color}
      initial={{ cx: pathCoordinates[0].x, cy: pathCoordinates[0].y }}
      animate={{
        cx: pathCoordinates.map(p => p.x),
        cy: pathCoordinates.map(p => p.y),
      }}
      transition={{
        duration: path.length * 0.6,
        ease: "linear",
      }}
      onAnimationComplete={onComplete}
      className="node-shadow"
    />
  );
};

const NetworkGraph = ({ nodes, edges, activeAnts = [], onAntComplete }) => {
  return (
    <div className="relative w-full h-[500px] glass-card overflow-hidden rounded-2xl">
      <svg className="w-full h-full" viewBox="0 0 600 500">
        {/* Draw Edges */}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const opacity = Math.min(0.1 + (edge.pheromone / 10), 0.9);
          const strokeWidth = 2 + (edge.pheromone / 5);

          return (
            <g key={`edge-${index}`}>
              <motion.line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="white"
                strokeOpacity={opacity}
                strokeWidth={strokeWidth}
                className="edge-glow"
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
            color={ant.type === 'data' ? '#10b981' : '#4facfe'}
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
          <rect width="180" height="30" fill="rgba(255,255,255,0.05)" rx="8" />
          <text x="10" y="20" fill="rgba(255,255,255,0.4)" fontSize="10">
            <tspan fontWeight="bold" fill="white">d</tspan> = Distance (Dist) | 
            <tspan fontWeight="bold" fill="#4facfe" dx="5">τ</tspan> = Pheromone (Pher)
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NetworkGraph;
