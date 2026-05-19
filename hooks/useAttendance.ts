// Attendance hook — fetches from Supabase and handles clock in/out
import { useState, useEffect, useCallback } from 'react';
import {
  fetchAttendance,
  clockIn as doClockIn,
  clockOut as doClockOut,
  type AttendanceRow,
} from '@/services/supabase/attendanceService';

const TODAY = new Date().toISOString().split('T')[0];

export function useAttendance(employeeDbId?: string) {
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [myRecord, setMyRecord] = useState<AttendanceRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchAttendance(TODAY);
    if (error) setError(error);
    setRecords(data);
    if (employeeDbId) {
      const mine = data.find(r => r.employee_id === employeeDbId) || null;
      setMyRecord(mine);
      setClockedIn(!!mine?.clock_in && !mine?.clock_out);
    }
    setLoading(false);
  }, [employeeDbId]);

  useEffect(() => { load(); }, [load]);

  const clockIn = async (employeeName: string, site: string): Promise<string | null> => {
    if (!employeeDbId) return 'Employee not found';
    const { data, error } = await doClockIn(employeeDbId, employeeName, site);
    if (error) return error;
    setMyRecord(data);
    setClockedIn(true);
    await load();
    return null;
  };

  const clockOut = async (): Promise<string | null> => {
    if (!employeeDbId) return 'Employee not found';
    const { data, error } = await doClockOut(employeeDbId);
    if (error) return error;
    setMyRecord(data);
    setClockedIn(false);
    await load();
    return null;
  };

  return { records, myRecord, clockedIn, loading, error, clockIn, clockOut, refetch: load };
}
