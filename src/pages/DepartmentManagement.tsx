import React, { useEffect, useState } from 'react';
import { Building2, Flag, Landmark, MapPinned, Plus, Shapes, Trash2, Users, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Department, Neighborhood, Position } from '../types';

type OrgTab = 'party' | 'government';

export default function DepartmentManagement({
  onNavigateToStaff,
}: {
  onNavigateToStaff: (filters?: { departmentId?: string; neighborhoodId?: string; triggerAdd?: boolean }) => void;
}) {
  const [activeTab, setActiveTab] = useState<OrgTab>('party');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  const [newDept, setNewDept] = useState('');
  const [newPos, setNewPos] = useState('');
  const [newNb, setNewNb] = useState('');

  const load = async () => {
    const [{ data: a }, { data: b }, { data: c }] = await Promise.all([
      supabase.from('departments').select('*').order('name'),
      supabase.from('positions').select('*').order('sort_order').order('name'),
      supabase.from('neighborhoods').select('*').order('name'),
    ]);
    setDepartments(a || []);
    setPositions(b || []);
    setNeighborhoods(c || []);
  };

  useEffect(() => { load(); }, []);

  const filteredDepts = departments.filter(d => d.org_type === activeTab);
  const filteredPositions = positions.filter(p => p.org_type === activeTab);

  const addDept = async () => {
    if (!newDept.trim()) return;
    await supabase.from('departments').insert({ name: newDept.trim(), org_type: activeTab });
    setNewDept('');
    load();
  };

  const addPos = async () => {
    if (!newPos.trim()) return;
    await supabase.from('positions').insert({ name: newPos.trim(), org_type: activeTab });
    setNewPos('');
    load();
  };

  const addNb = async () => {
    if (!newNb.trim()) return;
    await supabase.from('neighborhoods').insert({ name: newNb.trim() });
    setNewNb('');
    load();
  };

  const remove = async (table: string, id: number) => {
    if (!confirm('Xác nhận xóa?')) return;
    await supabase.from(table).delete().eq('id', id);
    load();
  };

  const isParty = activeTab === 'party';
  const tabColor = isParty ? 'red' : 'indigo';
  const deptLabel = isParty ? 'Chi bộ / Đơn vị Đảng' : 'Phòng ban / Đơn vị CQ';
  const posLabel = isParty ? 'Chức vụ Đảng' : 'Chức vụ Chính quyền';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/15">
          <Building2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-text">Cơ cấu tổ chức</h2>
          <p className="text-[11px] text-brand-text/40 font-medium">Quản lý đơn vị, chức vụ Đảng ủy & Chính quyền</p>
        </div>
      </div>

      {/* Tabs: Đảng ủy / UBND */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setActiveTab('party')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'party'
              ? 'bg-white text-red-600 shadow-sm border border-red-100'
              : 'text-brand-text/50 hover:text-brand-text/70'
          }`}
        >
          <Flag size={16} />
          Đảng ủy
        </button>
        <button
          onClick={() => setActiveTab('government')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'government'
              ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100'
              : 'text-brand-text/50 hover:text-brand-text/70'
          }`}
        >
          <Landmark size={16} />
          Chính quyền (UBND)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ── ĐƠN VỊ (filtered by org_type) ── */}
        <div className="card-no-hover flex flex-col">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isParty ? 'from-red-500 to-rose-500' : 'from-indigo-500 to-purple-500'} flex items-center justify-center text-white`}>
              <Building2 size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-text">{deptLabel}</h3>
              <p className="text-[10px] text-brand-text/35 font-medium">{filteredDepts.length} đơn vị</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              className="input text-sm flex-1"
              placeholder={isParty ? 'VD: Chi bộ Khối cơ quan...' : 'VD: Văn phòng UBND...'}
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addDept()}
            />
            <button onClick={addDept} className={`btn-primary !py-2 !px-3 !rounded-lg shrink-0 ${isParty ? '!from-red-500 !to-rose-500' : ''}`}>
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
            {filteredDepts.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-${tabColor}-200 hover:bg-${tabColor}-50/30 group transition-all`}>
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${isParty ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-brand-text truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className={`p-1.5 ${isParty ? 'text-red-500 hover:bg-red-50' : 'text-indigo-500 hover:bg-indigo-50'} rounded-lg`} title="Xem nhân sự" onClick={() => onNavigateToStaff({ departmentId: String(item.id) })}>
                    <Users size={13} />
                  </button>
                  <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg" onClick={() => remove('departments', item.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {filteredDepts.length === 0 && (
              <p className="text-center text-brand-text/30 text-xs py-6">Chưa có đơn vị {isParty ? 'Đảng' : 'CQ'}</p>
            )}
          </div>
        </div>

        {/* ── CHỨC VỤ (filtered by org_type) ── */}
        <div className="card-no-hover flex flex-col">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isParty ? 'from-orange-500 to-amber-500' : 'from-cyan-500 to-blue-500'} flex items-center justify-center text-white`}>
              <Shapes size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-text">{posLabel}</h3>
              <p className="text-[10px] text-brand-text/35 font-medium">{filteredPositions.length} chức danh</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              className="input text-sm flex-1"
              placeholder={isParty ? 'VD: Bí thư, Phó BT...' : 'VD: Chủ tịch, Trưởng phòng...'}
              value={newPos}
              onChange={e => setNewPos(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPos()}
            />
            <button onClick={addPos} className={`btn-primary !py-2 !px-3 !rounded-lg shrink-0 ${isParty ? '!from-orange-500 !to-amber-500' : '!from-cyan-500 !to-blue-500'}`}>
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
            {filteredPositions.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-${isParty ? 'orange' : 'cyan'}-200 hover:bg-${isParty ? 'orange' : 'cyan'}-50/30 group transition-all`}>
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${isParty ? 'bg-orange-50 text-orange-600' : 'bg-cyan-50 text-cyan-600'} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-brand-text truncate">{item.name}</span>
                </div>
                <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => remove('positions', item.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {filteredPositions.length === 0 && (
              <p className="text-center text-brand-text/30 text-xs py-6">Chưa có chức vụ {isParty ? 'Đảng' : 'CQ'}</p>
            )}
          </div>
        </div>

        {/* ── KHU PHỐ (shared) ── */}
        <div className="card-no-hover flex flex-col">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
              <MapPinned size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-text">Khu phố</h3>
              <p className="text-[10px] text-brand-text/35 font-medium">{neighborhoods.length} khu phố</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              className="input text-sm flex-1"
              placeholder="Tên khu phố mới..."
              value={newNb}
              onChange={e => setNewNb(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNb()}
            />
            <button onClick={addNb} className="btn-primary !py-2 !px-3 !rounded-lg shrink-0 !from-emerald-500 !to-teal-500">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
            {neighborhoods.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 group transition-all">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-brand-text truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg" title="Xem nhân sự" onClick={() => onNavigateToStaff({ neighborhoodId: String(item.id) })}>
                    <Users size={13} />
                  </button>
                  <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg" onClick={() => remove('neighborhoods', item.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {neighborhoods.length === 0 && (
              <p className="text-center text-brand-text/30 text-xs py-6">Chưa có khu phố</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
