// LS-ASENNUS Workforce Management — Design System v2.0
// New palette: Indigo primary, system-native typography

export const Colors = {
  // Brand
  primary: '#4F46E5',          // Indigo
  primaryDark: '#3730A3',
  primaryLight: '#6366F1',
  primaryFaded: '#EEF2FF',

  // Status semantic
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Surfaces
  background: '#F9FAFB',
  cardBg: '#FFFFFF',
  surfaceAlt: '#F3F4F6',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',

  // Tab bar
  tabActive: '#4F46E5',
  tabInactive: '#9CA3AF',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',

  // Shift type chips
  shiftMorning: '#3B82F6',
  shiftEvening: '#F59E0B',
  shiftNight: '#8B5CF6',
  shiftOvertime: '#EF4444',
  shiftWeekend: '#EC4899',

  // Clock
  clockIn: '#10B981',
  clockOut: '#EF4444',
  clockBreak: '#F59E0B',

  // Legacy compat (used in older services)
  accent: '#4F46E5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warningAlt: '#F59E0B',
  infoAlt: '#3B82F6',
  infoLight: '#DBEAFE',
  card: '#FFFFFF',
  dashboardBg: '#F9FAFB',
  textOnDark: '#F9FAFB',
  textLight: '#FFFFFF',
  borderDark: '#374151',
  borderCard: '#E5E7EB',
  borderLight: '#E5E7EB',
  overlayLight: 'rgba(0,0,0,0.15)',
  overlay: 'rgba(0,0,0,0.5)',
  morningShift: '#3B82F6',
  eveningShift: '#F59E0B',
  nightShift: '#8B5CF6',
  overtimeShift: '#EF4444',
  weekendShift: '#EC4899',
  checkedIn: '#10B981',
  checkedOut: '#9CA3AF',
  absent: '#EF4444',
  late: '#F59E0B',
  activeProject: '#10B981',
  pendingProject: '#F59E0B',
  completedProject: '#6B7280',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  panel: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  strong: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
};
