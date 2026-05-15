import { useState, useCallback, useRef } from 'react';
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
    overhead: 0,
    bestPathDist: Infinity,
    bestPathNodes: []
  });
  const [logs, setLogs] = useState([{ type: 'system', message: 'Simulation initialized.', time: new Date() }]);
  const [activeScenario, setActiveScenario] = useState('normal');
  const [isSimulating, setIsSimulating] = useState(false);
  const bestPathDistRef = useRef(Infinity);

  const addLog = (type, message) => {
    setLogs(prev => [{ type, message, time: new Date() }, ...prev].slice(0, 50));
  };

  // Probability rule for ant movement
  const calculateProbability = (currentNodeId, nextNodeId, availableEdges, customAlpha, customBeta) => {
    const edge = availableEdges.find(e => 
      (e.source === currentNodeId && e.target === nextNodeId) || 
      (e.target === currentNodeId && e.source === nextNodeId)
    );
    
    if (!edge) return 0;

    const alpha = customAlpha ?? configData.simulation.alpha;
    const beta = customBeta ?? configData.simulation.beta;
    const tau = edge.pheromone;
    const eta = 1 / edge.dist;

    const numerator = Math.pow(tau, alpha) * Math.pow(eta, beta);
    
    const denominator = availableEdges.reduce((sum, e) => {
      return sum + Math.pow(e.pheromone, alpha) * Math.pow(1 / e.dist, beta);
    }, 0);

    return numerator / denominator;
  };

  const runAnt = useCallback(async (antLabel = "Scout", alphaOverride, betaOverride) => {
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
          prob: calculateProbability(currentNode, target, neighbors, alphaOverride, betaOverride)
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

    addLog('ant', `${antLabel} found path: ${path.join(' → ')} (Dist: ${pathLength})`);
    
    if (pathLength < bestPathDistRef.current) {
      bestPathDistRef.current = pathLength;
      addLog('system', `⭐ New Best Path found by ${antLabel}! Distance: ${pathLength}`);
    }

    setMetrics(prev => {
      if (pathLength < prev.bestPathDist) {
        return {
          ...prev,
          bestPathDist: pathLength,
          bestPathNodes: path
        };
      }
      return prev;
    });

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
    return { path, pathLength };
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
    let totalPheromone = 0;
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
      totalPheromone += bestEdge.pheromone;
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
      addLog('data', `Packet delivered via ${path.join(' → ')} (Total Pheromone: ${totalPheromone.toFixed(2)})`);
      return { path, pathLength };
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
    
    // Start with the full set of edges from config
    // But pull pheromone levels from the current state if they exist
    let newEdges = configData.edges.map(configEdge => {
      const currentEdge = edges.find(e => e.source === configEdge.source && e.target === configEdge.target);
      return { 
        ...configEdge, 
        pheromone: currentEdge ? currentEdge.pheromone : configEdge.initialPheromone 
      };
    });

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
    bestPathDistRef.current = Infinity;
    setMetrics({ sent: 0, received: 0, totalDelay: 0, antPackets: 0, pdr: 0, avgDelay: 0, overhead: 0, bestPathDist: Infinity, bestPathNodes: [] });
  };

  const resetSystem = useCallback(() => {
    setEdges(configData.edges.map(e => ({ ...e, pheromone: e.initialPheromone })));
    bestPathDistRef.current = Infinity;
    setMetrics({ sent: 0, received: 0, totalDelay: 0, antPackets: 0, pdr: 0, avgDelay: 0, overhead: 0, bestPathDist: Infinity, bestPathNodes: [] });
    setLogs([{ type: 'system', message: 'System restarted. All data cleared.', time: new Date() }]);
    setActiveScenario('normal');
    setNodes(configData.nodes);
  }, []);

  // Derived metrics
  const pdr = metrics.sent > 0 ? (metrics.received / metrics.sent) * 100 : 0;
  const avgDelay = metrics.received > 0 ? metrics.totalDelay / metrics.received : 0;
  const totalPackets = metrics.sent + metrics.antPackets;
  const overhead = totalPackets > 0 ? (metrics.antPackets / totalPackets) * 100 : 0;

  const finalMetrics = { ...metrics, pdr, avgDelay, overhead };

  return {
    nodes,
    edges,
    metrics: finalMetrics,
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
