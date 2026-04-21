import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Edit2, Flag, GraduationCap, Landmark, MapPin, Plus, QrCode, Trash2, Users, X, ChevronDown, ChevronUp } from 'lucide-react';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import { Department, Meeting, Position } from '../types';
import { formatDate, formatTime } from '../lib/utils';

export default function MeetingManagement() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  
  const [allStaff, setAllStaff] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [attendanceTitle, setAttendanceTitle] = useState('');
  const [qr, setQr] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    org_type: 'all' as 'party' | 'government' | 'all',
    participant_department_ids: [] as number[],
    participant_position_ids: [] as number[],
    meeting_date: new Date().toISOString().split('T')[0],
    meeting_time: '08:00',
    meeting_end_time: '11:00',
    location: 'Hội trường UBND phường An Phú',
  });
  const [isAllStaff, setIsAllStaff] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'late' | 'absent'>('all');
  const [selectedMeetingForAttendance, setSelectedMeetingForAttendance] = useState<Meeting | null>(null);


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
        supabase.from('staff').select('id, department_id, position_id, party_department_id, party_position_id, full_name, staff_code, departments:department_id(name), positions:position_id(name), party_departments:party_department_id(name), party_positions:party_position_id(name)').eq('status', 'active'),
      ]);
      setMeetings(m || []);
      setDepartments(d || []);
      setPositions(p || []);
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
      setIsAllStaff(false);
      setForm({ title: '', content: '', org_type: 'all', participant_department_ids: [], participant_position_ids: [], meeting_date: new Date().toISOString().split('T')[0], meeting_time: '08:00', meeting_end_time: '11:00', location: 'Hội trường UBND phường An Phú' });
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
    setSelectedMeetingForAttendance(meeting);
    const { data } = await supabase
      .from('attendance')
      .select('*, staff(full_name, staff_code, departments(name), positions(name), neighborhoods(name))')
      .eq('meeting_id', meeting.id)
      .order('checkin_time', { ascending: false });

    let invitedStaff = allStaff;
    if (meeting.participant_department_ids?.length || meeting.participant_position_ids?.length) {
      invitedStaff = allStaff.filter(s => 
        (meeting.participant_department_ids || []).includes(s.department_id) ||
        (meeting.participant_department_ids || []).includes(s.party_department_id) ||
        (meeting.participant_position_ids || []).includes(s.position_id) ||
        (meeting.participant_position_ids || []).includes(s.party_position_id)
      );
    }

    const attendedStaffIds = new Set((data || []).map(a => a.staff_id));

    const mappedAttendance = (data || []).map((item: any) => ({
      ...item,
      full_name: item.staff?.full_name || '--',
      staff_code: item.staff?.staff_code || '--',
      department_name: item.staff?.departments?.name || '--',
      position_name: item.staff?.positions?.name || '--',
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

  const cancelCheckin = async (staffId: number) => {
    if (!selectedMeetingForAttendance) return;
    if (!confirm('Bạn có chắc muốn hủy điểm danh của cán bộ này?')) return;
    try {
      const { error } = await supabase.from('attendance').delete().eq('meeting_id', selectedMeetingForAttendance.id).eq('staff_id', staffId);
      if (error) {
        alert(error.message);
        return;
      }
      await showAttendance(selectedMeetingForAttendance);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const selectMacro = (type: 'heads' | 'deputies') => {
    setIsAllStaff(false);
    if (type === 'heads') {
      const headIds = positions.filter(p => {
        const n = p.name.toLowerCase();
        return (n.includes('trưởng') && !n.includes('phó')) || (n.includes('bí thư') && !n.includes('phó')) || (n.includes('chủ tịch') && !n.includes('phó')) || n.includes('ủy viên');
      }).map(p => p.id);
      setForm(prev => ({ ...prev, participant_position_ids: Array.from(new Set([...prev.participant_position_ids, ...headIds])) }));
    } else if (type === 'deputies') {
      const depIds = positions.filter(p => p.name.toLowerCase().includes('phó')).map(p => p.id);
      setForm(prev => ({ ...prev, participant_position_ids: Array.from(new Set([...prev.participant_position_ids, ...depIds])) }));
    }
  };

  const getInvitedStaffCount = () => {
     if (isAllStaff || (form.participant_department_ids.length === 0 && form.participant_position_ids.length === 0 && form.participant_neighborhood_ids.length === 0)) {
        return allStaff.length;
     }
     return allStaff.filter(s => 
        form.participant_department_ids.includes(s.department_id) || 
        form.participant_department_ids.includes(s.party_department_id) ||
        form.participant_department_ids.includes(s.school_department_id) ||
        form.participant_position_ids.includes(s.position_id) || 
        form.participant_position_ids.includes(s.party_position_id) ||
        form.participant_position_ids.includes(s.school_position_id) ||
        form.participant_neighborhood_ids.includes(s.neighborhood_id)
     ).length;
  };

  const orgLabel = (t: string) => t === 'party' ? '🚩 Đảng ủy' : t === 'government' ? '🏢 Chính quyền' : '📋 Tất cả';
  const formDepts = form.org_type === 'all' ? departments : departments.filter(d => d.org_type === form.org_type);
  const formPositions = form.org_type === 'all' ? positions : positions.filter(p => p.org_type === form.org_type);

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

          {/* Org Type Selector */}
          <div>
            <label className="block text-xs font-bold text-brand-text uppercase mb-2 ml-1">Thuộc tổ chức</label>
            <div className="flex gap-2">
              {(['party', 'government', 'all'] as const).map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, org_type: t, participant_department_ids: [], participant_position_ids: [] })}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                    form.org_type === t
                      ? t === 'party' ? 'border-red-500 bg-red-50 text-red-700' : t === 'government' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-brand-text/50 hover:border-gray-300'
                  }`}
                >
                  {t === 'party' ? <><Flag size={14}/>Đảng ủy</> : t === 'government' ? <><Landmark size={14}/>UBND</> : <>📋 Tất cả</>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text/50 uppercase mb-1.5 ml-1">Giờ bắt đầu</label>
              <input className="input" type="time" value={form.meeting_time} onChange={(event) => setForm({ ...form, meeting_time: event.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-text/50 uppercase mb-1.5 ml-1">Giờ kết thúc</label>
              <input className="input" type="time" value={form.meeting_end_time || '11:00'} onChange={(event) => setForm({ ...form, meeting_end_time: event.target.value })} required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-brand-text/50 uppercase mb-1.5 ml-1">Ngày diễn ra</label>
              <input className="input" type="date" value={form.meeting_date} onChange={(event) => setForm({ ...form, meeting_date: event.target.value })} required />
            </div>
          </div>
          <input className="input" placeholder="Địa điểm" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required />

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-text uppercase">Chọn nhanh thành phần tham dự</label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setIsAllStaff(true)} className={`badge !py-1.5 !px-3 !rounded-lg text-sm transition-all ${isAllStaff ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>Tất cả mọi người</button>
                <button type="button" onClick={() => selectMacro('heads')} className="badge !py-1.5 !px-3 !rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm transition-colors">Các Trưởng ban/ngành</button>
                <button type="button" onClick={() => selectMacro('deputies')} className="badge !py-1.5 !px-3 !rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm transition-colors">Các Phó ngành</button>
                <button type="button" onClick={() => { setIsAllStaff(false); setForm(prev => ({ ...prev, participant_department_ids: [], participant_position_ids: [] })) }} className="badge !py-1.5 !px-3 !rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm transition-colors cursor-pointer">Xóa bộ chọn</button>
              </div>
            </div>

            {!isAllStaff ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="md:col-span-2">
                  <Selection title={`Chức danh mời ${form.org_type !== 'all' ? `(${orgLabel(form.org_type)})` : ''}`} items={formPositions} selected={form.participant_position_ids} onToggle={(id) => toggle('participant_position_ids', id)} />
                </div>
                <Selection title={`Đơn vị mời ${form.org_type !== 'all' ? `(${orgLabel(form.org_type)})` : ''}`} items={formDepts} selected={form.participant_department_ids} onToggle={(id) => toggle('participant_department_ids', id)} />
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 text-sm text-indigo-700">
                ✔️ Đã cấu hình mời tất cả nhân sự tham gia cuộc họp. Nếu muốn mời thủ công, hãy chọn "Xóa bộ chọn".
              </div>
            )}
          </div>

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
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-brand-text">{item.title}</h3>
                  <span className={`badge !text-[10px] !py-0.5 !px-2 ${item.org_type === 'party' ? 'bg-red-100 text-red-700' : item.org_type === 'government' ? 'bg-indigo-100 text-indigo-700' : item.org_type === 'school' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                    {item.org_type === 'party' ? '🚩 Đảng' : item.org_type === 'government' ? '🏢 CQ' : '📋 Chung'}
                  </span>
                </div>
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
              <button className="btn-secondary !py-2 !px-3 !text-xs" onClick={() => { 
                setEditing(item); 
                setIsAllStaff(false);
                setForm({ 
                  title: item.title, 
                  content: item.content || '', 
                  org_type: item.org_type || 'all',
                  participant_department_ids: item.participant_department_ids || [], 
                  participant_position_ids: item.participant_position_ids || [], 
                  participant_neighborhood_ids: item.participant_neighborhood_ids || [], 
                  meeting_date: item.meeting_date, 
                  meeting_time: item.meeting_time, 
                  meeting_end_time: item.meeting_end_time || '11:00',
                  location: item.location 
                }); 
                setShowForm(true); 
              }}>
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
            <div className="flex items-center gap-3">
              <select className="input !py-1.5 !text-sm w-36" value={attendanceFilter} onChange={(e: any) => setAttendanceFilter(e.target.value)}>
                <option value="all">Tất cả ({attendance.length})</option>
                <option value="present">Đúng giờ ({attendance.filter(a => a.status === 'present').length})</option>
                <option value="late">Trễ ({attendance.filter(a => a.status === 'late').length})</option>
                <option value="absent">Vắng ({attendance.filter(a => a.status === 'absent').length})</option>
              </select>
              <button onClick={() => { setAttendanceTitle(''); setAttendance([]); setSelectedMeetingForAttendance(null); }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={16} className="text-brand-text/40" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {attendance.filter(item => attendanceFilter === 'all' || item.status === attendanceFilter).map((item) => (
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
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="font-mono text-sm font-semibold">{item.checkin_time ? formatTime(item.checkin_time) : '--:--'}</div>
                    <span className={`badge ${item.status === 'present' ? 'badge-success' : item.status === 'late' ? 'badge-warning' : 'badge-danger'} !text-[10px] !py-0.5 !px-2`}>
                      {item.status === 'present' ? 'Đúng giờ' : item.status === 'late' ? 'Đi trễ' : 'Vắng'}
                    </span>
                  </div>
                  {item.status !== 'absent' && (
                    <button 
                      onClick={() => cancelCheckin(item.staff_id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                      title="Hủy điểm danh"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {attendance.filter(item => attendanceFilter === 'all' || item.status === attendanceFilter).length === 0 && (
               <div className="text-center p-6 text-sm text-brand-text/50 font-medium">Không có dữ liệu phù hợp với bộ lọc hiện tại.</div>
            )}
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
