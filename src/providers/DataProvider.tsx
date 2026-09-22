import React, { createContext, useContext, useMemo } from 'react';
import { DataProvider as IDataProvider, ProviderCapabilities } from '../data/provider/dataProviderTypes';
import { getDataProvider } from '../data/provider/providerRegistry';
import { DataService, createDataService } from '../data/provider/dataService';
import { BOOTSTRAP_CONFIG } from '../config/bootstrapConfig';
import { useConfig } from './ConfigProvider';
import { ActiveStoreContext } from './StoreProvider';

export interface DataContextValue {
  /** The active DataProvider instance */
  provider: IDataProvider;
  /** High-level domain services (products, customer, orders, wishlist) */
  dataService: DataService;
  /** Active provider identifier (e.g. 'firebase') */
  providerId: string;
  /** Capability flags of the active provider */
  capabilities: ProviderCapabilities;
  /** Whether the provider is initialized and ready */
  isReady: boolean;
}

const DataContext = createContext<DataContextValue | null>(null);

export interface DataProviderProps {
  /** Optional override for active provider ID */
  providerId?: string;
  children: React.ReactNode;
}

/**
 * DataProvider Context Component
 * 
 * ARCHITECTURAL HIERARCHY:
 * <ConfigProvider>   --> Site identity, metadata, feature flags
 *   <ThemeProvider>  --> CSS design tokens, visual themes
 *     <DataProvider> --> Application data contracts, backend services
 *       <App />
 */
export const DataProvider: React.FC<DataProviderProps> = ({
  providerId = BOOTSTRAP_CONFIG.activeProviderId,
  children,
}) => {
  const { site } = useConfig();
  const activeStoreContext = useContext(ActiveStoreContext);
  const activeStore = activeStoreContext?.store;
  const storeId = activeStore?.id || 'store-haaply';

  const provider = useMemo(() => getDataProvider(providerId), [providerId]);
  const dataService = useMemo(
    () => createDataService(provider, site.fulfillment, storeId),
    [provider, site.fulfillment, storeId]
  );

  const value = useMemo<DataContextValue>(
    () => ({
      provider,
      dataService,
      providerId: provider.id,
      capabilities: provider.capabilities,
      isReady: provider.isReady(),
    }),
    [provider, dataService]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/**
 * Access the active data provider and its metadata
 */
export function useDataProvider(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataProvider must be used within a <DataProvider>');
  }
  return context;
}

/**
 * Access the high-level domain data services
 */
export function useDataService(): DataService {
  const { dataService } = useDataProvider();
  return dataService;
}
