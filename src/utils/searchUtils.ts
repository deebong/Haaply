import { Product } from '../types';

/**
 * Shared product filtering logic across all store themes and search presentations
 * (Expanding Header Search, SearchModal, Shop page filters).
 */
export function filterProductsByQuery(
  products: Product[],
  query: string,
  limit?: number
): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    return typeof limit === 'number' ? products.slice(0, limit) : products;
  }

  const results = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(q);
    const matchTamil = p.tamilName ? p.tamilName.toLowerCase().includes(q) : false;
    const matchCategory = p.category.toLowerCase().includes(q);
    const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
    const matchTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;
    return matchName || matchTamil || matchCategory || matchDesc || matchTags;
  });

  return typeof limit === 'number' ? results.slice(0, limit) : results;
}

/**
 * Curated popular search terms scoped by vertical / business domain.
 */
export function getPopularSearchTerms(vertical: string, isAtelier: boolean = false): string[] {
  if (vertical === 'fashion' || isAtelier) {
    return ['Double-Breasted Coat', 'Silk Shirt', 'Linen Trousers', 'Merino Knit', 'Trench', 'Oatmeal'];
  }
  if (vertical === 'beauty') {
    return ['Goat Milk Soap', 'Charcoal Detox', 'Rose & Shea', 'Turmeric Glow', 'Avarampoo Calm', 'Baby Mild'];
  }
  return ['Dosa Batter', 'Idli Batter', 'Ragi Sevai', 'Chapathi', 'Fresh Paneer', 'Millet'];
}

/**
 * Search input placeholder text scoped by vertical / business domain.
 */
export function getSearchPlaceholder(vertical: string, isAtelier: boolean = false): string {
  if (vertical === 'fashion' || isAtelier) {
    return 'Search tailored coats, silk shirts, knitwear...';
  }
  if (vertical === 'beauty') {
    return 'Search artisan soaps, cold-pressed oils, botanicals...';
  }
  return 'Search fresh batters, millets, paneer...';
}
