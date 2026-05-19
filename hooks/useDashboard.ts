// Dashboard data hook — fetches all stats from Supabase
import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '@/services/supabase/userProfileService';
import { fetchSites, type SiteRow } from '@/services/supabase/siteLeaveService';
import { fetchShifts, type ShiftRow } from '@/services/supabase/shiftService';

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  shiftsToday: number;
  overtimeHoursThisWeek: number;
  attendanceRate: number;
  activeSites: number;
  pendingLeaves: number;
  expiringDocs: number;
}

const TODAY = new Date().toISOString().split('T')[0];

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [todayShifts, setTodayShifts] = useState<ShiftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [statsRes, sitesRes, shiftsRes] = await Promise.all([
      getDashboardStats(TODAY),
      fetchSites(),
      fetchShifts(TODAY),
    ]);
    if (sitesRes.error) setError(sitesRes.error);
    if (shiftsRes.error) setError(shiftsRes.error);
    setStats(statsRes);
    setSites(sitesRes.data);
    setTodayShifts(shiftsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, sites, todayShifts, loading, error, refetch: load };
}
