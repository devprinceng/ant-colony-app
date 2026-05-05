import { Play, Send, Wind, AlertTriangle, Smartphone, RotateCcw } from 'lucide-react';

const ControlPanel = ({ onRunAnt, onSendData, onEvaporate, onRestart, onScenarioChange, currentScenario }) => {
  const scenarios = [
    { key: 'normal', label: 'Normal', icon: Play },
    { key: 'failure', label: 'Failure', icon: AlertTriangle },
    { key: 'mobility', label: 'Mobility', icon: Smartphone }
  ];

  return (
    <div className="flex flex-col gap-4 p-6 glass-card rounded-2xl h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold accent-text">Simulation Controls</h2>
        <button 
          onClick={onRestart}
          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
          style={{ padding: '8px' }}
          title="Restart System"
        >
          <RotateCcw size={18} />
        </button>
      </div>
      
      <div className="controls-grid">
        <button
          onClick={onRunAnt}
          className="btn bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-400"
        >
          <Play size={18} />
          <span style={{ marginLeft: '8px' }}>Run Ant Wave</span>
        </button>

        <button
          onClick={onSendData}
          className="btn bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400"
        >
          <Send size={18} />
          <span style={{ marginLeft: '8px' }}>Send Data</span>
        </button>

        <button
          onClick={onEvaporate}
          className="btn bg-amber-600/20 border border-amber-500/30 hover:bg-amber-600/30 text-amber-400"
          style={{ gridColumn: 'span 2' }}
        >
          <Wind size={18} />
          <span style={{ marginLeft: '8px' }}>Trigger Evaporation</span>
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Test Scenarios</h3>
        <div className="scenario-list">
          {scenarios.map((s) => (
            <button
              key={s.key}
              onClick={() => onScenarioChange(s.key)}
              className={`scenario-btn border transition-all ${
                currentScenario === s.key
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-transparent border-white/5 text-gray-500 hover:border-white/20'
              }`}
            >
              <s.icon size={18} />
              <span>{s.label}</span>
              {currentScenario === s.key && (
                <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60a5fa' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
