-- Generated script to insert staff using standard SQL subqueries

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Ngô Hiếu', (SELECT id FROM departments WHERE name = 'Chi bộ trường THPT Lý Thái Tổ' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1979, Quê quán: Thuận An, Bình Dương - phường Bình Hòa, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thị Hồng Minh', (SELECT id FROM departments WHERE name = 'Chi bộ trường THPT Lý Thái Tổ' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Mỹ Bằng, Yên Sơn, Tuyên Quang - Thuận Giao, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thị Mỹ Tiền', (SELECT id FROM departments WHERE name = 'Chi bộ trường THPT Lý Thái Tổ' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Phú Lợi, Thủ Dầu Một, Bình Dương - An Thạnh, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Bùi Thị Nhung', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty TNHH Komax Việt Nam' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: Xã An Hòa, Quỳnh Lưu, Nghệ An');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phí Văn Đức', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty TNHH Komax Việt Nam' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó bí thư chi bộ' LIMIT 1), 'Năm sinh: 1974, Quê quán: Xã Tuyết Nghĩa, Quốc Oai, Hà Nội');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phan Thị Thanh Tâm', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty cổ phần chiếu xạ An Phú' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bô, trưởng Phòng Hành chánh nhân sự' LIMIT 1), 'Năm sinh: , Quê quán: Phổ Cương, Đức Phổ, Quảng Ngãi
146/10A1, Lã Xuân Oai, Phường Tăng Nhơn Phú A, Tp HCM');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Thanh Hóa', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty cổ phần chiếu xạ An Phú' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó bí thư chi bô, Quản đốc, Chủ tịch Công Đoàn.' LIMIT 1), 'Năm sinh: 1977, Quê quán: Hòa Vang, Đà Nẳng
KP Bình Phước B, Phường An Phú, Tp HCM');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Đoàn Hoàng Thiện', (SELECT id FROM departments WHERE name = 'Chi bộ Trạm Y tế' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phan Thanh Ngọc', (SELECT id FROM departments WHERE name = 'Chi bộ Trạm Y tế' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Đỗ Ngọc Điệp', (SELECT id FROM departments WHERE name = 'Chi bộ Trạm Y tế' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Phi Sơn', (SELECT id FROM departments WHERE name = 'Chi bộ Công an' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Trưởng Công an' LIMIT 1), 'Năm sinh: 1985, Quê quán: Tân Thạnh Đông, Củ Chi, TP Hồ Chí Minh
Tân Thạnh Đông, Củ Chi, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Văn Quang Lợi', (SELECT id FROM departments WHERE name = 'Chi bộ Công an' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Trưởng Công an' LIMIT 1), 'Năm sinh: 1985, Quê quán: Hòa Lợi, Bến Cát, Bình Dương
Chánh Mỹ, Thủ Dầu Một, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Thị Thu Thủy', (SELECT id FROM departments WHERE name = 'Chi bộ Công an' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, cán bộ Công an' LIMIT 1), 'Năm sinh: , Quê quán: Xuân Hòa, Xuân Trường, Nam Định 
Hiệp Thành, TDM, tỉnh Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thị Hiền', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư Đảng ủy, CT HĐND, Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: An Sơn, Thuận An, Bình Dương
An Sơn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Lê Xuân Hùng', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), (SELECT id FROM positions WHERE name = 'UV.BTV, Phó Bí thư chi bộ, CHT Ban CHQS' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phạm Phú Nam', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Tiến Công', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ,  Chính trị viên phó' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phan Tấn Phú', (SELECT id FROM departments WHERE name = 'Chi bộ Quân sự' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: ');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Cao Quang Trung', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1967, Quê quán: Quảng Bình
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Hữu Nghi', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Phó Trưởng BĐH, khu đội trưởng' LIMIT 1), 'Năm sinh: 1978, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Huỳnh Văn Truyện', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1963, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Hồ Quốc Bình', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Trưởng Ban CTMT' LIMIT 1), 'Năm sinh: 1981, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Huỳnh Vương Quốc', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ phó tổ ANCS' LIMIT 1), 'Năm sinh: 1988, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phạm Văn Thái', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1968, Quê quán: Trực Cường, Trực Ninh, Nam Định
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Văn Thuần', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1979, Quê quán: An Ấp, Quỳnh Phụ, Thái Bình
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phạm Văn Dũng', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ, chi hội trưởng hội CCB' LIMIT 1), 'Năm sinh: 1976, Quê quán: Hải Minh, Hải Hậu, Nam Định
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phan Thị Kiều Loan', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ, Đề án Hội LHPN phường' LIMIT 1), 'Năm sinh: , Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Hà Văn Hóa', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 1B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ, tổ trưởng tổ ANTT' LIMIT 1), 'Năm sinh: 1986, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phạm Văn Bình', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 2' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1969, Quê quán: Lái Thiêu, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Quang Huy', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 2' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1991, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Bùi Tuấn Anh', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 2' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, khu đôi trưởng' LIMIT 1), 'Năm sinh: 1992, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Thanh Rồng', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 2' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Phó Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1963, Quê quán: Mỹ Thành Bắc, Cai Lậy, Tiền Giang
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Quang Thái', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 2' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ trưởng tổ ANCS' LIMIT 1), 'Năm sinh: 1988, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nghiêm Xuân Quỳnh', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 3' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1988, Quê quán: Thọ Cường, Triệu Sơn, Thanh Hóa
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Thị Mỹ Dung', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 3' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: , Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Đào Văn Sơn', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 3' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: 1991, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Đỗ Hữu Sao', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 3' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: 1972, Quê quán: Thanh Hóa
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Trung Huy', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 3' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT khu phố' LIMIT 1), 'Năm sinh: 1990, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phạm Văn Xuân', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 4' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1963, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Cao Bá Thành', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 4' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1972, Quê quán: Sơn Công, Ứng Hòa, Hà Nội
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Mai Thị Bông', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 4' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: Điềm Hy, Châu Thành, Tiền Giang
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Dương Bảo', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 4' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Phó Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1989, Quê quán: An Phú, Thuận An, Bình Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Mạc Đình Tuấn', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố 4' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT' LIMIT 1), 'Năm sinh: 1982, Quê quán: Đồng Lạc, Chi Linh, Hải Dương
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Lê Quốc Toàn', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Tuy An' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng 
nhà trường' LIMIT 1), 'Năm sinh: 1976, Quê quán: Phường Phú An, TP. Hồ Chí Minh
Khu phố Chánh Nghĩa 12, phường Thủ Dầu Một, TP. Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thị Hải Phương', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Tuy An' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ,
 Phó Hiệu trưởng' LIMIT 1), 'Năm sinh: , Quê quán: Xã Hà Nam, TP. Hải Phòng
