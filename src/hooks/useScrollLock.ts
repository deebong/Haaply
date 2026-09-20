import { useEffect } from 'react';
import { acquireScrollLock } from '../utils/scrollLock';

/**
 * Custom React hook for robust global scroll locking during modal, drawer,
 * or blocking overlay presentation.
 *
 * @param isOpen Whether the overlay is currently open
 * @param onClose Optional callback invoked when the Escape key is pressed
 */
export function useScrollLock(isOpen: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const release = acquireScrollLock(onClose);
    return () => {
      release();
    };
  }, [isOpen, onClose]);
}
