import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Lock, Save, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    setLoading(true);
    
    // Supabase auth auto uses the current session token to update user
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

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
      <div className="card w-full">
        {/* Header */}
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
            <input className="input" type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          </div>

          <div>
            <label className="text-xs font-bold text-brand-text/50 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock size={12} />Xác nhận mật khẩu
            </label>
            <input className="input" type="password" placeholder="Nhập lại mật khẩu mới" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </div>

          <div className="pt-3 border-t border-gray-100">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
