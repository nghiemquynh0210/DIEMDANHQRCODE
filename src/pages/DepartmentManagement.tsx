import React, { useEffect, useState } from 'react';
import { Building2, Check, Flag, Landmark, Pencil, Plus, Shapes, Trash2, Users, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Department, Position } from '../types';

type OrgTab = 'party' | 'government';

const TAB_CONFIG = {
  party:      { label: 'Đảng ủy',    icon: Flag,          deptLabel: 'Chi bộ / Đơn vị Đảng', posLabel: 'Chức vụ Đảng',       deptPH: 'VD: Chi bộ cơ quan...',     posPH: 'VD: Bí thư, Phó BT...',     color: 'red',     gradient: 'from-red-500 to-rose-500',     posGradient: 'from-orange-500 to-amber-500' },
  government: { label: 'Chính quyền', icon: Landmark,      deptLabel: 'Phòng ban / Đơn vị CQ', posLabel: 'Chức vụ Chính quyền', deptPH: 'VD: Văn phòng UBND...',     posPH: 'VD: Chủ tịch, Trưởng KP...', color: 'indigo',  gradient: 'from-indigo-500 to-purple-500', posGradient: 'from-cyan-500 to-blue-500' },

};

export default function DepartmentManagement({
  onNavigateToStaff,
}: {
  onNavigateToStaff: (filters?: { departmentId?: string; triggerAdd?: boolean }) => void;
}) {
  const [activeTab, setActiveTab] = useState<OrgTab>('party');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [newDept, setNewDept] = useState('');
  const [newPos, setNewPos] = useState('');

  // Inline edit state
  const [editingId, setEditingId] = useState<{ table: string; id: number } | null>(null);
  const [editingName, setEditingName] = useState('');

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<{ table: string; id: number; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showForceDelete, setShowForceDelete] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    const [{ data: a }, { data: b }] = await Promise.all([
      supabase.from('departments').select('*').order('name'),
      supabase.from('positions').select('*').order('sort_order').order('name')
    ]);
    setDepartments(a || []);
    setPositions(b || []);
  };

  useEffect(() => { load(); }, []);

  const cfg = TAB_CONFIG[activeTab];
  const filteredDepts = departments.filter(d => d.org_type === activeTab);
  const filteredPositions = positions.filter(p => p.org_type === activeTab);

  const addDept = async () => {
    if (!newDept.trim()) return;
    const { error } = await supabase.from('departments').insert({ name: newDept.trim(), org_type: activeTab });
    if (error) { console.error(error); showToast('Lỗi khi thêm đơn vị: ' + error.message, 'error'); return; }
    setNewDept('');
    load();
  };
  const addPos = async () => {
    if (!newPos.trim()) return;
    const { error } = await supabase.from('positions').insert({ name: newPos.trim(), org_type: activeTab });
    if (error) { console.error(error); showToast('Lỗi khi thêm chức vụ: ' + error.message, 'error'); return; }
    setNewPos('');
    load();
  };

  // Step 1: user clicks delete → show confirmation modal
  const requestDelete = (table: string, id: number, name: string) => {
    setDeleteTarget({ table, id, name });
    setDeleteError(null);
    setShowForceDelete(false);
  };

  // Step 2: user confirms → attempt delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);

    const { table, id } = deleteTarget;
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) {
      if (error.code === '23503') {
        // Foreign key constraint — ask user to force-decouple
        setShowForceDelete(true);
        setDeleteError('Đang có nhân sự giữ chức vụ hoặc công tác tại đơn vị này.');
        setDeleteLoading(false);
        return;
      } else {
        setDeleteError('Lỗi khi xóa: ' + error.message);
        setDeleteLoading(false);
        return;
      }
    }

    showToast(`Đã xóa "${deleteTarget.name}" thành công!`);
    setDeleteTarget(null);
    setDeleteLoading(false);
    load();
  };

  // Step 3 (optional): user force-decouples staff then deletes
  const forceDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    const { table, id } = deleteTarget;
    if (table === 'positions') {
      await supabase.from('staff').update({ position_id: null }).eq('position_id', id);
      await supabase.from('staff').update({ party_position_id: null }).eq('party_position_id', id);
    } else if (table === 'departments') {
      await supabase.from('staff').update({ department_id: null }).eq('department_id', id);
      await supabase.from('staff').update({ party_department_id: null }).eq('party_department_id', id);
    }

    const { error: finalErr } = await supabase.from(table).delete().eq('id', id);
    if (finalErr) {
      setDeleteError('Vẫn báo lỗi sau khi gỡ: ' + finalErr.message);
      setDeleteLoading(false);
      return;
    }

    showToast(`Đã xóa "${deleteTarget.name}" thành công!`);
    setDeleteTarget(null);
    setDeleteLoading(false);
    setShowForceDelete(false);
    load();
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
    setDeleteError(null);
    setShowForceDelete(false);
  };

  const startEdit = (table: string, id: number, name: string) => {
    setEditingId({ table, id });
    setEditingName(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async () => {
    if (!editingId || !editingName.trim()) return;
    const { error } = await supabase.from(editingId.table).update({ name: editingName.trim() }).eq('id', editingId.id);
    if (error) {
      console.error(error);
      showToast('Lỗi khi lưu: ' + error.message, 'error');
      return;
    }
    cancelEdit();
    load();
  };

  const isEditing = (table: string, id: number) => editingId?.table === table && editingId?.id === id;

  // Reusable item renderer
  const renderItem = (item: { id: number; name: string }, table: string, colorClass: string, showStaffBtn?: boolean, staffFilter?: object) => (
    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50/80 transition-all">
      {isEditing(table, item.id) ? (
        <>
          <input
            className="input text-sm flex-1 mr-2 !py-1.5"
            value={editingName}
            onChange={e => setEditingName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
            autoFocus
          />
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg" onClick={saveEdit} title="Lưu"><Check size={14} /></button>
            <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg" onClick={cancelEdit} title="Hủy"><X size={14} /></button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={`w-7 h-7 rounded-lg ${colorClass} flex items-center justify-center text-[10px] font-bold shrink-0`}>
              {item.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-brand-text truncate">{item.name}</span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            {showStaffBtn && (
              <button className="p-1.5 text-indigo-400 hover:bg-indigo-50 rounded-lg" title="Xem nhân sự" onClick={() => onNavigateToStaff(staffFilter)}>
                <Users size={13} />
              </button>
            )}
            <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg" title="Sửa" onClick={() => startEdit(table, item.id, item.name)}>
              <Pencil size={13} />
            </button>
            <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg" title="Xóa" onClick={() => requestDelete(table, item.id, item.name)}>
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/15">
          <Building2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-text">Cơ cấu tổ chức</h2>
          <p className="text-[11px] text-brand-text/40 font-medium">Quản lý đơn vị, chức vụ Đảng ủy, Chính quyền</p>
        </div>
      </div>

      {/* 2 Tabs */}
      <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
        {(['party', 'government'] as OrgTab[]).map(tab => {
          const t = TAB_CONFIG[tab];
          const Icon = t.icon;
          const isActive = activeTab === tab;
          const colorMap: Record<string, string> = { red: 'text-red-600 border-red-100', indigo: 'text-indigo-600 border-indigo-100', emerald: 'text-emerald-600 border-emerald-100' };
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isActive ? `bg-white shadow-sm ${colorMap[t.color] || ''} border` : 'text-brand-text/40 hover:text-brand-text/60'
              }`}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        {/* ── ĐƠN VỊ ── */}
        <div className="card-no-hover flex flex-col">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white`}>
              <Building2 size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-text">{cfg.deptLabel}</h3>
              <p className="text-[10px] text-brand-text/35 font-medium">{filteredDepts.length} đơn vị</p>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <input className="input text-sm flex-1" placeholder={cfg.deptPH} value={newDept} onChange={e => setNewDept(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDept()} />
            <button onClick={addDept} className={`btn-primary !py-2 !px-3 !rounded-lg shrink-0 !${cfg.gradient}`}><Plus size={16} /></button>
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
            {filteredDepts.map(item => renderItem(item, 'departments', `bg-${cfg.color}-50 text-${cfg.color}-600`, true, { departmentId: String(item.id) }))}
            {filteredDepts.length === 0 && (<p className="text-center text-brand-text/30 text-xs py-6">Chưa có đơn vị</p>)}
          </div>
        </div>

        {/* ── CHỨC VỤ ── */}
        <div className="card-no-hover flex flex-col">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.posGradient} flex items-center justify-center text-white`}><Shapes size={16} /></div>
            <div>
              <h3 className="font-bold text-sm text-brand-text">{cfg.posLabel}</h3>
              <p className="text-[10px] text-brand-text/35 font-medium">{filteredPositions.length} chức danh</p>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <input className="input text-sm flex-1" placeholder={cfg.posPH} value={newPos} onChange={e => setNewPos(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPos()} />
            <button onClick={addPos} className={`btn-primary !py-2 !px-3 !rounded-lg shrink-0 !${cfg.posGradient}`}><Plus size={16} /></button>
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
            {filteredPositions.map(item => renderItem(item, 'positions', `bg-${cfg.color}-50 text-${cfg.color}-600`))}
            {filteredPositions.length === 0 && (<p className="text-center text-brand-text/30 text-xs py-6">Chưa có chức vụ</p>)}
          </div>
        </div>
      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-brand-text">Xác nhận xóa</h3>
                <p className="text-xs text-brand-text/50">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-50 border border-red-100 mb-4">
              <p className="text-sm text-brand-text">
                Bạn có chắc chắn muốn xóa <strong>"{deleteTarget.name}"</strong>?
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 mb-4">
                <p className="text-sm text-amber-800 font-medium">{deleteError}</p>
                {showForceDelete && (
                  <p className="text-xs text-amber-600 mt-1">Bạn có muốn gỡ bỏ chức vụ/đơn vị này khỏi các nhân sự để tiếp tục xóa?</p>
                )}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                className="btn-secondary !py-2 !px-4 !text-sm"
                onClick={cancelDelete}
                disabled={deleteLoading}
              >
                Hủy
              </button>
              {showForceDelete ? (
                <button
                  className="btn-primary !py-2 !px-4 !text-sm !bg-red-500 hover:!bg-red-600"
                  onClick={forceDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Đang xóa...' : 'Gỡ nhân sự & Xóa'}
                </button>
              ) : (
                <button
                  className="btn-primary !py-2 !px-4 !text-sm !bg-red-500 hover:!bg-red-600"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-fade-in-up ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
