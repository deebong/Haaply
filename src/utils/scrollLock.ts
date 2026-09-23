/**
 * Haaply Global Scroll-Lock Architecture
 *
 * Provides centralized, reference-counted scroll locking for modal overlays,
 * drawers, and bottom sheets.
 *
 * Core Capabilities:
 * 1. Reference Counting: Handles nested and sequential overlays safely without premature unlocking.
 * 2. Exact Scroll Restoration: Preserves window.scrollY / window.scrollX and restores it with zero drift.
 * 3. Desktop Layout Shift Prevention: Calculates exact scrollbar width and applies paddingRight to document.body.
 * 4. Mobile Touch Drag Prevention: Blocks touchmove on backdrops and non-scrollable overlay areas on mobile iOS / Android.
 * 5. Scroll Chaining Prevention: Blocks touch & wheel boundary propagation from modal scrollable containers.
 * 6. Accessibility & Keyboard Control: Disables background navigation keys (PageUp/Down, Space, Arrows) and handles Escape to close.
 */

interface SavedBodyStyles {
  overflow: string;
  paddingRight: string;
}

interface SavedHtmlStyles {
  overflow: string;
}

let lockCount = 0;
let savedScrollY = 0;
let savedScrollX = 0;
let savedBodyStyles: SavedBodyStyles | null = null;
let savedHtmlStyles: SavedHtmlStyles | null = null;
const activeCloseHandlers: Array<() => void> = [];

// Touch coordinate tracking for boundary detection
let touchStartY = 0;
let touchStartX = 0;

/**
 * Calculates current vertical scrollbar width on desktop browsers.
 * Returns 0 on mobile / touch devices with overlay scrollbars.
 */
export function getScrollbarWidth(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }
}

function handleTouchMove(e: TouchEvent) {
  if (lockCount <= 0) return;

  const target = e.target as HTMLElement | null;
  if (!target) return;

  // Allow text cursor placement and input interactions
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
    return;
  }

  // Check if touch gesture is inside an element that scrolls horizontally (e.g. Popular search chips, category tabs)
  const horizontalScrollable = target.closest(
    '[data-modal-scrollable="horizontal"], [data-modal-scrollable="true"], .overflow-x-auto, .overflow-x-scroll'
  ) as HTMLElement | null;

  if (horizontalScrollable && horizontalScrollable.scrollWidth > horizontalScrollable.clientWidth) {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;

    // If predominantly horizontal swiping, permit touch scrolling within boundaries
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      const scrollLeft = horizontalScrollable.scrollLeft;
      const maxScrollLeft = horizontalScrollable.scrollWidth - horizontalScrollable.clientWidth;
      // Prevent over-scrolling bounce chaining at horizontal boundaries if cancelable
      if ((scrollLeft <= 0 && deltaX > 0) || (scrollLeft >= maxScrollLeft - 1 && deltaX < 0)) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
      return;
    }
  }

  // Find nearest scrollable container inside an overlay
  const scrollable = target.closest(
    '[data-modal-scrollable="true"], .overflow-y-auto, .overflow-y-scroll, .overflow-auto, .overflow-scroll'
  ) as HTMLElement | null;

  if (!scrollable) {
    // Touch gesture started on a non-scrollable element (e.g. backdrop, modal header, footer, background)
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  // Touch gesture is inside a scrollable container
  const currentY = e.touches[0].clientY;
  const deltaY = currentY - touchStartY; // > 0 pulling downwards, < 0 pushing upwards
  const isScrollable = scrollable.scrollHeight > scrollable.clientHeight;

  if (!isScrollable) {
    // Content fits entirely inside the container; prevent dragging background
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  const scrollTop = scrollable.scrollTop;
  const maxScrollTop = scrollable.scrollHeight - scrollable.clientHeight;

  // Reached top boundary and attempting to pull down
  if (scrollTop <= 0 && deltaY > 0) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  // Reached bottom boundary and attempting to push up
  if (scrollTop >= maxScrollTop - 1 && deltaY < 0) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }
}

