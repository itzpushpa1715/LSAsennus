// LS-ASENNUS Mock Data Service
// All data is mocked locally for V1.0

export type UserRole = 'admin' | 'supervisor' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  department: string;
  nationality: string;
  phone: string;
  email: string;
  contractType: string;
  startDate: string;
  hourlyRate: number;
  status: 'active' | 'inactive' | 'on-leave';
  documents: EmployeeDocument[];
  attendanceRate: number;
  overtimeHours: number;
}

export interface EmployeeDocument {
  type: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'morning' | 'evening' | 'night' | 'overtime' | 'weekend';
  site: string;
  role: string;
  status: 'scheduled' | 'active' | 'completed' | 'missed';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  breakMinutes: number;
  totalHours: number;
  overtimeHours: number;
  site: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface Site {
  id: string;
  name: string;
  location: string;
  manager: string;
  activeWorkers: number;
  totalWorkers: number;
  status: 'active' | 'maintenance' | 'closed';
  currentShift: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'sick' | 'annual' | 'unpaid' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Mikael Virtanen',
    email: 'admin@ls-asennus.fi',
    role: 'admin',
    department: 'Administration',
    employeeId: 'LS-001',
  },
  {
    id: 'u2',
    name: 'Juhani Mäkinen',
    email: 'supervisor@ls-asennus.fi',
    role: 'supervisor',
    department: 'Electrical',
    employeeId: 'LS-042',
  },
  {
    id: 'u3',
    name: 'Raj Thapa',
    email: 'employee@ls-asennus.fi',
    role: 'employee',
    department: 'Welding',
    employeeId: 'LS-118',
  },
];

// Mock Employees
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'Juhani Mäkinen',
    employeeId: 'LS-042',
    role: 'Senior Electrician',
    department: 'Electrical',
    nationality: 'Finnish',
    phone: '+358 40 123 4567',
    email: 'j.makinen@ls-asennus.fi',
    contractType: 'Full-time',
    startDate: '2021-03-15',
    hourlyRate: 28.5,
    status: 'active',
    attendanceRate: 96,
    overtimeHours: 12,
    documents: [
      { type: 'Työturvallisuuskortti', expiryDate: '2025-08-20', status: 'valid' },
      { type: 'SFS 6002', expiryDate: '2024-06-10', status: 'expiring' },
    ],
  },
  {
    id: 'e2',
    name: 'Raj Thapa',
    employeeId: 'LS-118',
    role: 'Welder',
    department: 'Welding',
    nationality: 'Nepali',
    phone: '+358 44 987 6543',
    email: 'r.thapa@ls-asennus.fi',
    contractType: 'Full-time',
    startDate: '2022-09-01',
    hourlyRate: 24.0,
    status: 'active',
    attendanceRate: 98,
    overtimeHours: 8,
    documents: [
      { type: 'Residence Permit', expiryDate: '2024-07-30', status: 'expiring' },
      { type: 'Hot Work Card', expiryDate: '2025-12-01', status: 'valid' },
      { type: 'Welding Cert', expiryDate: '2026-03-15', status: 'valid' },
    ],
  },
  {
    id: 'e3',
    name: 'Ahmad Al-Hassan',
    employeeId: 'LS-093',
    role: 'Pipe Installer',
    department: 'Piping',
    nationality: 'Syrian',
    phone: '+358 41 555 0012',
    email: 'a.alhassan@ls-asennus.fi',
    contractType: 'Full-time',
    startDate: '2023-01-10',
    hourlyRate: 22.5,
    status: 'active',
    attendanceRate: 91,
    overtimeHours: 4,
    documents: [
      { type: 'Residence Permit', expiryDate: '2024-04-01', status: 'expired' },
      { type: 'Työturvallisuuskortti', expiryDate: '2025-11-15', status: 'valid' },
    ],
  },
  {
    id: 'e4',
    name: 'Petteri Korhonen',
    employeeId: 'LS-031',
    role: 'Site Supervisor',
    department: 'Operations',
    nationality: 'Finnish',
    phone: '+358 50 234 5678',
    email: 'p.korhonen@ls-asennus.fi',
    contractType: 'Full-time',
    startDate: '2019-06-01',
    hourlyRate: 32.0,
    status: 'active',
    attendanceRate: 99,
    overtimeHours: 20,
    documents: [
      { type: 'Työturvallisuuskortti', expiryDate: '2026-05-01', status: 'valid' },
      { type: 'First Aid', expiryDate: '2025-09-20', status: 'valid' },
    ],
  },
  {
    id: 'e5',
    name: 'Sari Leinonen',
    employeeId: 'LS-077',
    role: 'Electrician',
    department: 'Electrical',
    nationality: 'Finnish',
    phone: '+358 45 678 9012',
    email: 's.leinonen@ls-asennus.fi',
    contractType: 'Part-time',
    startDate: '2022-04-15',
    hourlyRate: 26.0,
    status: 'on-leave',
    attendanceRate: 88,
    overtimeHours: 0,
    documents: [
      { type: 'SFS 6002', expiryDate: '2025-07-14', status: 'valid' },
    ],
  },
  {
    id: 'e6',
    name: 'Biplav Gurung',
    employeeId: 'LS-145',
    role: 'Welder',
    department: 'Welding',
    nationality: 'Nepali',
    phone: '+358 44 111 2233',
    email: 'b.gurung@ls-asennus.fi',
    contractType: 'Fixed-term',
    startDate: '2023-08-20',
    hourlyRate: 22.0,
    status: 'active',
    attendanceRate: 95,
    overtimeHours: 6,
    documents: [
      { type: 'Residence Permit', expiryDate: '2025-02-28', status: 'valid' },
      { type: 'Welding Cert', expiryDate: '2024-11-30', status: 'expiring' },
    ],
  },
];

