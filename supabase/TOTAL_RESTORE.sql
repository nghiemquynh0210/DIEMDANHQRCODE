-- ==========================================
-- SUPER RESTORE SCRIPT - CHẠY 1 LẦN DUY NHẤT LÀ XONG TẤT CẢ!
-- Được bổ sung lệnh dọn dẹp các tài khoản mồ côi (Orphaned Identities)
-- ==========================================

-- 1. Dọn dẹp sạch sẽ dữ liệu rác cũ (Cực kỳ quan trọng để sửa lỗi đăng nhập)
DELETE FROM auth.identities WHERE provider = 'email' AND identity_data->>'email' LIKE '%@anphu.com';
DELETE FROM auth.users WHERE email LIKE '%@anphu.com';
TRUNCATE TABLE staff CASCADE;

-- 2. Import lại danh sách nhân sự (Staff) chuẩn
-- Update Script: Remove incorrectly added "khu phố" from departments
DELETE FROM departments WHERE name ILIKE '%khu phố%';

-- Generated script to insert staff using standard SQL subqueries
INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Ngô Hiếu', (SELECT id FROM departments WHERE name = 'Chi bộ trường THPT Lý Thái Tổ' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1979, Quê quán: Thuận An, Bình Dương - phường Bình Hòa, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thị Hồng Minh', (SELECT id FROM departments WHERE name = 'Chi bộ trường THPT Lý Thái Tổ' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Mỹ Bằng, Yên Sơn, Tuyên Quang - Thuận Giao, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thị Mỹ Tiền', (SELECT id FROM departments WHERE name = 'Chi bộ trường THPT Lý Thái Tổ' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Phú Lợi, Thủ Dầu Một, Bình Dương - An Thạnh, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Bùi Thị Nhung', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty TNHH Komax Việt Nam' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: Xã An Hòa, Quỳnh Lưu, Nghệ An');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phí Văn Đức', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty TNHH Komax Việt Nam' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó bí thư chi bộ' LIMIT 1), 'Năm sinh: 1974, Quê quán: Xã Tuyết Nghĩa, Quốc Oai, Hà Nội');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phan Thị Thanh Tâm', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty cổ phần chiếu xạ An Phú' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bô, trưởng Phòng Hành chánh nhân sự' LIMIT 1), 'Năm sinh: , Quê quán: Phổ Cương, Đức Phổ, Quảng Ngãi
146/10A1, Lã Xuân Oai, Phường Tăng Nhơn Phú A, Tp HCM');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Thanh Hóa', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty cổ phần chiếu xạ An Phú' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó bí thư chi bô, Quản đốc, Chủ tịch Công Đoàn.' LIMIT 1), 'Năm sinh: 1977, Quê quán: Hòa Vang, Đà Nẳng
KP Bình Phước B, Phường An Phú, Tp HCM');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Đoàn Hoàng Thiện', (SELECT id FROM departments WHERE name = 'Chi bộ Trạm Y tế' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phan Thanh Ngọc', (SELECT id FROM departments WHERE name = 'Chi bộ Trạm Y tế' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Đỗ Ngọc Điệp', (SELECT id FROM departments WHERE name = 'Chi bộ Trạm Y tế' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Phi Sơn', (SELECT id FROM departments WHERE name = 'Chi bộ Công an' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Trưởng Công an' LIMIT 1), 'Năm sinh: 1985, Quê quán: Tân Thạnh Đông, Củ Chi, TP Hồ Chí Minh
Tân Thạnh Đông, Củ Chi, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Văn Quang Lợi', (SELECT id FROM departments WHERE name = 'Chi bộ Công an' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Trưởng Công an' LIMIT 1), 'Năm sinh: 1985, Quê quán: Hòa Lợi, Bến Cát, Bình Dương
Chánh Mỹ, Thủ Dầu Một, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Thị Thu Thủy', (SELECT id FROM departments WHERE name = 'Chi bộ Công an' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên, cán bộ Công an' LIMIT 1), 'Năm sinh: , Quê quán: Xuân Hòa, Xuân Trường, Nam Định 
Hiệp Thành, TDM, tỉnh Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thị Hiền', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư Đảng ủy, CT HĐND, Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: An Sơn, Thuận An, Bình Dương
An Sơn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Lê Xuân Hùng', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'UV.BTV, Phó Bí thư chi bộ, CHT Ban CHQS' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phạm Phú Nam', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Tiến Công', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ,  Chính trị viên phó' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phan Tấn Phú', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Cao Quang Trung', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1967, Quê quán: Quảng Bình
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Hữu Nghi', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Phó Trưởng BĐH, khu đội trưởng' LIMIT 1), 'Năm sinh: 1978, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Huỳnh Văn Truyện', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1963, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Hồ Quốc Bình', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Trưởng Ban CTMT' LIMIT 1), 'Năm sinh: 1981, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Huỳnh Vương Quốc', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ phó tổ ANCS' LIMIT 1), 'Năm sinh: 1988, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phạm Văn Thái', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1968, Quê quán: Trực Cường, Trực Ninh, Nam Định
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Văn Thuần', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1979, Quê quán: An Ấp, Quỳnh Phụ, Thái Bình
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phạm Văn Dũng', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ, chi hội trưởng hội CCB' LIMIT 1), 'Năm sinh: 1976, Quê quán: Hải Minh, Hải Hậu, Nam Định
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phan Thị Kiều Loan', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ, Đề án Hội LHPN phường' LIMIT 1), 'Năm sinh: , Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Hà Văn Hóa', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 1B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ, tổ trưởng tổ ANTT' LIMIT 1), 'Năm sinh: 1986, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phạm Văn Bình', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 2%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1969, Quê quán: Lái Thiêu, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Quang Huy', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 2%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1991, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Bùi Tuấn Anh', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 2%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, khu đôi trưởng' LIMIT 1), 'Năm sinh: 1992, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Thanh Rồng', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 2%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Phó Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1963, Quê quán: Mỹ Thành Bắc, Cai Lậy, Tiền Giang
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Quang Thái', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 2%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ trưởng tổ ANCS' LIMIT 1), 'Năm sinh: 1988, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nghiêm Xuân Quỳnh', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 3%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1988, Quê quán: Thọ Cường, Triệu Sơn, Thanh Hóa
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Thị Mỹ Dung', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 3%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: , Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Đào Văn Sơn', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 3%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: 1991, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Đỗ Hữu Sao', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 3%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: 1972, Quê quán: Thanh Hóa
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Trung Huy', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 3%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT khu phố' LIMIT 1), 'Năm sinh: 1990, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phạm Văn Xuân', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 4%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1963, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Cao Bá Thành', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 4%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1972, Quê quán: Sơn Công, Ứng Hòa, Hà Nội
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Mai Thị Bông', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 4%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: Điềm Hy, Châu Thành, Tiền Giang
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Dương Bảo', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 4%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Phó Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1989, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Mạc Đình Tuấn', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố 4%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT' LIMIT 1), 'Năm sinh: 1982, Quê quán: Đồng Lạc, Chi Linh, Hải Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Lê Quốc Toàn', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Tuy An' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng 
nhà trường' LIMIT 1), 'Năm sinh: 1976, Quê quán: Phường Phú An, TP. Hồ Chí Minh
Khu phố Chánh Nghĩa 12, phường Thủ Dầu Một, TP. Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thị Hải Phương', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Tuy An' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ,
 Phó Hiệu trưởng' LIMIT 1), 'Năm sinh: , Quê quán: Xã Hà Nam, TP. Hải Phòng
