import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StoreInstance } from '../config/storeInstance';
import {
  DEFAULT_STORE_ID,
  STORE_REGISTRY,
  getAllStores,
  getStoreById,
  resolveStoreIdentifier,
} from '../config/storeRegistry';

export interface ActiveStoreContextValue {
  /** The current active StoreInstance */
  store: StoreInstance;
  /** Ergonomic alias for store */
  activeStore: StoreInstance;
  /** Explicit function to transition to a different store instance */
  setStoreId: (storeId: string) => void;
  /** List of all configured store instances in the registry */
  availableStores: StoreInstance[];
}

export const ActiveStoreContext = createContext<ActiveStoreContextValue | null>(null);

export interface StoreProviderProps {
  initialStoreId?: string;
  children: React.ReactNode;
}

/**
 * StoreProvider establishes the foundational StoreInstance / Tenant runtime boundary.
 * All downstream providers (ConfigProvider, ThemeProvider, DataProvider, etc.)
 * resolve their state, configurations, and catalogs from this active store.
 */
export const StoreProvider: React.FC<StoreProviderProps> = ({
  initialStoreId,
  children,
}) => {
  // Determine initial store with URL parameter priority (?store=... or legacy ?theme=...)
  const initialStore = useMemo(() => {
    if (initialStoreId && getStoreById(initialStoreId)) {
      return getStoreById(initialStoreId)!;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlStore = params.get('store');
      if (urlStore) {
        return resolveStoreIdentifier(urlStore);
      }
      const urlTheme = params.get('theme');
      if (urlTheme) {
        return resolveStoreIdentifier(urlTheme);
      }
    }
    return STORE_REGISTRY[DEFAULT_STORE_ID];
  }, [initialStoreId]);

  const [activeStoreId, setActiveStoreId] = useState<string>(initialStore.id);

  // Sync when initialStoreId prop changes
  useEffect(() => {
    if (initialStoreId && getStoreById(initialStoreId)) {
      setActiveStoreId(initialStoreId);
    }
  }, [initialStoreId]);

  const currentStore = useMemo(() => {
    return getStoreById(activeStoreId) || STORE_REGISTRY[DEFAULT_STORE_ID];
  }, [activeStoreId]);

  const value = useMemo<ActiveStoreContextValue>(
    () => ({
      store: currentStore,
      activeStore: currentStore,
      setStoreId: (newStoreId: string) => {
        const resolved = resolveStoreIdentifier(newStoreId);
        setActiveStoreId(resolved.id);

        // Update URL query parameters cleanly without triggering full page reload
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('store', resolved.slug);
          // Remove legacy theme query param to prevent state desynchronization
          url.searchParams.delete('theme');
          window.history.replaceState({}, '', url.toString());
        }
      },
      availableStores: getAllStores(),
    }),
    [currentStore]
  );

  return (
    <ActiveStoreContext.Provider value={value}>
      {children}
    </ActiveStoreContext.Provider>
  );
};

/**
 * Access the active StoreInstance and registry actions
 */
export function useActiveStore(): ActiveStoreContextValue {
  const context = useContext(ActiveStoreContext);
  if (!context) {
    throw new Error('useActiveStore must be used within a <StoreProvider>');
  }
  return context;
}