function handleWheel(e: WheelEvent) {
  if (lockCount <= 0) return;

  const target = e.target as HTMLElement | null;
  if (!target) return;

  const scrollable = target.closest(
    '[data-modal-scrollable="true"], .overflow-y-auto, .overflow-y-scroll, .overflow-auto, .overflow-scroll'
  ) as HTMLElement | null;

  if (!scrollable) {
    // Mouse wheel over backdrop or non-scrollable overlay container
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  const isScrollable = scrollable.scrollHeight > scrollable.clientHeight;
  if (!isScrollable) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  const deltaY = e.deltaY;
  const scrollTop = scrollable.scrollTop;
  const maxScrollTop = scrollable.scrollHeight - scrollable.clientHeight;

  // Prevent wheel scroll chaining at top boundary
  if (scrollTop <= 0 && deltaY < 0) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }

  // Prevent wheel scroll chaining at bottom boundary
  if (scrollTop >= maxScrollTop - 1 && deltaY > 0) {
    if (e.cancelable) {
      e.preventDefault();
    }
    return;
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (lockCount <= 0) return;

  // Escape key triggers the active topmost overlay's close handler
  if (e.key === 'Escape') {
    if (activeCloseHandlers.length > 0) {
      e.preventDefault();
      const latestClose = activeCloseHandlers[activeCloseHandlers.length - 1];
      latestClose();
    }
    return;
  }

  // Prevent background scrolling keys when focus is outside inputs and scrollable content
  const scrollKeys = [' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown'];
  if (scrollKeys.includes(e.key)) {
    const target = e.target as HTMLElement | null;
    if (target) {
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;
      if (isInput) return;

      const scrollable = target.closest(
        '[data-modal-scrollable="true"], .overflow-y-auto, .overflow-y-scroll, .overflow-auto, .overflow-scroll'
      );
      if (!scrollable) {
        e.preventDefault();
      }
    }
  }
}

/**
 * Acquires a scroll lock for an active modal/drawer.
 * Returns a release function to unlock when the modal closes or unmounts.
 */
export function acquireScrollLock(onClose?: () => void): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  if (onClose) {
    activeCloseHandlers.push(onClose);
  }

  lockCount++;

  // Only apply lock and capture styles on the initial 0 -> 1 transition
  if (lockCount === 1) {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    savedScrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;

    const scrollbarWidth = getScrollbarWidth();

    savedBodyStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    savedHtmlStyles = {
      overflow: document.documentElement.style.overflow,
    };

    // Apply overflow lock
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Compensate for disappearing desktop scrollbar to prevent horizontal layout shift
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    // Attach non-passive boundary listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;

    if (onClose) {
      const idx = activeCloseHandlers.lastIndexOf(onClose);
      if (idx !== -1) {
        activeCloseHandlers.splice(idx, 1);
      }
    }

    releaseScrollLock();
  };
}

/**
 * Decrements lock count and restores original body state when all locks are released.
 */
function releaseScrollLock() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);

  // Only unlock when all active modal locks have been released
  if (lockCount === 0) {
    // Remove global boundary listeners
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('keydown', handleKeyDown);

    // Restore root overflow
    if (savedHtmlStyles) {
      document.documentElement.style.overflow = savedHtmlStyles.overflow;
      savedHtmlStyles = null;
    } else {
      document.documentElement.style.overflow = '';
    }

    // Restore body overflow and paddingRight
    if (savedBodyStyles) {
      document.body.style.overflow = savedBodyStyles.overflow;
      document.body.style.paddingRight = savedBodyStyles.paddingRight;
      savedBodyStyles = null;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Restore original scroll position without any animation jump
    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(savedScrollX, savedScrollY);
    document.documentElement.style.scrollBehavior = prevScrollBehavior;
  }
}
