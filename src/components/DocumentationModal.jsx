import { X, BookOpen, Zap, Target, RefreshCw, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentationModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] glass-card overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-400" />
                <h2 className="text-2xl font-bold">System Documentation (A-Z)</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="doc-content-area">
              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <Zap size={20} /> 1. What is Ant Colony Optimization?
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  ACO is a bio-inspired algorithm based on the behavior of real ants. In nature, ants wander randomly, and upon finding food, return to their colony while laying down pheromone trails. If other ants find such a path, they follow it, reinforcing the trail. Over time, the shortest paths receive the most pheromones and become the dominant routes.
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <Target size={18} /> Phase A: Forward Ant
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    The "Forward Ant" is a scout. It moves from Node A to Node E. At each node, it doesn't just pick a path randomly; it uses a <strong>Probabilistic Rule</strong>. It favors paths with high pheromones (τ) and short distances (1/dist).
                  </p>
                  <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 font-mono text-[10px] text-blue-300">
                    P = (τ^α * η^β) / Σ(τ^α * η^β)
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <RefreshCw size={18} /> Phase B: Backward Ant
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Once the Forward Ant reaches the destination (E), it turns into a <strong>Backward Ant</strong>. It retraces its exact path and deposits "Pheromones". Shorter paths get a much larger deposit (Q / Path_Length), making them more attractive for future ants.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} /> 2. Measuring Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="font-bold text-sm mb-1">PDR</h4>
                    <p className="text-xs text-gray-500">Packet Delivery Ratio. The % of data packets that successfully reach node E without getting lost in loops or dead ends.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="font-bold text-sm mb-1">Avg Delay</h4>
                    <p className="text-xs text-gray-500">The average "distance" traveled by successful packets. Lower delay means the ACO found more efficient routes.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="font-bold text-sm mb-1">Overhead</h4>
                    <p className="text-xs text-gray-500">The ratio of "Ant Scouts" to total network traffic. High overhead means the system is spending too much energy exploring.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-rose-400 mb-4">3. Operating the Simulation</h3>
                <ol className="list-decimal list-inside space-y-4 text-gray-300">
                  <li><strong>Run Ant Waves:</strong> Send scout ants to discover the network. Observe how the lines on the graph get thicker (more pheromones).</li>
                  <li><strong>Trigger Evaporation:</strong> Simulate the passage of time. Old pheromones fade away, preventing the system from getting "stuck" on old, sub-optimal paths.</li>
                  <li><strong>Send Data:</strong> Once trails are established, send real data packets. These will follow the path of least resistance (highest pheromones).</li>
                  <li><strong>Test Resilience:</strong> Use the "Failure" scenario to break Node D. Observe how PDR drops, then recovers as you send new Ants to find the A-C-E path.</li>
                </ol>
              </section>
            </div>

            <div className="p-6 border-t border-white/10 bg-white/5 text-center">
              <button 
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-2 rounded-xl font-bold transition-all"
              >
                Got it, let's simulate!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DocumentationModal;
