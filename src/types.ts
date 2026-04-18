export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Position {
  id: number;
  name: string;
  code?: string;
  description?: string;
  sort_order?: number;
  created_at: string;
}

export interface Neighborhood {
  id: number;
  name: string;
  code?: string;
  description?: string;
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
  neighborhood_id?: number | null;
  neighborhood_name?: string | null;
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
  participant_department_ids: number[];
  participant_position_ids: number[];
  participant_neighborhood_ids: number[];
  meeting_date: string;
  meeting_time: string;
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
  neighborhood_name?: string | null;
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
