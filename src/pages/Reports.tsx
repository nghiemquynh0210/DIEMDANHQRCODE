import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileBarChart, Filter, Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Attendance, Meeting } from '../types';
import { formatDate, formatTime } from '../lib/utils';

export default function Reports() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState('');
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'late' | 'absent'>('all');

  useEffect(() => {
    supabase.from('meetings').select('*').order('meeting_date', { ascending: false }).order('meeting_time', { ascending: false })
      .then(({ data }) => {
        const arr = data || [];
        setMeetings(arr);
        if (arr.length > 0) setSelectedMeetingId(String(arr[0].id));
      });
  }, []);

  useEffect(() => {
    if (!selectedMeetingId) return;

    const fetchUnifiedAttendance = async () => {
      try {
        const meeting = meetings.find(m => String(m.id) === String(selectedMeetingId));
        if (!meeting) return;

        const { data: attData } = await supabase
          .from('attendance')
          .select('*, staff(id, full_name, staff_code, departments:department_id(name), positions:position_id(name), party_departments:party_department_id(name), party_positions:party_position_id(name))')
          .eq('meeting_id', selectedMeetingId)
          .order('checkin_time', { ascending: false });

        let staffQuery = supabase.from('staff').select('id, full_name, staff_code, department_id, position_id, party_department_id, party_position_id, departments:department_id(name), positions:position_id(name), party_departments:party_department_id(name), party_positions:party_position_id(name)').eq('status', 'active');
        
        const orConditions = [];
        if (meeting.participant_department_ids?.length) {
            orConditions.push(`department_id.in.(${meeting.participant_department_ids.join(',')})`);
            orConditions.push(`party_department_id.in.(${meeting.participant_department_ids.join(',')})`);
        }
        if (meeting.participant_position_ids?.length) {
            orConditions.push(`position_id.in.(${meeting.participant_position_ids.join(',')})`);
            orConditions.push(`party_position_id.in.(${meeting.participant_position_ids.join(',')})`);
        }
        
        if (orConditions.length > 0) {
            staffQuery = staffQuery.or(orConditions.join(','));
        }

        const { data: staffData } = await staffQuery;

        const attendedStaffIds = new Set((attData || []).map(a => a.staff_id));

        const mappedAttendance = (attData || []).map((item: any) => ({
          ...item,
          full_name: item.staff?.full_name || '--',
          staff_code: item.staff?.staff_code || '--',
          department_name: item.staff?.departments?.name || item.staff?.party_departments?.name || '--',
          position_name: item.staff?.positions?.name || item.staff?.party_positions?.name || '--',
        }));

        const absentStaff = (staffData || []).filter(s => !attendedStaffIds.has(s.id));

        const mappedAbsent = absentStaff.map((s: any) => ({
            id: `absent-${s.id}`,
            meeting_id: selectedMeetingId,
            staff_id: s.id,
            checkin_time: null,
            checkin_method: null,
            status: 'absent',
            full_name: s.full_name || '--',
            staff_code: s.staff_code || '--',
            department_name: s.departments?.name || s.party_departments?.name || '--',
            position_name: s.positions?.name || s.party_positions?.name || '--',
        }));

        setAttendance([...mappedAttendance, ...mappedAbsent]);
      } catch (err) {
        console.error('Error unifying attendance:', err);
      }
    };

    fetchUnifiedAttendance();
  }, [selectedMeetingId, meetings]);

  const rows = useMemo(() => attendance.filter((item) => statusFilter === 'all' || item.status === statusFilter), [attendance, statusFilter]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows.map((item, index) => ({
      STT: index + 1,
      'Họ và tên': item.full_name,
      'Mã cán bộ': item.staff_code,
      'Chức danh': item.position_name,
      'Phòng ban': item.department_name,
      'Thời gian quét': item.checkin_time ? formatTime(item.checkin_time) : '--:--',
      'Trạng thái': item.status === 'present' ? 'Đúng giờ' : item.status === 'late' ? 'Đi trễ' : 'Vắng',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
    XLSX.writeFile(wb, 'Bao_cao_diem_danh.xlsx');
  };

  const presentCount = attendance.filter((r) => r.status === 'present').length;
  const lateCount = attendance.filter((r) => r.status === 'late').length;
  const absentCount = attendance.filter((r) => r.status === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="card flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1">
          <label className="text-xs font-bold text-brand-text/50 uppercase tracking-wider flex items-center gap-2 mb-2">
            <FileBarChart size={14} />Cuộc họp
          </label>
          <select className="input" value={selectedMeetingId} onChange={(event) => setSelectedMeetingId(event.target.value)}>
            {meetings.map((item) => <option key={item.id} value={item.id}>{item.title} ({formatDate(item.meeting_date)})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-brand-text/50 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Filter size={14} />Trạng thái
          </label>
          <select className="input md:w-48" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as any)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="present">Đúng giờ</option>
            <option value="late">Đi trễ</option>
            <option value="absent">Vắng</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary" onClick={exportExcel}>
            <Download size={16} />Xuất Excel
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={16} />In / PDF
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">Đúng giờ: {presentCount}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold text-amber-700">Đi trễ: {lateCount}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-100">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-xs font-semibold text-rose-700">Vắng: {absentCount}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100">
          <span className="text-xs font-semibold text-indigo-700">Tổng: {rows.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="premium-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Nhân sự</th>
              <th className="hidden md:table-cell">Cơ cấu</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={item.id}>
                <td className="font-mono text-sm text-brand-text/40">{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold shrink-0">
                      {item.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.full_name}</div>
                      <div className="text-[10px] text-brand-text/35 font-mono">{item.staff_code || '--'}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell">
                  <div className="text-sm">{item.position_name || '--'}</div>
                  <div className="text-[10px] text-brand-text/35">{item.department_name || '--'}</div>
                </td>
                <td>
                  <span className="font-mono text-sm font-medium">{item.checkin_time ? formatTime(item.checkin_time) : '--:--'}</span>
                </td>
                <td>
                  <span className={`badge ${item.status === 'present' ? 'badge-success' : item.status === 'late' ? 'badge-warning' : 'badge-danger'}`}>
                    {item.status === 'present' ? 'Đúng giờ' : item.status === 'late' ? 'Đi trễ' : 'Vắng'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
