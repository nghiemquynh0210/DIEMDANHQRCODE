import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, Building2, Briefcase, KeyRound, Smartphone, User, Loader2, AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
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
    departmentId: '',
    positionId: '',
    neighborhoodId: '',
    orgType: 'department' as 'department' | 'neighborhood'
  });

  // Load dropdown data natively via anon RLS policies
  useEffect(() => {
    supabase.from('departments').select('*').order('name').then(({ data }) => setDepartments(data || []));
    supabase.from('positions').select('*').order('name').then(({ data }) => setPositions(data || []));
    supabase.from('neighborhoods').select('*').order('name').then(({ data }) => setNeighborhoods(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Lookup names for selected IDs
      const dept = departments.find(d => d.id.toString() === formData.departmentId);
      const pos = positions.find(p => p.id.toString() === formData.positionId);
      const nb = neighborhoods.find(n => n.id.toString() === formData.neighborhoodId);

      // 1. Tạo account trong Supabase Auth
      // Lưu toàn bộ thông tin staff vào user_metadata để dùng khi insert staff sau
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

      // 2. Kiểm tra xem có session không (auto-confirm bật = có session ngay)
      // Nếu không có session (email confirmation bật), ta dùng service role hoặc chờ confirm
      const session = authData?.session;

      if (session) {
        // Có session -> Insert staff ngay
        const { error: insertError } = await supabase.from('staff').insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          department_id: dept?.id || null,
          position_id: pos?.id || null,
          neighborhood_id: nb?.id || null,
          status: 'active'
        });

        if (insertError) throw insertError;
        
        alert('Đăng ký thành công! Đang tự động đăng nhập...');
        navigate('/');
      } else {
        // Không có session -> Supabase yêu cầu xác nhận email
        // Vẫn thử insert staff bằng cách đăng nhập lại ngay
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (loginError) {
          // Nếu đăng nhập thất bại (do cần confirm email), thông báo cho user
          // Nhưng trước tiên thử tắt email confirm nếu project cho phép
          setError('Tài khoản đã tạo nhưng cần xác nhận email. Vui lòng kiểm tra hộp thư hoặc liên hệ Admin để kích hoạt tài khoản. Nếu dùng email giả, hãy vào Supabase Dashboard > Authentication > Settings > tắt "Confirm email".');
          return;
        }

        // Đăng nhập thành công -> Insert staff
        const { error: insertError } = await supabase.from('staff').insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          department_id: dept?.id || null,
          position_id: pos?.id || null,
          neighborhood_id: nb?.id || null,
          status: 'active'
        });

        if (insertError) throw insertError;

        alert('Đăng ký thành công! Đang tự động đăng nhập...');
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
      
      <div className="card w-full min-w-[320px] max-w-md relative z-10 p-4 sm:p-8">
        <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 text-brand-text/40 hover:text-brand-text transition-colors">
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-8 mt-2">
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

          <div className="grid grid-cols-1 gap-4">
            {/* Họ tên */}
            <div className="relative group">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
              <input required className="input pl-10" placeholder="Họ và tên đầy đủ" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>

            {/* SĐT + Mật khẩu */}
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

            {/* Email */}
            <div className="relative group">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
              <input required type="email" className="input pl-10" placeholder="Email đăng nhập" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            {/* Lựa chọn: Phòng ban hay Khu phố */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-brand-text/60 uppercase tracking-wider">Thuộc đơn vị</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, orgType: 'department', neighborhoodId: ''})}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    formData.orgType === 'department' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-brand-text/50 hover:border-gray-300'
                  }`}
                >
                  <Building2 size={16} />
                  Phòng ban
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, orgType: 'neighborhood', departmentId: ''})}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    formData.orgType === 'neighborhood' 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-brand-text/50 hover:border-gray-300'
                  }`}
                >
                  <MapPin size={16} />
                  Khu phố
                </button>
              </div>

              {formData.orgType === 'department' && (
                <div className="relative group animate-fade-in">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
                  <select required className="input pl-10 appearance-none bg-white" value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
                    <option value="" disabled>-- Chọn phòng ban --</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              )}

              {formData.orgType === 'neighborhood' && (
                <div className="relative group animate-fade-in">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
                  <select required className="input pl-10 appearance-none bg-white" value={formData.neighborhoodId} onChange={e => setFormData({...formData, neighborhoodId: e.target.value})}>
                    <option value="" disabled>-- Chọn khu phố --</option>
                    {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            
            {/* Chức vụ */}
            <div className="relative group">
              <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text/40" />
              <select className="input pl-10 appearance-none bg-white" value={formData.positionId} onChange={e => setFormData({...formData, positionId: e.target.value})}>
                <option value="">-- Chọn chức vụ (Không bắt buộc) --</option>
                {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
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
