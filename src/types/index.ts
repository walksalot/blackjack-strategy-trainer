// Card Types
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Value = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type DealerCard = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'A';

export interface Card {
  value: Value;
  suit: Suit;
  isRed: boolean;
}

// Game Types
export type Action = 'H' | 'S' | 'D' | 'P' | 'R';
export type RawAction = Action | 'Ds' | 'Rh' | 'Rs' | 'Rp' | 'Ph';
export type HandType = 'hard' | 'soft' | 'pair';
export type TrainingMode = 'critical' | 'hard' | 'balanced' | 'random';

export interface Hand {
  handType: HandType;
  handKey: string | number;
  dealerCard: DealerCard;
  weight: number;
  note: string | null;
}

export interface CurrentHand extends Hand {
  playerCards: Card[];
  dealerCardObj: Card;
  correctAction: Action;
  availableActions: Action[];
  startTime: number;
}

export interface ActionResult {
  isCorrect: boolean;
  userAction: Action;
  correctAction: Action;
  explanation: string;
  responseTime: number;
  streak: number;
  sessionAccuracy: string;
}

export interface GameState {
  mode: TrainingMode;
  currentHand: CurrentHand | null;
  isShowingFeedback: boolean;
  lastResult: ActionResult | null;
  streak: number;
  sessionCorrect: number;
  sessionTotal: number;
}

// Stats Types
export interface HandStats {
  attempts: number;
  correct: number;
  totalTime: number;
}

// Spaced Repetition Queue Item
export interface MistakeQueueItem {
  handKey: string;            // e.g., "soft_A,7_10"
  consecutiveCorrect: number; // 0-3, graduates at 3
  lastShownAt: number;        // timestamp for spacing
  addedAt: number;            // when first missed
}

export interface StoredStats {
  totalHands: number;
  totalCorrect: number;
  bestStreak: number;
  byHand: Record<string, HandStats>;
  lastPlayed: string | null;
  mistakeQueue: MistakeQueueItem[];  // Spaced repetition queue
}

export interface SessionStats {
  total: number;
  correct: number;
  accuracy: string;
  streak: number;
  bestStreak: number;
}

export interface WeakSpot {
  key: string;
  accuracy: string;
  attempts: number;
  correct: number;
  avgTime: string;
  formattedHand: string;
}

// Suit symbols for display
export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

// Action display names
export const ACTION_NAMES: Record<Action, string> = {
  H: 'HIT',
  S: 'STAND',
  D: 'DOUBLE',
  P: 'SPLIT',
  R: 'SURRENDER',
};

// Action colors for UI
export const ACTION_COLORS: Record<Action, { bg: string; border: string; text: string }> = {
  H: { bg: 'bg-cyan-500', border: 'border-cyan-400', text: 'text-cyan-400' },
  S: { bg: 'bg-green-500', border: 'border-green-400', text: 'text-green-400' },
  D: { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400' },
  P: { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-400' },
  R: { bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-400' },
};
