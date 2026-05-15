import { Activity, Clock, Cpu, BarChart3, Trophy } from 'lucide-react';

const MetricCard = ({ label, value, icon: Icon, color, suffix = "" }) => (
  <div className="glass-card p-4 rounded-xl border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center gap-3 mb-1">
      <Icon size={16} className="text-gray-400" />
      <span className="text-sm text-gray-400 font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold">
      {typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}
      <span className="text-sm ml-1 text-gray-500 font-normal">{suffix}</span>
    </div>
  </div>
);

const MetricsDashboard = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard 
        label="Packet Delivery Ratio" 
        value={metrics.pdr} 
        icon={Activity} 
        color="#10b981" 
        suffix="%" 
      />
      <MetricCard 
        label="Avg. End-to-End Delay" 
        value={metrics.avgDelay} 
        icon={Clock} 
        color="#3b82f6" 
        suffix="ms" 
      />
      <MetricCard 
        label="Routing Overhead" 
        value={metrics.overhead} 
        icon={Cpu} 
        color="#f59e0b" 
        suffix="%" 
      />
      <MetricCard 
        label="Packets Sent" 
        value={metrics.sent} 
        icon={BarChart3} 
        color="#8b5cf6" 
      />
      <MetricCard 
        label="Best Path Found" 
        value={metrics.bestPathDist === Infinity ? 0 : metrics.bestPathDist} 
        icon={Trophy} 
        color="#f43f5e" 
        suffix="units"
      />
    </div>
  );
};

export default MetricsDashboard;
