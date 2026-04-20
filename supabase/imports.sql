-- Generated script to insert departments and positions

-- Departments
INSERT INTO departments (name) SELECT 'Chi bộ trường THPT Lý Thái Tổ' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường THPT Lý Thái Tổ');
INSERT INTO departments (name) SELECT 'Chi bộ Công ty TNHH Komax Việt Nam' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ Công ty TNHH Komax Việt Nam');
INSERT INTO departments (name) SELECT 'Chi bộ Công ty cổ phần chiếu xạ An Phú' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ Công ty cổ phần chiếu xạ An Phú');
INSERT INTO departments (name) SELECT 'Chi bộ Trạm Y tế' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ Trạm Y tế');
INSERT INTO departments (name) SELECT 'Chi bộ Công an' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ Công an');
INSERT INTO departments (name) SELECT 'Chi bộ Quân sự' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ Quân sự');
INSERT INTO departments (name) SELECT 'Chi bộ khu phố 1A' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ khu phố 1A');
INSERT INTO departments (name) SELECT 'Chi bộ khu phố 1B' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ khu phố 1B');
INSERT INTO departments (name) SELECT 'Chi bộ khu phố 2' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ khu phố 2');
INSERT INTO departments (name) SELECT 'Chi bộ khu phố 3' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ khu phố 3');
INSERT INTO departments (name) SELECT 'Chi bộ khu phố 4' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ khu phố 4');
INSERT INTO departments (name) SELECT 'Chi bộ trường TH Tuy An' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường TH Tuy An');
INSERT INTO departments (name) SELECT 'Chi bộ trường TH An Phú' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường TH An Phú');
INSERT INTO departments (name) SELECT 'Chi bộ trường TH An Phú 2' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường TH An Phú 2');
INSERT INTO departments (name) SELECT 'Chi bộ trường TH An Phú 3' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường TH An Phú 3');
INSERT INTO departments (name) SELECT 'Chi bộ trường THCS Nguyễn Văn Trỗi' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi');
INSERT INTO departments (name) SELECT 'Chi bộ trường Mầm non Hoa Cúc 10' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường Mầm non Hoa Cúc 10');
INSERT INTO departments (name) SELECT 'Chi bộ Công ty TNHH PHKĐ Bình An' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ Công ty TNHH PHKĐ Bình An');
INSERT INTO departments (name) SELECT 'Chi bộ khu phố Bình Phước A' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ khu phố Bình Phước A');
INSERT INTO departments (name) SELECT 'Chi bộ khu phố Bình Phước B' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ khu phố Bình Phước B');
INSERT INTO departments (name) SELECT 'Chi bộ trường TH Lê Thị Trung' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường TH Lê Thị Trung');
INSERT INTO departments (name) SELECT 'Chi bộ trường MN Hoa Mai 5' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ trường MN Hoa Mai 5');
INSERT INTO departments (name) SELECT 'Chi bộ Trung tâm hỗ trợ phát triển giáo dục hòa nhập Trí Tâm' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Chi bộ Trung tâm hỗ trợ phát triển giáo dục hòa nhập Trí Tâm');

