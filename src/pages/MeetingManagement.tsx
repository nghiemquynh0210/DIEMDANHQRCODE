import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Edit2, MapPin, Plus, QrCode, Trash2, Users, X, ChevronDown, ChevronUp } from 'lucide-react';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import { Department, Meeting, Neighborhood, Position } from '../types';
import { formatDate, formatTime } from '../lib/utils';

export default function MeetingManagement() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [allStaff, setAllStaff] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [attendanceTitle, setAttendanceTitle] = useState('');
  const [qr, setQr] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    participant_department_ids: [] as number[],
    participant_position_ids: [] as number[],
    participant_neighborhood_ids: [] as number[],
    meeting_date: new Date().toISOString().split('T')[0],
    meeting_time: '08:00',
    location: 'Hội trường UBND phường An Phú',
  });

  const token = localStorage.getItem('token');

  const load = async () => {
    try {
      const [
        { data: m },
        { data: d },
        { data: p },
        { data: n },
        { data: s }
      ] = await Promise.all([
        supabase.from('meetings').select('*').order('meeting_date', { ascending: false }).order('meeting_time', { ascending: false }),
        supabase.from('departments').select('*'),
        supabase.from('positions').select('*'),
        supabase.from('neighborhoods').select('*'),
        supabase.from('staff').select('id, department_id, position_id, neighborhood_id, full_name, staff_code, departments(name), positions(name), neighborhoods(name)').eq('status', 'active'),
      ]);
      setMeetings(m || []);
      setDepartments(d || []);
      setPositions(p || []);
      setNeighborhoods(n || []);
      setAllStaff(s || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = (key: 'participant_department_ids' | 'participant_position_ids' | 'participant_neighborhood_ids', id: number) => {
    if (key === 'participant_position_ids') {
      const clickedPos = positions.find(p => p.id === id);
      if (clickedPos) {
        const name = clickedPos.name.toLowerCase();
        let relatedIds = [id];
        
        if (name === 'bí thư') {
          relatedIds = positions.filter(p => !p.name.toLowerCase().includes('phó') && p.name.toLowerCase().includes('bí thư')).map(p => p.id);
        } else if (name === 'phó bí thư') {
          relatedIds = positions.filter(p => p.name.toLowerCase().includes('phó bí thư')).map(p => p.id);
        } else if (name === 'chi ủy viên') {
          relatedIds = positions.filter(p => p.name.toLowerCase().includes('chi ủy viên')).map(p => p.id);
        } else if (name === 'chỉ huy trưởng') {
          relatedIds = positions.filter(p => p.name.toLowerCase().includes('chỉ huy trưởng') && !p.name.toLowerCase().includes('phó')).map(p => p.id);
        } else if (name === 'phó chỉ huy trưởng') {
          relatedIds = positions.filter(p => p.name.toLowerCase().includes('phó chỉ huy trưởng')).map(p => p.id);
        } else if (name === 'trưởng ban công tác mặt trận' || name === 'trưởng ban ctmt') {
          relatedIds = positions.filter(p => p.name.toLowerCase().includes('mặt trận') || p.name.toLowerCase().includes('ctmt')).map(p => p.id);
        }

        setForm(prev => {
          const arr = prev[key];
          if (arr.includes(id)) {
            // Uncheck all related
            return { ...prev, [key]: arr.filter(i => !relatedIds.includes(i)) };
          } else {
            // Check all related
            return { ...prev, [key]: Array.from(new Set([...arr, ...relatedIds])) };
          }
        });
        return;
      }
    }

    setForm((prev) => {
      const arr = prev[key];
      if (arr.includes(id)) {
        return { ...prev, [key]: arr.filter((i) => i !== id) };
      } else {
        return { ...prev, [key]: [...arr, id] };
      }
    });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let result;
      if (editing) {
        result = await supabase.from('meetings').update(form).eq('id', editing.id);
      } else {
        result = await supabase.from('meetings').insert(form);
      }
      
      if (result.error) {
         console.error('Supabase DB error: ', result.error);
         alert('Lỗi khi lưu dữ liệu do cơ sở dữ liệu: ' + result.error.message);
         return;
      }
      
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', content: '', participant_department_ids: [], participant_position_ids: [], participant_neighborhood_ids: [], meeting_date: new Date().toISOString().split('T')[0], meeting_time: '08:00', location: 'Hội trường UBND phường An Phú' });
      load();
    } catch (err: any) {
      console.error('Save error:', err);
      alert('Lỗi kết nối máy chủ hoặc logic Javascript nội bộ: ' + (err.message || ''));
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa cuộc họp này?')) return;
    await supabase.from('attendance').delete().eq('meeting_id', id);
    await supabase.from('meetings').delete().eq('id', id);
    load();
  };

  const showMeetingQr = async (meeting: Meeting) => {
    try {
      // Instead of relying on a short-lived backend token, we encode the self-checkin target URL.
      // This fulfills Phase 3 URL scanning capabilities directly into Zalo browser.
      const origin = window.location.origin;
      const targetUrl = `${origin}/self-checkin?meetingId=${meeting.id}`;
      const url = await QRCode.toDataURL(targetUrl, { width: 440, margin: 2, scale: 10,  color: { dark: '#4338CA', light: '#FFFFFF' } });
      
      setAttendanceTitle(meeting.title);
      setQr(url);
    } catch (error) {
      console.error('Error generating QR', error);
    }
  };

  const showAttendance = async (meeting: Meeting) => {
    const { data } = await supabase
      .from('attendance')
      .select('*, staff(full_name, staff_code, departments(name), positions(name), neighborhoods(name))')
      .eq('meeting_id', meeting.id)
      .order('checkin_time', { ascending: false });

    let invitedStaff = allStaff;
    if (meeting.participant_department_ids?.length || meeting.participant_position_ids?.length || meeting.participant_neighborhood_ids?.length) {
      invitedStaff = allStaff.filter(s => 
        (meeting.participant_department_ids || []).includes(s.department_id) ||
        (meeting.participant_position_ids || []).includes(s.position_id) ||
        (meeting.participant_neighborhood_ids || []).includes(s.neighborhood_id)
      );
    }

    const attendedStaffIds = new Set((data || []).map(a => a.staff_id));

    const mappedAttendance = (data || []).map((item: any) => ({
      ...item,
      full_name: item.staff?.full_name || '--',
      staff_code: item.staff?.staff_code || '--',
      department_name: item.staff?.departments?.name || '--',
      position_name: item.staff?.positions?.name || '--',
      neighborhood_name: item.staff?.neighborhoods?.name || '--',
    }));

    const absentStaff = invitedStaff.filter(s => !attendedStaffIds.has(s.id));
    const mappedAbsent = absentStaff.map((s: any) => ({
      id: `absent-${s.id}`,
      staff_id: s.id,
      meeting_id: meeting.id,
      checkin_time: null,
      status: 'absent',
      full_name: s.full_name || '--',
      staff_code: s.staff_code || '--',
      department_name: s.departments?.name || '--',
      position_name: s.positions?.name || '--',
      neighborhood_name: s.neighborhoods?.name || '--',
    }));

    setAttendance([...mappedAttendance, ...mappedAbsent]);
    setAttendanceTitle(meeting.title);
  };

  const getInvitedStaffCount = () => {
     if (form.participant_department_ids.length === 0 && form.participant_position_ids.length === 0 && form.participant_neighborhood_ids.length === 0) {
        return allStaff.length;
     }
     return allStaff.filter(s => 
        form.participant_department_ids.includes(s.department_id) || 
        form.participant_position_ids.includes(s.position_id) || 
        form.participant_neighborhood_ids.includes(s.neighborhood_id)
     ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brand-text/50 font-medium">{meetings.length} cuộc họp</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={18} />Tạo cuộc họp
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="card space-y-5 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-text">
              {editing ? 'Chỉnh sửa cuộc họp' : 'Tạo cuộc họp mới'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={18} className="text-brand-text/40" />
            </button>
          </div>

          <input className="input" placeholder="Tên cuộc họp" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          <textarea className="input min-h-[100px]" placeholder="Nội dung" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <input className="input" type="date" value={form.meeting_date} onChange={(event) => setForm({ ...form, meeting_date: event.target.value })} required />
            <input className="input" type="time" value={form.meeting_time} onChange={(event) => setForm({ ...form, meeting_time: event.target.value })} required />
          </div>
          <input className="input" placeholder="Địa điểm" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required />

          <Selection title="Phòng ban mời" items={departments} selected={form.participant_department_ids} onToggle={(id) => toggle('participant_department_ids', id)} />
          <Selection title="Chức danh mời" items={positions} selected={form.participant_position_ids} onToggle={(id) => toggle('participant_position_ids', id)} />
          <Selection title="Khu phố mời" items={neighborhoods} selected={form.participant_neighborhood_ids} onToggle={(id) => toggle('participant_neighborhood_ids', id)} />

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Users size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900">Số lượng dự kiến tham gia</h4>
                <p className="text-xs text-indigo-700/70 font-medium">Hệ thống tự động tính toán dựa trên cơ cấu khách mời</p>
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-700">
              {getInvitedStaffCount()} <span className="text-sm font-semibold text-indigo-700/60">cán bộ</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Đóng</button>
            <button className="btn-primary">{editing ? 'Lưu thay đổi' : 'Tạo cuộc họp'}</button>
          </div>
        </form>
      )}

      {/* Meeting List */}
      <div className="grid grid-cols-1 gap-4">
        {meetings.map((item, index) => (
          <div
            key={item.id}
            className="card flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/15">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-text">{item.title}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-brand-text/50 mt-1.5 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(item.meeting_date)}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} />{item.meeting_time}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={13} />{item.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary !py-2 !px-3 !text-xs" onClick={() => showMeetingQr(item)}>
                <QrCode size={14} />QR
              </button>
              <button className="btn-secondary !py-2 !px-3 !text-xs" onClick={() => showAttendance(item)}>
                <Users size={14} />Điểm danh
              </button>
              <button className="btn-secondary !py-2 !px-3 !text-xs" onClick={() => { setEditing(item); setForm({ title: item.title, content: item.content || '', participant_department_ids: item.participant_department_ids || [], participant_position_ids: item.participant_position_ids || [], participant_neighborhood_ids: item.participant_neighborhood_ids || [], meeting_date: item.meeting_date, meeting_time: item.meeting_time, location: item.location }); setShowForm(true); }}>
                <Edit2 size={14} />
              </button>
              <button className="btn-secondary !py-2 !px-3 !text-xs !text-red-500 !border-red-200 hover:!bg-red-50" onClick={() => remove(item.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Modal */}
      {qr && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-500/20">
              <QrCode size={28} />
            </div>
            <h3 className="text-lg font-bold text-brand-text mb-1">Mã QR điểm danh</h3>
            <p className="text-xs text-brand-text/50 mb-4">Quét mã bên dưới để điểm danh</p>
            <div className="p-3 bg-white rounded-2xl border border-gray-100 inline-block mb-4">
              <img src={qr} alt="QR" className="w-full max-w-[240px] mx-auto" />
            </div>
            <br />
            <button className="btn-secondary" onClick={() => setQr(null)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Attendance Detail */}
      {attendanceTitle && (
        <div className="card animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-brand-text">Chi tiết điểm danh: {attendanceTitle}</h3>
            <button onClick={() => { setAttendanceTitle(''); setAttendance([]); }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={16} className="text-brand-text/40" />
            </button>
          </div>
          <div className="space-y-2">
            {attendance.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-brand-bg/60 border border-gray-100 flex items-center justify-between hover:bg-brand-bg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {item.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{item.full_name}</div>
                    <div className="text-[11px] text-brand-text/40">{item.position_name || '--'} / {item.department_name || item.neighborhood_name || '--'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold">{item.checkin_time ? formatTime(item.checkin_time) : '--:--'}</div>
                  <span className={`badge ${item.status === 'present' ? 'badge-success' : item.status === 'late' ? 'badge-warning' : 'badge-danger'} !text-[10px] !py-0.5 !px-2`}>
                    {item.status === 'present' ? 'Đúng giờ' : item.status === 'late' ? 'Đi trễ' : 'Vắng'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Selection({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: Array<{ id: number; name: string }>;
  selected: number[];
  onToggle: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? items : items.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-brand-text/60 uppercase tracking-wider">{title}</label>
        {selected.length > 0 && (
          <span className="badge badge-info !text-[10px]">{selected.length} đã chọn</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {displayItems.map((item) => (
          <label key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-brand-bg/50 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all">
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => onToggle(item.id)}
              className="accent-indigo-500 w-4 h-4"
            />
            <span className="text-sm font-medium">{item.name}</span>
          </label>
        ))}
      </div>
      {items.length > 4 && (
        <button type="button" onClick={() => setExpanded(!expanded)} className="text-xs text-primary font-semibold mt-2 flex items-center gap-1 hover:underline">
          {expanded ? <><ChevronUp size={14} />Thu gọn</> : <><ChevronDown size={14} />Xem thêm ({items.length - 4})</>}
        </button>
      )}
    </div>
  );
}
