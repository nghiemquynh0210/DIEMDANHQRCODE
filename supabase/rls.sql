alter table departments enable row level security;
alter table positions enable row level security;
alter table neighborhoods enable row level security;
alter table staff enable row level security;
alter table users enable row level security;
alter table meetings enable row level security;
alter table attendance enable row level security;

drop policy if exists "departments_select_authenticated" on departments;
create policy "departments_select_authenticated"
on departments
for select
to authenticated
using (true);

drop policy if exists "positions_select_authenticated" on positions;
create policy "positions_select_authenticated"
on positions
for select
to authenticated
using (true);

drop policy if exists "neighborhoods_select_authenticated" on neighborhoods;
create policy "neighborhoods_select_authenticated"
on neighborhoods
for select
to authenticated
using (true);

drop policy if exists "staff_select_authenticated" on staff;
create policy "staff_select_authenticated"
on staff
for select
to authenticated
using (true);

drop policy if exists "meetings_select_authenticated" on meetings;
create policy "meetings_select_authenticated"
on meetings
for select
to authenticated
using (true);

drop policy if exists "attendance_select_authenticated" on attendance;
create policy "attendance_select_authenticated"
on attendance
for select
to authenticated
using (true);

drop policy if exists "departments_admin_all" on departments;
create policy "departments_admin_all"
on departments
for all
to authenticated
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "positions_admin_all" on positions;
create policy "positions_admin_all"
on positions
for all
to authenticated
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "neighborhoods_admin_all" on neighborhoods;
create policy "neighborhoods_admin_all"
on neighborhoods
for all
to authenticated
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "staff_admin_all" on staff;
create policy "staff_admin_all"
on staff
for all
to authenticated
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "meetings_admin_all" on meetings;
create policy "meetings_admin_all"
on meetings
for all
to authenticated
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "attendance_admin_all" on attendance;
create policy "attendance_admin_all"
on attendance
for all
to authenticated
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

drop policy if exists "users_admin_all" on users;
create policy "users_admin_all"
on users
for all
to authenticated
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');
