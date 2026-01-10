/**
 * Card generation utilities
 */

import type { Card, Suit, Value, DealerCard, HandType } from '../types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

function randomSuit(): Suit {
  return SUITS[Math.floor(Math.random() * SUITS.length)];
}

function createCard(value: Value, suit: Suit): Card {
  return {
    value,
    suit,
    isRed: suit === 'hearts' || suit === 'diamonds',
  };
}

/**
 * Get numeric value of a card
 */
export function cardValue(card: Value): number {
  if (card === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card)) return 10;
  return parseInt(card);
}

/**
 * Generate cards to match a specific hand
 */
export function generateHandCards(handType: HandType, handKey: string | number): Card[] {
  if (handType === 'pair') {
    const pairValue = (handKey as string).split(',')[0];
    let value: Value;
    if (pairValue === 'T') {
      const tenCards: Value[] = ['10', 'J', 'Q', 'K'];
      value = tenCards[Math.floor(Math.random() * tenCards.length)];
    } else {
      value = pairValue as Value;
    }
    return [
      createCard(value, randomSuit()),
      createCard(value, randomSuit()),
    ];
  }

  if (handType === 'soft') {
    const parts = (handKey as string).split(',');
    const otherValue = parts[1] as Value;
    return [
      createCard('A', randomSuit()),
      createCard(otherValue, randomSuit()),
    ];
  }

  if (handType === 'hard') {
    const total = typeof handKey === 'number' ? handKey : parseInt(String(handKey));

    // Generate two cards that sum to the total
    const possibleCombos: [Value, Value][] = [];

    // Try different combinations
    for (let i = 2; i <= 11; i++) {
      const j = total - (i === 11 ? 1 : i);
      if (j >= 2 && j <= 10 && i !== j) {
        if (i === 11) {
          // Ace as 1 in hard hand (only for totals 12-21)
          if (total >= 12 && total <= 21) {
            possibleCombos.push(['A', j.toString() as Value]);
          }
        } else if (j >= 2 && j <= 10) {
          possibleCombos.push([i.toString() as Value, j.toString() as Value]);
        }
      }
    }

    // Add 10-value cards
    const tenCards: Value[] = ['10', 'J', 'Q', 'K'];
    for (const tc of tenCards) {
      const other = total - 10;
      if (other >= 2 && other <= 10 && other !== 10) {
        possibleCombos.push([tc, other.toString() as Value]);
      }
    }

    // Filter out combos that would create soft hands
    const validCombos = possibleCombos.filter(([a, b]) => {
      if (a === 'A' || b === 'A') {
        const nonAce = a === 'A' ? b : a;
        const nonAceVal = cardValue(nonAce);
        return nonAceVal + 11 > 21;
      }
      return true;
    });

    if (validCombos.length === 0) {
      // Fallback
      const half = Math.floor(total / 2);
      const remainder = total - half;
      return [
        createCard(half.toString() as Value, randomSuit()),
        createCard(remainder.toString() as Value, randomSuit()),
      ];
    }

    const combo = validCombos[Math.floor(Math.random() * validCombos.length)];
    return [
      createCard(combo[0], randomSuit()),
      createCard(combo[1], randomSuit()),
    ];
  }

  return [];
}

/**
 * Generate dealer upcard
 */
export function generateDealerCard(targetValue: DealerCard): Card {
  let value: Value = targetValue;
  if (targetValue === '10') {
    const tenCards: Value[] = ['10', 'J', 'Q', 'K'];
    value = tenCards[Math.floor(Math.random() * tenCards.length)];
  }
  return createCard(value, randomSuit());
}

/**
 * Format hand for display
 */
export function formatHandLabel(handType: HandType, handKey: string | number): string {
  if (handType === 'pair') {
    const val = (handKey as string).split(',')[0];
    return `Pair of ${val === 'T' ? '10s' : val === 'A' ? 'Aces' : val + 's'}`;
  }
  if (handType === 'soft') {
    const parts = (handKey as string).split(',');
    const total = 11 + parseInt(parts[1]);
    return `Soft ${total}`;
  }
  return `Hard ${handKey}`;
}