// Mock Shifts (today's)
export const MOCK_SHIFTS: Shift[] = [
  {
    id: 's1',
    employeeId: 'e1',
    employeeName: 'Juhani Mäkinen',
    date: '2026-05-19',
    startTime: '06:00',
    endTime: '14:00',
    type: 'morning',
    site: 'Meyer Turku',
    role: 'Senior Electrician',
    status: 'completed',
  },
  {
    id: 's2',
    employeeId: 'e2',
    employeeName: 'Raj Thapa',
    date: '2026-05-19',
    startTime: '06:00',
    endTime: '14:00',
    type: 'morning',
    site: 'Meyer Turku',
    role: 'Welder',
    status: 'active',
  },
  {
    id: 's3',
    employeeId: 'e3',
    employeeName: 'Ahmad Al-Hassan',
    date: '2026-05-19',
    startTime: '14:00',
    endTime: '22:00',
    type: 'evening',
    site: 'Turku Repair Yard',
    role: 'Pipe Installer',
    status: 'scheduled',
  },
  {
    id: 's4',
    employeeId: 'e4',
    employeeName: 'Petteri Korhonen',
    date: '2026-05-19',
    startTime: '06:00',
    endTime: '18:00',
    type: 'overtime',
    site: 'Meyer Turku',
    role: 'Site Supervisor',
    status: 'active',
  },
  {
    id: 's5',
    employeeId: 'e6',
    employeeName: 'Biplav Gurung',
    date: '2026-05-19',
    startTime: '22:00',
    endTime: '06:00',
    type: 'night',
    site: 'Electrical Installation Area',
    role: 'Welder',
    status: 'scheduled',
  },
  {
    id: 's6',
    employeeId: 'e1',
    employeeName: 'Juhani Mäkinen',
    date: '2026-05-20',
    startTime: '06:00',
    endTime: '14:00',
    type: 'morning',
    site: 'Meyer Turku',
    role: 'Senior Electrician',
    status: 'scheduled',
  },
];

