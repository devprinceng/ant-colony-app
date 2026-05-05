import { X, BookOpen, Zap, Target, RefreshCw, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InlineGuide = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden mb-8"
        >
          <div className="glass-card rounded-2xl border border-blue-500/20 shadow-2xl shadow-blue-500/5">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-blue-500/5">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-400" />
                <h2 className="text-2xl font-bold">System A-Z Guide</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content Area - No fixed height, grows with text */}
            <div className="p-8 md:p-12 space-y-12">
              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Zap size={20} /> 1. What is Ant Colony Optimization?
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  ACO is a bio-inspired algorithm based on the behavior of real ants. In nature, ants wander randomly, and upon finding food, return to their colony while laying down pheromone trails. If other ants find such a path, they follow it, reinforcing the trail. Over time, the shortest paths receive the most pheromones and become the dominant routes.
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <Target size={18} /> Phase A: Forward Ant
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    The "Forward Ant" is a scout. It moves from Node A to Node E. At each node, it uses a <strong>Probabilistic Rule</strong>. It favors paths with high pheromones (τ) and short distances (1/dist).
                  </p>
                  <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/10 font-mono text-sm text-blue-300">
                    P = (τ^α * η^β) / Σ(τ^α * η^β)
                  </div>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <RefreshCw size={18} /> Phase B: Backward Ant
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Once the Forward Ant reaches Node E, it becomes a <strong>Backward Ant</strong>. It retraces its path and deposits <strong>Pheromones</strong>. Shorter paths get larger deposits (Q / Length), making them more attractive for future ants.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
                  <BarChart3 size={20} /> 2. Key Metrics Explained
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-blue-500/5 rounded-xl border border-blue-500/10">
                    <h4 className="font-bold text-blue-400 mb-2">PDR</h4>
                    <p className="text-sm text-gray-400">Packet Delivery Ratio. The percentage of data packets that successfully reach node E. High = Reliable.</p>
                  </div>
                  <div className="p-5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <h4 className="font-bold text-emerald-400 mb-2">Avg Delay</h4>
                    <p className="text-sm text-gray-400">Average time/distance traveled. Lower delay means the ACO has found more efficient routes.</p>
                  </div>
                  <div className="p-5 bg-purple-500/5 rounded-xl border-purple-500/10">
                    <h4 className="font-bold text-purple-400 mb-2">Overhead</h4>
                    <p className="text-sm text-gray-400">Ratio of Ant Scouts to Total Packets. Shows how much work the system is doing to "search" for paths.</p>
                  </div>
                </div>
              </section>

              <section className="p-8 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-6">3. Operating the Simulation</h3>
                <ol className="list-decimal list-inside space-y-4 text-gray-300 text-lg">
                  <li><strong>Run Ant Waves:</strong> Send scout ants to discover the network. Observe how the lines on the graph get thicker (more pheromones).</li>
                  <li><strong>Trigger Evaporation:</strong> Simulate the passage of time. Old pheromones fade away, preventing the system from getting "stuck" on old, sub-optimal paths.</li>
                  <li><strong>Send Data:</strong> Once trails are established, send real data packets. These will follow the path of least resistance (highest pheromones).</li>
                  <li><strong>Test Resilience:</strong> Use the "Failure" scenario to break Node D. Observe how PDR drops, then recovers as you send new Ants to find the A-C-E path.</li>
                  <li><strong>System Reset:</strong> Use the Refresh icon in the controls panel to clear all data, metrics, and logs for a new trial.</li>
                </ol>
              </section>
            </div>
            
            <div className="p-6 bg-white/5 border-t border-white/10 text-center">
              <button 
                onClick={onClose}
                className="btn bg-blue-500 hover:bg-blue-600 px-10"
              >
                Close Guide
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InlineGuide;
