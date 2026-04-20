-- 1. Xóa các nhân sự bị trùng lặp (nếu bạn lỡ import nhiều lần)
DELETE FROM staff WHERE id NOT IN (SELECT min(id) FROM staff GROUP BY full_name);

-- 2. Tạo tài khoản auth và cập nhật email cho staff
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'ngohieu@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ngô Hiếu"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ngohieu@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'ngohieu@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'ngohieu@anphu.com' WHERE full_name = 'Ngô Hiếu';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthihongminh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Hồng Minh"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthihongminh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthihongminh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthihongminh@anphu.com' WHERE full_name = 'Nguyễn Thị Hồng Minh';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthimytien@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Mỹ Tiền"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthimytien@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthimytien@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthimytien@anphu.com' WHERE full_name = 'Nguyễn Thị Mỹ Tiền';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'buithinhung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bùi Thị Nhung"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'buithinhung@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'buithinhung@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'buithinhung@anphu.com' WHERE full_name = 'Bùi Thị Nhung';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phivanduc@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phí Văn Đức"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phivanduc@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phivanduc@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phivanduc@anphu.com' WHERE full_name = 'Phí Văn Đức';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phanthithanhtam@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Thị Thanh Tâm"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phanthithanhtam@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phanthithanhtam@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phanthithanhtam@anphu.com' WHERE full_name = 'Phan Thị Thanh Tâm';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthanhhoa@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thanh Hóa"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranthanhhoa@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranthanhhoa@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranthanhhoa@anphu.com' WHERE full_name = 'Trần Thanh Hóa';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyendoanhoangthien@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Đoàn Hoàng Thiện"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyendoanhoangthien@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyendoanhoangthien@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyendoanhoangthien@anphu.com' WHERE full_name = 'Nguyễn Đoàn Hoàng Thiện';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phanthanhngoc@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Thanh Ngọc"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phanthanhngoc@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phanthanhngoc@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phanthanhngoc@anphu.com' WHERE full_name = 'Phan Thanh Ngọc';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dongocdiep@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đỗ Ngọc Điệp"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dongocdiep@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'dongocdiep@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'dongocdiep@anphu.com' WHERE full_name = 'Đỗ Ngọc Điệp';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenphison@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Phi Sơn"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenphison@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenphison@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenphison@anphu.com' WHERE full_name = 'Nguyễn Phi Sơn';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'vanquangloi@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Văn Quang Lợi"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vanquangloi@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'vanquangloi@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'vanquangloi@anphu.com' WHERE full_name = 'Văn Quang Lợi';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthithuthuy@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Thu Thủy"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranthithuthuy@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranthithuthuy@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranthithuthuy@anphu.com' WHERE full_name = 'Trần Thị Thu Thủy';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthihien@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Hiền"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthihien@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthihien@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthihien@anphu.com' WHERE full_name = 'Nguyễn Thị Hiền';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'lexuanhung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Xuân Hùng"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lexuanhung@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'lexuanhung@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'lexuanhung@anphu.com' WHERE full_name = 'Lê Xuân Hùng';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamphunam@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Phú Nam"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phamphunam@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phamphunam@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phamphunam@anphu.com' WHERE full_name = 'Phạm Phú Nam';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyentiencong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Tiến Công"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyentiencong@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyentiencong@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyentiencong@anphu.com' WHERE full_name = 'Nguyễn Tiến Công';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phantanphu@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Tấn Phú"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phantanphu@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phantanphu@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phantanphu@anphu.com' WHERE full_name = 'Phan Tấn Phú';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'caoquangtrung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Cao Quang Trung"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'caoquangtrung@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'caoquangtrung@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'caoquangtrung@anphu.com' WHERE full_name = 'Cao Quang Trung';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenhuunghi@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Hữu Nghi"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenhuunghi@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenhuunghi@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenhuunghi@anphu.com' WHERE full_name = 'Nguyễn Hữu Nghi';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'huynhvantruyen@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Huỳnh Văn Truyện"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'huynhvantruyen@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'huynhvantruyen@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'huynhvantruyen@anphu.com' WHERE full_name = 'Huỳnh Văn Truyện';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'hoquocbinh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hồ Quốc Bình"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hoquocbinh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'hoquocbinh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'hoquocbinh@anphu.com' WHERE full_name = 'Hồ Quốc Bình';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'huynhvuongquoc@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Huỳnh Vương Quốc"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'huynhvuongquoc@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'huynhvuongquoc@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'huynhvuongquoc@anphu.com' WHERE full_name = 'Huỳnh Vương Quốc';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamvanthai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Văn Thái"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phamvanthai@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phamvanthai@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phamvanthai@anphu.com' WHERE full_name = 'Phạm Văn Thái';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenvanthuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Văn Thuần"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenvanthuan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenvanthuan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenvanthuan@anphu.com' WHERE full_name = 'Nguyễn Văn Thuần';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamvandung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Văn Dũng"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phamvandung@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phamvandung@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phamvandung@anphu.com' WHERE full_name = 'Phạm Văn Dũng';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phanthikieuloan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Thị Kiều Loan"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phanthikieuloan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phanthikieuloan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phanthikieuloan@anphu.com' WHERE full_name = 'Phan Thị Kiều Loan';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'havanhoa@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hà Văn Hóa"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'havanhoa@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'havanhoa@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'havanhoa@anphu.com' WHERE full_name = 'Hà Văn Hóa';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamvanbinh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Văn Bình"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phamvanbinh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phamvanbinh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phamvanbinh@anphu.com' WHERE full_name = 'Phạm Văn Bình';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranquanghuy@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Quang Huy"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranquanghuy@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranquanghuy@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranquanghuy@anphu.com' WHERE full_name = 'Trần Quang Huy';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'buituananh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bùi Tuấn Anh"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'buituananh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'buituananh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'buituananh@anphu.com' WHERE full_name = 'Bùi Tuấn Anh';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthanhrong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thanh Rồng"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranthanhrong@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranthanhrong@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranthanhrong@anphu.com' WHERE full_name = 'Trần Thanh Rồng';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranquangthai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Quang Thái"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranquangthai@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranquangthai@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranquangthai@anphu.com' WHERE full_name = 'Trần Quang Thái';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nghiemxuanquynh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nghiêm Xuân Quỳnh"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nghiemxuanquynh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nghiemxuanquynh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nghiemxuanquynh@anphu.com' WHERE full_name = 'Nghiêm Xuân Quỳnh';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthimydung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Mỹ Dung"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranthimydung@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranthimydung@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranthimydung@anphu.com' WHERE full_name = 'Trần Thị Mỹ Dung';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'daovanson@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đào Văn Sơn"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'daovanson@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'daovanson@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'daovanson@anphu.com' WHERE full_name = 'Đào Văn Sơn';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dohuusao@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đỗ Hữu Sao"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dohuusao@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'dohuusao@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'dohuusao@anphu.com' WHERE full_name = 'Đỗ Hữu Sao';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyentrunghuy@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Trung Huy"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyentrunghuy@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyentrunghuy@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyentrunghuy@anphu.com' WHERE full_name = 'Nguyễn Trung Huy';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamvanxuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Văn Xuân"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phamvanxuan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phamvanxuan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phamvanxuan@anphu.com' WHERE full_name = 'Phạm Văn Xuân';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'caobathanh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Cao Bá Thành"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'caobathanh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'caobathanh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'caobathanh@anphu.com' WHERE full_name = 'Cao Bá Thành';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'maithibong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mai Thị Bông"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'maithibong@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'maithibong@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'maithibong@anphu.com' WHERE full_name = 'Mai Thị Bông';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'duongbao@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dương Bảo"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'duongbao@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'duongbao@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'duongbao@anphu.com' WHERE full_name = 'Dương Bảo';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'macdinhtuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mạc Đình Tuấn"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'macdinhtuan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'macdinhtuan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'macdinhtuan@anphu.com' WHERE full_name = 'Mạc Đình Tuấn';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'lequoctoan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Quốc Toàn"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lequoctoan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'lequoctoan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'lequoctoan@anphu.com' WHERE full_name = 'Lê Quốc Toàn';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthihaiphuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Hải Phương"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthihaiphuong@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthihaiphuong@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthihaiphuong@anphu.com' WHERE full_name = 'Nguyễn Thị Hải Phương';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'huynhthiphung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Huỳnh Thị Phụng"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'huynhthiphung@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'huynhthiphung@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'huynhthiphung@anphu.com' WHERE full_name = 'Huỳnh Thị Phụng';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'hotantai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hồ Tấn Tài"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hotantai@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'hotantai@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'hotantai@anphu.com' WHERE full_name = 'Hồ Tấn Tài';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenngocthi@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Ngọc Thi"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenngocthi@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenngocthi@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenngocthi@anphu.com' WHERE full_name = 'Nguyễn Ngọc Thi';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phamthixuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phạm Thị Xuân"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phamthixuan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phamthixuan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phamthixuan@anphu.com' WHERE full_name = 'Phạm Thị Xuân';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthithugiang@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Thu Giang"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthithugiang@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthithugiang@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthithugiang@anphu.com' WHERE full_name = 'Nguyễn Thị Thu Giang';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyencongquang@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Công Quang"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyencongquang@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyencongquang@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyencongquang@anphu.com' WHERE full_name = 'Nguyễn Công Quang';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthanhnhan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thanh Nhàn"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthanhnhan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthanhnhan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthanhnhan@anphu.com' WHERE full_name = 'Nguyễn Thanh Nhàn';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'hoangthuyha@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hoàng Thúy Hà"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hoangthuyha@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'hoangthuyha@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'hoangthuyha@anphu.com' WHERE full_name = 'Hoàng Thúy Hà';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'vivansinh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Vi Văn Sính"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vivansinh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'vivansinh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'vivansinh@anphu.com' WHERE full_name = 'Vi Văn Sính';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthanhtuan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thanh Tuấn"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthanhtuan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthanhtuan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthanhtuan@anphu.com' WHERE full_name = 'Nguyễn Thanh Tuấn';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'daothithuha@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đào Thị Thu Hà"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'daothithuha@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'daothithuha@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'daothithuha@anphu.com' WHERE full_name = 'Đào Thị Thu Hà';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dauthithuynhung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đậu Thị Thúy Nhung"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dauthithuynhung@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'dauthithuynhung@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'dauthithuynhung@anphu.com' WHERE full_name = 'Đậu Thị Thúy Nhung';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyentrungtoan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Trung Toàn"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyentrungtoan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyentrungtoan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyentrungtoan@anphu.com' WHERE full_name = 'Nguyễn Trung Toàn';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenngochieu@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Ngọc Hiếu"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenngochieu@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenngochieu@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenngochieu@anphu.com' WHERE full_name = 'Nguyễn Ngọc Hiếu';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'phanthanhhai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Phan Thanh Hải"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'phanthanhhai@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'phanthanhhai@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'phanthanhhai@anphu.com' WHERE full_name = 'Phan Thanh Hải';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthilai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Lại"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthilai@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthilai@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthilai@anphu.com' WHERE full_name = 'Nguyễn Thị Lại';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'trantonga@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Tố Nga"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'trantonga@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'trantonga@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'trantonga@anphu.com' WHERE full_name = 'Trần Tố Nga';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'lethithanhnguyen@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Thị Thanh Nguyên"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'lethithanhnguyen@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'lethithanhnguyen@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'lethithanhnguyen@anphu.com' WHERE full_name = 'Lê Thị Thanh Nguyên';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'trankimthanh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Kim Thanh"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'trankimthanh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'trankimthanh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'trankimthanh@anphu.com' WHERE full_name = 'Trần Kim Thanh';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthihongdiep@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Hồng Diệp"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthihongdiep@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthihongdiep@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthihongdiep@anphu.com' WHERE full_name = 'Nguyễn Thị Hồng Diệp';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'truonghoaian@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trương Hoài Ân"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'truonghoaian@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'truonghoaian@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'truonghoaian@anphu.com' WHERE full_name = 'Trương Hoài Ân';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'buiminhthanh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Bùi Minh Thành"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'buiminhthanh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'buiminhthanh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'buiminhthanh@anphu.com' WHERE full_name = 'Bùi Minh Thành';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthithuha@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Thu Hà"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranthithuha@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranthithuha@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranthithuha@anphu.com' WHERE full_name = 'Trần Thị Thu Hà';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthithuhuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Thu Hương"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranthithuhuong@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranthithuhuong@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranthithuhuong@anphu.com' WHERE full_name = 'Trần Thị Thu Hương';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenminhkhai@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Minh Khải"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenminhkhai@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenminhkhai@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenminhkhai@anphu.com' WHERE full_name = 'Nguyễn Minh Khải';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyendinhsang@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Đinh Sang"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyendinhsang@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyendinhsang@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyendinhsang@anphu.com' WHERE full_name = 'Nguyễn Đinh Sang';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenthidiemtrinh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Thị Diễm Trinh"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenthidiemtrinh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenthidiemtrinh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenthidiemtrinh@anphu.com' WHERE full_name = 'Nguyễn Thị Diễm Trinh';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenvanhiep@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Văn Hiệp"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenvanhiep@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenvanhiep@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenvanhiep@anphu.com' WHERE full_name = 'Nguyễn Văn Hiệp';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'huynhvanphap@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Huỳnh Văn Pháp"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'huynhvanphap@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'huynhvanphap@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'huynhvanphap@anphu.com' WHERE full_name = 'Huỳnh Văn Pháp';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'maithanhnghia@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mai Thành Nghĩa"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'maithanhnghia@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'maithanhnghia@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'maithanhnghia@anphu.com' WHERE full_name = 'Mai Thành Nghĩa';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'haquoctoan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hà Quốc Toàn"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'haquoctoan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'haquoctoan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'haquoctoan@anphu.com' WHERE full_name = 'Hà Quốc Toàn';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenvandu@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Văn Dự"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenvandu@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenvandu@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenvandu@anphu.com' WHERE full_name = 'Nguyễn Văn Dự';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenngocvan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Ngọc Vân"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenngocvan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenngocvan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenngocvan@anphu.com' WHERE full_name = 'Nguyễn Ngọc Vân';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'levanthanh@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Lê Văn Thanh"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'levanthanh@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'levanthanh@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'levanthanh@anphu.com' WHERE full_name = 'Lê Văn Thanh';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dothikimday@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đỗ Thị Kim Đây"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dothikimday@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'dothikimday@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'dothikimday@anphu.com' WHERE full_name = 'Đỗ Thị Kim Đây';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenkimphuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Kim Phương"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenkimphuong@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenkimphuong@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenkimphuong@anphu.com' WHERE full_name = 'Nguyễn Kim Phương';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'dongochongloan@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Đỗ Ngọc Hồng Loan"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dongochongloan@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'dongochongloan@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'dongochongloan@anphu.com' WHERE full_name = 'Đỗ Ngọc Hồng Loan';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'nguyenhongnhung@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nguyễn Hồng Nhung"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nguyenhongnhung@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'nguyenhongnhung@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'nguyenhongnhung@anphu.com' WHERE full_name = 'Nguyễn Hồng Nhung';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'vungocthuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Vũ Ngọc Thương"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vungocthuong@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'vungocthuong@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'vungocthuong@anphu.com' WHERE full_name = 'Vũ Ngọc Thương';

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT gen_random_uuid(), 'authenticated', 'authenticated', 'tranthihuong@anphu.com', crypt('123123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Trần Thị Hương"}', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tranthihuong@anphu.com');

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT gen_random_uuid(), id::text, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now()
FROM auth.users WHERE email = 'tranthihuong@anphu.com'
AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE provider = 'email' AND user_id = auth.users.id);

UPDATE staff SET email = 'tranthihuong@anphu.com' WHERE full_name = 'Trần Thị Hương';

