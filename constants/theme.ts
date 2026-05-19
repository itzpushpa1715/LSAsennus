// LS-ASENNUS Design System
// Industrial Finnish Shipyard Workforce Theme

export const Colors = {
  // Primary Brand
  primary: '#1A1A1A',
  primaryLight: '#2C2C2C',
  accent: '#7E9CB4',       // Steel Blue
  accentLight: '#9BB5C8',
  copper: '#C48B6A',       // Copper Warm
  copperLight: '#D4A882',

  // Surfaces
  surface: '#F5F5F5',
  surfaceDark: '#121212',
  card: '#FFFFFF',
  cardDark: '#1E1E1E',
  panelDark: '#202020',

  // Backgrounds
  dashboardBg: '#F1F4F8',
  workerCardBg: '#FFFFFF',
  sitePanelBg: '#2B2B2B',
  adminSidebar: '#202020',
  shiftPanelBg: '#EDEDED',

  // Text
  textPrimary: '#14181B',
  textSecondary: '#666666',
  textMuted: '#999999',
  textLight: '#FFFFFF',
  textOnDark: '#E0E0E0',

  // Status
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FFB74D',
  warningLight: '#FFF8E1',
  error: '#E53935',
  errorLight: '#FFEBEE',
  info: '#64B5F6',
  infoLight: '#E3F2FD',

  // Shift Types
  morningShift: '#42A5F5',
  eveningShift: '#FFA726',
  nightShift: '#5C6BC0',
  overtimeShift: '#EF5350',
  weekendShift: '#AB47BC',

  // Attendance
  checkedIn: '#66BB6A',
  checkedOut: '#BDBDBD',
  absent: '#E57373',
  late: '#FFCA28',

  // Projects
  activeProject: '#26A69A',
  pendingProject: '#FFCA28',
  completedProject: '#78909C',

  // Borders
  borderLight: '#E0E0E0',
  borderDark: '#424242',
  borderCard: '#EEEEEE',

  // Overlays
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.15)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  body: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  hero: 34,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  panel: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
};
