import React, { useEffect, useMemo, useState } from 'react';
import { Edit2, FileSpreadsheet, Flag, Landmark, Plus, QrCode as QrIcon, Search, Trash2, X } from 'lucide-react';
import QRCode from 'qrcode';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';
import { Department, Position, Staff } from '../types';

export default function StaffManagement({
  initialDepartmentId,
  autoOpenAdd,
  onClearParams,
}: {
  initialDepartmentId?: string;
  autoOpenAdd?: boolean;
  onClearParams?: () => void;
}) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(initialDepartmentId || 'all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [qr, setQr] = useState<{ name: string; url: string } | null>(null);
  const [form, setForm] = useState({
    staff_code: '', full_name: '',
    position_id: '', department_id: initialDepartmentId || '',
    party_position_id: '', party_department_id: '',
    phone: '', email: '', status: 'active', notes: '',
  });

  const load = async () => {
    try {
      const [{ data: s }, { data: d }, { data: p }] = await Promise.all([
        supabase.from('staff').select(`
          *, departments:department_id(name), positions:position_id(name),
          party_departments:party_department_id(name), party_positions:party_position_id(name)
        `).order('full_name'),
        supabase.from('departments').select('*').order('name'),
        supabase.from('positions').select('*').order('sort_order').order('name')
      ]);
      const mappedStaff = (s || []).map((item: any) => ({
        ...item,
        department_name: item.departments?.name || null,
        position_name: item.positions?.name || null,
        party_department_name: item.party_departments?.name || null,
        party_position_name: item.party_positions?.name || null,
      }));
      setStaff(mappedStaff);
      setDepartments(d || []);
      setPositions(p || []);
    } catch (err) {
      console.error('Failed to load staff data:', err);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (autoOpenAdd) { setShowForm(true); onClearParams?.(); }
  }, [autoOpenAdd, onClearParams]);

  const partyPositions = positions.filter(p => p.org_type === 'party');
  const govPositions = positions.filter(p => p.org_type === 'government');

  const partyDepts = departments.filter(d => d.org_type === 'party');
  const govDepts = departments.filter(d => d.org_type === 'government');

  const rows = useMemo(() => staff.filter((item) => {
    const q = searchTerm.toLowerCase();
    const hit = item.full_name.toLowerCase().includes(q) ||
      (item.staff_code || '').toLowerCase().includes(q) ||
      (item.position_name || '').toLowerCase().includes(q) ||
      (item.party_position_name || '').toLowerCase().includes(q);
    const okDept = selectedDept === 'all' || [item.department_id, item.party_department_id].map(String).includes(selectedDept);
    return hit && okDept;
  }), [staff, searchTerm, selectedDept]);

  const reset = () => {
    setEditing(null);
    setForm({
      staff_code: '', full_name: '', position_id: '', department_id: initialDepartmentId || '',
      party_position_id: '', party_department_id: '',
      phone: '', email: '', status: 'active', notes: '',
    });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      staff_code: form.staff_code || null, full_name: form.full_name,
      department_id: form.department_id ? Number(form.department_id) : null,
      position_id: form.position_id ? Number(form.position_id) : null,
      party_department_id: form.party_department_id ? Number(form.party_department_id) : null,
      party_position_id: form.party_position_id ? Number(form.party_position_id) : null,
      phone: form.phone || '', email: form.email || '',
      status: form.status || 'active', notes: form.notes || '',
    };
    if (editing) { await supabase.from('staff').update(payload).eq('id', editing.id); }
    else { await supabase.from('staff').insert(payload); }
    setShowForm(false); reset(); load();
  };

  const remove = async (id: number) => {
    if (!confirm('Xác nhận xóa?')) return;
    await supabase.from('users').delete().eq('staff_id', id);
    await supabase.from('staff').delete().eq('id', id);
    load();
  };

  const showQr = async (item: Staff) => {
    const url = await QRCode.toDataURL(String(item.id), { width: 280, margin: 2 });
    setQr({ name: item.full_name, url });
  };

  const exportExcel = () => {
    const data = rows.map((item) => ({
      'Mã CB': item.staff_code || '', 'Họ tên': item.full_name,
      'CV Đảng': item.party_position_name || '', 'Chi bộ': item.party_department_name || '',
      'CV CQ': item.position_name || '', 'Phòng ban': item.department_name || '',
      'SĐT': item.phone,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nhân sự');
    XLSX.writeFile(wb, 'Danh_sach_nhan_su_An_Phu.xlsx');
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0].charAt(0) + parts[parts.length - 1].charAt(0) : name.charAt(0);
  };

  const avatarColors = [
    'from-indigo-500 to-purple-500', 'from-cyan-500 to-blue-500', 'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500', 'from-pink-500 to-rose-500', 'from-violet-500 to-fuchsia-500',
  ];

  const startEdit = (item: Staff) => {
    setEditing(item);
    setForm({
      staff_code: item.staff_code || '', full_name: item.full_name,
      position_id: item.position_id ? String(item.position_id) : '',
      department_id: item.department_id ? String(item.department_id) : '',
      party_position_id: item.party_position_id ? String(item.party_position_id) : '',
      party_department_id: item.party_department_id ? String(item.party_department_id) : '',
      phone: item.phone || '', email: item.email || '', status: item.status, notes: item.notes || '',
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="space-y-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-primary transition-colors" size={18} />
          <input className="input pl-12 w-full" placeholder="Tìm tên, mã, chức vụ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="input w-full sm:w-48 min-w-0" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
            <option value="all">Tất cả đơn vị</option>
            <optgroup label="🚩 Đảng ủy">{partyDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
            <optgroup label="🏢 Chính quyền">{govDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>

          </select>
          <div className="flex gap-3 ml-auto">
            <button className="btn-secondary" onClick={exportExcel}><FileSpreadsheet size={16} />Xuất Excel</button>
            <button className="btn-primary" onClick={() => { reset(); setShowForm(true); }}><Plus size={16} />Thêm nhân sự</button>
          </div>
        </div>
      </div>

      <p className="text-xs font-medium text-brand-text/40">{rows.length} nhân sự</p>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="card animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-brand-text">{editing ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự mới'}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={18} className="text-brand-text/40" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Mã cán bộ" value={form.staff_code} onChange={e => setForm({ ...form, staff_code: e.target.value })} />
            <input className="input" placeholder="Họ và tên" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
            <input className="input" placeholder="SĐT" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          {/* Đảng */}
          <div className="mt-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
            <div className="flex items-center gap-2 mb-3"><Flag size={14} className="text-red-500" /><span className="text-sm font-bold text-red-700">Đảng ủy</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className="input !bg-white" value={form.party_department_id} onChange={e => setForm({ ...form, party_department_id: e.target.value })}>
                <option value="">-- Chi bộ / Đơn vị Đảng --</option>
                {partyDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select className="input !bg-white" value={form.party_position_id} onChange={e => setForm({ ...form, party_position_id: e.target.value })}>
                <option value="">-- Chức vụ Đảng --</option>
                {partyPositions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* CQ */}
          <div className="mt-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3"><Landmark size={14} className="text-indigo-500" /><span className="text-sm font-bold text-indigo-700">Chính quyền (UBND)</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className="input !bg-white" value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                <option value="">-- Phòng ban / Đơn vị CQ --</option>
                {govDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select className="input !bg-white" value={form.position_id} onChange={e => setForm({ ...form, position_id: e.target.value })}>
                <option value="">-- Chức vụ CQ --</option>
                {govPositions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>


          {/* Trạng thái */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Đang hoạt động</option><option value="inactive">Ngừng sử dụng</option></select>
            <textarea className="input md:col-span-2 min-h-[80px]" placeholder="Ghi chú" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-gray-100">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Đóng</button>
            <button className="btn-primary">{editing ? 'Lưu thay đổi' : 'Thêm mới'}</button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Nhân sự</th>
              <th>Đảng</th>
              <th>Chính quyền</th>


              <th className="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={item.id} className="group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                      {getInitials(item.full_name)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.full_name}</div>
                      <div className="text-[11px] text-brand-text/40 font-mono">{item.staff_code || `ID-${item.id}`}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">{item.party_position_name || <span className="text-brand-text/20">--</span>}</div>
                  <div className="text-[11px] text-brand-text/40">{item.party_department_name || ''}</div>
                </td>
                <td>
                  <div className="text-sm">{item.position_name || <span className="text-brand-text/20">--</span>}</div>
                  <div className="text-[11px] text-brand-text/40">{item.department_name || ''}</div>
                </td>


                <td>
                  <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-indigo-50 rounded-lg" onClick={() => showQr(item)} title="QR"><QrIcon size={15} className="text-brand-text/50" /></button>
                    <button className="p-2 hover:bg-indigo-50 rounded-lg" title="Sửa" onClick={() => startEdit(item)}><Edit2 size={15} className="text-brand-text/50" /></button>
                    <button className="p-2 hover:bg-red-50 rounded-lg" onClick={() => remove(item.id)} title="Xóa"><Trash2 size={15} className="text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Modal */}
      {qr && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-500/20"><QrIcon size={24} /></div>
            <h3 className="text-lg font-bold text-brand-text mb-4">{qr.name}</h3>
            <div className="p-3 bg-white rounded-2xl border border-gray-100 inline-block mb-4"><img src={qr.url} alt="QR" className="w-full max-w-[240px] mx-auto" /></div>
            <br /><button className="btn-secondary" onClick={() => setQr(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
