import { StoreVertical, FulfillmentConfig } from '../types';
import { SiteConfig, DeliveryRules } from './siteConfig';
import { FeatureFlags } from './featureConfig';

/**
 * First-Class Store Instance Model (Tenant Runtime Boundary)
 *
 * Represents an independent storefront instance within the Haaply commerce platform.
 * Unifies store identity, vertical, active theme, site metadata, feature flags,
 * fulfillment configuration, and commercial delivery rules.
 */
export interface StoreInstance {
  /** Unique tenant/store identifier (e.g. 'store-haaply', 'store-atelier') */
  id: string;
  /** URL / routing slug (e.g. 'haaply', 'atelier') */
  slug: string;
  /** Display brand name (e.g. 'Haaply', 'Atelier') */
  name: string;
  /** Commerce domain vertical (e.g. 'grocery', 'fashion') */
  vertical: StoreVertical;
  /** ID of the active storefront theme (e.g. 'haaply-fresh', 'atelier') */
  activeThemeId: string;
  /** Complete store site metadata, legal info, contact details, and branding */
  siteConfig: SiteConfig;
  /** Feature toggle capabilities specific to this store */
  featureFlags: FeatureFlags;
  /** Fulfillment model and warehouse/hub routing configuration */
  fulfillment: FulfillmentConfig;
  /** Commercial delivery rules and free shipping fee thresholds */
  delivery: DeliveryRules;
  /** Underlying data provider identifier (e.g. 'firebase') */
  dataProviderId: string;
}