// Mock Attendance
export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'a1',
    employeeId: 'e1',
    employeeName: 'Juhani Mäkinen',
    date: '2026-05-19',
    clockIn: '05:58',
    clockOut: '14:03',
    breakMinutes: 30,
    totalHours: 7.58,
    overtimeHours: 0,
    site: 'Meyer Turku',
    status: 'present',
  },
  {
    id: 'a2',
    employeeId: 'e2',
    employeeName: 'Raj Thapa',
    date: '2026-05-19',
    clockIn: '06:12',
    breakMinutes: 30,
    totalHours: 0,
    overtimeHours: 0,
    site: 'Meyer Turku',
    status: 'late',
  },
  {
    id: 'a3',
    employeeId: 'e3',
    employeeName: 'Ahmad Al-Hassan',
    date: '2026-05-19',
    breakMinutes: 0,
    totalHours: 0,
    overtimeHours: 0,
    site: 'Turku Repair Yard',
    status: 'absent',
  },
  {
    id: 'a4',
    employeeId: 'e4',
    employeeName: 'Petteri Korhonen',
    date: '2026-05-19',
    clockIn: '05:55',
    breakMinutes: 60,
    totalHours: 11,
    overtimeHours: 3,
    site: 'Meyer Turku',
    status: 'present',
  },
  {
    id: 'a5',
    employeeId: 'e6',
    employeeName: 'Biplav Gurung',
    date: '2026-05-19',
    breakMinutes: 0,
    totalHours: 0,
    overtimeHours: 0,
    site: 'Electrical Installation Area',
    status: 'present',
  },
];

// Mock Sites
export const MOCK_SITES: Site[] = [
  {
    id: 'site1',
    name: 'Meyer Turku',
    location: 'Turku, Finland',
    manager: 'Petteri Korhonen',
    activeWorkers: 34,
    totalWorkers: 45,
    status: 'active',
    currentShift: 'Morning',
  },
  {
    id: 'site2',
    name: 'Turku Repair Yard',
    location: 'Turku, Finland',
    manager: 'Juhani Mäkinen',
    activeWorkers: 12,
    totalWorkers: 18,
    status: 'active',
    currentShift: 'Evening',
  },
  {
    id: 'site3',
    name: 'Electrical Installation Area',
    location: 'Naantali, Finland',
    manager: 'Petteri Korhonen',
    activeWorkers: 8,
    totalWorkers: 10,
    status: 'active',
    currentShift: 'Night',
  },
];

// Mock Leave Requests
export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'l1',
    employeeId: 'e5',
    employeeName: 'Sari Leinonen',
    type: 'sick',
    startDate: '2026-05-12',
    endDate: '2026-05-23',
    days: 10,
    reason: 'Medical leave',
    status: 'approved',
    requestedAt: '2026-05-11',
  },
  {
    id: 'l2',
    employeeId: 'e3',
    employeeName: 'Ahmad Al-Hassan',
    type: 'annual',
    startDate: '2026-06-01',
    endDate: '2026-06-14',
    days: 10,
    reason: 'Summer vacation',
    status: 'pending',
    requestedAt: '2026-05-18',
  },
  {
    id: 'l3',
    employeeId: 'e6',
    employeeName: 'Biplav Gurung',
    type: 'emergency',
    startDate: '2026-05-20',
    endDate: '2026-05-21',
    days: 2,
    reason: 'Family emergency',
    status: 'pending',
    requestedAt: '2026-05-19',
  },
];

// Dashboard Statistics
export const getDashboardStats = () => ({
  totalEmployees: MOCK_EMPLOYEES.length,
  activeToday: 4,
  onLeave: 1,
  shiftsToday: MOCK_SHIFTS.filter(s => s.date === '2026-05-19').length,
  presentToday: MOCK_ATTENDANCE.filter(a => a.status === 'present').length,
  absentToday: MOCK_ATTENDANCE.filter(a => a.status === 'absent').length,
  lateToday: MOCK_ATTENDANCE.filter(a => a.status === 'late').length,
  pendingLeaves: MOCK_LEAVE_REQUESTS.filter(l => l.status === 'pending').length,
  expiringDocs: MOCK_EMPLOYEES.reduce((acc, emp) =>
    acc + emp.documents.filter(d => d.status === 'expiring' || d.status === 'expired').length, 0),
  overtimeHoursThisWeek: 43,
  attendanceRate: 87,
  activeSites: MOCK_SITES.filter(s => s.status === 'active').length,
});
