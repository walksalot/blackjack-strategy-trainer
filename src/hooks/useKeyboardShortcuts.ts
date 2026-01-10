import { useEffect } from 'react';
import type { Action } from '../types';

interface UseKeyboardShortcutsOptions {
  onAction: (action: Action) => void;
  onNext: () => void;
  disabled: boolean;
  isShowingFeedback: boolean;
  availableActions: Action[];
}

export function useKeyboardShortcuts({
  onAction,
  onNext,
  disabled,
  isShowingFeedback,
  availableActions,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // During feedback, space or enter advances
      if (isShowingFeedback) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          onNext();
        }
        return;
      }

      if (disabled) return;

      const keyMap: Record<string, Action> = {
        KeyH: 'H',
        KeyS: 'S',
        KeyD: 'D',
        KeyP: 'P',
        KeyR: 'R',
      };

      const action = keyMap[e.code];
      if (action && availableActions.includes(action)) {
        e.preventDefault();
        onAction(action);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onAction, onNext, disabled, isShowingFeedback, availableActions]);
}
