import { StoreTheme } from './themeTypes';
import { haaplyFreshTheme } from './haaplyFresh';
import { atelierTheme } from './atelier';
import { anyasoapsTheme } from './anyasoaps';
import { StoreVertical } from '../types';

/**
 * Centralized Theme Registry
 * Maps theme IDs to StoreTheme configuration tokens.
 * Supports multiple storefront themes across grocery, fashion, and other verticals.
 */
export const THEME_REGISTRY: Record<string, StoreTheme> = {
  'haaply-fresh': haaplyFreshTheme,
  'atelier': atelierTheme,
  'anyasoaps': anyasoapsTheme,
};

export const DEFAULT_THEME_ID = 'haaply-fresh';

export function getThemeById(themeId?: string): StoreTheme {
  if (themeId && THEME_REGISTRY[themeId]) {
    return THEME_REGISTRY[themeId];
  }
  return haaplyFreshTheme;
}

/**
 * Retrieves all registered themes that declare compatibility with the given store vertical.
 */
export function getThemesForVertical(vertical: StoreVertical): StoreTheme[] {
  return Object.values(THEME_REGISTRY).filter((theme) => {
    return (
      theme.supportedVerticals.includes(vertical) ||
      theme.supportedVerticals.includes('*')
    );
  });
}

/**
 * Validates whether a specific theme is compatible with a given store vertical.
 */
export function isThemeCompatibleWithVertical(
  themeId: string,
  vertical: StoreVertical
): boolean {
  const theme = THEME_REGISTRY[themeId];
  if (!theme) return false;
  return (
    theme.supportedVerticals.includes(vertical) ||
    theme.supportedVerticals.includes('*')
  );
}

/**
 * Resolves a theme suitable for the vertical:
 * - If requested themeId is compatible with vertical, returns it.
 * - Otherwise falls back to the first compatible theme for the vertical,
 *   or the default theme if none found.
 */
export function resolveThemeForVertical(
  themeId: string | undefined,
  vertical: StoreVertical
): StoreTheme {
  if (themeId && isThemeCompatibleWithVertical(themeId, vertical)) {
    return THEME_REGISTRY[themeId];
  }
  const compatibleThemes = getThemesForVertical(vertical);
  return compatibleThemes.length > 0 ? compatibleThemes[0] : haaplyFreshTheme;
}

