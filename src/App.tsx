import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameEngine } from './hooks/useGameEngine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useSound } from './hooks/useSound';
import { Header } from './components/ui/Header';
import { Hand, DealerHand } from './components/cards/Hand';
import { ActionButtons } from './components/game/ActionButtons';
import { Feedback, CorrectFlash, IncorrectFlash } from './components/game/Feedback';
import { StrategyChart } from './components/strategy/StrategyChart';
import { StatsModal } from './components/ui/StatsModal';
import type { Action } from './types';

function App() {
  const {
    state,
    generateHand,
    submitAction,
    setMode,
    dismissFeedback,
    getSessionStats,
    getLifetimeStats,
    getWeakSpots,
    resetStats,
    getHandLabel,
  } = useGameEngine();

  const { playCorrect, playIncorrect } = useSound();

  const [showChart, setShowChart] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showCorrectFlash, setShowCorrectFlash] = useState(false);
  const [showIncorrectFlash, setShowIncorrectFlash] = useState(false);
  const [isDealing, setIsDealing] = useState(false);

  // Generate first hand on mount
  useEffect(() => {
    generateHand();
    setIsDealing(true);
  }, []);

  // Handle action submission
  const handleAction = useCallback((action: Action) => {
    if (state.isShowingFeedback || !state.currentHand) return;

    const result = submitAction(action);
    if (!result) return;

    if (result.isCorrect) {
      playCorrect();
      setShowCorrectFlash(true);
      setTimeout(() => setShowCorrectFlash(false), 200);

      // Auto-advance after correct answer
      setTimeout(() => {
        dismissFeedback();
        setIsDealing(true);
        generateHand();
      }, 400);
    } else {
      playIncorrect();
      setShowIncorrectFlash(true);
      setTimeout(() => setShowIncorrectFlash(false), 200);
    }
  }, [state.isShowingFeedback, state.currentHand, submitAction, playCorrect, playIncorrect, dismissFeedback, generateHand]);

  // Handle advancing to next hand
  const handleNext = useCallback(() => {
    if (!state.isShowingFeedback) return;
    dismissFeedback();
    setIsDealing(true);
    generateHand();
  }, [state.isShowingFeedback, dismissFeedback, generateHand]);

  // Reset dealing animation flag
  useEffect(() => {
    if (isDealing) {
      const timer = setTimeout(() => setIsDealing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isDealing, state.currentHand]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: handleAction,
    onNext: handleNext,
    disabled: !state.currentHand || state.isShowingFeedback,
    isShowingFeedback: state.isShowingFeedback,
    availableActions: state.currentHand?.availableActions || [],
  });

  const sessionStats = getSessionStats();
  const lifetimeStats = getLifetimeStats();
  const weakSpots = getWeakSpots();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-felt-dark via-felt to-felt-dark">
      {/* Flashes */}
      <CorrectFlash show={showCorrectFlash} />
      <IncorrectFlash show={showIncorrectFlash} />

      {/* Header */}
      <Header
        mode={state.mode}
        onModeChange={setMode}
        onShowChart={() => setShowChart(true)}
        onShowStats={() => setShowStats(true)}
        streak={state.streak}
        accuracy={sessionStats.accuracy}
        total={sessionStats.total}
      />

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6 sm:gap-8">
        {state.currentHand && (
          <>
            {/* Dealer */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DealerHand
                card={state.currentHand.dealerCardObj}
                isDealing={isDealing}
              />
            </motion.div>

            {/* VS Divider */}
            <div className="text-white/30 text-sm font-medium">vs</div>

            {/* Player Hand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Hand
                cards={state.currentHand.playerCards}
                isDealing={isDealing}
                label={getHandLabel()}
                highlight={
                  state.lastResult
                    ? state.lastResult.isCorrect
                      ? 'correct'
                      : 'incorrect'
                    : null
                }
              />
            </motion.div>

            {/* Note for critical hands */}
            {state.currentHand.note && !state.isShowingFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gold/80 text-sm text-center px-4 py-2 bg-gold/10 rounded-lg border border-gold/20"
              >
                {state.currentHand.weight >= 4 ? '⚠️ ' : ''}
                Tricky situation!
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Action Buttons */}
      <div className="pb-8 sm:pb-12 px-4">
        <ActionButtons
          availableActions={state.currentHand?.availableActions || []}
          onAction={handleAction}
          disabled={!state.currentHand || state.isShowingFeedback}
          highlightCorrect={
            state.isShowingFeedback && state.lastResult && !state.lastResult.isCorrect
              ? state.lastResult.correctAction
              : null
          }
        />

        {/* Keyboard hint */}
        <p className="text-center text-white/30 text-xs mt-4">
          Use keyboard: H S D P R • Space to continue
        </p>
      </div>

      {/* Feedback */}
      <Feedback
        result={state.lastResult}
        isVisible={state.isShowingFeedback}
        onDismiss={handleNext}
      />

      {/* Modals */}
      <StrategyChart
        isOpen={showChart}
        onClose={() => setShowChart(false)}
        currentHand={state.currentHand}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        sessionStats={sessionStats}
        lifetimeStats={lifetimeStats}
        weakSpots={weakSpots}
        onReset={resetStats}
      />
    </div>
  );
}

export default App;
