import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, Flag, Landmark, KeyRound, Smartphone, User, Loader2, AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import { Department, Position, Neighborhood } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    // Chính quyền
    departmentId: '',
    positionId: '',
    // Đảng
    partyDepartmentId: '',
    partyPositionId: '',
    // Khu phố
    neighborhoodId: '',
  });

  useEffect(() => {
    supabase.from('departments').select('*').order('name').then(({ data }) => setDepartments(data || []));
    supabase.from('positions').select('*').order('name').then(({ data }) => setPositions(data || []));
    supabase.from('neighborhoods').select('*').order('name').then(({ data }) => setNeighborhoods(data || []));
  }, []);

  const partyDepts = departments.filter(d => d.org_type === 'party');
  const govDepts = departments.filter(d => d.org_type === 'government');
  const partyPositions = positions.filter(p => p.org_type === 'party');
  const govPositions = positions.filter(p => p.org_type === 'government');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: 'staff',
          }
        }
      });
      
      if (authError) throw authError;

      const staffPayload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        department_id: formData.departmentId ? Number(formData.departmentId) : null,
        position_id: formData.positionId ? Number(formData.positionId) : null,
        party_department_id: formData.partyDepartmentId ? Number(formData.partyDepartmentId) : null,
        party_position_id: formData.partyPositionId ? Number(formData.partyPositionId) : null,
        neighborhood_id: formData.neighborhoodId ? Number(formData.neighborhoodId) : null,
        status: 'active',
      };

      const session = authData?.session;
      if (session) {
        const { error: insertError } = await supabase.from('staff').insert(staffPayload);
        if (insertError) throw insertError;
        alert('Đăng ký thành công! Đang tự động đăng nhập...');
        navigate('/');
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email, password: formData.password
        });
        if (loginError) {
          setError('Tài khoản đã tạo nhưng cần xác nhận email. Vui lòng kiểm tra hộp thư hoặc liên hệ Admin.');
          return;
        }
        const { error: insertError } = await supabase.from('staff').insert(staffPayload);
        if (insertError) throw insertError;
        alert('Đăng ký thành công!');
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra khi đăng ký!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="card w-full min-w-[320px] max-w-lg relative z-10 p-4 sm:p-8">
        <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 text-brand-text/40 hover:text-brand-text transition-colors">
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-6 mt-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <UserPlus size={28} />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-brand-text">Đăng ký Cán bộ</h2>
          <p className="text-sm text-brand-text/50 font-medium mt-1">Tự động khai báo vào hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Thông tin cơ bản */}
          <div className="relative group">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
            <input required className="input pl-10" placeholder="Họ và tên đầy đủ" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
              <input required type="tel" className="input pl-10" placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="relative group">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
              <input required type="password" minLength={6} className="input pl-10" placeholder="Mật khẩu (≥6)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          <div className="relative group">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
            <input required type="email" className="input pl-10" placeholder="Email đăng nhập" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          {/* Đảng Section */}
          <div className="p-4 rounded-xl bg-red-50/60 border border-red-100 space-y-3">
            <div className="flex items-center gap-2">
              <Flag size={14} className="text-red-500" />
              <span className="text-sm font-bold text-red-700">Đảng ủy</span>
              <span className="text-[10px] text-red-400">(không bắt buộc)</span>
            </div>
            <select className="input !bg-white" value={formData.partyDepartmentId} onChange={e => setFormData({...formData, partyDepartmentId: e.target.value})}>
              <option value="">-- Chi bộ / Đơn vị Đảng --</option>
              {partyDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select className="input !bg-white" value={formData.partyPositionId} onChange={e => setFormData({...formData, partyPositionId: e.target.value})}>
              <option value="">-- Chức vụ Đảng --</option>
              {partyPositions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Chính quyền Section */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <Landmark size={14} className="text-indigo-500" />
              <span className="text-sm font-bold text-indigo-700">Chính quyền (UBND)</span>
              <span className="text-[10px] text-indigo-400">(không bắt buộc)</span>
            </div>
            <select className="input !bg-white" value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
              <option value="">-- Phòng ban / Đơn vị CQ --</option>
              {govDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select className="input !bg-white" value={formData.positionId} onChange={e => setFormData({...formData, positionId: e.target.value})}>
              <option value="">-- Chức vụ CQ --</option>
              {govPositions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Khu phố */}
          <div className="relative group">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
            <select className="input pl-10 appearance-none bg-white" value={formData.neighborhoodId} onChange={e => setFormData({...formData, neighborhoodId: e.target.value})}>
              <option value="">-- Chọn khu phố --</option>
              {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            Hoàn tất Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}
