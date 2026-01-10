import { Modal } from '../ui/Modal';
import { HARD, SOFT, PAIRS, DEALER_CARDS, resolveAction } from '../../data/strategy';
import type { Action, RawAction } from '../../types';

interface StrategyChartProps {
  isOpen: boolean;
  onClose: () => void;
  currentHand?: {
    handType: string;
    handKey: string | number;
    dealerCard: string;
  } | null;
}

const ACTION_COLORS: Record<Action, string> = {
  H: 'bg-cyan-500',
  S: 'bg-green-500',
  D: 'bg-amber-500',
  P: 'bg-purple-500',
  R: 'bg-orange-500',
};

const ACTION_LABELS: Record<Action, string> = {
  H: 'H',
  S: 'S',
  D: 'D',
  P: 'P',
  R: 'R',
};

function ChartCell({ action, isHighlighted }: { action: RawAction; isHighlighted?: boolean }) {
  const resolved = resolveAction(action);
  return (
    <td
      className={`
        ${ACTION_COLORS[resolved]}
        text-white text-[10px] sm:text-xs font-bold text-center
        w-6 h-6 sm:w-7 sm:h-7
        ${isHighlighted ? 'ring-2 ring-white ring-offset-1 ring-offset-black scale-125 z-10' : ''}
      `}
    >
      {ACTION_LABELS[resolved]}
    </td>
  );
}

function ChartTable({
  title,
  data,
  rowLabels,
  currentHand,
  chartType,
}: {
  title: string;
  data: Record<string | number, RawAction[]>;
  rowLabels: (string | number)[];
  currentHand?: { handType: string; handKey: string | number; dealerCard: string } | null;
  chartType: string;
}) {
  const dealerIdx = (card: string) => {
    if (card === 'A') return 9;
    if (['K', 'Q', 'J', '10'].includes(card)) return 8;
    return parseInt(card) - 2;
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-semibold text-sm sm:text-base mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="text-white/50 text-[10px] sm:text-xs p-1"></th>
              {DEALER_CARDS.map((card) => (
                <th key={card} className="text-white/70 text-[10px] sm:text-xs font-medium p-1 w-6 sm:w-7">
                  {card}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map((label) => {
              const row = data[label];
              if (!row) return null;

              return (
                <tr key={String(label)}>
                  <td className="text-white/70 text-[10px] sm:text-xs font-medium pr-2 text-right whitespace-nowrap">
                    {chartType === 'soft' ? `A,${String(label).replace('A,', '')}` : String(label)}
                  </td>
                  {row.map((action, idx) => {
                    const isHighlighted =
                      currentHand &&
                      currentHand.handType === chartType &&
                      String(currentHand.handKey) === String(label) &&
                      dealerIdx(currentHand.dealerCard) === idx;

                    return (
                      <ChartCell
                        key={idx}
                        action={action}
                        isHighlighted={isHighlighted || undefined}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StrategyChart({ isOpen, onClose, currentHand }: StrategyChartProps) {
  const hardLabels = [21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5];
  const softLabels = ['A,9', 'A,8', 'A,7', 'A,6', 'A,5', 'A,4', 'A,3', 'A,2'];
  const pairLabels = ['A,A', 'T,T', '9,9', '8,8', '7,7', '6,6', '5,5', '4,4', '3,3', '2,2'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Basic Strategy Chart" size="full">
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-cyan-500 rounded" />
            <span className="text-white/70 text-xs">Hit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-green-500 rounded" />
            <span className="text-white/70 text-xs">Stand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-amber-500 rounded" />
            <span className="text-white/70 text-xs">Double</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-purple-500 rounded" />
            <span className="text-white/70 text-xs">Split</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-orange-500 rounded" />
            <span className="text-white/70 text-xs">Surrender</span>
          </div>
        </div>

        <p className="text-white/50 text-xs">
          6-Deck | Dealer Stands on Soft 17 | DAS Allowed | Late Surrender
        </p>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartTable
            title="Hard Hands"
            data={HARD}
            rowLabels={hardLabels}
            currentHand={currentHand}
            chartType="hard"
          />

          <ChartTable
            title="Soft Hands"
            data={SOFT}
            rowLabels={softLabels}
            currentHand={currentHand}
            chartType="soft"
          />

          <ChartTable
            title="Pairs"
            data={PAIRS}
            rowLabels={pairLabels}
            currentHand={currentHand}
            chartType="pair"
          />
        </div>

        {/* Key Notes */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="text-white/70 text-xs font-semibold mb-2">Critical Hands to Remember:</h4>
          <ul className="text-white/50 text-xs space-y-1">
            <li>• <strong className="text-white">Soft 18 vs 9, 10, A</strong>: HIT (not stand!)</li>
            <li>• <strong className="text-white">Hard 12 vs 2, 3</strong>: HIT (not stand)</li>
            <li>• <strong className="text-white">Hard 16 vs 9, 10, A</strong>: SURRENDER</li>
            <li>• <strong className="text-white">Always split 8s and Aces</strong></li>
            <li>• <strong className="text-white">Never split 10s or 5s</strong></li>
            <li>• <strong className="text-white">9,9 vs 7</strong>: STAND (not split)</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
