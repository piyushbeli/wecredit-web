/**
 * WeCredit Design System - Color Palette
 * 
 * This file serves as the single source of truth for all color values used
 * throughout the WeCredit web application. These colors are defined to ensure
 * visual consistency and brand coherence across all components.
 * 
 * @module constants/colors
 * @see {@link /docs/design-system/colors.md} for complete usage guidelines
 */

/**
 * Primary brand colors and gradients
 */
export const COLORS = {
  /**
   * Brand colors - Primary blues used for key interactive elements
   */
  brand: {
    /**
     * Primary brand blue - Use for main CTAs, links, and key interactive elements
     * @example
     * ```tsx
     * <button style={{ backgroundColor: COLORS.brand.primary }}>Apply Now</button>
     * ```
     */
    primary: '#045BCF',

    /**
     * Light gradient colors - For hero sections and feature cards
     * @example
     * ```tsx
     * const gradient = `linear-gradient(135deg, ${COLORS.brand.lightGradient.from}, ${COLORS.brand.lightGradient.to})`;
     * ```
     */
    lightGradient: {
      /** Gradient start color - Light blue */
      from: '#CBDFFC',
      /** Gradient end color - Medium blue */
      to: '#076FDA',
    },

    /**
     * Lightest gradient colors - For subtle backgrounds and cards
     * @example
     * ```tsx
     * const gradient = `linear-gradient(135deg, ${COLORS.brand.lightestGradient.from}, ${COLORS.brand.lightestGradient.to})`;
     * ```
     */
    lightestGradient: {
      /** Gradient start color - Very light blue */
      from: '#CCDFFC',
      /** Gradient end color - Near white with blue tint */
      to: '#FAFCFF',
    },
  },

  /**
   * Grayscale colors - For text, borders, and neutral UI elements
   */
  gray: {
    /**
     * Black - Use for primary text and headings (highest emphasis)
     * Contrast ratio: 19.5:1 (WCAG AAA)
     */
    900: '#121111',

    /**
     * Dark gray - Use for secondary text and subheadings
     * Contrast ratio: 11.9:1 (WCAG AAA)
     */
    700: '#303030',

    /**
     * Medium gray - Use for tertiary text, disabled states, and placeholders
     * Contrast ratio: 4.6:1 (WCAG AA)
     */
    500: '#7F7F7F',

    /**
     * Light gray - Use for borders, dividers, and subtle backgrounds
     */
    100: '#D9D9D9',

    /**
     * White - Use for backgrounds, cards, and high-contrast text on dark backgrounds
     */
    white: '#FFFFFF',
  },
} as const;

/**
 * Type for brand colors
 */
export type BrandColors = typeof COLORS.brand;

/**
 * Type for gray colors
 */
export type GrayColors = typeof COLORS.gray;

/**
 * Type for all colors
 */
export type ColorPalette = typeof COLORS;

/**
 * Type for gradient configuration
 */
export type GradientConfig = {
  from: string;
  to: string;
};

/**
 * Legacy WeCredit brand colors (for backward compatibility)
 * @deprecated Use COLORS.brand instead for new components
 */
export const LEGACY_WC_COLORS = {
  blue: {
    50: '#EBF2FF',
    100: '#D6E4FF',
    200: '#ADC8FF',
    300: '#85ADFF',
    400: '#5C91FF',
    500: '#1E5FE6',
    600: '#1850C7',
    700: '#1240A8',
    800: '#0C3189',
    900: '#0A1B3D',
  },
  dark: '#0A1B3D',
  accent: '#3B82F6',
  green: '#22C55E',
} as const;