Khu phố Đồng An 3, phường Bình Hòa, TP. Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Huỳnh Thị Phụng', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Tuy An' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ, Tổ trưởng Tổ Lớp 4' LIMIT 1), 'Năm sinh: , Quê quán: Xã Phú Giáo, TP. Hồ Chí Minh
Khu phố 1B, phường An Phú, TP. Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Hồ Tấn Tài', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1979, Quê quán: Phường Phú An, TP Hồ Chí Minh
Phường Lái Thiêu, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Ngọc Thi', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Khánh Lộc, phường Tân Khánh, TP Hồ Chí Minh
 Khánh Lộc, phường Tân Khánh, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phạm Thị Xuân', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên' LIMIT 1), 'Năm sinh: , Quê quán: xã Hồng Lộc, tỉnh Hà Tĩnh
Phường Thuận An, Thành phố Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thị Thu Giang', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên, thư ký hội đồng' LIMIT 1), 'Năm sinh: , Quê quán: Phú Hưng, Phường Bến Cát, TP Hồ Chí Minh
Phú Hưng, Phường Bến Cát, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Công Quang', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ trưởng tổ lớp 3' LIMIT 1), 'Năm sinh: 1993, Quê quán: xã Hưng Thuận, tỉnh Tây Ninh
Khu phố Suối Cát, phường Tây Nam, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thanh Nhàn', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 2' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1974, Quê quán: An Sơn, Thuận An, Bình Dương
Phú Thọ, TDM, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Hoàng Thúy Hà', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 2' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Thanh Hà, Thanh Hà, Hải Dương
Lái Thiêu, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Vi Văn Sính', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 2' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên, CT Công đoàn cơ sở' LIMIT 1), 'Năm sinh: 1991, Quê quán: Chiến Thắng, Chi Lăng, Lạng Sơn
Khánh Bình, Tân Uyên, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thanh Tuấn', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 3' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1965, Quê quán: Hưng Định Thuận An, Bình Dương
Hưng Định Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Đào Thị Thu Hà', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 3' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Trưởng Ban thanh tra' LIMIT 1), 'Năm sinh: , Quê quán: Yên Thành, Yên Thành, Nghệ An
An Thạnh, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Đậu Thị Thúy Nhung', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 3' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ trưởng tổ lớp 3' LIMIT 1), 'Năm sinh: , Quê quán: Bến Thủy, thành phố Vinh, Nghệ An
Hiệp Bình Phước, Thủ Đức, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Trung Toàn', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'BTCB, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1967, Quê quán: Bình Nhâm, Thuận An, Bình Dương
Bình Nhâm, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Ngọc Hiếu', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1973, Quê quán: Thuận Giao, Thuận An, Bình Dương
Thuận Giao, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Phan Thanh Hải', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên' LIMIT 1), 'Năm sinh: 1978, Quê quán: Dầu Tiếng, Bình Dương
Thuận Giao, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thị Lại', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên' LIMIT 1), 'Năm sinh: , Quê quán: Tam Quan Bắc, Hoài Nhơn, Bình Định
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Tố Nga', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên' LIMIT 1), 'Năm sinh: , Quê quán: Đức Đồng, Đức Thọ, Hà Tĩnh
Long Bình Tân, Biên Hòa, Đồng Nai');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Lê Thị Thanh Nguyên', (SELECT id FROM departments WHERE name = 'Chi bộ trường Mầm non Hoa Cúc 10' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: An Sơn, Thuận An, Bình Dương
An Sơn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Kim Thanh', (SELECT id FROM departments WHERE name = 'Chi bộ trường Mầm non Hoa Cúc 10' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Vĩnh Phú, Thuận An, Bình Dương
Vĩnh Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thị Hồng Diệp', (SELECT id FROM departments WHERE name = 'Chi bộ trường Mầm non Hoa Cúc 10' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ trưởng' LIMIT 1), 'Năm sinh: , Quê quán: An Ấp, Quỳnh Phụ, Thái Bình
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trương Hoài Ân', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty TNHH PHKĐ Bình An' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bi thư chi bộ' LIMIT 1), 'Năm sinh: 1993, Quê quán: Bình Nhâm, Thuận An, Bình Dương
Thuận Giao, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Bùi Minh Thành', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1968, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Thị Thu Hà', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Thị Thu Hương', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT khu phố' LIMIT 1), 'Năm sinh: , Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Minh Khải', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1988, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Đinh Sang', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước A%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Tổ trưởng tổ BVANTT khu phố' LIMIT 1), 'Năm sinh: 1992, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Thị Diễm Trinh', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1989, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Văn Hiệp', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1989, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Huỳnh Văn Pháp', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1977, Quê quán: Uyên Hưng, Tân Uyên, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Mai Thành Nghĩa', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT khu phố' LIMIT 1), 'Năm sinh: 1999, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Hà Quốc Toàn', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Tổ viên Tổ BV ANTT khu phố' LIMIT 1), 'Năm sinh: 1988, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Văn Dự', NULL, (SELECT id FROM neighborhoods WHERE name ILIKE '%khu phố Bình Phước B%' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Tổ viên Tổ BVANTT khu phố' LIMIT 1), 'Năm sinh: 1987, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Ngọc Vân', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Lê Thị Trung' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng' LIMIT 1), 'Năm sinh: 1976, Quê quán: Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Lê Văn Thanh', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Lê Thị Trung' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng' LIMIT 1), 'Năm sinh: 1990, Quê quán: Phú Thọ, Thủ Dầu Một, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Đỗ Thị Kim Đây', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Lê Thị Trung' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên, Giáo viên' LIMIT 1), 'Năm sinh: 1978, Quê quán: Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Kim Phương', (SELECT id FROM departments WHERE name = 'Chi bộ trường MN Hoa Mai 5' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng' LIMIT 1), 'Năm sinh: 1974, Quê quán: Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Đỗ Ngọc Hồng Loan', (SELECT id FROM departments WHERE name = 'Chi bộ trường MN Hoa Mai 5' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng' LIMIT 1), 'Năm sinh: 1985, Quê quán: Hiệp Thành, Thủ Dầu Một, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Nguyễn Hồng Nhung', (SELECT id FROM departments WHERE name = 'Chi bộ trường MN Hoa Mai 5' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Chi ủy viên, Giáo viên' LIMIT 1), 'Năm sinh: 1984, Quê quán: Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Vũ Ngọc Thương', (SELECT id FROM departments WHERE name = 'Chi bộ Trung tâm hỗ trợ phát triển giáo dục hòa nhập Trí Tâm' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1982, Quê quán: Nghĩa An, Nam Trực, Nam Định');

