-- =========================================================================
-- KHỞI TẠO CẤU TRÚC DATABASE (INITIAL SCHEMA)
-- Dành cho hệ thống Điểm Danh An Phú (Supabase Version)
--
-- HƯỚNG DẪN: 
-- Chạy toàn bộ Script này trên SQL Editor của Supabase TRƯỚC khi chạy script RLS.
-- =========================================================================

-- 1. Bảng Phòng Ban (departments)
CREATE TABLE IF NOT EXISTS public.departments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Chức Vụ (positions)
CREATE TABLE IF NOT EXISTS public.positions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Khu Phố (neighborhoods)
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Nhân Sự (staff)
CREATE TABLE IF NOT EXISTS public.staff (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  staff_code TEXT,
  full_name TEXT NOT NULL,
  position_id BIGINT REFERENCES public.positions(id) ON DELETE SET NULL,
  department_id BIGINT REFERENCES public.departments(id) ON DELETE SET NULL,
  neighborhood_id BIGINT REFERENCES public.neighborhoods(id) ON DELETE SET NULL,
  phone TEXT,
  email TEXT,
  qr_code TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng Cuộc Họp (meetings)
CREATE TABLE IF NOT EXISTS public.meetings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  content TEXT,
  participant_department_ids INT[] DEFAULT '{}',
  participant_position_ids INT[] DEFAULT '{}',
  participant_neighborhood_ids INT[] DEFAULT '{}',
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  location TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bảng Điểm Danh (attendance)
CREATE TABLE IF NOT EXISTS public.attendance (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  meeting_id BIGINT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  staff_id BIGINT NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  checkin_time TIMESTAMPTZ DEFAULT NOW(),
  checkin_method TEXT,
  status TEXT DEFAULT 'present',
  UNIQUE(meeting_id, staff_id)
);

-- Thêm Indexes để load API siêu tốc
CREATE INDEX IF NOT EXISTS idx_staff_department ON public.staff(department_id);
CREATE INDEX IF NOT EXISTS idx_staff_position ON public.staff(position_id);
CREATE INDEX IF NOT EXISTS idx_attendance_meeting ON public.attendance(meeting_id);
CREATE INDEX IF NOT EXISTS idx_attendance_staff ON public.attendance(staff_id);

-- Lưu ý: Những bảng này là nền tảng. Sau khi chạy script này thành công, 
-- bạn hãy chạy tiếp Script số `01_rls_policies.sql` để bảo mật.
