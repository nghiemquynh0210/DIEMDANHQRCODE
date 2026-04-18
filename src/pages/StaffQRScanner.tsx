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
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        async (decodedText) => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;

          try {
            // Parse the QR URL to find meetingId
            let meetingId: string | null = null;
            try {
              const url = new URL(decodedText);
              meetingId = url.searchParams.get('meetingId');
            } catch {
              // Not a URL, maybe just the meetingId itself
              if (/^\d+$/.test(decodedText)) {
                meetingId = decodedText;
              }
            }

            if (!meetingId) {
              setStatus({ type: 'error', message: 'Mã QR không chứa thông tin cuộc họp.' });
              setTimeout(() => { isProcessingRef.current = false; }, 2000);
              return;
            }

            // Get meeting info
            const { data: meeting, error: meetingError } = await supabase
              .from('meetings').select('*').eq('id', meetingId).single();

            if (!meeting || meetingError) {
              setStatus({ type: 'error', message: 'Cuộc họp không tồn tại hoặc đã bị xóa.' });
              setTimeout(() => { isProcessingRef.current = false; }, 2000);
              return;
            }

            // Find staff by email
            let staffId: string | null = null;
            if (user?.email) {
              const { data: staffMatch } = await supabase
                .from('staff').select('id').eq('email', user.email).maybeSingle();
              if (staffMatch) staffId = staffMatch.id;
            }

            if (!staffId) {
              setStatus({ type: 'error', message: 'Tài khoản chưa liên kết với hồ sơ cán bộ.' });
              setTimeout(() => { isProcessingRef.current = false; }, 3000);
              return;
            }

            // Check if already checked in
            const { data: existing } = await supabase.from('attendance')
              .select('id').eq('meeting_id', meetingId).eq('staff_id', staffId).maybeSingle();

            if (existing) {
              setStatus({ type: 'info', message: `Bạn đã điểm danh "${meeting.title}" rồi!` });
              setTimeout(() => { isProcessingRef.current = false; }, 3000);
              return;
            }

            // Insert attendance
            const { error: insertError } = await supabase.from('attendance').insert({
              meeting_id: Number(meetingId),
              staff_id: Number(staffId),
              checkin_method: 'qr',
            });

            if (insertError) {
              setStatus({ type: 'error', message: insertError.message });
            } else {
              setStatus({ type: 'success', message: `✅ Điểm danh "${meeting.title}" thành công!` });
              // Stop camera after success
              setTimeout(() => stopCamera(), 2000);
            }
          } finally {
            setTimeout(() => { isProcessingRef.current = false; }, 3000);
          }
        },
        () => {} // ignore scan misses
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
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header Card */}
      <div className="card-no-hover text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <QrCode size={28} />
        </div>
        <h2 className="text-xl font-bold text-brand-text">Quét QR Điểm Danh</h2>
        <p className="text-sm text-brand-text/50 font-medium mt-1">Mở camera và hướng vào mã QR của cuộc họp</p>
      </div>

      {/* Camera Toggle Button */}
      <button
        onClick={cameraOn ? stopCamera : startCamera}
        className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-base transition-all ${
          cameraOn
            ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:translate-y-[-2px]'
        }`}
      >
        {cameraOn ? <CameraOff size={22} /> : <Camera size={22} />}
        {cameraOn ? 'Tắt Camera' : '📷 Bật Camera Quét QR'}
      </button>

      {/* Camera View */}
      {cameraOn && (
        <div className="animate-fade-in-up">
          <div className="rounded-2xl overflow-hidden border-2 border-indigo-200 bg-black">
            <div id={containerId} className="w-full" style={{ minHeight: 300 }} />
          </div>
        </div>
      )}

      {!cameraOn && <div id={containerId} style={{ display: 'none' }} />}

      {/* Status Message */}
      {status.type !== 'idle' && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 animate-fade-in-up ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
          status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' :
          status.type === 'info' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
          'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
          {status.type === 'success' && <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
          {status.type === 'error' && <AlertCircle size={20} className="shrink-0 mt-0.5" />}
          {status.type === 'loading' && <Loader2 size={20} className="shrink-0 mt-0.5 animate-spin" />}
          <span className="font-medium text-sm">{status.message}</span>
        </div>
      )}

      {/* Instructions */}
      {!cameraOn && status.type === 'idle' && (
        <div className="card-no-hover space-y-3">
          <h3 className="font-bold text-sm text-brand-text">Hướng dẫn:</h3>
          <ol className="text-sm text-brand-text/60 space-y-2 list-decimal list-inside">
            <li>Bấm nút <strong>"Bật Camera Quét QR"</strong> ở trên</li>
            <li>Cho phép trình duyệt truy cập camera</li>
            <li>Hướng camera vào mã QR của cuộc họp</li>
            <li>Hệ thống tự động nhận diện và điểm danh cho bạn</li>
          </ol>
        </div>
      )}
    </div>
  );
}
