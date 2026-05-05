import { useState, useCallback, useEffect, useRef } from 'react';
import configData from '../data/config.json';

export const useACO = () => {
  const [nodes, setNodes] = useState(configData.nodes);
  const [edges, setEdges] = useState(configData.edges.map(e => ({ ...e, pheromone: e.initialPheromone })));
  const [metrics, setMetrics] = useState({
    sent: 0,
    received: 0,
    totalDelay: 0,
    antPackets: 0,
    pdr: 0,
    avgDelay: 0,
    overhead: 0
  });
  const [logs, setLogs] = useState([{ type: 'system', message: 'Simulation initialized.', time: new Date() }]);
  const [activeScenario, setActiveScenario] = useState('normal');
  const [isSimulating, setIsSimulating] = useState(false);

  const addLog = (type, message) => {
    setLogs(prev => [{ type, message, time: new Date() }, ...prev].slice(0, 50));
  };

  // Probability rule for ant movement
  const calculateProbability = (currentNodeId, nextNodeId, availableEdges) => {
    const edge = availableEdges.find(e => 
      (e.source === currentNodeId && e.target === nextNodeId) || 
      (e.target === currentNodeId && e.source === nextNodeId)
    );
    
    if (!edge) return 0;

    const { alpha, beta } = configData.simulation;
    const tau = edge.pheromone;
    const eta = 1 / edge.dist;

    const numerator = Math.pow(tau, alpha) * Math.pow(eta, beta);
    
    const denominator = availableEdges.reduce((sum, e) => {
      return sum + Math.pow(e.pheromone, alpha) * Math.pow(1 / e.dist, beta);
    }, 0);

    return numerator / denominator;
  };

  const runAnt = useCallback(async () => {
    setIsSimulating(true);
    const { sourceNode, destNode, Q } = configData.simulation;
    let currentNode = sourceNode;
    const path = [sourceNode];
    const visited = new Set([sourceNode]);
    let pathLength = 0;

    setMetrics(prev => ({ ...prev, antPackets: prev.antPackets + 1 }));

    // Forward Ant
    while (currentNode !== destNode) {
      const neighbors = edges.filter(e => 
        (e.source === currentNode || e.target === currentNode) && 
        !visited.has(e.source === currentNode ? e.target : e.source)
      );

      if (neighbors.length === 0) {
        addLog('warning', 'Ant reached a dead end.');
        setIsSimulating(false);
        return null;
      }

      // Pick next node based on probability
      const probs = neighbors.map(e => {
        const target = e.source === currentNode ? e.target : e.source;
        return {
          edge: e,
          target,
          prob: calculateProbability(currentNode, target, neighbors)
        };
      });

      // Random selection based on probs
      const rand = Math.random();
      let cumulativeProb = 0;
      let selected = probs[probs.length - 1];

      for (const p of probs) {
        cumulativeProb += p.prob;
        if (rand <= cumulativeProb) {
          selected = p;
          break;
        }
      }

      pathLength += selected.edge.dist;
      currentNode = selected.target;
      path.push(currentNode);
      visited.add(currentNode);
      
      // Artificial delay for visualization if needed, but here we return the path
    }

    addLog('ant', `Ant found path: ${path.join(' → ')} (Dist: ${pathLength})`);

    // Backward Ant (Pheromone Update)
    setEdges(prevEdges => prevEdges.map(edge => {
      const isInPath = path.some((node, i) => {
        if (i === 0) return false;
        const prev = path[i-1];
        return (edge.source === prev && edge.target === node) || (edge.source === node && edge.target === prev);
      });

      if (isInPath) {
        return { ...edge, pheromone: edge.pheromone + (Q / pathLength) };
      }
      return edge;
    }));

    setIsSimulating(false);
    return path;
  }, [edges]);

  const evaporate = useCallback(() => {
    const { evaporationRate } = configData.simulation;
    setEdges(prev => prev.map(e => ({ ...e, pheromone: e.pheromone * evaporationRate })));
    addLog('system', 'Pheromones evaporated (Rate: 0.9)');
  }, []);

  const sendDataPacket = useCallback(() => {
    const { sourceNode, destNode } = configData.simulation;
    let currentNode = sourceNode;
    const path = [sourceNode];
    const visited = new Set([sourceNode]);
    let pathLength = 0;
    let success = false;

    setMetrics(prev => ({ ...prev, sent: prev.sent + 1 }));

    while (currentNode !== destNode) {
      const neighbors = edges.filter(e => 
        (e.source === currentNode || e.target === currentNode) && 
        !visited.has(e.source === currentNode ? e.target : e.source)
      );

      if (neighbors.length === 0) break;

      // Data follows HIGHEST pheromone
      const bestEdge = neighbors.reduce((prev, curr) => prev.pheromone > curr.pheromone ? prev : curr);
      
      pathLength += bestEdge.dist;
      currentNode = bestEdge.source === currentNode ? bestEdge.target : bestEdge.source;
      path.push(currentNode);
      visited.add(currentNode);

      if (currentNode === destNode) {
        success = true;
        break;
      }
    }

    if (success) {
      setMetrics(prev => ({
        ...prev,
        received: prev.received + 1,
        totalDelay: prev.totalDelay + pathLength
      }));
      addLog('data', `Packet delivered via ${path.join(' → ')}`);
      return path;
    } else {
      addLog('error', 'Packet lost: No valid path found.');
      return null;
    }
  }, [edges]);

  // Apply Scenarios
  const applyScenario = (key) => {
    const scenario = configData.scenarios[key];
    if (!scenario) return;

    setActiveScenario(key);
    addLog('system', `Switching to ${scenario.name}: ${scenario.description}`);

    let newNodes = [...configData.nodes];
    let newEdges = configData.edges.map(e => ({ ...e, pheromone: e.initialPheromone }));

    if (scenario.removeNodes) {
      newNodes = newNodes.filter(n => !scenario.removeNodes.includes(n.id));
      newEdges = newEdges.filter(e => !scenario.removeNodes.includes(e.source) && !scenario.removeNodes.includes(e.target));
    }

    if (scenario.updateEdges) {
      newEdges = newEdges.map(e => {
        const update = scenario.updateEdges.find(u => u.source === e.source && u.target === e.target);
        return update ? { ...e, dist: update.dist } : e;
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setMetrics({ sent: 0, received: 0, totalDelay: 0, antPackets: 0, pdr: 0, avgDelay: 0, overhead: 0 });
  };

  const resetSystem = useCallback(() => {
    setEdges(configData.edges.map(e => ({ ...e, pheromone: e.initialPheromone })));
    setMetrics({ sent: 0, received: 0, totalDelay: 0, antPackets: 0, pdr: 0, avgDelay: 0, overhead: 0 });
    setLogs([{ type: 'system', message: 'System restarted. All data cleared.', time: new Date() }]);
    setActiveScenario('normal');
    setNodes(configData.nodes);
  }, []);

  // Calculate high-level metrics
  useEffect(() => {
    setMetrics(prev => {
      const pdr = prev.sent > 0 ? (prev.received / prev.sent) * 100 : 0;
      const avgDelay = prev.received > 0 ? prev.totalDelay / prev.received : 0;
      const totalPackets = prev.sent + prev.antPackets;
      const overhead = totalPackets > 0 ? (prev.antPackets / totalPackets) * 100 : 0;

      return { ...prev, pdr, avgDelay, overhead };
    });
  }, [metrics.sent, metrics.received, metrics.antPackets]);

  return {
    nodes,
    edges,
    metrics,
    logs,
    activeScenario,
    isSimulating,
    runAnt,
    evaporate,
    sendDataPacket,
    applyScenario,
    resetSystem
  };
};
