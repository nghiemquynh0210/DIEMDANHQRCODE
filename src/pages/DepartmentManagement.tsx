import React, { useEffect, useState } from 'react';
import { Building2, MapPinned, Plus, Shapes, Trash2, Users, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Department, Neighborhood, Position } from '../types';

export default function DepartmentManagement({
  onNavigateToStaff,
}: {
  onNavigateToStaff: (filters?: { departmentId?: string; neighborhoodId?: string; triggerAdd?: boolean }) => void;
}) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  // Inline add forms
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

  const addDept = async () => {
    if (!newDept.trim()) return;
    await supabase.from('departments').insert({ name: newDept.trim() });
    setNewDept('');
    load();
  };

  const addPos = async () => {
    if (!newPos.trim()) return;
    await supabase.from('positions').insert({ name: newPos.trim() });
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
    await supabase.from(table).delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/15">
          <Building2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-text">Cơ cấu tổ chức</h2>
          <p className="text-[11px] text-brand-text/40 font-medium">Quản lý phòng ban, chức vụ và khu phố tại một nơi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ── PHÒNG BAN ── */}
        <div className="card-no-hover flex flex-col">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <Building2 size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-text">Phòng ban</h3>
              <p className="text-[10px] text-brand-text/35 font-medium">{departments.length} đơn vị</p>
            </div>
          </div>

          {/* Quick add */}
          <div className="flex gap-2 mb-3">
            <input
              className="input text-sm flex-1"
              placeholder="Tên phòng ban mới..."
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addDept()}
            />
            <button onClick={addDept} className="btn-primary !py-2 !px-3 !rounded-lg shrink-0">
              <Plus size={16} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
            {departments.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 group transition-all">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-brand-text truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg"
                    title="Xem nhân sự"
                    onClick={() => onNavigateToStaff({ departmentId: String(item.id) })}
                  >
                    <Users size={13} />
                  </button>
                  <button
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                    onClick={() => remove('departments', item.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {departments.length === 0 && (
              <p className="text-center text-brand-text/30 text-xs py-6">Chưa có phòng ban</p>
            )}
          </div>
        </div>

        {/* ── KHU PHỐ ── */}
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

          {/* Quick add */}
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

          {/* List */}
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
                  <button
                    className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg"
                    title="Xem nhân sự"
                    onClick={() => onNavigateToStaff({ neighborhoodId: String(item.id) })}
                  >
                    <Users size={13} />
                  </button>
                  <button
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                    onClick={() => remove('neighborhoods', item.id)}
                  >
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

        {/* ── CHỨC VỤ ── */}
        <div className="card-no-hover flex flex-col">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white">
              <Shapes size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-text">Chức vụ</h3>
              <p className="text-[10px] text-brand-text/35 font-medium">{positions.length} chức danh</p>
            </div>
          </div>

          {/* Quick add */}
          <div className="flex gap-2 mb-3">
            <input
              className="input text-sm flex-1"
              placeholder="Tên chức vụ mới..."
              value={newPos}
              onChange={e => setNewPos(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPos()}
            />
            <button onClick={addPos} className="btn-primary !py-2 !px-3 !rounded-lg shrink-0 !from-cyan-500 !to-blue-500">
              <Plus size={16} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[400px] pr-1">
            {positions.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/30 group transition-all">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-brand-text truncate">{item.name}</span>
                </div>
                <button
                  className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => remove('positions', item.id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {positions.length === 0 && (
              <p className="text-center text-brand-text/30 text-xs py-6">Chưa có chức vụ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
