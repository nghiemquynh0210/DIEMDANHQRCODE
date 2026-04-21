export interface Department {
  id: number;
  name: string;
  description: string;
  org_type: 'party' | 'government' | 'school';
  created_at: string;
}

export interface Position {
  id: number;
  name: string;
  code?: string;
  description?: string;
  org_type: 'party' | 'government' | 'school';
  sort_order?: number;
  created_at: string;
}

export interface Staff {
  id: number;
  staff_code?: string;
  full_name: string;
  position_id?: number | null;
  position_name?: string | null;
  department_id?: number | null;
  department_name?: string | null;
  party_position_id?: number | null;
  party_position_name?: string | null;
  party_department_id?: number | null;
  party_department_name?: string | null;
  school_position_id?: number | null;
  school_position_name?: string | null;
  school_department_id?: number | null;
  school_department_name?: string | null;
  phone: string;
  email: string;
  qr_code?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
}

export interface Meeting {
  id: number;
  title: string;
  content: string;
  org_type: 'party' | 'government' | 'school' | 'all';
  participant_department_ids: number[];
  participant_position_ids: number[];
  meeting_date: string;
  meeting_time: string;
  meeting_end_time?: string;
  location: string;
  created_by?: number | null;
  created_at: string;
}

export interface Attendance {
  id: number;
  meeting_id: number;
  staff_id: number;
  full_name?: string;
  staff_code?: string;
  position_name?: string | null;
  department_name?: string | null;
  checkin_time: string;
  checkin_method?: 'qr' | 'manual' | 'self';
  status: 'present' | 'late' | 'absent';
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'staff' | 'viewer';
  staff_id?: number | null;
}

