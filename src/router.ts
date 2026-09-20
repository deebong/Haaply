import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { type: 'home' }
  | { type: 'shop'; initialCategory?: string }
  | { type: 'category'; categorySlug: string }
  | { type: 'product'; productId: string }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'not-found' };

/**
 * Detect base repository path (e.g. /haaply) when hosted on GitHub Pages or subfolders.
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const knownRoots = ['shop', 'cart', 'checkout', 'category', 'product'];

  // If the first segment is not a recognized top-level app route, it's the GitHub repository name
  if (segments.length > 0 && !knownRoots.includes(segments[0])) {
    return '/' + segments[0];
  }
  return '';
}

/**
 * Extract the relative route path (without repo prefix) and search parameters.
 */
export function extractAppPath(): { pathname: string; search: string } {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '' };
  }

  // 1. Support Hash routing fallback (e.g. #/shop, #shop, #/category/xyz)
  if (window.location.hash && window.location.hash.length > 1) {
    let hashContent = window.location.hash.slice(1);
    if (!hashContent.startsWith('/')) {
      hashContent = '/' + hashContent;
    }
    const [pathPart, searchPart] = hashContent.split('?');
    return {
      pathname: pathPart || '/',
      search: searchPart ? '?' + searchPart : '',
    };
  }

  // 2. Standard pathname with repo base stripped
  const base = getBasePath();
  let path = window.location.pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length);
  }

  if (!path || !path.startsWith('/')) {
    path = '/' + (path || '');
  }

  return { pathname: path, search: window.location.search };
}

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

  // Fallback: check if the path ends with known endpoints
  if (clean.endsWith('/shop')) {
    return { type: 'shop' };
  }
  if (clean.endsWith('/cart')) {
    return { type: 'cart' };
  }
  if (clean.endsWith('/checkout')) {
    return { type: 'checkout' };
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

  const base = getBasePath();
  const targetFullPath = (base ? base : '') + (path.startsWith('/') ? path : '/' + path);

  const currentFullPath = window.location.pathname + window.location.search;
  if (currentFullPath !== targetFullPath) {
    if (options?.replace) {
      window.history.replaceState({}, '', targetFullPath);
    } else {
      window.history.pushState({}, '', targetFullPath);
    }
  }

  if (!options?.preserveScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  notifyListeners();
}

export function useRouter() {
  const [navTick, setNavTick] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      setNavTick((t) => t + 1);
    };

    const handleHashChange = () => {
      setNavTick((t) => t + 1);
    };

    const handleCustomNav = () => {
      setNavTick((t) => t + 1);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    listeners.add(handleCustomNav);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
      listeners.delete(handleCustomNav);
    };
  }, []);

  const { pathname, search } = extractAppPath();
  const route = parseRoute(pathname, search);

  const goTo = useCallback((path: string, options?: { replace?: boolean; preserveScroll?: boolean }) => {
    navigate(path, options);
  }, []);

  return {
    currentPath: pathname + search,
    route,
    navigate: goTo,
    navTick,
  };
}
