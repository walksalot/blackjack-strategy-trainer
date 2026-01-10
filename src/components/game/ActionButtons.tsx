import { motion } from 'framer-motion';
import type { Action } from '../../types';

interface ActionButtonsProps {
  availableActions: Action[];
  onAction: (action: Action) => void;
  disabled: boolean;
  highlightCorrect?: Action | null;
}

const BUTTON_CONFIG: Record<Action, { label: string; key: string; bgClass: string; borderClass: string }> = {
  H: { label: 'HIT', key: 'H', bgClass: 'bg-cyan-500', borderClass: 'border-cyan-400' },
  S: { label: 'STAND', key: 'S', bgClass: 'bg-green-500', borderClass: 'border-green-400' },
  D: { label: 'DOUBLE', key: 'D', bgClass: 'bg-amber-500', borderClass: 'border-amber-400' },
  P: { label: 'SPLIT', key: 'P', bgClass: 'bg-purple-500', borderClass: 'border-purple-400' },
  R: { label: 'SURRENDER', key: 'R', bgClass: 'bg-orange-500', borderClass: 'border-orange-400' },
};

// Display order for buttons
const ACTION_ORDER: Action[] = ['H', 'S', 'D', 'P', 'R'];

export function ActionButtons({ availableActions, onAction, disabled, highlightCorrect }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
      {ACTION_ORDER.map((action) => {
        const config = BUTTON_CONFIG[action];
        const isAvailable = availableActions.includes(action);
        const isHighlighted = highlightCorrect === action;

        return (
          <motion.button
            key={action}
            whileHover={isAvailable && !disabled ? { scale: 1.05, y: -3 } : undefined}
            whileTap={isAvailable && !disabled ? { scale: 0.95 } : undefined}
            onClick={() => isAvailable && !disabled && onAction(action)}
            disabled={!isAvailable || disabled}
            className={`
              flex flex-col items-center justify-center
              min-w-[70px] sm:min-w-[90px] px-4 sm:px-6 py-3 sm:py-4 rounded-xl
              border-2 font-semibold transition-all duration-150
              ${isHighlighted
                ? `${config.bgClass} text-white ${config.borderClass} shadow-lg scale-110`
                : isAvailable && !disabled
                  ? `border-white/30 text-white/90 hover:${config.borderClass} hover:text-white active:${config.bgClass}`
                  : 'border-white/10 text-white/30 cursor-not-allowed'
              }
            `}
          >
            <span className="text-sm sm:text-base">{config.label}</span>
            <kbd className={`
              text-xs mt-1 px-1.5 py-0.5 rounded
              ${isHighlighted ? 'bg-white/20' : 'bg-white/10'}
            `}>
              {config.key}
            </kbd>
          </motion.button>
        );
      })}
    </div>
  );
}