-- Positions
INSERT INTO positions (name) SELECT 'Bí thư chi bộ, Hiệu trưởng trường' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường');
INSERT INTO positions (name) SELECT 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường');
INSERT INTO positions (name) SELECT 'Bí thư chi bộ' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bí thư chi bộ');
INSERT INTO positions (name) SELECT 'Phó bí thư chi bộ' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó bí thư chi bộ');
INSERT INTO positions (name) SELECT 'Bí thư chi bô, trưởng Phòng Hành chánh nhân sự' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bí thư chi bô, trưởng Phòng Hành chánh nhân sự');
INSERT INTO positions (name) SELECT 'Phó bí thư chi bô, Quản đốc, Chủ tịch Công Đoàn.' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó bí thư chi bô, Quản đốc, Chủ tịch Công Đoàn.');
INSERT INTO positions (name) SELECT 'Phó Bí thư chi bộ' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó Bí thư chi bộ');
INSERT INTO positions (name) SELECT 'Chi ủy viên chi bộ' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên chi bộ');
INSERT INTO positions (name) SELECT 'Bí thư chi bộ, Trưởng Công an' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bí thư chi bộ, Trưởng Công an');
INSERT INTO positions (name) SELECT 'Phó Bí thư chi bộ, Phó Trưởng Công an' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Trưởng Công an');
INSERT INTO positions (name) SELECT 'Chi ủy viên, cán bộ Công an' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, cán bộ Công an');
INSERT INTO positions (name) SELECT 'Bí thư Đảng ủy, CT HĐND, Bí thư chi bộ' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bí thư Đảng ủy, CT HĐND, Bí thư chi bộ');
INSERT INTO positions (name) SELECT 'UV.BTV, Phó Bí thư chi bộ, CHT Ban CHQS' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'UV.BTV, Phó Bí thư chi bộ, CHT Ban CHQS');
INSERT INTO positions (name) SELECT 'Chi ủy viên chi bộ,  Chính trị viên phó' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên chi bộ,  Chính trị viên phó');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Phó Trưởng BĐH, khu đội trưởng' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Phó Trưởng BĐH, khu đội trưởng');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Trưởng BĐH khu phố' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Trưởng BĐH khu phố');
INSERT INTO positions (name) SELECT 'Trưởng Ban CTMT' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Trưởng Ban CTMT');
INSERT INTO positions (name) SELECT 'Chi ủy viên, tổ phó tổ ANCS' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, tổ phó tổ ANCS');
INSERT INTO positions (name) SELECT 'Phó Bí thư chi bộ, Trưởng BĐH khu phố' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó Bí thư chi bộ, Trưởng BĐH khu phố');
INSERT INTO positions (name) SELECT 'Chi ủy viên chi bộ, chi hội trưởng hội CCB' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên chi bộ, chi hội trưởng hội CCB');
INSERT INTO positions (name) SELECT 'Chi ủy viên chi bộ, Đề án Hội LHPN phường' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên chi bộ, Đề án Hội LHPN phường');
INSERT INTO positions (name) SELECT 'Chi ủy viên chi bộ, tổ trưởng tổ ANTT' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên chi bộ, tổ trưởng tổ ANTT');
INSERT INTO positions (name) SELECT 'Bí thư chi bộ, Trưởng BĐH khu phố' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bí thư chi bộ, Trưởng BĐH khu phố');
INSERT INTO positions (name) SELECT 'Chi ủy viên, khu đôi trưởng' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, khu đôi trưởng');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Phó Trưởng BĐH khu phố' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Phó Trưởng BĐH khu phố');
INSERT INTO positions (name) SELECT 'Chi ủy viên, tổ trưởng tổ ANCS' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, tổ trưởng tổ ANCS');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Trưởng Ban CTMT khu phố' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT khu phố');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Trưởng Ban CTMT' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT');
INSERT INTO positions (name) SELECT 'Bí thư chi bộ, Hiệu trưởng 
nhà trường' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng 
nhà trường');
INSERT INTO positions (name) SELECT 'Phó Bí thư chi bộ,
 Phó Hiệu trưởng' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó Bí thư chi bộ,
 Phó Hiệu trưởng');
INSERT INTO positions (name) SELECT 'Chi ủy viên chi bộ, Tổ trưởng Tổ Lớp 4' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên chi bộ, Tổ trưởng Tổ Lớp 4');
INSERT INTO positions (name) SELECT 'Chi ủy viên' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên');
INSERT INTO positions (name) SELECT 'Chi ủy viên, thư ký hội đồng' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, thư ký hội đồng');
INSERT INTO positions (name) SELECT 'Chi ủy viên, tổ trưởng tổ lớp 3' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, tổ trưởng tổ lớp 3');
INSERT INTO positions (name) SELECT 'Chi ủy viên, CT Công đoàn cơ sở' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, CT Công đoàn cơ sở');
INSERT INTO positions (name) SELECT 'Phó Bí thư chi bộ, Trưởng Ban thanh tra' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó Bí thư chi bộ, Trưởng Ban thanh tra');
INSERT INTO positions (name) SELECT 'BTCB, Hiệu trưởng trường' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'BTCB, Hiệu trưởng trường');
INSERT INTO positions (name) SELECT 'Chi ủy viên, tổ trưởng' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, tổ trưởng');
INSERT INTO positions (name) SELECT 'Bi thư chi bộ' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bi thư chi bộ');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Tổ trưởng tổ BVANTT khu phố' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Tổ trưởng tổ BVANTT khu phố');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Tổ viên Tổ BV ANTT khu phố' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Tổ viên Tổ BV ANTT khu phố');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Tổ viên Tổ BVANTT khu phố' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Tổ viên Tổ BVANTT khu phố');
INSERT INTO positions (name) SELECT 'Bí thư chi bộ, Hiệu trưởng' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng');
INSERT INTO positions (name) SELECT 'Phó Bí thư chi bộ, Phó Hiệu trưởng' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng');
INSERT INTO positions (name) SELECT 'Chi ủy viên, Giáo viên' WHERE NOT EXISTS (SELECT 1 FROM positions WHERE name = 'Chi ủy viên, Giáo viên');
