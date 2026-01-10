import { Card, CardBack } from './Card';
import type { Card as CardType } from '../../types';

interface HandProps {
  cards: CardType[];
  isDealing?: boolean;
  highlight?: 'correct' | 'incorrect' | null;
  label?: string;
  showLabel?: boolean;
}

export function Hand({ cards, isDealing = false, highlight = null, label, showLabel = true }: HandProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center -space-x-6 sm:-space-x-8">
        {cards.map((card, index) => (
          <Card
            key={`${card.value}-${card.suit}-${index}`}
            card={card}
            index={index}
            isDealing={isDealing}
            highlight={highlight}
          />
        ))}
      </div>
      {showLabel && label && (
        <span className="text-lg sm:text-xl font-semibold text-white/90 bg-black/30 px-4 py-1 rounded-full">
          {label}
        </span>
      )}
    </div>
  );
}

interface DealerHandProps {
  card: CardType;
  isDealing?: boolean;
}

export function DealerHand({ card, isDealing = false }: DealerHandProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Dealer Shows</span>
      <div className="flex items-center justify-center -space-x-6 sm:-space-x-8">
        <Card card={card} index={0} isDealing={isDealing} />
        <CardBack index={1} isDealing={isDealing} />
      </div>
    </div>
  );
}
