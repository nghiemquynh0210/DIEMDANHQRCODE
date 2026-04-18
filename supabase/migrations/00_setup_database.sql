-- =========================================================================
-- KHỞI TẠO CẤU TRÚC VÀ BẢO MẬT DATABASE TỔNG HỢP (SUPER SCRIPT)
-- Dành cho hệ thống Điểm Danh An Phú (Supabase Version)
--
-- HƯỚNG DẪN: MỞ BẢNG ĐIỀU KHIỂN SUPABASE SQL EDITOR VÀ CHẠY TOÀN BỘ MÃ NÀY!
-- =========================================================================

-- ==========================================
-- PHẦN 1: TẠO CẤU TRÚC BẢNG (SCHEMA)
-- ==========================================

-- Đảm bảo xóa sạch các bảng cũ bị lỗi cấu trúc (nếu có) để tạo lại chuẩn 100%
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;
DROP TABLE IF EXISTS public.staff CASCADE;
DROP TABLE IF EXISTS public.neighborhoods CASCADE;
DROP TABLE IF EXISTS public.positions CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;

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
  created_by UUID, -- Tạm bỏ reference cứng tới auth.users phòng trường hợp lỗi schema system
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

-- ==========================================
-- PHẦN 2: BẬT BẢO MẬT (ROW LEVEL SECURITY)
-- ==========================================

-- Bật RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Hàm hỗ trợ xóa policy an toàn (tránh lỗi nếu chưa có)
DO $$
BEGIN
    -- Departments
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem phòng ban" ON departments;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa phòng ban" ON departments;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên phòng ban" ON departments;
    
    -- Positions
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem chức vụ" ON positions;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa chức vụ" ON positions;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên chức vụ" ON positions;

    -- Neighborhoods
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem khu phố" ON neighborhoods;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa khu phố" ON neighborhoods;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên khu phố" ON neighborhoods;

    -- Meetings
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem cuộc họp" ON meetings;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa cuộc họp" ON meetings;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên cuộc họp" ON meetings;

    -- Staff
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem nhân sự" ON staff;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa nhân sự" ON staff;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên nhân sự" ON staff;

    -- Attendance
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem điểm danh" ON attendance;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa điểm danh" ON attendance;
    DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên điểm danh" ON attendance;
END $$;

-- Tạo lại Policies chuẩn 100%
CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên phòng ban" 
ON public.departments AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên chức vụ" 
ON public.positions AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên khu phố" 
ON public.neighborhoods AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên cuộc họp" 
ON public.meetings AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên nhân sự" 
ON public.staff AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên điểm danh" 
ON public.attendance AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ĐÃ HOÀN TẤT!
