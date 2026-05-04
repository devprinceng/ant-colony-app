import { Play, Send, Wind, AlertTriangle, Smartphone } from 'lucide-react';

const ControlPanel = ({ onRunAnt, onSendData, onEvaporate, onScenarioChange, currentScenario }) => {
  const scenarios = [
    { key: 'normal', label: 'Normal', icon: Play },
    { key: 'failure', label: 'Failure', icon: AlertTriangle },
    { key: 'mobility', label: 'Mobility', icon: Smartphone }
  ];

  return (
    <div className="flex flex-col gap-4 p-6 glass-card rounded-2xl h-full">
      <h2 className="text-xl font-bold accent-text mb-2">Simulation Controls</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRunAnt}
          className="flex items-center justify-center gap-2 bg-blue-600/20 border border-blue-500/30 py-3 rounded-xl hover:bg-blue-600/30"
        >
          <Play size={18} className="text-blue-400" />
          <span>Run Ant Wave</span>
        </button>

        <button
          onClick={onSendData}
          className="flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-500/30 py-3 rounded-xl hover:bg-emerald-600/30"
        >
          <Send size={18} className="text-emerald-400" />
          <span>Send Data</span>
        </button>

        <button
          onClick={onEvaporate}
          className="flex items-center justify-center gap-2 bg-amber-600/20 border border-amber-500/30 py-3 rounded-xl hover:bg-amber-600/30 col-span-2"
        >
          <Wind size={18} className="text-amber-400" />
          <span>Trigger Evaporation</span>
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Test Scenarios</h3>
        <div className="flex flex-col gap-2">
          {scenarios.map((s) => (
            <button
              key={s.key}
              onClick={() => onScenarioChange(s.key)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                currentScenario === s.key
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-transparent border-white/5 text-gray-500 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <s.icon size={18} />
                <span>{s.label}</span>
              </div>
              {currentScenario === s.key && <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
