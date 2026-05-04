import { useACO } from './hooks/useACO';
import NetworkGraph from './components/NetworkGraph';
import ControlPanel from './components/ControlPanel';
import MetricsDashboard from './components/MetricsDashboard';
import LogsPanel from './components/LogsPanel';
import DocumentationModal from './components/DocumentationModal';
import { Network, Globe, Zap, Info, BookOpen } from 'lucide-react';
import { useState } from 'react';

function App() {
  const { 
    nodes, 
    edges, 
    metrics, 
    logs, 
    activeScenario, 
    runAnt, 
    evaporate, 
    sendDataPacket, 
    applyScenario 
  } = useACO();

  const [isDocOpen, setIsDocOpen] = useState(false);
  const [activeAnts, setActiveAnts] = useState([]);

  const addAntAnimation = (path, type = 'scout') => {
    if (!path) return;
    const id = Math.random().toString(36).substr(2, 9);
    setActiveAnts(prev => [...prev, { id, path, type }]);
  };

  const removeAntAnimation = (id) => {
    setActiveAnts(prev => prev.filter(ant => ant.id !== id));
  };

  const handleRunAnt = async () => {
    const path = await runAnt();
    addAntAnimation(path, 'scout');
  };

  const handleSendData = () => {
    const path = sendDataPacket();
    addAntAnimation(path, 'data');
  };

  const handleSimulateBatch = async () => {
    // For batch simulation, we skip individual animations to save performance
    // but we run the logic as usual
    for(let i=0; i<10; i++) {
      await runAnt();
    }
    for(let i=0; i<50; i++) {
      sendDataPacket();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Network className="text-blue-400" size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              ANT<span className="accent-text">COLONY</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-12">
            Network Routing Optimization Simulation
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDocOpen(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-5 py-2.5 rounded-xl font-semibold transition-all"
          >
            <BookOpen size={18} />
            <span>Guide</span>
          </button>
          <button 
            onClick={handleSimulateBatch}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
          >
            <Zap size={18} />
            <span>Auto-Test (50 Packets)</span>
          </button>
        </div>
      </header>

      {/* Metrics Bar */}
      <MetricsDashboard metrics={metrics} />
 
      <div className="dashboard-grid">
        {/* Main Graph Area */}
        <div className="main-content">
          <NetworkGraph 
            nodes={nodes} 
            edges={edges} 
            activeAnts={activeAnts} 
            onAntComplete={removeAntAnimation} 
          />
          
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Algorithm Parameters</h3>
            <div className="algorithm-params-grid">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Pheromone (α)</span>
                <span className="font-mono text-blue-400 font-bold">1.0</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Distance (β)</span>
                <span className="font-mono text-blue-400 font-bold">2.0</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Deposit (Q)</span>
                <span className="font-mono text-blue-400 font-bold">10.0</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">Evaporation (ρ)</span>
                <span className="font-mono text-blue-400 font-bold">0.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Controls & Logs */}
        <div className="sidebar">
          <ControlPanel 
            onRunAnt={handleRunAnt}
            onSendData={handleSendData}
            onEvaporate={evaporate}
            onScenarioChange={applyScenario}
            currentScenario={activeScenario}
          />
          <div className="h-[400px]">
            <LogsPanel logs={logs} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
        <p>© 2026 Ant Colony Optimization Lab. All systems operational.</p>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsDocOpen(true)} className="hover:text-white transition-colors flex items-center gap-2 font-medium">
            <Info size={14} className="text-blue-400" />
            <span>Documentation</span>
          </button>
          <a href="#" className="hover:text-white transition-colors">API Reference</a>
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span>v1.0.4-stable</span>
          </div>
        </div>
      </footer>

      <DocumentationModal isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} />
    </div>
  );
}

export default App;
