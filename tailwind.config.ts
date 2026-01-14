/**
 * Tailwind CSS Configuration
 * 
 * This configuration extends Tailwind's default theme with WeCredit's
 * design system colors and customizations.
 * 
 * @see {@link /docs/design-system/colors.md} for complete color documentation
 */
const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      /**
       * WeCredit Color Palette
       * 
       * Primary Blues: Brand colors for interactive elements and key UI
       * Grayscale: Neutral colors for text, borders, and backgrounds
       */
      colors: {
        // WeCredit Design System Colors
        brand: {
          primary: '#045BCF',
          light: {
            from: '#CBDFFC',
            to: '#076FDA',
          },
          lightest: {
            from: '#CCDFFC',
            to: '#FAFCFF',
          },
        },
        gray: {
          900: '#121111',
          700: '#303030',
          500: '#7F7F7F',
          100: '#D9D9D9',
        },

        // Legacy WeCredit Brand Colors (for backward compatibility)
        wc: {
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
        },

        // shadcn/ui color system (CSS variables)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },

      /**
       * Border Radius
       */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 12px)',
        '4xl': 'calc(var(--radius) + 16px)',
      },

      /**
       * Font Families
       */
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      /**
       * Background Gradients
       * 
       * Custom gradient utilities for WeCredit design system
       */
      backgroundImage: {
        'brand-light': 'linear-gradient(135deg, #CBDFFC 0%, #076FDA 100%)',
        'brand-lightest': 'linear-gradient(135deg, #CCDFFC 0%, #FAFCFF 100%)',
        'hero-gradient':
          'linear-gradient(180deg, #1E5FE6 0%, #3B7BF7 35%, #5A9BFF 55%, #89BFFF 70%, #CDDEFF 85%, #FFFFFF 100%)',
      },

      /**
       * Animation Keyframes
       */
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },

      /**
       * Animations
       */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
