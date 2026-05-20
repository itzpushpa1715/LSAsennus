// Zustand shift store
import { create } from 'zustand';
import { fetchShiftsForDateRange, fetchShifts, type ShiftRow } from '@/services/supabase/shiftService';

interface ShiftState {
  shifts: ShiftRow[];
  loading: boolean;
  error: string | null;
  fetchWeek: (from: string, to: string) => Promise<void>;
  fetchDay: (date: string) => Promise<void>;
  getForDate: (date: string) => ShiftRow[];
  getForEmployee: (employeeId: string) => ShiftRow[];
}

export const useShiftStore = create<ShiftState>((set, get) => ({
  shifts: [],
  loading: false,
  error: null,

  fetchWeek: async (from, to) => {
    set({ loading: true, error: null });
    const { data, error } = await fetchShiftsForDateRange(from, to);
    set({ shifts: data, loading: false, error });
  },

  fetchDay: async (date) => {
    set({ loading: true, error: null });
    const { data, error } = await fetchShifts(date);
    set({ shifts: data, loading: false, error });
  },

  getForDate: (date) => get().shifts.filter(s => s.date === date),
  getForEmployee: (id) => get().shifts.filter(s => s.employee_id === id),
}));