Khu phố Đồng An 3, phường Bình Hòa, TP. Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Huỳnh Thị Phụng', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Tuy An' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên chi bộ, Tổ trưởng Tổ Lớp 4' LIMIT 1), 'Năm sinh: , Quê quán: Xã Phú Giáo, TP. Hồ Chí Minh
Khu phố 1B, phường An Phú, TP. Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Hồ Tấn Tài', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1979, Quê quán: Phường Phú An, TP Hồ Chí Minh
Phường Lái Thiêu, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Ngọc Thi', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Khánh Lộc, phường Tân Khánh, TP Hồ Chí Minh
 Khánh Lộc, phường Tân Khánh, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phạm Thị Xuân', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên' LIMIT 1), 'Năm sinh: , Quê quán: xã Hồng Lộc, tỉnh Hà Tĩnh
Phường Thuận An, Thành phố Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thị Thu Giang', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, thư ký hội đồng' LIMIT 1), 'Năm sinh: , Quê quán: Phú Hưng, Phường Bến Cát, TP Hồ Chí Minh
Phú Hưng, Phường Bến Cát, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Công Quang', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ trưởng tổ lớp 3' LIMIT 1), 'Năm sinh: 1993, Quê quán: xã Hưng Thuận, tỉnh Tây Ninh
Khu phố Suối Cát, phường Tây Nam, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thanh Nhàn', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 2' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1974, Quê quán: An Sơn, Thuận An, Bình Dương
Phú Thọ, TDM, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Hoàng Thúy Hà', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 2' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Thanh Hà, Thanh Hà, Hải Dương
Lái Thiêu, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Vi Văn Sính', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 2' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, CT Công đoàn cơ sở' LIMIT 1), 'Năm sinh: 1991, Quê quán: Chiến Thắng, Chi Lăng, Lạng Sơn
Khánh Bình, Tân Uyên, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thanh Tuấn', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 3' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1965, Quê quán: Hưng Định Thuận An, Bình Dương
Hưng Định Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Đào Thị Thu Hà', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 3' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Trưởng Ban thanh tra' LIMIT 1), 'Năm sinh: , Quê quán: Yên Thành, Yên Thành, Nghệ An
An Thạnh, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Đậu Thị Thúy Nhung', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH An Phú 3' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ trưởng tổ lớp 3' LIMIT 1), 'Năm sinh: , Quê quán: Bến Thủy, thành phố Vinh, Nghệ An
Hiệp Bình Phước, Thủ Đức, TP Hồ Chí Minh');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Trung Toàn', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), (SELECT id FROM positions WHERE name = 'BTCB, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1967, Quê quán: Bình Nhâm, Thuận An, Bình Dương
Bình Nhâm, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Ngọc Hiếu', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: 1973, Quê quán: Thuận Giao, Thuận An, Bình Dương
Thuận Giao, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Phan Thanh Hải', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên' LIMIT 1), 'Năm sinh: 1978, Quê quán: Dầu Tiếng, Bình Dương
Thuận Giao, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thị Lại', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên' LIMIT 1), 'Năm sinh: , Quê quán: Tam Quan Bắc, Hoài Nhơn, Bình Định
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Tố Nga', (SELECT id FROM departments WHERE name = 'Chi bộ trường THCS Nguyễn Văn Trỗi' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên' LIMIT 1), 'Năm sinh: , Quê quán: Đức Đồng, Đức Thọ, Hà Tĩnh
Long Bình Tân, Biên Hòa, Đồng Nai');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Lê Thị Thanh Nguyên', (SELECT id FROM departments WHERE name = 'Chi bộ trường Mầm non Hoa Cúc 10' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: An Sơn, Thuận An, Bình Dương
An Sơn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Kim Thanh', (SELECT id FROM departments WHERE name = 'Chi bộ trường Mầm non Hoa Cúc 10' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng trường' LIMIT 1), 'Năm sinh: , Quê quán: Vĩnh Phú, Thuận An, Bình Dương
Vĩnh Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thị Hồng Diệp', (SELECT id FROM departments WHERE name = 'Chi bộ trường Mầm non Hoa Cúc 10' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, tổ trưởng' LIMIT 1), 'Năm sinh: , Quê quán: An Ấp, Quỳnh Phụ, Thái Bình
An Phú, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trương Hoài Ân', (SELECT id FROM departments WHERE name = 'Chi bộ Công ty TNHH PHKĐ Bình An' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bi thư chi bộ' LIMIT 1), 'Năm sinh: 1993, Quê quán: Bình Nhâm, Thuận An, Bình Dương
Thuận Giao, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Bùi Minh Thành', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1968, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Thị Thu Hà', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: , Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Thị Thu Hương', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT khu phố' LIMIT 1), 'Năm sinh: , Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Minh Khải', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1988, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Đinh Sang', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước A' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Tổ trưởng tổ BVANTT khu phố' LIMIT 1), 'Năm sinh: 1992, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Thị Diễm Trinh', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1989, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Văn Hiệp', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1989, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Huỳnh Văn Pháp', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng BĐH khu phố' LIMIT 1), 'Năm sinh: 1977, Quê quán: Uyên Hưng, Tân Uyên, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Mai Thành Nghĩa', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Trưởng Ban CTMT khu phố' LIMIT 1), 'Năm sinh: 1999, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Hà Quốc Toàn', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Tổ viên Tổ BV ANTT khu phố' LIMIT 1), 'Năm sinh: 1988, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Văn Dự', (SELECT id FROM departments WHERE name = 'Chi bộ khu phố Bình Phước B' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Tổ viên Tổ BVANTT khu phố' LIMIT 1), 'Năm sinh: 1987, Quê quán: Bình Chuẩn, Thuận An, Bình Dương
Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Ngọc Vân', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Lê Thị Trung' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng' LIMIT 1), 'Năm sinh: 1976, Quê quán: Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Lê Văn Thanh', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Lê Thị Trung' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng' LIMIT 1), 'Năm sinh: 1990, Quê quán: Phú Thọ, Thủ Dầu Một, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Đỗ Thị Kim Đây', (SELECT id FROM departments WHERE name = 'Chi bộ trường TH Lê Thị Trung' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Giáo viên' LIMIT 1), 'Năm sinh: 1978, Quê quán: Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Kim Phương', (SELECT id FROM departments WHERE name = 'Chi bộ trường MN Hoa Mai 5' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ, Hiệu trưởng' LIMIT 1), 'Năm sinh: 1974, Quê quán: Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Đỗ Ngọc Hồng Loan', (SELECT id FROM departments WHERE name = 'Chi bộ trường MN Hoa Mai 5' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ, Phó Hiệu trưởng' LIMIT 1), 'Năm sinh: 1985, Quê quán: Hiệp Thành, Thủ Dầu Một, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Nguyễn Hồng Nhung', (SELECT id FROM departments WHERE name = 'Chi bộ trường MN Hoa Mai 5' LIMIT 1), (SELECT id FROM positions WHERE name = 'Chi ủy viên, Giáo viên' LIMIT 1), 'Năm sinh: 1984, Quê quán: Bình Chuẩn, Thuận An, Bình Dương');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Vũ Ngọc Thương', (SELECT id FROM departments WHERE name = 'Chi bộ Trung tâm hỗ trợ phát triển giáo dục hòa nhập Trí Tâm' LIMIT 1), (SELECT id FROM positions WHERE name = 'Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1982, Quê quán: Nghĩa An, Nam Trực, Nam Định');

INSERT INTO staff (full_name, department_id, position_id, notes)
VALUES ('Trần Thị Hương', (SELECT id FROM departments WHERE name = 'Chi bộ Trung tâm hỗ trợ phát triển giáo dục hòa nhập Trí Tâm' LIMIT 1), (SELECT id FROM positions WHERE name = 'Phó Bí thư chi bộ' LIMIT 1), 'Năm sinh: 1983, Quê quán: Đông Du, Bình Lục, Hà Nam');

