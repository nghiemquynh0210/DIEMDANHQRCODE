import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Camera, CameraOff, CheckCircle2, History, Search, Users, Zap } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { supabase } from '../lib/supabase';
import { Attendance, Meeting } from '../types';
import { formatTime } from '../lib/utils';

export default function QRScanner() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState('');
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [flashId, setFlashId] = useState<number | null>(null);

  // Camera scanner state
  const [cameraOn, setCameraOn] = useState(false);
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-container';
  const isProcessingRef = useRef(false);

  useEffect(() => {
    Promise.all([
      supabase.from('meetings').select('*').order('meeting_date', { ascending: false }).order('meeting_time', { ascending: false }),
      supabase.from('staff').select('*, departments(name), positions(name), neighborhoods(name)').order('full_name'),
    ]).then(([
      { data: meetingsData },
      { data: staffData }
    ]) => {
      const m = meetingsData || [];
      const s = (staffData || []).map((item: any) => ({
        ...item,
        department_name: item.departments?.name || null,
        position_name: item.positions?.name || null,
        neighborhood_name: item.neighborhoods?.name || null,
      }));
      setMeetings(m);
      setStaff(s);
      if (m.length > 0) setSelectedMeetingId(String(m[0].id));
    }).catch(console.error);
  }, []);

  // Refresh attendance when meeting changes
  const refreshAttendance = useCallback(async () => {
    if (!selectedMeetingId) return;
    const { data } = await supabase.from('attendance')
      .select('*, staff(full_name, staff_code, departments(name), positions(name), neighborhoods(name))')
      .eq('meeting_id', selectedMeetingId)
      .order('checkin_time', { ascending: false });
      
    const mapped = (data || []).map((item: any) => ({
      ...item,
      full_name: item.staff?.full_name || '--',
      staff_code: item.staff?.staff_code || '--',
      position_name: item.staff?.positions?.name || '--',
      department_name: item.staff?.departments?.name || '--',
      neighborhood_name: item.staff?.neighborhoods?.name || '--',
    }));
    setAttendance(mapped);
  }, [selectedMeetingId]);

  useEffect(() => {
    refreshAttendance();
  }, [refreshAttendance]);

  // ── Camera Scanner Logic ──
  const startCamera = async () => {
    try {
      const scanner = new Html5Qrcode(scannerContainerId, {
        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
        verbose: false
      });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' }, // Camera sau
        {
          fps: 30,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1.0,
          disableFlip: false
        },
        async (decodedText) => {
          // Tránh xử lý nhiều lần cùng lúc
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;

          try {
            // Phân tích URL từ QR code
            // QR code có thể chứa URL dạng: .../self-checkin?meetingId=123
            // Hoặc chứa text thuần là staffId / staffCode
            let url: URL | null = null;
            try {
              url = new URL(decodedText);
            } catch {
              // Không phải URL
            }

            if (url) {
              const meetingIdFromQR = url.searchParams.get('meetingId');
              if (meetingIdFromQR) {
                // Đây là mã QR cuộc họp -> điểm danh tất cả nhân sự đang đứng trước camera
                setScanResult({ type: 'info', message: `Mã cuộc họp: ${meetingIdFromQR}. Dùng nút Điểm danh bên danh sách.` });
              } else {
                setScanResult({ type: 'error', message: 'QR không chứa thông tin cuộc họp.' });
              }
            } else {
              // Có thể là staff_code hoặc staff ID
              const staffMatch = staff.find(s => 
                s.staff_code === decodedText || 
                s.qr_code === decodedText ||
                String(s.id) === decodedText
              );

              if (staffMatch) {
                const alreadyChecked = attendance.some(a => String(a.staff_id) === String(staffMatch.id));
                if (alreadyChecked) {
                  setScanResult({ type: 'info', message: `${staffMatch.full_name} đã điểm danh rồi.` });
                } else if (selectedMeetingId) {
                  const { error } = await supabase.from('attendance').insert({
                    meeting_id: Number(selectedMeetingId),
                    staff_id: staffMatch.id,
                    checkin_method: 'qr',
                  });

                  if (!error) {
                    setScanResult({ type: 'success', message: `✅ ${staffMatch.full_name} - Điểm danh thành công!` });
                    setFlashId(staffMatch.id);
                    setTimeout(() => setFlashId(null), 1500);
                    await refreshAttendance();
                  } else {
                    setScanResult({ type: 'error', message: error.message });
                  }
                }
              } else {
                setScanResult({ type: 'error', message: `Không tìm thấy nhân sự với mã: ${decodedText}` });
              }
            }
          } finally {
            // Cho phép quét lại sau 2 giây
            setTimeout(() => { isProcessingRef.current = false; }, 2000);
          }
        },
        () => {} // Ignore scan failures (normal when no QR in frame)
      );

      setCameraOn(true);
    } catch (err: any) {
      setScanResult({ type: 'error', message: `Không thể mở camera: ${err.message || err}` });
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setCameraOn(false);
    setScanResult(null);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
      }
    };
  }, []);

  const manualCheckin = async (staffId: number) => {
    const alreadyChecked = attendance.some(a => String(a.staff_id) === String(staffId));
    if (alreadyChecked) return;

    const { error } = await supabase.from('attendance').insert({
      meeting_id: Number(selectedMeetingId),
      staff_id: staffId,
      checkin_method: 'manual',
    });

    if (error) {
      alert(error.message || 'Không thể điểm danh.');
      return;
    }
    
    setFlashId(staffId);
    setTimeout(() => setFlashId(null), 1500);
    await refreshAttendance();
  };

  const filteredStaff = staff.filter((item) => item.full_name.toLowerCase().includes(search.toLowerCase()) || (item.staff_code || '').toLowerCase().includes(search.toLowerCase()));
  const checkedCount = attendance.length;
  const totalCount = staff.length;

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0].charAt(0) + parts[parts.length - 1].charAt(0) : name.charAt(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-112px)]">
      {/* Left Panel - Camera + Manual Checkin */}
      <div className="lg:col-span-3 card flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/15">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-text">Điểm danh</h3>
              <p className="text-[11px] text-brand-text/40 font-medium">{checkedCount}/{totalCount} đã điểm danh</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="input flex-1 sm:w-48" value={selectedMeetingId} onChange={(event) => setSelectedMeetingId(event.target.value)}>
              {meetings.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
            <button 
              onClick={cameraOn ? stopCamera : startCamera}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                cameraOn 
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl'
              }`}
            >
              {cameraOn ? <CameraOff size={18} /> : <Camera size={18} />}
              {cameraOn ? 'Tắt' : 'Camera'}
            </button>
          </div>
        </div>

        {/* Camera Scanner Area */}
        {cameraOn && (
          <div className="mb-4 animate-fade-in-up">
            <div className="rounded-2xl overflow-hidden border-2 border-indigo-200 bg-black relative">
              <div id={scannerContainerId} className="w-full" style={{ minHeight: 280 }} />
            </div>
            {scanResult && (
              <div className={`mt-3 p-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${
                scanResult.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                scanResult.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' :
                'bg-blue-50 text-blue-600 border border-blue-200'
              }`}>
                {scanResult.type === 'success' && <CheckCircle2 size={16} />}
                {scanResult.message}
              </div>
            )}
          </div>
        )}

        {!cameraOn && (
          <div id={scannerContainerId} style={{ display: 'none' }} />
        )}

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: totalCount > 0 ? `${(checkedCount / totalCount) * 100}%` : '0%' }}
          />
        </div>

        <div className="relative mb-4 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-primary transition-colors" size={18} />
          <input className="input pl-12" placeholder="Tìm nhân sự theo tên hoặc mã..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {filteredStaff.map((item) => {
            const checked = attendance.some((row) => row.staff_id === item.id);
            const justChecked = flashId === item.id;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  justChecked
                    ? 'bg-emerald-50 border-emerald-200 scale-[1.01]'
                    : checked
                      ? 'bg-gray-50/50 border-gray-100'
                      : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    checked
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                  }`}>
                    {checked ? <CheckCircle2 size={16} /> : getInitials(item.full_name)}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${checked ? 'text-brand-text/50' : ''}`}>{item.full_name}</div>
                    <div className="text-[11px] text-brand-text/35">{item.position_name || '--'} / {item.department_name || item.neighborhood_name || '--'}</div>
                  </div>
                </div>
                {checked ? (
                  <span className="badge badge-success !text-[10px]">
                    <CheckCircle2 size={12} />
                    Đã điểm danh
                  </span>
                ) : (
                  <button className="btn-primary !py-2 !px-4 !text-xs !rounded-lg !shadow-sm" onClick={() => manualCheckin(item.id)}>
                    Điểm danh
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - History */}
      <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <History size={16} className="text-primary" />
          </div>
          <div>
            <span className="font-bold text-sm text-brand-text">Lịch sử điểm danh</span>
            <p className="text-[10px] text-brand-text/35 font-medium">{attendance.length} lượt</p>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {attendance.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-brand-text/30">
              <Users size={32} className="mb-2" />
              <p className="text-xs font-medium">Chưa có điểm danh</p>
            </div>
          )}
          {attendance.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-brand-bg/50 border border-gray-100 flex items-center justify-between hover:bg-brand-bg transition-colors"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                  {getInitials(item.full_name || '')}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.full_name}</div>
                  <div className="text-[10px] text-brand-text/35">{item.department_name || item.neighborhood_name || '--'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs font-semibold">{formatTime(item.checkin_time)}</div>
                <span className={`badge ${item.status === 'present' ? 'badge-success' : 'badge-warning'} !text-[9px] !py-0 !px-1.5`}>
                  {item.status === 'present' ? 'Đúng giờ' : 'Trễ'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
