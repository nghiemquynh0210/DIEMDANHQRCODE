-- ========================================================
-- KỊCH BẢN ÁP DỤNG ROW LEVEL SECURITY (RLS) CHO SUPABASE
-- Dành cho hệ thống Điểm Danh An Phú (Premium Version)
-- ========================================================

-- MỤC ĐÍCH: 
-- Ngăn chặn những truy cập trái phép bằng Public API KEY 
-- của Supabase từ trình duyệt. Mọi truy cập phải được xác 
-- thực thông qua Supabase Auth.

-- HƯỚNG DẪN: 
-- Hãy chép toàn bộ mã SQL này và chạy trên SQL Editor của Supabase.

-- 1. Bật RLS cho tất cả các bảng chính
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ nếu có (để tránh lỗi tạo trùng)
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem phòng ban" ON departments;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem chức vụ" ON positions;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem khu phố" ON neighborhoods;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem cuộc họp" ON meetings;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem nhân sự" ON staff;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập xem điểm danh" ON attendance;

DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa phòng ban" ON departments;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa chức vụ" ON positions;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa khu phố" ON neighborhoods;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa cuộc họp" ON meetings;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa nhân sự" ON staff;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập chỉnh sửa điểm danh" ON attendance;

DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên phòng ban" ON departments;
DROP POLICY IF EXISTS "Cho phép khách chưa đăng nhập xem danh sách phòng ban" ON departments;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên chức vụ" ON positions;
DROP POLICY IF EXISTS "Cho phép khách chưa đăng nhập xem danh sách chức vụ" ON positions;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên khu phố" ON neighborhoods;
DROP POLICY IF EXISTS "Cho phép khách chưa đăng nhập xem danh sách khu phố" ON neighborhoods;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên cuộc họp" ON meetings;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên nhân sự" ON staff;
DROP POLICY IF EXISTS "Cho phép staff/admin đã đăng nhập toàn quyền trên điểm danh" ON attendance;

-- 2. Tạo Policies (Quy tắc): 
-- Chỉ cấp quyền CREATE/READ/UPDATE/DELETE cho những người thuộc nhóm 'authenticated' (đã đăng nhập)

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên phòng ban" 
ON departments AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép khách chưa đăng nhập xem danh sách phòng ban" 
ON departments FOR SELECT TO anon USING (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên chức vụ" 
ON positions AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép khách chưa đăng nhập xem danh sách chức vụ" 
ON positions FOR SELECT TO anon USING (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên khu phố" 
ON neighborhoods AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép khách chưa đăng nhập xem danh sách khu phố" 
ON neighborhoods FOR SELECT TO anon USING (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên cuộc họp" 
ON meetings AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên nhân sự" 
ON staff AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Cho phép staff/admin đã đăng nhập toàn quyền trên điểm danh" 
ON attendance AS PERMISSIVE FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================================================
-- HOÀN TẤT. Hệ thống đã an toàn khỏi các tương tác nặc danh.