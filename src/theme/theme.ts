export const Colors = {
  // Google Core Colors
  primary: '#EA4335', // Google Red
  primaryDark: '#C5221F', // Darker Red
  primaryLight: '#F28B82', // Lighter Red
  primarySurface: '#FDE7E5', // Very light red tint for surfaces
  secondary: '#4285F4', // Google Blue
  secondaryDark: '#3367D6',
  accent: '#FBBC05', // Google Yellow
  accentDark: '#F29900',

  // Backgrounds
  background: '#F8F9FA', // Google Grey 50
  surface: '#FFFFFF', // White
  surfaceLight: '#F1F3F4', // Google Grey 100
  surfaceElevated: '#FFFFFF', // Cards on top of background
  card: '#FFFFFF',

  // Text
  textPrimary: '#202124', // Google Dark Grey
  textSecondary: '#5F6368', // Google Grey 700
  textMuted: '#9AA0A6', // Google Grey 500
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#34A853', // Google Green
  warning: '#FBBC05',
  error: '#EA4335',
  info: '#4285F4',

  // Seat states
  seatAvailable: '#34A853', // Green
  seatSelected: '#4285F4', // Blue
  seatBooked: '#DADCE0', // Greyed out (Grey 300)
  seatLocked: '#FBBC05', // Yellow

  // Misc
  border: '#DADCE0', // Google Grey 300
  borderLight: '#E8EAED', // Google Grey 200
  overlay: 'rgba(0,0,0,0.5)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Promo card backgrounds
  promoDarkRed: '#8B1A2B',
  promoLightPink: '#FFF0F0',
  promoLightBlue: '#EFF6FF',
  promoLightGreen: '#ECFDF5',
};

export const Fonts = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 40,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
};

export const Radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 32,
  full: 999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: '#EA4335',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
};
