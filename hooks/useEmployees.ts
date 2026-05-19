// Employee list hook — fetches from Supabase
import { useState, useEffect, useCallback } from 'react';
import { fetchEmployees, fetchEmployee, type EmployeeRow } from '@/services/supabase/employeeService';

export function useEmployees() {
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchEmployees();
    if (error) setError(error);
    setEmployees(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { employees, loading, error, refetch: load };
}

export function useEmployee(id: string) {
  const [employee, setEmployee] = useState<EmployeeRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchEmployee(id).then(({ data, error }) => {
      if (error) setError(error);
      setEmployee(data);
      setLoading(false);
    });
  }, [id]);

  return { employee, loading, error };
}
