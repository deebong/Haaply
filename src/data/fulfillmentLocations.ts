import { FulfillmentLocation } from '../types';

/**
 * Standard default fulfillment location ID for Single Store mode
 */
export const DEFAULT_FULFILLMENT_LOCATION_ID = 'loc-cbe-central';

/**
 * Default Fulfillment Locations for Haaply Platform.
 * Demonstrates support for:
 * - Production / fulfillment unit ('production_unit')
 * - Dark store ('dark_store')
 * - Retail storefront ('store')
 * - Central warehouse ('warehouse')
 */
export const DEFAULT_FULFILLMENT_LOCATIONS: FulfillmentLocation[] = [
  {
    id: 'loc-cbe-central',
    name: 'Haaply Central Kitchen & Production Hub',
    type: 'production_unit',
    address: {
      street: '42 Fresh Harvest Road, RS Puram',
      area: 'RS Puram',
      city: 'Coimbatore',
      pincode: '641002',
      state: 'Tamil Nadu',
    },
    serviceAreas: ['641001', '641002', '641003', '641004', '641012', '641018'],
    operatingHours: {
      openTime: '06:00',
      closeTime: '21:00',
    },
    active: true,
  },
  {
    id: 'loc-cbe-east',
    name: 'Haaply Peelamedu Dark Store',
    type: 'dark_store',
    address: {
      street: '18 Avinashi Road',
      area: 'Peelamedu',
      city: 'Coimbatore',
      pincode: '641004',
      state: 'Tamil Nadu',
    },
    serviceAreas: ['641004', '641014', '641015', '641016'],
    operatingHours: {
      openTime: '06:30',
      closeTime: '21:30',
    },
    active: true,
  },
  {
    id: 'loc-cbe-saravanampatti',
    name: 'Haaply North Retail & Delivery Store',
    type: 'store',
    address: {
      street: '7 Sathy Main Road',
      area: 'Saravanampatti',
      city: 'Coimbatore',
      pincode: '641035',
      state: 'Tamil Nadu',
    },
    serviceAreas: ['641035', '641049'],
    operatingHours: {
      openTime: '07:00',
      closeTime: '21:00',
    },
    active: true,
  },
];

/**
 * Fulfillment Locations for Atelier Storefront (Fashion / Bangalore Hub)
 */
export const ATELIER_FULFILLMENT_LOCATIONS: FulfillmentLocation[] = [
  {
    id: 'loc-atelier-flagship',
    storeId: 'store-atelier',
    name: 'Atelier Studio Flagship & Atelier Archive',
    type: 'store',
    address: {
      street: '14 Vittal Mallya Road',
      area: 'Lavelle Road',
      city: 'Bangalore',
      pincode: '560001',
      state: 'Karnataka',
    },
    serviceAreas: ['560001', '560025', '560002', '560027'],
    operatingHours: {
      openTime: '10:00',
      closeTime: '20:00',
    },
    active: true,
  },
];

/**
 * Fulfillment Locations for Anya Soaps Storefront (Artisan Skincare / Coimbatore Studio)
 */
export const ANYA_FULFILLMENT_LOCATIONS: FulfillmentLocation[] = [
  {
    id: 'loc-anya-studio',
    storeId: 'store-anyasoaps',
    name: 'Anya Soaps Botanical Artisan Studio',
    type: 'production_unit',
    address: {
      street: '28 Thillai Nagar, Gandhi Park Road',
      area: 'RS Puram East',
      city: 'Coimbatore',
      pincode: '641002',
      state: 'Tamil Nadu',
    },
    serviceAreas: ['641001', '641002', '641003', '641004', '641018'],
    operatingHours: {
      openTime: '09:00',
      closeTime: '19:00',
    },
    active: true,
  },
];

