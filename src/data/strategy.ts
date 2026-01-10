/**
 * Complete Basic Strategy Chart for 6-Deck, Dealer Stands on Soft 17 (S17)
 * Optimized for Cosmo Casino High Limit Room
 *
 * Rules: 6 deck, S17, DAS allowed, Late Surrender allowed, Resplit Aces
 *
 * Action Codes:
 * H  = Hit
 * S  = Stand
 * D  = Double (if not allowed, Hit)
 * Ds = Double (if not allowed, Stand)
 * P  = Split
 * Ph = Split if DAS allowed (else Hit)
 * Rh = Surrender if allowed (else Hit)
 * Rs = Surrender if allowed (else Stand)
 * Rp = Surrender if allowed (else Split)
 */

import type { DealerCard, Action, RawAction, HandType } from '../types';

// Dealer upcard indices: 2=0, 3=1, 4=2, 5=3, 6=4, 7=5, 8=6, 9=7, 10=8, A=9
export const DEALER_CARDS: DealerCard[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

// Convert dealer card to index
export function dealerIndex(card: DealerCard | string): number {
  if (card === 'A') return 9;
  if (card === 'K' || card === 'Q' || card === 'J' || card === '10') return 8;
  return parseInt(card) - 2;
}

// HARD HANDS (player total vs dealer upcard)
//                    2    3    4    5    6    7    8    9   10    A
export const HARD: Record<number, RawAction[]> = {
  5:  ['H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H'],
  6:  ['H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H'],
  7:  ['H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H'],
  8:  ['H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H',  'H'],
  9:  ['H',  'D',  'D',  'D',  'D',  'H',  'H',  'H',  'H',  'H'],
  10: ['D',  'D',  'D',  'D',  'D',  'D',  'D',  'D',  'H',  'H'],
  11: ['D',  'D',  'D',  'D',  'D',  'D',  'D',  'D',  'D',  'H'],
  12: ['H',  'H',  'S',  'S',  'S',  'H',  'H',  'H',  'H',  'H'],
  13: ['S',  'S',  'S',  'S',  'S',  'H',  'H',  'H',  'H',  'H'],
  14: ['S',  'S',  'S',  'S',  'S',  'H',  'H',  'H',  'H',  'H'],
  15: ['S',  'S',  'S',  'S',  'S',  'H',  'H',  'H',  'Rh', 'Rh'],
  16: ['S',  'S',  'S',  'S',  'S',  'H',  'H',  'Rh', 'Rh', 'Rh'],
  17: ['S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'Rs'],
  18: ['S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S'],
  19: ['S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S'],
  20: ['S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S'],
  21: ['S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S'],
};

// SOFT HANDS (Ace + X, counted as soft total)
//                      2    3    4    5    6    7    8    9   10    A
export const SOFT: Record<string, RawAction[]> = {
  'A,2': ['H',  'H',  'H',  'D',  'D',  'H',  'H',  'H',  'H',  'H'],  // Soft 13
  'A,3': ['H',  'H',  'H',  'D',  'D',  'H',  'H',  'H',  'H',  'H'],  // Soft 14
  'A,4': ['H',  'H',  'D',  'D',  'D',  'H',  'H',  'H',  'H',  'H'],  // Soft 15
  'A,5': ['H',  'H',  'D',  'D',  'D',  'H',  'H',  'H',  'H',  'H'],  // Soft 16
  'A,6': ['H',  'D',  'D',  'D',  'D',  'H',  'H',  'H',  'H',  'H'],  // Soft 17
  'A,7': ['Ds', 'Ds', 'Ds', 'Ds', 'Ds', 'S',  'S',  'H',  'H',  'H'],  // Soft 18 - CRITICAL!
  'A,8': ['S',  'S',  'S',  'S',  'Ds', 'S',  'S',  'S',  'S',  'S'],  // Soft 19
  'A,9': ['S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S'],  // Soft 20
};

// PAIRS (matching cards)
//                      2    3    4    5    6    7    8    9   10    A
export const PAIRS: Record<string, RawAction[]> = {
  '2,2': ['Ph', 'Ph', 'P',  'P',  'P',  'P',  'H',  'H',  'H',  'H'],
  '3,3': ['Ph', 'Ph', 'P',  'P',  'P',  'P',  'H',  'H',  'H',  'H'],
  '4,4': ['H',  'H',  'H',  'Ph', 'Ph', 'H',  'H',  'H',  'H',  'H'],
  '5,5': ['D',  'D',  'D',  'D',  'D',  'D',  'D',  'D',  'H',  'H'],  // Never split 5s!
  '6,6': ['Ph', 'P',  'P',  'P',  'P',  'H',  'H',  'H',  'H',  'H'],
  '7,7': ['P',  'P',  'P',  'P',  'P',  'P',  'H',  'H',  'H',  'H'],
  '8,8': ['P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'Rp'], // CRITICAL: Always split!
  '9,9': ['P',  'P',  'P',  'P',  'P',  'S',  'P',  'P',  'S',  'S'],  // Stand vs 7, 10, A!
  'T,T': ['S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S',  'S'],  // Never split 10s!
  'A,A': ['P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'P',  'P'],  // Always split!
};

// Cosmo High Limit Rules
export const RULES = {
  decks: 6,
  dealerStandsSoft17: true,  // S17
  doubleAfterSplit: true,    // DAS
  surrenderAllowed: true,    // Late surrender
  resplitAces: true,
  hitSplitAces: false,
  blackjackPays: 1.5,        // 3:2
  houseEdge: 0.0036,         // ~0.36%
} as const;

/**
 * Resolve conditional actions based on casino rules
 */
export function resolveAction(action: RawAction, canDouble = true): Action {
  switch (action) {
    case 'Ds':
      return canDouble ? 'D' : 'S';
    case 'D':
      return canDouble ? 'D' : 'H';
    case 'Rh':
      return RULES.surrenderAllowed ? 'R' : 'H';
    case 'Rs':
      return RULES.surrenderAllowed ? 'R' : 'S';
    case 'Rp':
      return RULES.surrenderAllowed ? 'R' : 'P';
    case 'Ph':
      return RULES.doubleAfterSplit ? 'P' : 'H';
    default:
      return action;
  }
}

/**
 * Get the correct action for a given hand
 */
export function getCorrectAction(
  handType: HandType,
  handKey: string | number,
  dealerCard: DealerCard,
  canDouble = true
): Action | null {
  const dIdx = dealerIndex(dealerCard);
  let rawAction: RawAction | undefined;

  switch (handType) {
    case 'hard':
      rawAction = HARD[handKey as number]?.[dIdx];
      break;
    case 'soft':
      rawAction = SOFT[handKey as string]?.[dIdx];
      break;
    case 'pair':
      rawAction = PAIRS[handKey as string]?.[dIdx];
      break;
    default:
      return null;
  }

  if (!rawAction) return null;

  return resolveAction(rawAction, canDouble);
}

/**
 * Get explanation for why this is the correct play
 */
export function getExplanation(
  handType: HandType,
  handKey: string | number,
  dealerCard: DealerCard,
  action: Action
): string {
  const key = `${handType}_${handKey}_${dealerCard}`;

  const explanations: Record<string, string> = {
    'soft_A,7_9': 'Soft 18 vs 9: Dealer likely makes 19+. HIT to improve!',
    'soft_A,7_10': 'Soft 18 vs 10: You lose more by standing. HIT!',
    'soft_A,7_A': 'Soft 18 vs Ace: Dealer has edge. Take a card!',
    'hard_12_2': 'Hard 12 vs 2: Dealer busts only 35%. HIT!',
    'hard_12_3': 'Hard 12 vs 3: Still not enough bust potential. HIT!',
    'hard_16_9': '16 vs 9: Surrender saves money long-term.',
    'hard_16_10': '16 vs 10: Worst hand in blackjack. SURRENDER!',
    'hard_16_A': '16 vs Ace: SURRENDER if allowed.',
    'pair_8,8_10': 'Split 8s vs 10: Two chances at 18 beats one 16.',
    'pair_8,8_A': 'Split 8s vs Ace: Painful but mathematically correct.',
    'pair_9,9_7': 'STAND with 18! Dealer likely has 17.',
    'hard_11_A': '11 vs Ace (6-deck): Just HIT, don\'t double.',
    'hard_15_10': 'SURRENDER 15 vs 10 to minimize losses.',
    'hard_15_A': 'SURRENDER 15 vs Ace - dealer too strong.',
    'hard_17_A': 'SURRENDER 17 vs Ace if allowed.',
    'soft_A,6_3': 'Soft 17: DOUBLE vs dealer bust cards!',
    'soft_A,6_4': 'Soft 17: DOUBLE vs dealer bust cards!',
    'soft_A,6_5': 'Soft 17: DOUBLE vs dealer bust cards!',
    'soft_A,6_6': 'Soft 17: DOUBLE vs dealer bust cards!',
    'pair_9,9_9': 'SPLIT 9s vs 9 for a slight edge.',
    'pair_9,9_10': 'STAND with 18 vs 10 - don\'t split.',
    'pair_9,9_A': 'STAND with 18 vs Ace - splitting is worse.',
  };

  return explanations[key] || `${action === 'H' ? 'HIT' : action === 'S' ? 'STAND' : action === 'D' ? 'DOUBLE' : action === 'P' ? 'SPLIT' : 'SURRENDER'} is the mathematically optimal play.`;
}
