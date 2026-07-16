/**
 * Color Utility Functions
 * 
 * Helper functions for working with colors from the WeCredit design system.
 * Provides utilities for creating gradients, applying opacity, and other
 * color transformations.
 * 
 * @module utils/colors
 * @see {@link /docs/design-system/colors.md} for complete usage guidelines
 */

import { COLORS, type GradientConfig } from '@/lib/constants/colors';

/**
 * Gradient direction type
 */
type GradientDirection = string; // e.g., '135deg', 'to right', 'to bottom'

/**
 * Creates a CSS linear gradient string from a gradient configuration
 * 
 * @param gradientConfig - Object containing 'from' and 'to' color values
 * @param direction - CSS gradient direction (default: '135deg')
 * @returns CSS linear-gradient string
 * 
 * @example
 * ```tsx
 * const gradient = createGradient(COLORS.brand.lightGradient, '135deg');
 * // Returns: 'linear-gradient(135deg, #CBDFFC 0%, #076FDA 100%)'
 * 
 * <div style={{ background: gradient }}>
 *   Content with gradient background
 * </div>
 * ```
 */
export function createGradient(
  gradientConfig: GradientConfig,
  direction: GradientDirection = '135deg'
): string {
  return `linear-gradient(${direction}, ${gradientConfig.from} 0%, ${gradientConfig.to} 100%)`;
}

/**
 * Returns CSS gradient string for brand light gradient
 * Ideal for hero sections and feature cards
 * 
 * @param direction - CSS gradient direction (default: '135deg')
 * @returns CSS linear-gradient string
 * 
 * @example
 * ```tsx
 * <div style={{ background: getBrandLightGradient() }}>
 *   Hero Section
 * </div>
 * ```
 */
export function getBrandLightGradient(direction: GradientDirection = '135deg'): string {
  return createGradient(COLORS.brand.lightGradient, direction);
}

/**
 * Returns CSS gradient string for brand lightest gradient
 * Ideal for subtle backgrounds and card backgrounds
 * 
 * @param direction - CSS gradient direction (default: '135deg')
 * @returns CSS linear-gradient string
 * 
 * @example
 * ```tsx
 * <div style={{ background: getBrandLightestGradient() }}>
 *   Card Content
 * </div>
 * ```
 */
export function getBrandLightestGradient(direction: GradientDirection = '135deg'): string {
  return createGradient(COLORS.brand.lightestGradient, direction);
}

/**
 * Converts hex color to RGB values
 * 
 * @param hex - Hex color string (with or without #)
 * @returns RGB values as object { r, g, b } or null if invalid
 * 
 * @example
 * ```tsx
 * hexToRgb('#045BCF'); // Returns: { r: 4, g: 91, b: 207 }
 * ```
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    console.warn(`Invalid hex color: ${hex}`);
    return null;
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Normalizes backend hex colors into valid CSS hex values.
 * Accepts ARGB values and hex values with or without "#".
 * Returns null for empty/invalid values.
 */
export function normalizeHexColor(color?: string | null): string | null {
  if (!color || typeof color !== 'string') return null;

  const value = color.trim();
  if (!value || value.toLowerCase() === 'null' || value.toLowerCase() === 'undefined') {
    return null;
  }

  const argbMatch = value.match(/^0x([0-9A-Fa-f]{8})$/);
  if (argbMatch) {
    return `#${argbMatch[1].slice(2)}`;
  }

  const hex = value.startsWith('#') ? value.slice(1) : value;

  if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    return `#${hex.split('').map((char) => `${char}${char}`).join('')}`;
  }

  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return `#${hex}`;
  }

  return null;
}

export const DEFAULT_LENDER_COLOR = '#045BCF';

/**
 * Returns the lender theme color or the default when it is missing or invalid.
 */
export function getLenderThemeColor(topColour?: string | null): string {
  const color = topColour?.trim();

  if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color;
  }

  return DEFAULT_LENDER_COLOR;
}

/**
 * Applies opacity to a hex color
 * 
 * @param hex - Hex color string (with or without #)
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string or original hex if conversion fails
 * 
 * @example
 * ```tsx
 * getColorWithOpacity('#045BCF', 0.5); // Returns: 'rgba(4, 91, 207, 0.5)'
 * getColorWithOpacity(COLORS.brand.primary, 0.2); // Returns: 'rgba(4, 91, 207, 0.2)'
 * 
 * <div style={{ backgroundColor: getColorWithOpacity(COLORS.brand.primary, 0.1) }}>
 *   Subtle background
 * </div>
 * ```
 */
export function getColorWithOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  
  if (!rgb) {
    return hex; // Return original if conversion fails
  }
  
  // Clamp opacity between 0 and 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedOpacity})`;
}

/**
 * Creates a radial gradient for glow effects
 * 
 * @param color - Center color (hex)
 * @param opacity - Center opacity (0-1)
 * @param size - Size of the glow effect (default: '300px')
 * @returns CSS radial-gradient string
 * 
 * @example
 * ```tsx
 * const glow = createRadialGlow(COLORS.brand.primary, 0.3);
 * 
 * <div style={{ background: glow }}>
 *   Glowing effect
 * </div>
 * ```
 */
export function createRadialGlow(
  color: string,
  opacity: number = 0.3,
  size: string = '300px'
): string {
  const centerColor = getColorWithOpacity(color, opacity);
  return `radial-gradient(circle ${size}, ${centerColor} 0%, transparent 70%)`;
}

/**
 * Generates Tailwind CSS classes for a given color key
 * 
 * @param colorKey - The color key (e.g., 'brand-primary', 'gray-900')
 * @returns Object with common Tailwind class names
 * 
 * @example
 * ```tsx
 * const classes = getTailwindClasses('brand-primary');
 * // Returns: { bg: 'bg-brand-primary', text: 'text-brand-primary', border: 'border-brand-primary' }
 * 
 * <button className={classes.bg}>Apply Now</button>
 * ```
 */
export function getTailwindClasses(colorKey: string): {
  bg: string;
  text: string;
  border: string;
  hover: {
    bg: string;
    text: string;
    border: string;
  };
} {
  return {
    bg: `bg-${colorKey}`,
    text: `text-${colorKey}`,
    border: `border-${colorKey}`,
    hover: {
      bg: `hover:bg-${colorKey}`,
      text: `hover:text-${colorKey}`,
      border: `hover:border-${colorKey}`,
    },
  };
}

/**
 * Gets CSS variable reference for a color
 * 
 * @param colorKey - The color key (e.g., 'brand-primary', 'gray-900')
 * @returns CSS variable reference string
 * 
 * @example
 * ```tsx
 * const cssVar = getCssVariable('brand-primary');
 * // Returns: 'var(--color-brand-primary)'
 * 
 * <div style={{ color: getCssVariable('brand-primary') }}>
 *   Text in brand color
 * </div>
 * ```
 */
export function getCssVariable(colorKey: string): string {
  return `var(--color-${colorKey})`;
}

/**
 * Color utility object for easy access to common operations
 */
export const colorUtils = {
  gradients: {
    light: getBrandLightGradient,
    lightest: getBrandLightestGradient,
    custom: createGradient,
  },
  opacity: getColorWithOpacity,
  glow: createRadialGlow,
  tailwind: getTailwindClasses,
  cssVar: getCssVariable,
  convert: {
    hexToRgb,
  },
} as const;
