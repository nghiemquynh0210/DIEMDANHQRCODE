import React, { useEffect, useState, useRef } from 'react';
import { Camera, CameraOff, CheckCircle2, AlertCircle, QrCode, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function StaffQRScanner() {
  const { user } = useAuth();
  const [cameraOn, setCameraOn] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'info' | 'loading'; message: string }>({ type: 'idle', message: '' });
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);
  const containerId = 'staff-qr-reader';

  const startCamera = async () => {
    setStatus({ type: 'idle', message: '' });
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
        async (decodedText) => {
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

            let staffId: string | null = null;
            if (user?.email) {
              const { data: staffMatch } = await supabase
                .from('staff').select('id').eq('email', user.email).maybeSingle();
              if (staffMatch) staffId = staffMatch.id;
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
              staff_id: Number(staffId),
              checkin_method: 'qr',
            });

            if (insertError) {
              setStatus({ type: 'error', message: insertError.message });
            } else {
              setStatus({ type: 'success', message: `Điểm danh "${meeting.title}" thành công!` });
              setTimeout(() => stopCamera(), 2000);
            }
          } finally {
            setTimeout(() => { isProcessingRef.current = false; }, 3000);
          }
        },
        () => {}
      );

      setCameraOn(true);
    } catch (err: any) {
      setStatus({ type: 'error', message: `Không thể mở camera: ${err.message || err}` });
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
    }
    setCameraOn(false);
  };

  useEffect(() => {
    return () => { if (scannerRef.current) { try { scannerRef.current.stop(); } catch {} } };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '20px 16px',
        textAlign: 'center',
        marginBottom: 16,
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          width: 52, height: 52,
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 10px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(79,70,229,0.2)',
        }}>
          <QrCode size={24} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: '0 0 4px' }}>Quét QR Điểm Danh</h2>
        <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Hướng camera vào mã QR cuộc họp</p>
      </div>

      {/* Camera Button */}
      <button
        onClick={cameraOn ? stopCamera : startCamera}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '14px 20px',
          borderRadius: 14,
          fontWeight: 700,
          fontSize: 15,
          border: cameraOn ? '2px solid #FCA5A5' : 'none',
          background: cameraOn ? '#FEF2F2' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          color: cameraOn ? '#DC2626' : 'white',
          cursor: 'pointer',
          boxShadow: cameraOn ? 'none' : '0 8px 24px rgba(79,70,229,0.25)',
          marginBottom: 16,
        }}
      >
        {cameraOn ? <CameraOff size={20} /> : <Camera size={20} />}
        {cameraOn ? 'Tắt Camera' : 'Bật Camera Quét QR'}
      </button>

      {/* Camera View */}
      {cameraOn && (
        <div style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: '2px solid #c7d2fe',
          background: '#000',
          marginBottom: 16,
        }}>
          <div id={containerId} style={{ width: '100%', minHeight: 280 }} />
        </div>
      )}

      {!cameraOn && <div id={containerId} style={{ display: 'none' }} />}

      {/* Status */}
      {status.type !== 'idle' && (
        <div style={{
          padding: '12px 14px',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 16,
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

      {/* Instructions */}
      {!cameraOn && status.type === 'idle' && (
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '16px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 10px' }}>Hướng dẫn:</h3>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 6px' }}>1. Bấm <strong>"Bật Camera Quét QR"</strong></p>
            <p style={{ margin: '0 0 6px' }}>2. Cho phép trình duyệt truy cập camera</p>
            <p style={{ margin: '0 0 6px' }}>3. Hướng camera vào mã QR cuộc họp</p>
            <p style={{ margin: 0 }}>4. Hệ thống tự động điểm danh cho bạn</p>
          </div>
        </div>
      )}
    </div>
  );
}
