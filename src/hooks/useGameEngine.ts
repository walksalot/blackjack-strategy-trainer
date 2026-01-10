import { useState, useCallback, useRef } from 'react';
import type { GameState, Action, TrainingMode, ActionResult, CurrentHand, StoredStats, WeakSpot } from '../types';
import { getNextHand, QUEUE_CONFIG } from '../data/weights';
import { getCorrectAction, getExplanation } from '../data/strategy';
import { generateHandCards, generateDealerCard, formatHandLabel } from '../lib/cardGenerator';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_STATS: StoredStats = {
  totalHands: 0,
  totalCorrect: 0,
  bestStreak: 0,
  byHand: {},
  lastPlayed: null,
  mistakeQueue: [],  // Spaced repetition queue
};

const INITIAL_STATE: GameState = {
  mode: 'balanced',
  currentHand: null,
  isShowingFeedback: false,
  lastResult: null,
  streak: 0,
  sessionCorrect: 0,
  sessionTotal: 0,
};

export function useGameEngine() {
  const [stats, setStats] = useLocalStorage<StoredStats>('blackjack_trainer_stats', DEFAULT_STATS);
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  // Track queue-related state
  const lastHandKeyRef = useRef<string | null>(null);
  const handsSinceQueueRef = useRef<number>(0);
  const currentFromQueueRef = useRef<boolean>(false);
  const currentQueueIndexRef = useRef<number>(-1);

  const generateHand = useCallback(() => {
    // Use getNextHand with queue support
    const { hand, fromQueue, queueIndex } = getNextHand(
      state.mode,
      stats.mistakeQueue || [],
      lastHandKeyRef.current,
      handsSinceQueueRef.current
    );

    const playerCards = generateHandCards(hand.handType, hand.handKey);
    const dealerCardObj = generateDealerCard(hand.dealerCard);
    const correctAction = getCorrectAction(hand.handType, hand.handKey, hand.dealerCard, true);

    if (!correctAction) {
      console.error('Failed to get correct action for hand:', hand);
      return;
    }

    // Determine available actions
    const availableActions: Action[] = ['H', 'S', 'D', 'R'];
    if (hand.handType === 'pair') {
      availableActions.push('P');
    }

    const currentHand: CurrentHand = {
      ...hand,
      playerCards,
      dealerCardObj,
      correctAction,
      availableActions,
      startTime: Date.now(),
    };

    // Track if this hand is from queue
    currentFromQueueRef.current = fromQueue;
    currentQueueIndexRef.current = queueIndex;

    // Update last hand key and queue gap counter
    const handKey = `${hand.handType}_${hand.handKey}_${hand.dealerCard}`;
    lastHandKeyRef.current = handKey;

    if (fromQueue) {
      handsSinceQueueRef.current = 0;
      // Update lastShownAt for queue item
      if (queueIndex >= 0 && stats.mistakeQueue) {
        const newQueue = [...stats.mistakeQueue];
        newQueue[queueIndex] = { ...newQueue[queueIndex], lastShownAt: Date.now() };
        setStats({ ...stats, mistakeQueue: newQueue });
      }
    } else {
      handsSinceQueueRef.current++;
    }

    setState(prev => ({
      ...prev,
      currentHand,
      isShowingFeedback: false,
      lastResult: null,
    }));
  }, [state.mode, stats, setStats]);

  const isActionCorrect = useCallback((userAction: Action, correctAction: Action): boolean => {
    if (userAction === correctAction) return true;
    // If correct is Double but user hits, that's acceptable
    if (correctAction === 'D' && userAction === 'H') return true;
    return false;
  }, []);

  const getStatsKey = useCallback((hand: CurrentHand): string => {
    return `${hand.handType}_${hand.handKey}_${hand.dealerCard}`;
  }, []);

  const submitAction = useCallback((action: Action): ActionResult | null => {
    if (!state.currentHand || state.isShowingFeedback) return null;

    const responseTime = Date.now() - state.currentHand.startTime;
    const isCorrect = isActionCorrect(action, state.currentHand.correctAction);

    // Update session stats
    const newStreak = isCorrect ? state.streak + 1 : 0;
    const newSessionCorrect = state.sessionCorrect + (isCorrect ? 1 : 0);
    const newSessionTotal = state.sessionTotal + 1;

    // Update persistent stats
    const handKey = getStatsKey(state.currentHand);
    const newStats = { ...stats };

    // Initialize mistakeQueue if missing (backwards compatibility)
    if (!newStats.mistakeQueue) {
      newStats.mistakeQueue = [];
    }

    if (!newStats.byHand[handKey]) {
      newStats.byHand[handKey] = { attempts: 0, correct: 0, totalTime: 0 };
    }
    newStats.byHand[handKey].attempts++;
    if (isCorrect) newStats.byHand[handKey].correct++;
    newStats.byHand[handKey].totalTime += responseTime;

    newStats.totalHands++;
    if (isCorrect) newStats.totalCorrect++;
    if (newStreak > newStats.bestStreak) {
      newStats.bestStreak = newStreak;
    }
    newStats.lastPlayed = new Date().toISOString();

    // ===== SPACED REPETITION QUEUE MANAGEMENT =====
    const existingQueueIndex = newStats.mistakeQueue.findIndex(item => item.handKey === handKey);
    const wasFromQueue = currentFromQueueRef.current;

    if (!isCorrect) {
      // INCORRECT: Add to queue or reset consecutive count
      if (existingQueueIndex >= 0) {
        // Already in queue - reset consecutive correct
        newStats.mistakeQueue[existingQueueIndex].consecutiveCorrect = 0;
        newStats.mistakeQueue[existingQueueIndex].lastShownAt = Date.now();
      } else {
        // New mistake - add to queue
        newStats.mistakeQueue.push({
          handKey,
          consecutiveCorrect: 0,
          lastShownAt: Date.now(),
          addedAt: Date.now(),
        });
      }
    } else if (wasFromQueue && existingQueueIndex >= 0) {
      // CORRECT and was from queue: increment consecutive count
      const item = newStats.mistakeQueue[existingQueueIndex];
      item.consecutiveCorrect++;
      item.lastShownAt = Date.now();

      // Check for graduation
      if (item.consecutiveCorrect >= QUEUE_CONFIG.GRADUATION_THRESHOLD) {
        // Graduate! Remove from queue
        newStats.mistakeQueue.splice(existingQueueIndex, 1);
      }
    }
    // ===== END QUEUE MANAGEMENT =====

    setStats(newStats);

    const result: ActionResult = {
      isCorrect,
      userAction: action,
      correctAction: state.currentHand.correctAction,
      explanation: getExplanation(
        state.currentHand.handType,
        state.currentHand.handKey,
        state.currentHand.dealerCard,
        state.currentHand.correctAction
      ),
      responseTime,
      streak: newStreak,
      sessionAccuracy: newSessionTotal > 0
        ? (newSessionCorrect / newSessionTotal * 100).toFixed(1)
        : '0',
    };

    setState(prev => ({
      ...prev,
      streak: newStreak,
      sessionCorrect: newSessionCorrect,
      sessionTotal: newSessionTotal,
      isShowingFeedback: true,
      lastResult: result,
    }));

    return result;
  }, [state, stats, setStats, isActionCorrect, getStatsKey]);

  const setMode = useCallback((mode: TrainingMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const dismissFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      isShowingFeedback: false,
    }));
  }, []);

  const getSessionStats = useCallback(() => ({
    total: state.sessionTotal,
    correct: state.sessionCorrect,
    accuracy: state.sessionTotal > 0
      ? (state.sessionCorrect / state.sessionTotal * 100).toFixed(1)
      : '0',
    streak: state.streak,
    bestStreak: stats.bestStreak,
  }), [state, stats]);

  const getLifetimeStats = useCallback(() => ({
    totalHands: stats.totalHands,
    totalCorrect: stats.totalCorrect,
    accuracy: stats.totalHands > 0
      ? (stats.totalCorrect / stats.totalHands * 100).toFixed(1)
      : '0',
    bestStreak: stats.bestStreak,
  }), [stats]);

  const getWeakSpots = useCallback((minAttempts = 3, limit = 5): WeakSpot[] => {
    const weakSpots: WeakSpot[] = [];

    for (const [key, data] of Object.entries(stats.byHand)) {
      if (data.attempts >= minAttempts) {
        const accuracy = data.correct / data.attempts;

        // Parse key to get formatted hand
        const parts = key.split('_');
        const handType = parts[0];
        const handKey = parts.slice(1, -1).join('_');
        const dealerCard = parts[parts.length - 1];

        let formattedHand: string;
        if (handType === 'pair') {
          formattedHand = `${handKey.replace(',', 's')} vs ${dealerCard}`;
        } else if (handType === 'soft') {
          const softTotal = 11 + parseInt(handKey.split(',')[1]);
          formattedHand = `Soft ${softTotal} vs ${dealerCard}`;
        } else {
          formattedHand = `Hard ${handKey} vs ${dealerCard}`;
        }

        weakSpots.push({
          key,
          accuracy: (accuracy * 100).toFixed(1),
          attempts: data.attempts,
          correct: data.correct,
          avgTime: (data.totalTime / data.attempts / 1000).toFixed(2),
          formattedHand,
        });
      }
    }

    weakSpots.sort((a, b) => parseFloat(a.accuracy) - parseFloat(b.accuracy));
    return weakSpots.slice(0, limit);
  }, [stats]);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    setState(INITIAL_STATE);
  }, [setStats]);

  const getHandLabel = useCallback((): string => {
    if (!state.currentHand) return '';
    return formatHandLabel(state.currentHand.handType, state.currentHand.handKey);
  }, [state.currentHand]);

  const getQueueStats = useCallback(() => ({
    count: stats.mistakeQueue?.length || 0,
    items: stats.mistakeQueue || [],
  }), [stats.mistakeQueue]);

  return {
    state,
    generateHand,
    submitAction,
    setMode,
    dismissFeedback,
    getSessionStats,
    getLifetimeStats,
    getWeakSpots,
    getQueueStats,
    resetStats,
    getHandLabel,
  };
}
