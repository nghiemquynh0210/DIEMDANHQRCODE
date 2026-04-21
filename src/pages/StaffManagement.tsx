import React, { useEffect, useMemo, useState } from 'react';
import { Edit2, FileSpreadsheet, Plus, QrCode as QrIcon, Search, Trash2, X, UserCircle } from 'lucide-react';
import QRCode from 'qrcode';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';
import { Department, Neighborhood, Position, Staff } from '../types';

export default function StaffManagement({
  initialDepartmentId,
  initialNeighborhoodId,
  autoOpenAdd,
  onClearParams,
}: {
  initialDepartmentId?: string;
  initialNeighborhoodId?: string;
  autoOpenAdd?: boolean;
  onClearParams?: () => void;
}) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(initialDepartmentId || 'all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(initialNeighborhoodId || 'all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [qr, setQr] = useState<{ name: string; url: string } | null>(null);
  const [form, setForm] = useState({
    staff_code: '',
    full_name: '',
    position_id: '',
    department_id: initialDepartmentId || '',
    neighborhood_id: initialNeighborhoodId || '',
    phone: '',
    email: '',
    status: 'active',
    notes: '',
  });

  const token = localStorage.getItem('token');

  const load = async () => {
    try {
      const [
        { data: s },
        { data: d },
        { data: p },
        { data: n }
      ] = await Promise.all([
        supabase.from('staff').select('*, departments(name), positions(name), neighborhoods(name)').order('full_name'),
        supabase.from('departments').select('*'),
        supabase.from('positions').select('*'),
        supabase.from('neighborhoods').select('*'),
      ]);

      const mappedStaff = (s || []).map((item: any) => ({
        ...item,
        department_name: item.departments?.name || null,
        position_name: item.positions?.name || null,
        neighborhood_name: item.neighborhoods?.name || null,
      }));

      setStaff(mappedStaff);
      setDepartments(d || []);
      setPositions(p || []);
      setNeighborhoods(n || []);
    } catch (err) {
      console.error('Failed to load staff data:', err);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (autoOpenAdd) {
      setShowForm(true);
      onClearParams?.();
    }
  }, [autoOpenAdd, onClearParams]);

  const rows = useMemo(() => staff.filter((item) => {
    const q = searchTerm.toLowerCase();
    const hit = item.full_name.toLowerCase().includes(q) || (item.staff_code || '').toLowerCase().includes(q) || (item.position_name || '').toLowerCase().includes(q);
    const okDept = selectedDept === 'all' || String(item.department_id || '') === selectedDept;
    const okNeighborhood = selectedNeighborhood === 'all' || String(item.neighborhood_id || '') === selectedNeighborhood;
    return hit && okDept && okNeighborhood;
  }), [staff, searchTerm, selectedDept, selectedNeighborhood]);

  const reset = () => {
    setEditing(null);
    setForm({
      staff_code: '',
      full_name: '',
      position_id: '',
      department_id: initialDepartmentId || '',
      neighborhood_id: initialNeighborhoodId || '',
      phone: '',
      email: '',
      status: 'active',
      notes: '',
    });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      staff_code: form.staff_code || null,
      full_name: form.full_name,
      department_id: form.department_id ? Number(form.department_id) : null,
      position_id: form.position_id ? Number(form.position_id) : null,
      neighborhood_id: form.neighborhood_id ? Number(form.neighborhood_id) : null,
      phone: form.phone || '',
      email: form.email || '',
      status: form.status || 'active',
      notes: form.notes || '',
    };

    if (editing) {
      await supabase.from('staff').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('staff').insert(payload);
    }
    
    setShowForm(false);
    reset();
    load();
  };

  const remove = async (id: number) => {
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
      'Mã cán bộ': item.staff_code || '',
      'Họ và tên': item.full_name,
      'Chức danh': item.position_name || '',
      'Phòng ban': item.department_name || '',
      'Khu phố': item.neighborhood_name || '',
      'Số điện thoại': item.phone,
      Email: item.email,
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
    'from-indigo-500 to-purple-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-fuchsia-500',
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="space-y-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-primary transition-colors" size={18} />
          <input className="input pl-12 w-full" placeholder="Tìm tên, mã cán bộ, chức danh..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="input w-full sm:w-48 min-w-0" value={selectedDept} onChange={(event) => setSelectedDept(event.target.value)}>
            <option value="all">Tất cả phòng ban</option>
            {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select className="input w-full sm:w-48 min-w-0" value={selectedNeighborhood} onChange={(event) => setSelectedNeighborhood(event.target.value)}>
            <option value="all">Tất cả khu phố</option>
            {neighborhoods.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <div className="flex gap-3 ml-auto">
            <button className="btn-secondary" onClick={exportExcel}><FileSpreadsheet size={16} />Xuất Excel</button>
            <button className="btn-primary" onClick={() => { reset(); setShowForm(true); }}><Plus size={16} />Thêm nhân sự</button>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs font-medium text-brand-text/40">{rows.length} nhân sự</p>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="card animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-brand-text">{editing ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự mới'}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X size={18} className="text-brand-text/40" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Mã cán bộ" value={form.staff_code} onChange={(event) => setForm({ ...form, staff_code: event.target.value })} />
            <input className="input" placeholder="Họ và tên" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} required />
            <select className="input" value={form.position_id} onChange={(event) => setForm({ ...form, position_id: event.target.value })}>
              <option value="">Chọn chức danh</option>
              {positions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select className="input" value={form.department_id} onChange={(event) => setForm({ ...form, department_id: event.target.value })}>
              <option value="">Chọn phòng ban</option>
              {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select className="input" value={form.neighborhood_id} onChange={(event) => setForm({ ...form, neighborhood_id: event.target.value })}>
              <option value="">Chọn khu phố</option>
              {neighborhoods.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <input className="input" placeholder="Số điện thoại" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <input className="input" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <select className="input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng sử dụng</option>
            </select>
            <textarea className="input md:col-span-2 min-h-[80px]" placeholder="Ghi chú" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
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
              <th>Cơ cấu</th>
              <th className="hidden md:table-cell">Liên hệ</th>
              <th className="hidden sm:table-cell">Trạng thái</th>
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
                  <div className="text-sm">{item.position_name || '--'}</div>
                  <div className="text-[11px] text-brand-text/40">{item.department_name || '--'} / {item.neighborhood_name || '--'}</div>
                </td>
                <td className="hidden md:table-cell">
                  <div className="text-sm">{item.phone || '--'}</div>
                  <div className="text-[11px] text-brand-text/40">{item.email || '--'}</div>
                </td>
                <td className="hidden sm:table-cell">
                  <span className={`badge ${item.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {item.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-indigo-50 rounded-lg transition-colors" onClick={() => showQr(item)} title="QR Code">
                      <QrIcon size={15} className="text-brand-text/50" />
                    </button>
                    <button className="p-2 hover:bg-indigo-50 rounded-lg transition-colors" title="Chỉnh sửa" onClick={() => { setEditing(item); setForm({ staff_code: item.staff_code || '', full_name: item.full_name, position_id: item.position_id ? String(item.position_id) : '', department_id: item.department_id ? String(item.department_id) : '', neighborhood_id: item.neighborhood_id ? String(item.neighborhood_id) : '', phone: item.phone, email: item.email, status: item.status, notes: item.notes || '' }); setShowForm(true); }}>
                      <Edit2 size={15} className="text-brand-text/50" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" onClick={() => remove(item.id)} title="Xóa">
                      <Trash2 size={15} className="text-red-400" />
                    </button>
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-500/20">
              <QrIcon size={24} />
            </div>
            <h3 className="text-lg font-bold text-brand-text mb-4">{qr.name}</h3>
            <div className="p-3 bg-white rounded-2xl border border-gray-100 inline-block mb-4">
              <img src={qr.url} alt="QR" className="w-full max-w-[240px] mx-auto" />
            </div>
            <br />
            <button className="btn-secondary" onClick={() => setQr(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
