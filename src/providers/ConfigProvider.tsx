import React, { createContext, useContext, useMemo } from 'react';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../config/siteConfig';
import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from '../config/featureConfig';
import { StoreVertical } from '../types';
import {
  VerticalCapabilities,
  getVerticalCapabilities,
  getVerticalDefinition,
  VerticalDefinition,
} from '../config/verticalConfig';
import { ActiveStoreContext } from './StoreProvider';

interface ConfigContextValue {
  site: SiteConfig;
  features: FeatureFlags;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

interface ConfigProviderProps {
  initialSiteConfig?: Partial<SiteConfig>;
  initialFeatureFlags?: Partial<FeatureFlags>;
  children: React.ReactNode;
}

/**
 * Central Configuration Provider
 * Supplies site identity and feature gating across the entire application.
 * Sourced directly from the active StoreInstance when wrapped in StoreProvider,
 * with fallback to default TypeScript configuration.
 */
export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  initialSiteConfig,
  initialFeatureFlags,
  children,
}) => {
  const activeStoreContext = useContext(ActiveStoreContext);
  const activeStore = activeStoreContext?.store;

  const site = useMemo<SiteConfig>(() => {
    const baseConfig = activeStore ? activeStore.siteConfig : DEFAULT_SITE_CONFIG;
    return {
      ...baseConfig,
      ...initialSiteConfig,
      delivery: {
        ...baseConfig.delivery,
        ...initialSiteConfig?.delivery,
      },
      fulfillment: {
        ...baseConfig.fulfillment,
        ...initialSiteConfig?.fulfillment,
      },
    };
  }, [activeStore, initialSiteConfig]);

  const features = useMemo<FeatureFlags>(() => {
    const baseFlags = activeStore ? activeStore.featureFlags : DEFAULT_FEATURE_FLAGS;
    return {
      ...baseFlags,
      ...initialFeatureFlags,
    };
  }, [activeStore, initialFeatureFlags]);

  const isFeatureEnabled = useMemo(() => {
    return (feature: keyof FeatureFlags): boolean => {
      return Boolean(features[feature]);
    };
  }, [features]);

  const value = useMemo<ConfigContextValue>(() => ({
    site,
    features,
    isFeatureEnabled,
  }), [site, features, isFeatureEnabled]);

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextValue => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

/**
 * Lightweight helper hook for checking feature flags
 */
export const useFeatureFlag = (feature: keyof FeatureFlags): boolean => {
  const { isFeatureEnabled } = useConfig();
  return isFeatureEnabled(feature);
};

/**
 * Lightweight helper hook for accessing fulfillment configuration
 */
export const useFulfillmentConfig = () => {
  const { site } = useConfig();
  return site.fulfillment;
};

/**
 * Hook for accessing the active store's business vertical (e.g. 'grocery', 'fashion')
 */
export const useStoreVertical = (): StoreVertical => {
  const { site } = useConfig();
  return site.vertical;
};

/**
 * Hook for accessing the capability profile of the active store's vertical
 */
export const useVerticalCapabilities = (): VerticalCapabilities => {
  const vertical = useStoreVertical();
  return getVerticalCapabilities(vertical);
};

/**
 * Hook for accessing the full definition of the active store's vertical
 */
export const useVerticalDefinition = (): VerticalDefinition => {
  const vertical = useStoreVertical();
  return getVerticalDefinition(vertical);
};

