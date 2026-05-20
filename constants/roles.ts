// Role definitions and route mapping
export type UserRole = 'admin' | 'supervisor' | 'employee';

export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/(admin)',
  supervisor: '/(manager)',
  employee: '/(employee)',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'HR / Admin',
  supervisor: 'Manager',
  employee: 'Employee',
};

export const LEAVE_TYPES = ['Annual', 'Sick', 'Unpaid', 'Parental', 'Emergency'] as const;
export type LeaveType = (typeof LEAVE_TYPES)[number];

export const SHIFT_TYPES = ['morning', 'evening', 'night', 'overtime', 'weekend', 'emergency'] as const;
export type ShiftType = (typeof SHIFT_TYPES)[number];

export const TASK_PRIORITIES = ['High', 'Medium', 'Low'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
