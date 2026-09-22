import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { StoreTheme } from '../themes/themeTypes';
import {
  getThemeById,
  resolveThemeForVertical,
  isThemeCompatibleWithVertical,
  DEFAULT_THEME_ID,
} from '../themes/themeRegistry';
import { useConfig } from './ConfigProvider';
import { ActiveStoreContext } from './StoreProvider';

interface ThemeContextValue {
  theme: StoreTheme;
  themeId: string;
  setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  themeId?: string;
  children: React.ReactNode;
}

/**
 * ThemeProvider applies CSS variables dynamically to the document root element
 * based on the active StoreTheme.
 *
 * Enforces the strict resolution rule: ActiveStore -> Vertical -> Theme
 * A theme cannot be activated unless it is compatible with the active store's vertical.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  themeId: propThemeId,
  children,
}) => {
  const { site } = useConfig();
  const activeStoreContext = useContext(ActiveStoreContext);
  const activeStore = activeStoreContext?.store;

  const currentVertical = activeStore ? activeStore.vertical : site.vertical;
  const currentDefaultTheme = activeStore ? activeStore.activeThemeId : site.activeThemeId;

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    if (propThemeId && isThemeCompatibleWithVertical(propThemeId, currentVertical)) {
      return propThemeId;
    }
    return resolveThemeForVertical(currentDefaultTheme, currentVertical).id;
  });

  // When active store or vertical changes, strictly synchronize to a compatible theme
  useEffect(() => {
    if (!propThemeId) {
      const resolved = resolveThemeForVertical(currentDefaultTheme, currentVertical);
      setActiveThemeId(resolved.id);
    }
  }, [currentDefaultTheme, currentVertical, propThemeId]);

  const setThemeId = useCallback(
    (newThemeId: string) => {
      if (!isThemeCompatibleWithVertical(newThemeId, currentVertical)) {
        console.warn(
          `[ThemeProvider] Theme '${newThemeId}' is incompatible with store vertical '${currentVertical}'. Theme switch rejected.`
        );
        return;
      }
      setActiveThemeId(newThemeId);
    },
    [currentVertical]
  );

  const theme = useMemo(() => getThemeById(activeThemeId), [activeThemeId]);

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    // Apply color tokens
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-secondary-hover', theme.colors.secondaryHover);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-accent-hover', theme.colors.accentHover);
    root.style.setProperty('--color-bg', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-surface-alt', theme.colors.surfaceAlt);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-muted', theme.colors.textMuted);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-border-strong', theme.colors.borderStrong);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-danger', theme.colors.danger);

    // Maintain backwards compatibility with legacy Haaply variables
    root.style.setProperty('--haaply-green', theme.colors.primary);
    root.style.setProperty('--haaply-teal', theme.colors.secondary);
    root.style.setProperty('--haaply-deep-blue', theme.colors.accent);
    root.style.setProperty('--haaply-bg', theme.colors.background);
    root.style.setProperty('--haaply-surface', theme.colors.surface);
    root.style.setProperty('--haaply-text', theme.colors.text);
    root.style.setProperty('--haaply-text-secondary', theme.colors.textMuted);
    root.style.setProperty('--haaply-border', theme.colors.border);
    root.style.setProperty('--haaply-muted-surface', theme.colors.surfaceAlt);

    // Apply shape tokens
    root.style.setProperty('--radius-sm', theme.shape.radiusSmall);
    root.style.setProperty('--radius-md', theme.shape.radiusMedium);
    root.style.setProperty('--radius-lg', theme.shape.radiusLarge);
    root.style.setProperty('--radius-xl', theme.shape.radiusXLarge);
    root.style.setProperty('--radius-button', theme.shape.buttonRadius);
    root.style.setProperty('--radius-card', theme.shape.cardRadius);

    // Apply elevation tokens
    root.style.setProperty('--shadow-sm', theme.elevation.shadowSmall);
    root.style.setProperty('--shadow-md', theme.elevation.shadowMedium);
    root.style.setProperty('--shadow-lg', theme.elevation.shadowLarge);

    // Apply typography
    root.style.setProperty('--font-heading', theme.typography.headingFont);
    root.style.setProperty('--font-body', theme.typography.bodyFont);
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      themeId: theme.id,
      setThemeId,
    }),
    [theme, setThemeId]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
