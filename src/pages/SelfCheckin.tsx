import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, Clock, FileText, Loader2, MapPin, QrCode, Search, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

export default function SelfCheckin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const meetingId = searchParams.get('meetingId');
  const [meeting, setMeeting] = useState<any>(null);
  const [status, setStatus] = useState<{ type: 'loading' | 'success' | 'error' | 'idle' | 'select-staff'; message: string }>({ type: 'loading', message: 'Đang tải thông tin...' });
  const { user, loading: authLoading } = useAuth();
  
  // Staff selection state (when email doesn't match any staff)
  const [allStaff, setAllStaff] = useState<any[]>([]);
  const [staffSearch, setStaffSearch] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  
  const showLogin = !authLoading && !user;

  useEffect(() => {
    if (!user || !meetingId) {
      if (!meetingId) setStatus({ type: 'error', message: 'Không tìm thấy thông tin cuộc họp.' });
      return;
    }

    Promise.all([
      supabase.from('meetings').select('*').eq('id', meetingId).single(),
      supabase.from('staff').select('id, full_name, staff_code, email').eq('status', 'active').order('full_name'),
    ]).then(([meetingRes, staffRes]) => {
      if (meetingRes.data && !meetingRes.error) {
        setMeeting(meetingRes.data);
        setAllStaff(staffRes.data || []);
        
        // Try auto-match by email
        if (user.staff_id) {
          // Already linked via AuthContext
          setStatus({ type: 'idle', message: '' });
        } else if (user.email) {
          const match = (staffRes.data || []).find((s: any) => s.email && s.email.toLowerCase() === user.email.toLowerCase());
          if (match) {
            setSelectedStaffId(match.id);
            setStatus({ type: 'idle', message: '' });
          } else {
            // No email match — ask staff to select themselves
            setStatus({ type: 'select-staff', message: 'Vui lòng chọn tên của bạn để điểm danh.' });
          }
        } else {
          setStatus({ type: 'select-staff', message: 'Vui lòng chọn tên của bạn để điểm danh.' });
        }
      } else {
        setStatus({ type: 'error', message: 'Cuộc họp không tồn tại hoặc đã bị xóa.' });
      }
    });
  }, [user, meetingId]);

  const handleConfirm = async (overrideStaffId?: number) => {
    setStatus({ type: 'loading', message: 'Đang xác thực danh tính...' });

    const staffId = overrideStaffId || selectedStaffId || user?.staff_id;

    if (!staffId) {
      setStatus({ type: 'error', message: 'Chưa xác định được nhân sự. Vui lòng chọn tên của bạn.' });
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

  const filteredStaff = allStaff.filter(s => 
    s.full_name.toLowerCase().includes(staffSearch.toLowerCase()) || 
    (s.staff_code || '').toLowerCase().includes(staffSearch.toLowerCase())
  );

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
      overflow: 'auto',
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
                <h2 className="text-xl font-bold text-brand-text mb-2">Thành công!</h2>
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
            ) : status.type === 'select-staff' ? (
              /* Staff selection mode — user picks their name */
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <User size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-brand-text">Chọn tên của bạn</h3>
                    <p className="text-[10px] text-brand-text/40">{status.message}</p>
                  </div>
                </div>

                {/* Meeting info */}
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 mb-4">
                  <p className="font-bold text-sm text-brand-text mb-1">{meeting?.title}</p>
                  <p className="text-[11px] text-brand-text/50">{meeting?.meeting_date} • {meeting?.meeting_time} • {meeting?.location}</p>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text/30" size={16} />
                  <input 
                    className="input pl-10 !text-sm" 
                    placeholder="Tìm tên hoặc mã nhân sự..." 
                    value={staffSearch} 
                    onChange={e => setStaffSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Staff list */}
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {filteredStaff.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => handleConfirm(s.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 hover:bg-indigo-50 hover:border-indigo-200 border-gray-100`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {s.full_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-brand-text truncate">{s.full_name}</div>
                        <div className="text-[10px] text-brand-text/40">{s.staff_code || '--'}</div>
                      </div>
                    </button>
                  ))}
                  {filteredStaff.length === 0 && (
                    <p className="text-center text-brand-text/30 text-xs py-6">Không tìm thấy nhân sự</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-bold text-brand-text">{meeting?.title}</h3>
                  
                  {/* Nội dung cuộc họp */}
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
                <button onClick={() => handleConfirm()} className="btn-primary w-full justify-center h-12 text-base">
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
