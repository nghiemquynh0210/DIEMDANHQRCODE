import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, Clock, Loader2, MapPin, QrCode } from 'lucide-react';
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

    // Step 1: Link Auth Account to Physical Staff Record via Email
    let staffId = user?.staff_id;
    
    if (!staffId && user?.email) {
      const { data: staffMatch } = await supabase
        .from('staff')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();
        
      if (staffMatch) {
         staffId = staffMatch.id;
      }
    }

    if (!staffId) {
      setStatus({ type: 'error', message: 'Tài khoản của bạn chưa được liên kết với hồ sơ cán bộ nào.' });
      return;
    }
    
    // Check if already checked in
    const { data: existing } = await supabase.from('attendance')
      .select('id')
      .eq('meeting_id', meeting.id)
      .eq('staff_id', staffId)
      .maybeSingle();
      
    if (existing) {
      setStatus({ type: 'error', message: 'Bạn đã điểm danh cuộc họp này rồi.' });
      return;
    }

    const { error } = await supabase.from('attendance').insert({
      meeting_id: meeting.id,
      staff_id: staffId,
      checkin_method: 'self',
    });

    if (!error) {
      setStatus({ type: 'success', message: 'Điểm danh thành công.' });
    } else {
      setStatus({ type: 'error', message: error.message || 'Điểm danh thất bại.' });
    }
  };

  if (showLogin) return <Login />;

  if (status.type === 'loading') {
    return (
      <div className="login-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-white/70" />
          <span className="text-sm font-medium text-white/50">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="login-bg w-full min-h-screen flex flex-col justify-center p-6 font-sans">
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="login-card overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                <QrCode size={32} />
              </div>
              <h1 className="text-xl font-bold uppercase tracking-tight">Xác nhận điểm danh</h1>
              <p className="text-sm text-white/60 mt-1 font-medium">UBND Phường An Phú</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 bg-white/90 backdrop-blur-sm">
            {status.type === 'success' ? (
              <div className="text-center py-4 animate-fade-in-up">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-xl font-bold text-brand-text mb-2">Thành công!</h2>
                <p className="text-brand-text/50 text-sm mb-8">{status.message}</p>
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
                <p className="text-brand-text/50 text-sm mb-8">{status.message}</p>
                <button onClick={() => navigate('/')} className="btn-secondary w-full justify-center h-12">
                  <span>Về trang chủ</span>
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-bold text-brand-text">{meeting?.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-brand-text/60">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Calendar size={15} className="text-primary" />
                      </div>
                      <span className="font-medium">{meeting?.meeting_date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-brand-text/60">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Clock size={15} className="text-primary" />
                      </div>
                      <span className="font-medium">{meeting?.meeting_time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-brand-text/60">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
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
