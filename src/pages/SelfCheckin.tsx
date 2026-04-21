import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, Clock, FileText, Loader2, MapPin, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

export default function SelfCheckin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const meetingId = searchParams.get('meetingId');
  const [meeting, setMeeting] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'loading' | 'success' | 'error' | 'idle'; message: string }>({ type: 'loading', message: 'Đang tải thông tin...' });
  const { user, loading: authLoading } = useAuth();
  
  const showLogin = !authLoading && !user;

  useEffect(() => {
    if (!user || !meetingId) {
      if (!meetingId) setStatus({ type: 'error', message: 'Không tìm thấy thông tin cuộc họp.' });
      return;
    }

    supabase.from('meetings').select('*').eq('id', meetingId).single()
      .then(({ data, error }) => {
        if (data && !error) {
          setMeeting(data);
          setStatus({ type: 'idle', message: '' });
        } else {
          setStatus({ type: 'error', message: 'Cuộc họp không tồn tại hoặc đã bị xóa.' });
        }
      });
  }, [user, meetingId]);

  const handleConfirm = async () => {
    setStatus({ type: 'loading', message: 'Đang xác thực danh tính...' });

    // AuthContext already resolved staff_id from email matching
    const staffId = user?.staff_id;

    if (!staffId) {
      setStatus({ type: 'error', message: 'Tài khoản của bạn chưa được liên kết với hồ sơ cán bộ. Vui lòng liên hệ quản trị viên.' });
      return;
    }
    
    const { error } = await supabase.from('attendance').upsert({
      meeting_id: meeting.id,
      staff_id: staffId,
      checkin_method: 'self',
    }, { onConflict: 'meeting_id,staff_id' });

    if (!error) {
      setStatus({ type: 'success', message: 'Điểm danh thành công.' });
    } else {
      setStatus({ type: 'error', message: error.message || 'Điểm danh thất bại.' });
    }
  };

  if (showLogin) return <Login />;

  if (status.type === 'loading') {
    return (
      <div style={{ background: 'linear-gradient(135deg, #312E81, #4C1D95, #6D28D9)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-white/70" />
          <span className="text-sm font-medium text-white/50">{status.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #312E81, #4C1D95, #6D28D9)',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            padding: '24px 20px',
            textAlign: 'center',
            color: 'white',
          }}>
            <div style={{
              width: 56, height: 56,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <QrCode size={28} />
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', margin: 0 }}>
              Xác nhận điểm danh
            </h1>
            <p style={{ fontSize: 13, opacity: 0.6, marginTop: 4, fontWeight: 500 }}>UBND Phường An Phú</p>
          </div>

          {/* Body */}
          <div style={{ padding: '24px 20px', background: 'rgba(255,255,255,0.92)' }}>
            {status.type === 'success' ? (
              <div className="text-center py-4 animate-fade-in-up">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-xl font-bold text-brand-text mb-1">Thành công!</h2>
                <p style={{ color: '#4F46E5', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{user?.username}</p>
                <p className="text-brand-text/50 text-sm mb-6">{status.message}</p>
                <button onClick={() => navigate('/')} className="btn-primary w-full justify-center h-12">
                  <span>Về trang chủ</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : status.type === 'error' ? (
              <div className="text-center py-4 animate-fade-in-up">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-brand-text mb-2">Lỗi</h2>
                <p className="text-brand-text/50 text-sm mb-6">{status.message}</p>
                <button onClick={() => navigate('/')} className="btn-secondary w-full justify-center h-12">
                  <span>Về trang chủ</span>
                </button>
              </div>
            ) : (
              <>
                {/* Staff identity */}
                <div style={{
                  textAlign: 'center',
                  padding: '14px 16px',
                  background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                  borderRadius: 14,
                  border: '1px solid #C7D2FE',
                  marginBottom: 20,
                }}>
                  <p style={{ fontSize: 12, color: '#6366F1', fontWeight: 600, marginBottom: 2 }}>Xin chào đồng chí</p>
                  {user?.position_name && (
                    <p style={{ fontSize: 14, color: '#4F46E5', fontWeight: 700, marginBottom: 2 }}>
                      {user.position_name}{user.department_name ? ` ${user.department_name}` : ''}
                    </p>
                  )}
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#1F2937', margin: 0 }}>{user?.username}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-bold text-brand-text">{meeting?.title}</h3>
                  
                  {meeting?.content && (
                    <div className="flex items-start gap-3 text-sm text-brand-text/60">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText size={15} className="text-purple-500" />
                      </div>
                      <span className="font-medium leading-relaxed">{meeting.content}</span>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-sm text-brand-text/60">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Calendar size={15} className="text-primary" />
                      </div>
                      <span className="font-medium">{meeting?.meeting_date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-brand-text/60">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Clock size={15} className="text-primary" />
                      </div>
                      <span className="font-medium">{meeting?.meeting_time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-brand-text/60">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <MapPin size={15} className="text-primary" />
                      </div>
                      <span className="font-medium">{meeting?.location}</span>
                    </div>
                  </div>
                </div>
                <button onClick={handleConfirm} className="btn-primary w-full justify-center h-12 text-base">
                  <CheckCircle2 size={20} />
                  <span className="font-bold">XÁC NHẬN ĐIỂM DANH</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
