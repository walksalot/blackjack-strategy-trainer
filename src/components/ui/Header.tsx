import type { TrainingMode } from '../../types';

interface HeaderProps {
  mode: TrainingMode;
  onModeChange: (mode: TrainingMode) => void;
  onShowChart: () => void;
  onShowStats: () => void;
  streak: number;
  accuracy: string;
  total: number;
}

const MODE_LABELS: Record<TrainingMode, { label: string; description: string }> = {
  critical: { label: 'Critical', description: 'Focus on most-misplayed hands' },
  hard: { label: 'Hard', description: 'Challenging situations' },
  balanced: { label: 'Balanced', description: 'Mix of all difficulties' },
  random: { label: 'Random', description: 'Pure random selection' },
};

export function Header({ mode, onModeChange, onShowChart, onShowStats, streak, accuracy, total }: HeaderProps) {
  return (
    <header className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
            <span className="text-black font-bold text-sm sm:text-lg">BJ</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-semibold text-lg">Strategy Trainer</h1>
            <p className="text-white/50 text-xs">Cosmo High Roller Rules</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          {total > 0 && (
            <>
              <div className="text-center">
                <div className="text-white/50 text-xs">Streak</div>
                <div className={`font-bold ${streak >= 5 ? 'text-gold' : 'text-white'}`}>
                  {streak}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/50 text-xs">Accuracy</div>
                <div className={`font-bold ${parseFloat(accuracy) >= 80 ? 'text-green-400' : parseFloat(accuracy) >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {accuracy}%
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as TrainingMode)}
            className="bg-white/10 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-white/20 focus:outline-none focus:border-gold/50 cursor-pointer"
            title={MODE_LABELS[mode].description}
          >
            {(Object.keys(MODE_LABELS) as TrainingMode[]).map((m) => (
              <option key={m} value={m} className="bg-gray-900 text-white">
                {MODE_LABELS[m].label}
              </option>
            ))}
          </select>

          {/* Chart Button */}
          <button
            onClick={onShowChart}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            title="Show Strategy Chart"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>

          {/* Stats Button */}
          <button
            onClick={onShowStats}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            title="Show Statistics"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
