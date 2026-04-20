import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In Supabase, username might be matched to an email format or we use email directly.
      // Assuming for now the admin uses admin@example.com or we handle it via email.
      // If the user inputs "admin", we might need to suffix it if we set up emails that way, e.g. "admin@ubuntu.local" 
      // For general compatibility, let's assume they enter an email or we format it.
      const email = username.includes('@') ? username : `${username}@anphu.com`;
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(`Đăng nhập thất bại: ${authError.message}`);
      }
      // On success, AuthContext's onAuthStateChange will trigger and user will be populated, thus unmounting <Login />
    } catch {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg w-full min-h-screen flex items-center justify-center px-6">
      {/* Extra floating orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-float pointer-events-none" />

      <div className="login-card p-8 sm:p-10 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg overflow-hidden">
            <img alt="Logo" className="w-14 h-14 object-contain" src="/logo_an_phu_v4.png" />
          </div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">
            Hệ thống điểm danh
          </h1>
          <p className="text-sm text-white/60 mt-2 font-medium">UBND Phường An Phú</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/15 text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm border border-red-500/20 backdrop-blur-sm animate-fade-in">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="relative group">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors" />
            <input
              className="w-full bg-white/10 border border-white/15 text-white placeholder-white/40 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/10 transition-all"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/70 transition-colors" />
            <input
              className="w-full bg-white/10 border border-white/15 text-white placeholder-white/40 rounded-xl py-3.5 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/10 transition-all"
              placeholder="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider bg-white text-indigo-700 hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-indigo-700/30 border-t-indigo-700 rounded-full animate-spin" />
            ) : (
              <LogIn size={18} />
            )}
            <span>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/70 font-medium">
            Chưa có tài khoản?{' '}
            <button onClick={() => navigate(`/register${location.search}`)} className="text-white font-bold hover:underline">
              Đăng ký ngay
            </button>
          </p>
        </div>

        <p className="text-center text-white/30 text-xs mt-6 font-medium">
          © 2026 UBND Phường An Phú — Hệ thống nội bộ
        </p>
      </div>
    </div>
  );
}
