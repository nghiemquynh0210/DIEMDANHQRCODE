import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Camera, CameraOff, CheckCircle2, AlertCircle, QrCode, Loader2, CalendarDays, Clock, MapPin, Bell, BellRing } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Meeting } from '../types';

export default function StaffQRScanner() {
  const { user } = useAuth();
  const [cameraOn, setCameraOn] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'info' | 'loading'; message: string }>({ type: 'idle', message: '' });
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);
  const containerId = 'staff-qr-reader';

  // --- New: Upcoming meetings & staff info ---
  const [staffId, setStaffId] = useState<number | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<(Meeting & { checked?: boolean })[]>([]);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [reminder, setReminder] = useState<Meeting | null>(null);
  const reminderDismissedRef = useRef<Set<number>>(new Set());

  // Resolve staff_id from user email
  useEffect(() => {
    if (!user?.email) return;
    supabase.from('staff').select('id, department_id, position_id, neighborhood_id')
      .eq('email', user.email).maybeSingle()
      .then(({ data }) => {
        if (data) setStaffId(data.id);
      });
  }, [user]);

  // Load upcoming meetings for this staff
  const loadMeetings = useCallback(async () => {
    if (!staffId) return;
    const today = new Date().toISOString().split('T')[0];
    
    // Get staff profile to know their department/position/neighborhood
    const { data: staffProfile } = await supabase.from('staff')
      .select('department_id, position_id, neighborhood_id')
      .eq('id', staffId).single();
    if (!staffProfile) return;

    // Get meetings from today onwards
    const { data: meetings } = await supabase.from('meetings')
      .select('*')
      .gte('meeting_date', today)
      .order('meeting_date', { ascending: true })
      .order('meeting_time', { ascending: true });

    if (!meetings) return;

    // Filter meetings this staff is invited to
    const relevant = meetings.filter(m => {
      const depts = m.participant_department_ids || [];
      const positions = m.participant_position_ids || [];
      const neighborhoods = m.participant_neighborhood_ids || [];
      // If no filters set, all staff are invited
      if (!depts.length && !positions.length && !neighborhoods.length) return true;
      return depts.includes(staffProfile.department_id) ||
             positions.includes(staffProfile.position_id) ||
             neighborhoods.includes(staffProfile.neighborhood_id);
    });

    // Check which ones have been attended
    const { data: attendanceData } = await supabase.from('attendance')
      .select('meeting_id')
      .eq('staff_id', staffId)
      .in('meeting_id', relevant.map(m => m.id));

    const attendedSet = new Set((attendanceData || []).map(a => a.meeting_id));

    setUpcomingMeetings(relevant.map(m => ({ ...m, checked: attendedSet.has(m.id) })));
  }, [staffId]);

  useEffect(() => { loadMeetings(); }, [loadMeetings]);

  // --- 30-minute Reminder Logic ---
  useEffect(() => {
    if (!upcomingMeetings.length) return;

    const checkReminder = () => {
      const now = new Date();
      for (const m of upcomingMeetings) {
        if (m.checked) continue;
        if (reminderDismissedRef.current.has(m.id)) continue;
        
        const meetingDateTime = new Date(`${m.meeting_date}T${m.meeting_time}`);
        const diffMs = meetingDateTime.getTime() - now.getTime();
        const diffMin = diffMs / 60000;

        // Show reminder if meeting is within 30 minutes and hasn't started yet (or started within last 5 min)
        if (diffMin <= 30 && diffMin >= -5) {
          setReminder(m);
          // Try Browser Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`📋 Nhắc nhở cuộc họp`, {
              body: `"${m.title}" sẽ bắt đầu lúc ${m.meeting_time} tại ${m.location}`,
              icon: '/logo_an_phu_v4.png',
              tag: `meeting-${m.id}`,
            });
          }
          return;
        }
      }
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    checkReminder();
    const interval = setInterval(checkReminder, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [upcomingMeetings]);

  const dismissReminder = () => {
    if (reminder) reminderDismissedRef.current.add(reminder.id);
    setReminder(null);
  };

  // --- Confirm attendance manually (one-tap button) ---
  const confirmAttendance = async (meetingId: number) => {
    if (!staffId) {
      setStatus({ type: 'error', message: 'Tài khoản chưa liên kết hồ sơ cán bộ.' });
      return;
    }
    setConfirmingId(meetingId);
    try {
      const { data: existing } = await supabase.from('attendance')
        .select('id').eq('meeting_id', meetingId).eq('staff_id', staffId).maybeSingle();

      if (existing) {
        setStatus({ type: 'info', message: 'Bạn đã điểm danh cuộc họp này rồi!' });
        return;
      }

      const { error } = await supabase.from('attendance').insert({
        meeting_id: meetingId,
        staff_id: staffId,
        checkin_method: 'self',
      });

      if (error) {
        setStatus({ type: 'error', message: error.message });
      } else {
        setStatus({ type: 'success', message: 'Xác nhận điểm danh thành công!' });
        await loadMeetings();
      }
    } finally {
      setConfirmingId(null);
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
    }
  };

  // --- QR Scanner Logic (unchanged) ---
  const processQRText = async (decodedText: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      let meetingId: string | null = null;
      try {
        const url = new URL(decodedText);
        meetingId = url.searchParams.get('meetingId');
      } catch {
        if (/^\d+$/.test(decodedText)) meetingId = decodedText;
      }

      if (!meetingId) {
        setStatus({ type: 'error', message: 'Mã QR không chứa thông tin cuộc họp.' });
        setTimeout(() => { isProcessingRef.current = false; }, 2000);
        return;
      }

      const { data: meeting, error: meetingError } = await supabase
        .from('meetings').select('*').eq('id', meetingId).single();

      if (!meeting || meetingError) {
        setStatus({ type: 'error', message: 'Cuộc họp không tồn tại.' });
        setTimeout(() => { isProcessingRef.current = false; }, 2000);
        return;
      }

      if (!staffId) {
        setStatus({ type: 'error', message: 'Tài khoản chưa liên kết hồ sơ cán bộ.' });
        setTimeout(() => { isProcessingRef.current = false; }, 3000);
        return;
      }

      const { data: existing } = await supabase.from('attendance')
        .select('id').eq('meeting_id', meetingId).eq('staff_id', staffId).maybeSingle();

      if (existing) {
        setStatus({ type: 'info', message: `Bạn đã điểm danh "${meeting.title}" rồi!` });
        setTimeout(() => { isProcessingRef.current = false; }, 3000);
        return;
      }

      const { error: insertError } = await supabase.from('attendance').insert({
        meeting_id: Number(meetingId),
        staff_id: staffId,
        checkin_method: 'qr',
      });

      if (insertError) {
        setStatus({ type: 'error', message: insertError.message });
      } else {
        setStatus({ type: 'success', message: `Điểm danh "${meeting.title}" thành công!` });
        await loadMeetings();
        setTimeout(() => stopCamera(), 2000);
      }
    } finally {
      setTimeout(() => { isProcessingRef.current = false; }, 3000);
    }
  };

  const startCamera = async () => {
    setStatus({ type: 'idle', message: '' });
    setFallbackMode(false);
    try {
      const scanner = new Html5Qrcode(containerId, {
        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
        verbose: false
      });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 30, qrbox: { width: 280, height: 280 }, aspectRatio: 1.0, disableFlip: false },
        async (decodedText) => { await processQRText(decodedText); },
        () => {}
      );
      setCameraOn(true);
    } catch {
      setCameraOn(false);
      setFallbackMode(true);
      setStatus({ type: 'info', message: 'Zalo hoặc trình duyệt chặn Camera. Vui lòng bấm "Chụp ảnh QR" bên dưới.' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus({ type: 'loading', message: 'Đang xử lý ảnh...' });
    try {
      const scanner = new Html5Qrcode(containerId);
      const decodedText = await scanner.scanFile(file, true);
      await processQRText(decodedText);
      scanner.clear();
    } catch {
      setStatus({ type: 'error', message: 'Không thể nhận diện mã QR trong ảnh.' });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
    }
    setCameraOn(false);
  };

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted && !cameraOn && !scannerRef.current) startCamera();
    }, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
      if (scannerRef.current) { try { scannerRef.current.stop(); } catch {} }
    };
  }, []);

  const formatMeetingDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.getTime() === today.getTime()) return 'Hôm nay';
    if (d.getTime() === tomorrow.getTime()) return 'Ngày mai';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>

      {/* 🔔 Meeting Reminder Banner */}
      {reminder && (
        <div style={{
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          borderRadius: 16,
          padding: '14px 16px',
          marginBottom: 16,
          border: '2px solid #F59E0B',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          animation: 'fadeIn 0.3s ease',
        }}>
          <BellRing size={22} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#92400E', marginBottom: 4 }}>
              ⏰ Sắp tới giờ họp!
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#78350F', marginBottom: 4 }}>
              {reminder.title}
            </div>
            <div style={{ fontSize: 12, color: '#92400E', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {reminder.meeting_time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} /> {reminder.location}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button
                onClick={() => { confirmAttendance(reminder.id); dismissReminder(); }}
                style={{
                  padding: '8px 16px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                  background: '#059669', color: 'white', border: 'none', cursor: 'pointer',
                }}
              >
                ✅ Xác nhận điểm danh
              </button>
              <button
                onClick={dismissReminder}
                style={{
                  padding: '8px 16px', borderRadius: 10, fontWeight: 600, fontSize: 13,
                  background: 'rgba(0,0,0,0.08)', color: '#78350F', border: 'none', cursor: 'pointer',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '20px 16px', textAlign: 'center',
        marginBottom: 16, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          width: 52, height: 52, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
          color: 'white', boxShadow: '0 4px 12px rgba(79,70,229,0.2)',
        }}>
          <QrCode size={24} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: '0 0 4px' }}>Quét QR Điểm Danh</h2>
        <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Quét mã QR hoặc xác nhận điểm danh bên dưới</p>
      </div>

      {/* Camera Button */}
      {!fallbackMode ? (
        <button
          onClick={cameraOn ? stopCamera : startCamera}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '14px 20px', borderRadius: 14, fontWeight: 700, fontSize: 15,
            border: cameraOn ? '2px solid #FCA5A5' : 'none',
            background: cameraOn ? '#FEF2F2' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: cameraOn ? '#DC2626' : 'white', cursor: 'pointer',
            boxShadow: cameraOn ? 'none' : '0 8px 24px rgba(79,70,229,0.25)', marginBottom: 16,
          }}
        >
          {cameraOn ? <CameraOff size={20} /> : <Camera size={20} />}
          {cameraOn ? 'Tắt Camera' : 'Bật Camera Quét QR'}
        </button>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} ref={fileInputRef} style={{ display: 'none' }} />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '16px 20px', borderRadius: 14, fontWeight: 700, fontSize: 16,
              background: 'linear-gradient(135deg, #059669, #10B981)', color: 'white', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16,185,129,0.25)', border: 'none',
            }}
          >
            <Camera size={22} /> Chụp Ảnh Mã QR
          </button>
        </div>
      )}

      {/* Camera View */}
      {cameraOn && (
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '2px solid #c7d2fe', background: '#000', marginBottom: 16 }}>
          <div id={containerId} style={{ width: '100%', minHeight: 280 }} />
        </div>
      )}
      {!cameraOn && <div id={containerId} style={{ display: 'none' }} />}

      {/* Status */}
      {status.type !== 'idle' && (
        <div style={{
          padding: '12px 14px', borderRadius: 14, display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16,
          background: status.type === 'success' ? '#ECFDF5' : status.type === 'error' ? '#FEF2F2' : status.type === 'info' ? '#EFF6FF' : '#F9FAFB',
          color: status.type === 'success' ? '#059669' : status.type === 'error' ? '#DC2626' : status.type === 'info' ? '#2563EB' : '#6B7280',
          border: `1px solid ${status.type === 'success' ? '#A7F3D0' : status.type === 'error' ? '#FECACA' : status.type === 'info' ? '#BFDBFE' : '#E5E7EB'}`,
        }}>
          {status.type === 'success' && <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />}
          {status.type === 'error' && <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />}
          {status.type === 'loading' && <Loader2 size={18} style={{ flexShrink: 0, marginTop: 1, animation: 'spin 1s linear infinite' }} />}
          <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4 }}>{status.message}</span>
        </div>
      )}

      {/* 📋 Upcoming Meetings with Confirm Button */}
      {upcomingMeetings.length > 0 && (
        <div style={{
          background: 'white', borderRadius: 16, padding: 16, marginBottom: 16,
          border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <CalendarDays size={18} style={{ color: '#4F46E5' }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 }}>Cuộc họp sắp tới</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingMeetings.map(m => (
              <div
                key={m.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: m.checked ? '1px solid #A7F3D0' : '1px solid #E0E7FF',
                  background: m.checked ? '#ECFDF5' : '#EEF2FF',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14, color: m.checked ? '#065F46' : '#1e293b', marginBottom: 6 }}>
                  {m.title}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: m.checked ? '#047857' : '#6366F1', marginBottom: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarDays size={12} /> {formatMeetingDate(m.meeting_date)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {m.meeting_time}{m.meeting_end_time ? ` - ${m.meeting_end_time}` : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {m.location}
                  </span>
                </div>

                {m.checked ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#059669',
                  }}>
                    <CheckCircle2 size={16} /> Đã điểm danh
                  </div>
                ) : (
                  <button
                    onClick={() => confirmAttendance(m.id)}
                    disabled={confirmingId === m.id}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '10px 16px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                      background: confirmingId === m.id ? '#9CA3AF' : 'linear-gradient(135deg, #059669, #10B981)',
                      color: 'white', border: 'none', cursor: confirmingId === m.id ? 'wait' : 'pointer',
                      boxShadow: '0 4px 12px rgba(5,150,105,0.2)',
                    }}
                  >
                    {confirmingId === m.id ? (
                      <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Đang xử lý...</>
                    ) : (
                      <><CheckCircle2 size={16} /> Xác nhận điểm danh</>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions (only when no camera and no meetings) */}
      {!cameraOn && status.type === 'idle' && upcomingMeetings.length === 0 && (
        <div style={{
          background: 'white', borderRadius: 16, padding: 16,
          border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 10px' }}>Hướng dẫn:</h3>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 6px' }}>1. Bấm <strong>"Bật Camera Quét QR"</strong></p>
            <p style={{ margin: '0 0 6px' }}>2. Cho phép trình duyệt truy cập camera</p>
            <p style={{ margin: '0 0 6px' }}>3. Hướng camera vào mã QR cuộc họp</p>
            <p style={{ margin: 0 }}>4. Hoặc bấm <strong>"Xác nhận điểm danh"</strong> ở danh sách bên dưới</p>
          </div>
        </div>
      )}
    </div>
  );
}
