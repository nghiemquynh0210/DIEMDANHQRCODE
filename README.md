# Ung dung diem danh cuoc hop bang QR cho UBND phuong An Phu

Ung dung nay duoc xay dung theo huong:

- Frontend: React + Vite
- Backend API: Express
- CSDL: Supabase PostgreSQL
- Chuc nang nghiep vu: quan ly nhan su, chuc danh, phong ban, khu pho, cuoc hop va diem danh bang QR

## 1. Tao database Supabase

1. Tao project Supabase moi.
2. Mo SQL Editor trong Supabase.
3. Chay file [schema.sql](C:\Users\Admin\Downloads\DIEMDANHQRCODE\supabase\schema.sql).
4. Chay tiep file [rls.sql](C:\Users\Admin\Downloads\DIEMDANHQRCODE\supabase\rls.sql).

Sau khi schema duoc tao, server se tu seed du lieu mau:

- tai khoan `admin`
- mat khau mac dinh `123123`
- danh muc phong ban, chuc danh, khu pho
- mot vai nhan su mau
- mot cuoc hop mau

## 1.1 Ghi chu ve RLS

- File [rls.sql](C:\Users\Admin\Downloads\DIEMDANHQRCODE\supabase\rls.sql) bat RLS cho toan bo bang chinh.
- Cac policy hien tai uu tien an toan: chi `authenticated` moi doc duoc cac bang cong khai, va chi nguoi co claim `role=admin` moi duoc ghi.
- Backend Express hien dang dung `SUPABASE_SERVICE_ROLE_KEY`, vi vay service layer van hoat dong du ke ca khi RLS bat. Day la mo hinh phu hop khi app chua chuyen sang Supabase Auth.
- Neu sau nay ban muon bo Express va cho frontend goi truc tiep Supabase, minh nen lam them buoc dong bo Supabase Auth + custom JWT claims.

## 2. Cau hinh bien moi truong

Tao file `.env` tu `.env.example` va dien:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_custom_secret
PORT=3000
```

Luu y:

- `SUPABASE_SERVICE_ROLE_KEY` chi dung o backend Express.
- Khong dua service role key vao code frontend.

## 3. Cai dat va chay

```bash
npm install
npm run dev
```

App se chay o:

- `http://localhost:3000`

## 4. Nghiệp vu da ho tro

- Quan ly co cau: phong ban, chuc danh, khu pho
- Quan ly nhan su va tai khoan dang nhap
- Tao cuoc hop va chon thanh phan moi theo 3 nhom
- QR cho tu diem danh
- QR / manual check-in cho thu ky
- Bao cao diem danh va xuat Excel

## 4.1 Import danh sach can bo that tu Excel

Ban co 2 cach:

1. Import ngay tren giao dien `Nhan su`
2. Dung script de nap file lon hoac file that:

```bash
npm run import:staff -- "duong-dan-file.xlsx"
```

Hoac dry-run de xem truoc:

```bash
npm run import:staff -- "duong-dan-file.xlsx" --dry-run
```

Neu file co nhieu sheet:

```bash
npm run import:staff -- "duong-dan-file.xlsx" --sheet=Sheet1
```

Script dang ho tro cac cot gan dung nhu:

- `Ma can bo`
- `Ho va ten`
- `Chuc danh` / `Chuc vu`
- `Phong ban`
- `Khu pho`
- `So dien thoai`
- `Email`
- `Ghi chu`
- `Trang thai`

Neu ten cot trong file that khac, minh co the map them rat nhanh.

## 5. Cac bang chinh trong Supabase

- `departments`
- `positions`
- `neighborhoods`
- `staff`
- `users`
- `meetings`
- `attendance`

## 6. Ghi chu trien khai

- Neu muon dua len mobile qua Capacitor, van giu backend Supabase + Express nhu hien tai.
- Khi demo noi bo, co the dung local network IP de dien thoai quet QR.
- Neu muon dua vao van hanh that, nen bo sung RLS, audit log va sao luu dinh ky.

## 7. APK Android

Project da co san thu muc Android va Capacitor config:

- [capacitor.config.ts](C:\Users\Admin\Downloads\DIEMDANHQRCODE\capacitor.config.ts)
- [android/app/build.gradle](C:\Users\Admin\Downloads\DIEMDANHQRCODE\android\app\build.gradle)

Tuy nhien tren may hien tai `java` chua co trong PATH, nen chua the build APK ngay. De dong goi APK can toi thieu:

- JDK 17
- Android SDK
- bien moi truong `JAVA_HOME`
- bien moi truong `ANDROID_HOME` hoac `ANDROID_SDK_ROOT`

Khi may da du cac thanh phan nay, cac buoc se la:

```bash
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```
