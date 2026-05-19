// Shifts hook — fetches from Supabase
import { useState, useEffect, useCallback } from 'react';
import { fetchShiftsForDateRange, type ShiftRow } from '@/services/supabase/shiftService';

// Build a week range starting from a given ISO date
function getWeekRange(startIso: string): { from: string; to: string; dates: string[] } {
  const dates: string[] = [];
  const start = new Date(startIso);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return { from: dates[0], to: dates[6], dates };
}

const TODAY = new Date().toISOString().split('T')[0];

export function useShifts() {
  const [allShifts, setAllShifts] = useState<ShiftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { from, to, dates } = getWeekRange(TODAY);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchShiftsForDateRange(from, to);
    if (error) setError(error);
    setAllShifts(data);
    setLoading(false);
  }, [from, to]);

  useEffect(() => { load(); }, [load]);

  const getShiftsForDate = (date: string) => allShifts.filter(s => s.date === date);
  const weekDates = dates;

  return { allShifts, getShiftsForDate, weekDates, loading, error, refetch: load };
}
