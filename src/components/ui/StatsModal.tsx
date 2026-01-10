import { Modal } from './Modal';
import type { SessionStats, WeakSpot } from '../../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionStats: SessionStats;
  lifetimeStats: { totalHands: number; totalCorrect: number; accuracy: string; bestStreak: number };
  weakSpots: WeakSpot[];
  queueCount: number;
  onReset: () => void;
}

export function StatsModal({ isOpen, onClose, sessionStats, lifetimeStats, weakSpots, queueCount, onReset }: StatsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics" size="md">
      <div className="space-y-6">
        {/* Session Stats */}
        <div>
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">This Session</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Hands" value={sessionStats.total.toString()} />
            <StatCard label="Correct" value={sessionStats.correct.toString()} />
            <StatCard
              label="Accuracy"
              value={`${sessionStats.accuracy}%`}
              color={parseFloat(sessionStats.accuracy) >= 80 ? 'green' : parseFloat(sessionStats.accuracy) >= 60 ? 'yellow' : 'red'}
            />
            <StatCard label="Streak" value={sessionStats.streak.toString()} color={sessionStats.streak >= 5 ? 'gold' : undefined} />
          </div>
        </div>

        {/* Lifetime Stats */}
        <div>
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">All Time</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Hands" value={lifetimeStats.totalHands.toString()} />
            <StatCard label="Total Correct" value={lifetimeStats.totalCorrect.toString()} />
            <StatCard
              label="Accuracy"
              value={`${lifetimeStats.accuracy}%`}
              color={parseFloat(lifetimeStats.accuracy) >= 80 ? 'green' : parseFloat(lifetimeStats.accuracy) >= 60 ? 'yellow' : 'red'}
            />
            <StatCard label="Best Streak" value={lifetimeStats.bestStreak.toString()} color="gold" />
          </div>
        </div>

        {/* Weak Spots */}
        {weakSpots.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Areas to Improve</h3>
            <div className="space-y-2">
              {weakSpots.map((spot) => (
                <div
                  key={spot.key}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <span className="text-white font-medium">{spot.formattedHand}</span>
                    <span className="text-white/50 text-sm ml-2">({spot.attempts} attempts)</span>
                  </div>
                  <span className={`font-bold ${parseFloat(spot.accuracy) < 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {spot.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Queue */}
        <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div>
            <span className="text-white font-medium">Review Queue</span>
            <span className="text-white/50 text-sm ml-2">(hands you missed)</span>
          </div>
          <span className={`font-bold ${queueCount > 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {queueCount} {queueCount === 1 ? 'hand' : 'hands'}
          </span>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => {
              if (window.confirm('Reset all statistics? This cannot be undone.')) {
                onReset();
                onClose();
              }
            }}
            className="w-full py-2 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Reset All Statistics
          </button>
        </div>
      </div>
    </Modal>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: 'green' | 'yellow' | 'red' | 'gold' }) {
  const colorClasses = {
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    gold: 'text-gold',
  };

  return (
    <div className="bg-white/5 rounded-lg p-3 text-center">
      <div className="text-white/50 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-bold ${color ? colorClasses[color] : 'text-white'}`}>{value}</div>
    </div>
  );
}
