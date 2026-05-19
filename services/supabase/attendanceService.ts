// Attendance data service — OnSpace Cloud / Supabase
import { supabase } from './client';

export interface AttendanceRow {
  id: string;
  employee_id: string | null;
  employee_name: string;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  break_minutes: number;
  total_hours: number;
  overtime_hours: number;
  site: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string | null;
}

export async function fetchAttendance(date?: string): Promise<{ data: AttendanceRow[]; error: string | null }> {
  let query = supabase
    .from('attendance')
    .select('*')
    .order('employee_name');
  if (date) query = query.eq('date', date);
  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: data as AttendanceRow[], error: null };
}

export async function clockIn(
  employeeId: string,
  employeeName: string,
  site: string
): Promise<{ data: AttendanceRow | null; error: string | null }> {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const scheduledStart = '06:00';
  const isLate = time > scheduledStart;

  const { data, error } = await supabase
    .from('attendance')
    .upsert({
      employee_id: employeeId,
      employee_name: employeeName,
      date: today,
      clock_in: time,
      site,
      status: isLate ? 'late' : 'present',
    }, { onConflict: 'employee_id,date' })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as AttendanceRow, error: null };
}

export async function clockOut(
  employeeId: string
): Promise<{ data: AttendanceRow | null; error: string | null }> {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Fetch existing to compute hours
  const { data: existing } = await supabase
    .from('attendance')
    .select('clock_in, break_minutes')
    .eq('employee_id', employeeId)
    .eq('date', today)
    .single();

  let totalHours = 0;
  let overtimeHours = 0;
  if (existing?.clock_in) {
    const [inH, inM] = existing.clock_in.split(':').map(Number);
    const [outH, outM] = time.split(':').map(Number);
    const totalMins = (outH * 60 + outM) - (inH * 60 + inM) - (existing.break_minutes || 0);
    totalHours = Math.max(0, totalMins / 60);
    overtimeHours = Math.max(0, totalHours - 8);
  }

  const { data, error } = await supabase
    .from('attendance')
    .update({ clock_out: time, total_hours: totalHours, overtime_hours: overtimeHours })
    .eq('employee_id', employeeId)
    .eq('date', today)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as AttendanceRow, error: null };
}
