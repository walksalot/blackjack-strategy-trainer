import { motion, AnimatePresence } from 'framer-motion';
import type { ActionResult } from '../../types';
import { ACTION_NAMES } from '../../types';

interface FeedbackProps {
  result: ActionResult | null;
  isVisible: boolean;
  onDismiss: () => void;
}

export function Feedback({ result, isVisible, onDismiss }: FeedbackProps) {
  if (!result) return null;

  return (
    <AnimatePresence>
      {isVisible && !result.isCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed inset-x-4 bottom-32 sm:bottom-36 z-20 flex justify-center"
        >
          <div
            onClick={onDismiss}
            className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 max-w-md w-full text-center shadow-2xl border border-white/10 cursor-pointer"
          >
            <div className="mb-3">
              <span className="text-red-400 text-sm">
                You chose: <strong>{ACTION_NAMES[result.userAction]}</strong>
              </span>
            </div>

            <div className="mb-4">
              <span className="text-green-400 text-xl sm:text-2xl font-bold">
                Correct: {ACTION_NAMES[result.correctAction]}
              </span>
            </div>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-4">
              {result.explanation}
            </p>

            <span className="text-white/40 text-xs">
              Tap or press SPACE to continue
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick flash feedback for correct answers
export function CorrectFlash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 pointer-events-none bg-green-500/20 z-10"
        />
      )}
    </AnimatePresence>
  );
}

export function IncorrectFlash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 pointer-events-none bg-red-500/20 z-10"
        />
      )}
    </AnimatePresence>
  );
}
