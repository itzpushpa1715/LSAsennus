// Employee data service — OnSpace Cloud / Supabase
import { supabase } from './client';

export interface EmployeeRow {
  id: string;
  user_id: string | null;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string;
  nationality: string | null;
  address: string | null;
  emergency_contact: string | null;
  contract_type: string;
  salary_type: string;
  hourly_rate: number;
  tes_category: string | null;
  start_date: string;
  status: 'active' | 'inactive' | 'on-leave';
  attendance_rate: number;
  overtime_hours: number;
  created_at: string;
  updated_at: string;
  employee_documents?: DocumentRow[];
}

export interface DocumentRow {
  id: string;
  employee_id: string;
  type: string;
  expiry_date: string | null;
  status: 'valid' | 'expiring' | 'expired';
  file_url: string | null;
}

export async function fetchEmployees(): Promise<{ data: EmployeeRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('employees')
    .select(`*, employee_documents(*)`)
    .order('full_name');
  if (error) return { data: [], error: error.message };
  return { data: data as EmployeeRow[], error: null };
}

export async function fetchEmployee(id: string): Promise<{ data: EmployeeRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('employees')
    .select(`*, employee_documents(*)`)
    .eq('id', id)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as EmployeeRow, error: null };
}

export async function fetchEmployeeByEmployeeId(employeeId: string): Promise<{ data: EmployeeRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('employees')
    .select(`*, employee_documents(*)`)
    .eq('employee_id', employeeId)
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as EmployeeRow, error: null };
}

export function getExpiryAlertCount(employees: EmployeeRow[]): number {
  return employees.reduce((acc, emp) => {
    const docs = emp.employee_documents || [];
    return acc + docs.filter(d => d.status === 'expired' || d.status === 'expiring').length;
  }, 0);
}
