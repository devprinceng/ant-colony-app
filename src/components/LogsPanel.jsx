import { Terminal } from 'lucide-react';

const LogsPanel = ({ logs }) => {
  return (
    <div className="glass-card p-5 rounded-2xl h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Terminal size={18} className="text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">System Logs</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 font-mono text-xs">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-gray-600">[{log.time.toLocaleTimeString([], { hour12: false })}]</span>
            <span className={
              log.type === 'error' ? 'text-rose-400' :
              log.type === 'warning' ? 'text-amber-400' :
              log.type === 'ant' ? 'text-blue-400' :
              log.type === 'data' ? 'text-emerald-400' :
              'text-gray-400'
            }>
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && <div className="text-gray-600 italic">No events recorded.</div>}
      </div>
    </div>
  );
};

export default LogsPanel;
