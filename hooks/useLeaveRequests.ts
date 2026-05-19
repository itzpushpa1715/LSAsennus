// Leave requests hook — fetches from Supabase
import { useState, useEffect, useCallback } from 'react';
import {
  fetchLeaveRequests,
  updateLeaveStatus,
  type LeaveRequestRow,
} from '@/services/supabase/siteLeaveService';

export function useLeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchLeaveRequests();
    if (error) setError(error);
    setRequests(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (leaveId: string, reviewerId: string): Promise<string | null> => {
    const { error } = await updateLeaveStatus(leaveId, 'approved', reviewerId);
    if (error) return error;
    await load();
    return null;
  };

  const reject = async (leaveId: string, reviewerId: string): Promise<string | null> => {
    const { error } = await updateLeaveStatus(leaveId, 'rejected', reviewerId);
    if (error) return error;
    await load();
    return null;
  };

  const pending = requests.filter(r => r.status === 'pending');

  return { requests, pending, loading, error, approve, reject, refetch: load };
}
