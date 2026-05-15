import { useACO } from './hooks/useACO';
import NetworkGraph from './components/NetworkGraph';
import ControlPanel from './components/ControlPanel';
import MetricsDashboard from './components/MetricsDashboard';
import LogsPanel from './components/LogsPanel';
import InlineGuide from './components/DocumentationModal';
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
    applyScenario,
    resetSystem
  } = useACO();

  const [isDocOpen, setIsDocOpen] = useState(false);
  const [activeAnts, setActiveAnts] = useState([]);

  const addAntAnimation = (path, type = 'scout', label = null, dist = null) => {
    if (!path) return;
    const id = Math.random().toString(36).substr(2, 9);
    setActiveAnts(prev => [...prev, { id, path, type, label, dist }]);
  };

  const removeAntAnimation = (id) => {
    setActiveAnts(prev => prev.filter(ant => ant.id !== id));
  };

  const handleRunAnt = async () => {
    for (let i = 0; i < 5; i++) {
      // Stagger the starts slightly for better visualization
      setTimeout(async () => {
        const label = `Ant ${i + 1}`;
        // Vary parameters to ensure diversity as requested by the client
        // Ant 1 is standard, others are more exploratory
        const alpha = i === 0 ? 1 : 0.5; 
        const beta = i === 0 ? 2 : 4;   
        
        const { path, pathLength } = await runAnt(label, alpha, beta);
        addAntAnimation(path, 'scout', label, pathLength);
      }, i * 300);
    }
  };

  const handleSendData = () => {
    const path = sendDataPacket();
    addAntAnimation(path, 'data');
  };
  const handleRestart = () => {
    resetSystem();
    setActiveAnts([]);
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
        
        <div className="header-controls">
          <button 
            onClick={() => setIsDocOpen(true)}
            className={`btn transition-all ${isDocOpen ? 'bg-blue-500/20 border-blue-400 text-white shadow-lg shadow-blue-500/10' : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'}`}
            style={{ borderStyle: 'solid', borderWidth: '1px' }}
          >
            <BookOpen size={18} className={isDocOpen ? 'text-blue-400' : ''} />
            <span style={{ marginLeft: '8px' }}>Guide</span>
          </button>
          <button 
            onClick={handleSimulateBatch}
            className="btn bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
          >
            <Zap size={18} />
            <span style={{ marginLeft: '8px' }}>Auto-Test (50 Packets)</span>
          </button>
        </div>
      </header>

      {/* Metrics Bar */}
      <MetricsDashboard metrics={metrics} />

      <InlineGuide isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} />
 
      <div className="dashboard-grid">
        {/* Main Graph Area */}
        <div className="main-content">
          <NetworkGraph 
            nodes={nodes} 
            edges={edges} 
            activeAnts={activeAnts} 
            bestPathNodes={metrics.bestPathNodes}
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
            onRestart={handleRestart}
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

    </div>
  );
}

export default App;
