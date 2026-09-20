import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { type: 'home' }
  | { type: 'shop'; initialCategory?: string }
  | { type: 'category'; categorySlug: string }
  | { type: 'product'; productId: string }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'not-found' };

export function parseRoute(pathname: string, search: string = ''): Route {
  // Normalize: remove trailing slash
  const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (clean === '' || clean === '/') {
    return { type: 'home' };
  }

  if (clean === '/shop') {
    const params = new URLSearchParams(search);
    const cat = params.get('category') || undefined;
    return { type: 'shop', initialCategory: cat };
  }

  if (clean === '/cart') {
    return { type: 'cart' };
  }

  if (clean === '/checkout') {
    return { type: 'checkout' };
  }

  if (clean.startsWith('/category/')) {
    const slug = decodeURIComponent(clean.replace('/category/', '').trim());
    if (slug) {
      return { type: 'category', categorySlug: slug };
    }
    return { type: 'shop' };
  }

  if (clean.startsWith('/product/')) {
    const id = decodeURIComponent(clean.replace('/product/', '').trim());
    if (id) {
      return { type: 'product', productId: id };
    }
    return { type: 'shop' };
  }

  return { type: 'not-found' };
}

// Global listeners for client-side navigation
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function navigate(path: string, options?: { replace?: boolean; preserveScroll?: boolean }) {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname + window.location.search;
  if (currentPath === path) return;

  if (options?.replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }

  if (!options?.preserveScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  notifyListeners();
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname + window.location.search;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    const handleCustomNav = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    listeners.add(handleCustomNav);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      listeners.delete(handleCustomNav);
    };
  }, []);

  const route = parseRoute(
    typeof window !== 'undefined' ? window.location.pathname : '/',
    typeof window !== 'undefined' ? window.location.search : ''
  );

  const goTo = useCallback((path: string, options?: { replace?: boolean; preserveScroll?: boolean }) => {
    navigate(path, options);
  }, []);

  return {
    currentPath,
    route,
    navigate: goTo,
  };
}