INSERT INTO staff (full_name, department_id, neighborhood_id, position_id, notes)
VALUES ('Trần Thị Hương', (SELECT id FROM departments WHERE name = 'Chi bộ Trung tâm hỗ trợ phát triển giáo dục hòa nhập Trí Tâm' LIMIT 1), NULL, (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1983, Quê quán: Đông Du, Bình Lục, Hà Nam');



-- 3. Tạo tài khoản đăng nhập (Auth + Identities)
-- SCRIPT SỬA LỖI ĐĂNG NHẬP (CLEAN & RESTORE V2)
-- Sẽ xóa tự động các tài khoản @anphu.com bị dở dang gây lỗi trước đó
DELETE FROM auth.users WHERE email LIKE '%@anphu.com';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'ngohieu@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ngô Hiếu"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'ngohieu@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'ngohieu@anphu.com';

UPDATE staff SET email = 'ngohieu@anphu.com' WHERE full_name = 'Ngô Hiếu';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthihongminh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Hồng Minh"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthihongminh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthihongminh@anphu.com';

UPDATE staff SET email = 'nguyenthihongminh@anphu.com' WHERE full_name = 'Nguyễn Thị Hồng Minh';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthimytien@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Mỹ Tiền"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthimytien@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthimytien@anphu.com';

UPDATE staff SET email = 'nguyenthimytien@anphu.com' WHERE full_name = 'Nguyễn Thị Mỹ Tiền';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'buithinhung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bùi Thị Nhung"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'buithinhung@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'buithinhung@anphu.com';

UPDATE staff SET email = 'buithinhung@anphu.com' WHERE full_name = 'Bùi Thị Nhung';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phivanduc@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phí Văn Đức"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phivanduc@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phivanduc@anphu.com';

UPDATE staff SET email = 'phivanduc@anphu.com' WHERE full_name = 'Phí Văn Đức';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phanthithanhtam@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Thị Thanh Tâm"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phanthithanhtam@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phanthithanhtam@anphu.com';

UPDATE staff SET email = 'phanthithanhtam@anphu.com' WHERE full_name = 'Phan Thị Thanh Tâm';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthanhhoa@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thanh Hóa"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranthanhhoa@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranthanhhoa@anphu.com';

UPDATE staff SET email = 'tranthanhhoa@anphu.com' WHERE full_name = 'Trần Thanh Hóa';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyendoanhoangthien@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Đoàn Hoàng Thiện"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyendoanhoangthien@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyendoanhoangthien@anphu.com';

UPDATE staff SET email = 'nguyendoanhoangthien@anphu.com' WHERE full_name = 'Nguyễn Đoàn Hoàng Thiện';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phanthanhngoc@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Thanh Ngọc"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phanthanhngoc@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phanthanhngoc@anphu.com';

UPDATE staff SET email = 'phanthanhngoc@anphu.com' WHERE full_name = 'Phan Thanh Ngọc';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dongocdiep@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đỗ Ngọc Điệp"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'dongocdiep@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'dongocdiep@anphu.com';

UPDATE staff SET email = 'dongocdiep@anphu.com' WHERE full_name = 'Đỗ Ngọc Điệp';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenphison@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Phi Sơn"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenphison@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenphison@anphu.com';

UPDATE staff SET email = 'nguyenphison@anphu.com' WHERE full_name = 'Nguyễn Phi Sơn';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'vanquangloi@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Văn Quang Lợi"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'vanquangloi@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'vanquangloi@anphu.com';

UPDATE staff SET email = 'vanquangloi@anphu.com' WHERE full_name = 'Văn Quang Lợi';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthithuthuy@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Thu Thủy"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranthithuthuy@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranthithuthuy@anphu.com';

UPDATE staff SET email = 'tranthithuthuy@anphu.com' WHERE full_name = 'Trần Thị Thu Thủy';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthihien@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Hiền"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthihien@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthihien@anphu.com';

UPDATE staff SET email = 'nguyenthihien@anphu.com' WHERE full_name = 'Nguyễn Thị Hiền';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'lexuanhung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Xuân Hùng"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'lexuanhung@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'lexuanhung@anphu.com';

UPDATE staff SET email = 'lexuanhung@anphu.com' WHERE full_name = 'Lê Xuân Hùng';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamphunam@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Phú Nam"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phamphunam@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phamphunam@anphu.com';

UPDATE staff SET email = 'phamphunam@anphu.com' WHERE full_name = 'Phạm Phú Nam';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyentiencong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Tiến Công"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyentiencong@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyentiencong@anphu.com';

UPDATE staff SET email = 'nguyentiencong@anphu.com' WHERE full_name = 'Nguyễn Tiến Công';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phantanphu@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Tấn Phú"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phantanphu@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phantanphu@anphu.com';

UPDATE staff SET email = 'phantanphu@anphu.com' WHERE full_name = 'Phan Tấn Phú';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'caoquangtrung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Cao Quang Trung"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'caoquangtrung@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'caoquangtrung@anphu.com';

UPDATE staff SET email = 'caoquangtrung@anphu.com' WHERE full_name = 'Cao Quang Trung';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenhuunghi@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Hữu Nghi"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenhuunghi@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenhuunghi@anphu.com';

UPDATE staff SET email = 'nguyenhuunghi@anphu.com' WHERE full_name = 'Nguyễn Hữu Nghi';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'huynhvantruyen@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Huỳnh Văn Truyện"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'huynhvantruyen@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'huynhvantruyen@anphu.com';

UPDATE staff SET email = 'huynhvantruyen@anphu.com' WHERE full_name = 'Huỳnh Văn Truyện';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'hoquocbinh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hồ Quốc Bình"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'hoquocbinh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'hoquocbinh@anphu.com';

UPDATE staff SET email = 'hoquocbinh@anphu.com' WHERE full_name = 'Hồ Quốc Bình';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'huynhvuongquoc@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Huỳnh Vương Quốc"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'huynhvuongquoc@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'huynhvuongquoc@anphu.com';

UPDATE staff SET email = 'huynhvuongquoc@anphu.com' WHERE full_name = 'Huỳnh Vương Quốc';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamvanthai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Văn Thái"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phamvanthai@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phamvanthai@anphu.com';

UPDATE staff SET email = 'phamvanthai@anphu.com' WHERE full_name = 'Phạm Văn Thái';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenvanthuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Văn Thuần"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenvanthuan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenvanthuan@anphu.com';

UPDATE staff SET email = 'nguyenvanthuan@anphu.com' WHERE full_name = 'Nguyễn Văn Thuần';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamvandung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Văn Dũng"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phamvandung@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phamvandung@anphu.com';

UPDATE staff SET email = 'phamvandung@anphu.com' WHERE full_name = 'Phạm Văn Dũng';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phanthikieuloan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Thị Kiều Loan"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phanthikieuloan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phanthikieuloan@anphu.com';

UPDATE staff SET email = 'phanthikieuloan@anphu.com' WHERE full_name = 'Phan Thị Kiều Loan';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'havanhoa@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hà Văn Hóa"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'havanhoa@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'havanhoa@anphu.com';

UPDATE staff SET email = 'havanhoa@anphu.com' WHERE full_name = 'Hà Văn Hóa';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamvanbinh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Văn Bình"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phamvanbinh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phamvanbinh@anphu.com';

UPDATE staff SET email = 'phamvanbinh@anphu.com' WHERE full_name = 'Phạm Văn Bình';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranquanghuy@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Quang Huy"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranquanghuy@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranquanghuy@anphu.com';

UPDATE staff SET email = 'tranquanghuy@anphu.com' WHERE full_name = 'Trần Quang Huy';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'buituananh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bùi Tuấn Anh"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'buituananh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'buituananh@anphu.com';

UPDATE staff SET email = 'buituananh@anphu.com' WHERE full_name = 'Bùi Tuấn Anh';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthanhrong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thanh Rồng"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranthanhrong@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranthanhrong@anphu.com';

UPDATE staff SET email = 'tranthanhrong@anphu.com' WHERE full_name = 'Trần Thanh Rồng';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranquangthai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Quang Thái"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranquangthai@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranquangthai@anphu.com';

UPDATE staff SET email = 'tranquangthai@anphu.com' WHERE full_name = 'Trần Quang Thái';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nghiemxuanquynh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nghiêm Xuân Quỳnh"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nghiemxuanquynh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nghiemxuanquynh@anphu.com';

UPDATE staff SET email = 'nghiemxuanquynh@anphu.com' WHERE full_name = 'Nghiêm Xuân Quỳnh';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthimydung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Mỹ Dung"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranthimydung@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranthimydung@anphu.com';

UPDATE staff SET email = 'tranthimydung@anphu.com' WHERE full_name = 'Trần Thị Mỹ Dung';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'daovanson@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đào Văn Sơn"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'daovanson@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'daovanson@anphu.com';

UPDATE staff SET email = 'daovanson@anphu.com' WHERE full_name = 'Đào Văn Sơn';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dohuusao@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đỗ Hữu Sao"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'dohuusao@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'dohuusao@anphu.com';

UPDATE staff SET email = 'dohuusao@anphu.com' WHERE full_name = 'Đỗ Hữu Sao';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyentrunghuy@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Trung Huy"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyentrunghuy@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyentrunghuy@anphu.com';

UPDATE staff SET email = 'nguyentrunghuy@anphu.com' WHERE full_name = 'Nguyễn Trung Huy';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamvanxuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Văn Xuân"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phamvanxuan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phamvanxuan@anphu.com';

UPDATE staff SET email = 'phamvanxuan@anphu.com' WHERE full_name = 'Phạm Văn Xuân';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'caobathanh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Cao Bá Thành"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'caobathanh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'caobathanh@anphu.com';

UPDATE staff SET email = 'caobathanh@anphu.com' WHERE full_name = 'Cao Bá Thành';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'maithibong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mai Thị Bông"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'maithibong@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'maithibong@anphu.com';

UPDATE staff SET email = 'maithibong@anphu.com' WHERE full_name = 'Mai Thị Bông';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'duongbao@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dương Bảo"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'duongbao@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'duongbao@anphu.com';

UPDATE staff SET email = 'duongbao@anphu.com' WHERE full_name = 'Dương Bảo';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'macdinhtuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mạc Đình Tuấn"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'macdinhtuan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'macdinhtuan@anphu.com';

UPDATE staff SET email = 'macdinhtuan@anphu.com' WHERE full_name = 'Mạc Đình Tuấn';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'lequoctoan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Quốc Toàn"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'lequoctoan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'lequoctoan@anphu.com';

UPDATE staff SET email = 'lequoctoan@anphu.com' WHERE full_name = 'Lê Quốc Toàn';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthihaiphuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Hải Phương"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthihaiphuong@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthihaiphuong@anphu.com';

UPDATE staff SET email = 'nguyenthihaiphuong@anphu.com' WHERE full_name = 'Nguyễn Thị Hải Phương';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'huynhthiphung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Huỳnh Thị Phụng"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'huynhthiphung@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'huynhthiphung@anphu.com';

UPDATE staff SET email = 'huynhthiphung@anphu.com' WHERE full_name = 'Huỳnh Thị Phụng';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'hotantai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hồ Tấn Tài"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'hotantai@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'hotantai@anphu.com';

UPDATE staff SET email = 'hotantai@anphu.com' WHERE full_name = 'Hồ Tấn Tài';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenngocthi@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Ngọc Thi"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenngocthi@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenngocthi@anphu.com';

UPDATE staff SET email = 'nguyenngocthi@anphu.com' WHERE full_name = 'Nguyễn Ngọc Thi';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamthixuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Thị Xuân"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phamthixuan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phamthixuan@anphu.com';

UPDATE staff SET email = 'phamthixuan@anphu.com' WHERE full_name = 'Phạm Thị Xuân';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthithugiang@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Thu Giang"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthithugiang@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthithugiang@anphu.com';

UPDATE staff SET email = 'nguyenthithugiang@anphu.com' WHERE full_name = 'Nguyễn Thị Thu Giang';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyencongquang@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Công Quang"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyencongquang@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyencongquang@anphu.com';

UPDATE staff SET email = 'nguyencongquang@anphu.com' WHERE full_name = 'Nguyễn Công Quang';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthanhnhan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thanh Nhàn"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthanhnhan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthanhnhan@anphu.com';

UPDATE staff SET email = 'nguyenthanhnhan@anphu.com' WHERE full_name = 'Nguyễn Thanh Nhàn';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'hoangthuyha@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hoàng Thúy Hà"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'hoangthuyha@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'hoangthuyha@anphu.com';

UPDATE staff SET email = 'hoangthuyha@anphu.com' WHERE full_name = 'Hoàng Thúy Hà';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'vivansinh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Vi Văn Sính"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'vivansinh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'vivansinh@anphu.com';

UPDATE staff SET email = 'vivansinh@anphu.com' WHERE full_name = 'Vi Văn Sính';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthanhtuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thanh Tuấn"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthanhtuan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthanhtuan@anphu.com';

UPDATE staff SET email = 'nguyenthanhtuan@anphu.com' WHERE full_name = 'Nguyễn Thanh Tuấn';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'daothithuha@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đào Thị Thu Hà"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'daothithuha@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'daothithuha@anphu.com';

UPDATE staff SET email = 'daothithuha@anphu.com' WHERE full_name = 'Đào Thị Thu Hà';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dauthithuynhung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đậu Thị Thúy Nhung"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'dauthithuynhung@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'dauthithuynhung@anphu.com';

UPDATE staff SET email = 'dauthithuynhung@anphu.com' WHERE full_name = 'Đậu Thị Thúy Nhung';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyentrungtoan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Trung Toàn"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyentrungtoan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyentrungtoan@anphu.com';

UPDATE staff SET email = 'nguyentrungtoan@anphu.com' WHERE full_name = 'Nguyễn Trung Toàn';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenngochieu@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Ngọc Hiếu"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenngochieu@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenngochieu@anphu.com';

UPDATE staff SET email = 'nguyenngochieu@anphu.com' WHERE full_name = 'Nguyễn Ngọc Hiếu';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phanthanhhai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Thanh Hải"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'phanthanhhai@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'phanthanhhai@anphu.com';

UPDATE staff SET email = 'phanthanhhai@anphu.com' WHERE full_name = 'Phan Thanh Hải';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthilai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Lại"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthilai@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthilai@anphu.com';

UPDATE staff SET email = 'nguyenthilai@anphu.com' WHERE full_name = 'Nguyễn Thị Lại';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'trantonga@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Tố Nga"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'trantonga@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'trantonga@anphu.com';

UPDATE staff SET email = 'trantonga@anphu.com' WHERE full_name = 'Trần Tố Nga';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'lethithanhnguyen@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Thị Thanh Nguyên"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'lethithanhnguyen@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'lethithanhnguyen@anphu.com';

UPDATE staff SET email = 'lethithanhnguyen@anphu.com' WHERE full_name = 'Lê Thị Thanh Nguyên';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'trankimthanh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Kim Thanh"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'trankimthanh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'trankimthanh@anphu.com';

UPDATE staff SET email = 'trankimthanh@anphu.com' WHERE full_name = 'Trần Kim Thanh';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthihongdiep@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Hồng Diệp"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthihongdiep@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthihongdiep@anphu.com';

UPDATE staff SET email = 'nguyenthihongdiep@anphu.com' WHERE full_name = 'Nguyễn Thị Hồng Diệp';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'truonghoaian@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trương Hoài Ân"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'truonghoaian@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'truonghoaian@anphu.com';

UPDATE staff SET email = 'truonghoaian@anphu.com' WHERE full_name = 'Trương Hoài Ân';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'buiminhthanh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bùi Minh Thành"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'buiminhthanh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'buiminhthanh@anphu.com';

UPDATE staff SET email = 'buiminhthanh@anphu.com' WHERE full_name = 'Bùi Minh Thành';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthithuha@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Thu Hà"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranthithuha@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranthithuha@anphu.com';

UPDATE staff SET email = 'tranthithuha@anphu.com' WHERE full_name = 'Trần Thị Thu Hà';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthithuhuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Thu Hương"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranthithuhuong@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranthithuhuong@anphu.com';

UPDATE staff SET email = 'tranthithuhuong@anphu.com' WHERE full_name = 'Trần Thị Thu Hương';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenminhkhai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Minh Khải"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenminhkhai@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenminhkhai@anphu.com';

UPDATE staff SET email = 'nguyenminhkhai@anphu.com' WHERE full_name = 'Nguyễn Minh Khải';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyendinhsang@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Đinh Sang"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyendinhsang@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyendinhsang@anphu.com';

UPDATE staff SET email = 'nguyendinhsang@anphu.com' WHERE full_name = 'Nguyễn Đinh Sang';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthidiemtrinh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Diễm Trinh"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenthidiemtrinh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthidiemtrinh@anphu.com';

UPDATE staff SET email = 'nguyenthidiemtrinh@anphu.com' WHERE full_name = 'Nguyễn Thị Diễm Trinh';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenvanhiep@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Văn Hiệp"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenvanhiep@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenvanhiep@anphu.com';

UPDATE staff SET email = 'nguyenvanhiep@anphu.com' WHERE full_name = 'Nguyễn Văn Hiệp';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'huynhvanphap@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Huỳnh Văn Pháp"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'huynhvanphap@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'huynhvanphap@anphu.com';

UPDATE staff SET email = 'huynhvanphap@anphu.com' WHERE full_name = 'Huỳnh Văn Pháp';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'maithanhnghia@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mai Thành Nghĩa"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'maithanhnghia@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'maithanhnghia@anphu.com';

UPDATE staff SET email = 'maithanhnghia@anphu.com' WHERE full_name = 'Mai Thành Nghĩa';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'haquoctoan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hà Quốc Toàn"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'haquoctoan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'haquoctoan@anphu.com';

UPDATE staff SET email = 'haquoctoan@anphu.com' WHERE full_name = 'Hà Quốc Toàn';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenvandu@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Văn Dự"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenvandu@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenvandu@anphu.com';

UPDATE staff SET email = 'nguyenvandu@anphu.com' WHERE full_name = 'Nguyễn Văn Dự';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenngocvan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Ngọc Vân"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenngocvan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenngocvan@anphu.com';

UPDATE staff SET email = 'nguyenngocvan@anphu.com' WHERE full_name = 'Nguyễn Ngọc Vân';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'levanthanh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Văn Thanh"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'levanthanh@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'levanthanh@anphu.com';

UPDATE staff SET email = 'levanthanh@anphu.com' WHERE full_name = 'Lê Văn Thanh';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dothikimday@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đỗ Thị Kim Đây"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'dothikimday@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'dothikimday@anphu.com';

UPDATE staff SET email = 'dothikimday@anphu.com' WHERE full_name = 'Đỗ Thị Kim Đây';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenkimphuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Kim Phương"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenkimphuong@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenkimphuong@anphu.com';

UPDATE staff SET email = 'nguyenkimphuong@anphu.com' WHERE full_name = 'Nguyễn Kim Phương';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dongochongloan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đỗ Ngọc Hồng Loan"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'dongochongloan@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'dongochongloan@anphu.com';

UPDATE staff SET email = 'dongochongloan@anphu.com' WHERE full_name = 'Đỗ Ngọc Hồng Loan';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenhongnhung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Hồng Nhung"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'nguyenhongnhung@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenhongnhung@anphu.com';

UPDATE staff SET email = 'nguyenhongnhung@anphu.com' WHERE full_name = 'Nguyễn Hồng Nhung';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'vungocthuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Vũ Ngọc Thương"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'vungocthuong@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'vungocthuong@anphu.com';

UPDATE staff SET email = 'vungocthuong@anphu.com' WHERE full_name = 'Vũ Ngọc Thương';


INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthihuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Hương"}', now(), now();

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', 'tranthihuong@anphu.com'), 'email', now(), now()
FROM auth.users WHERE email = 'tranthihuong@anphu.com';

UPDATE staff SET email = 'tranthihuong@anphu.com' WHERE full_name = 'Trần Thị Hương';



-- ==========================================
-- HOÀN TẤT! BẠN CÓ THỂ ĐĂNG NHẬP ĐƯỢC RỒI
-- ==========================================
