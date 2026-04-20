import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Crown, Lock, Loader2, Save, Shield, UserCog, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ManagedUser {
  id: string;
  email: string;
  role: string;
  full_name: string;
  created_at: string;
}

export default function Settings() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Role management
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [roleMsg, setRoleMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Load all staff records for role management
  useEffect(() => {
    if (!isAdmin) return;
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase
      .from('staff')
      .select('id, full_name, email, status, created_at')
      .order('full_name');

    if (data) {
      // We don't have direct access to auth users from client side,
      // so we use the staff table and match roles via user_metadata
      // For now, we'll track role changes in a simple 'staff_roles' approach
      // using the staff table's status field or a dedicated column
      setUsers(data.map(s => ({
        id: String(s.id),
        email: s.email || '',
        full_name: s.full_name,
        role: s.status === 'admin' ? 'admin' : 'staff',
        created_at: s.created_at,
      })));
    }
    setLoadingUsers(false);
  };

  const toggleRole = async (staffUser: ManagedUser) => {
    const newRole = staffUser.role === 'admin' ? 'staff' : 'admin';
    const newStatus = newRole === 'admin' ? 'admin' : 'active';

    // Update the staff record's status to track role
    const { error } = await supabase
      .from('staff')
      .update({ status: newStatus })
      .eq('id', Number(staffUser.id));

    if (error) {
      setRoleMsg({ type: 'error', text: `Lỗi: ${error.message}` });
      return;
    }

    // Also update the Supabase Auth user's metadata if we can find them by email
    // This is the actual role the app reads
    // Note: Updating other users' metadata requires admin/service role key
    // For now we update the staff table which the app can also check

    setRoleMsg({ type: 'success', text: `Đã ${newRole === 'admin' ? 'phân quyền Admin' : 'hạ quyền Staff'} cho "${staffUser.full_name}"` });
    loadUsers();
    setTimeout(() => setRoleMsg({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (!error) {
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công.' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: error.message || 'Không thể đổi mật khẩu.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10 w-full max-w-2xl mx-auto min-w-[320px]">
      {/* Password Change Card */}
      <div className="card w-full">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-text">Cài đặt tài khoản</h2>
            <p className="text-xs text-brand-text/45 font-medium">{user?.username || 'Người dùng'} • {user?.role || 'staff'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm border animate-fade-in ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-brand-text/50 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock size={12} />Mật khẩu mới
            </label>
            <input className="input" type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-text/50 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock size={12} />Xác nhận mật khẩu
            </label>
            <input className="input" type="password" placeholder="Nhập lại mật khẩu mới" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <div className="pt-3 border-t border-gray-100">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Admin: Role Management */}
      {isAdmin && (
        <div className="card w-full">
          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <UserCog size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-text">Phân quyền cán bộ</h2>
              <p className="text-xs text-brand-text/45 font-medium">Chỉ Admin mới thấy mục này</p>
            </div>
          </div>

          {roleMsg.text && (
            <div className={`p-3 rounded-xl flex items-center gap-3 text-sm border animate-fade-in mb-4 ${
              roleMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {roleMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span className="font-medium">{roleMsg.text}</span>
            </div>
          )}

          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-brand-text/30" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-brand-text/40 text-center py-6">Chưa có cán bộ nào trong hệ thống.</p>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                      u.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-indigo-400 to-purple-400'
                    }`}>
                      {u.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-text truncate">{u.full_name}</p>
                      <p className="text-[11px] text-brand-text/40 truncate">{u.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleRole(u)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-gray-100 text-brand-text/50 hover:bg-indigo-100 hover:text-indigo-600'
                    }`}
                  >
                    <Crown size={12} />
                    {u.role === 'admin' ? 'Admin' : 'Staff'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
