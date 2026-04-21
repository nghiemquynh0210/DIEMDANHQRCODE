import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Calendar, CheckCircle2, Clock, FileText, Loader2, MapPin, QrCode, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SelfCheckin() {
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('meetingId');
  const [meeting, setMeeting] = useState<any>(null);
  const [invitedStaff, setInvitedStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedInId, setCheckedInId] = useState<number | null>(null);
  const [checkedInName, setCheckedInName] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (!meetingId) {
      setError('Không tìm thấy thông tin cuộc họp.');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      // Load meeting
      const { data: m, error: mErr } = await supabase
        .from('meetings').select('*').eq('id', meetingId).single();

      if (!m || mErr) {
        setError('Cuộc họp không tồn tại hoặc đã bị xóa.');
        setLoading(false);
        return;
      }
      setMeeting(m);

      // Load all active staff with their departments/positions
      const { data: allStaff } = await supabase
        .from('staff')
        .select('id, full_name, staff_code, department_id, position_id, party_department_id, party_position_id')
        .eq('status', 'active')
        .order('full_name');

      // Filter to invited members based on meeting criteria
      let filtered = allStaff || [];
      const deptIds: number[] = m.participant_department_ids || [];
      const posIds: number[] = m.participant_position_ids || [];

      if (deptIds.length > 0 || posIds.length > 0) {
        filtered = filtered.filter(s =>
          deptIds.includes(s.department_id) ||
          deptIds.includes(s.party_department_id) ||
          posIds.includes(s.position_id) ||
          posIds.includes(s.party_position_id)
        );
      }
      // If no filters → all staff are invited

      // Check who already checked in
      const { data: attendance } = await supabase
        .from('attendance')
        .select('staff_id')
        .eq('meeting_id', meetingId);
      
      const checkedIds = new Set((attendance || []).map((a: any) => a.staff_id));
      
      setInvitedStaff(filtered.map(s => ({
        ...s,
        alreadyCheckedIn: checkedIds.has(s.id),
      })));
      setLoading(false);
    };

    loadData();
  }, [meetingId]);

  const handleCheckin = async (staffId: number, staffName: string) => {
    setProcessingId(staffId);
    
    const { error } = await supabase.from('attendance').upsert({
      meeting_id: Number(meetingId),
      staff_id: staffId,
      checkin_method: 'self',
    }, { onConflict: 'meeting_id,staff_id' });

    if (!error) {
      setCheckedInId(staffId);
      setCheckedInName(staffName);
    } else {
      setError(error.message || 'Điểm danh thất bại.');
    }
    setProcessingId(null);
  };

  // ─── LOADING ───
  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #312E81, #4C1D95, #6D28D9)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.7)', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 16 }}>Đang tải cuộc họp...</p>
        </div>
      </div>
    );
  }

  // ─── ERROR ───
  if (error && !meeting) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #312E81, #4C1D95, #6D28D9)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <AlertCircle style={{ width: 48, height: 48, color: '#EF4444', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Lỗi</h2>
          <p style={{ color: '#6B7280', fontSize: 14 }}>{error}</p>
        </div>
      </div>
    );
  }

  // ─── SUCCESS ───
  if (checkedInId) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #312E81, #4C1D95, #6D28D9)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
          <div style={{ width: 72, height: 72, background: '#D1FAE5', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 style={{ width: 36, height: 36, color: '#059669' }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1F2937', marginBottom: 8 }}>Điểm danh thành công!</h2>
          <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 4 }}>{checkedInName}</p>
          <p style={{ color: '#9CA3AF', fontSize: 13 }}>{meeting?.title}</p>
          <div style={{ marginTop: 24, padding: '12px 16px', background: '#F0FDF4', borderRadius: 12, border: '1px solid #BBF7D0' }}>
            <p style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>✓ Đã ghi nhận điểm danh của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN: Meeting info + Staff list ───
  return (
    <div style={{
      background: 'linear-gradient(135deg, #312E81, #4C1D95, #6D28D9)',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
      boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Header Card */}
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* Purple header */}
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            padding: '20px 20px 16px',
            textAlign: 'center',
            color: 'white',
          }}>
            <div style={{
              width: 48, height: 48,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <QrCode size={24} />
            </div>
            <h1 style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
              Điểm danh cuộc họp
            </h1>
            <p style={{ fontSize: 12, opacity: 0.6, marginTop: 4, fontWeight: 500 }}>UBND Phường An Phú</p>
          </div>

          {/* Meeting info */}
          <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.95)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', marginBottom: 12, lineHeight: 1.4 }}>{meeting?.title}</h3>
            
            {meeting?.content && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={14} style={{ color: '#9333EA' }} />
                </div>
                <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, lineHeight: 1.5 }}>{meeting.content}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280', background: '#F3F4F6', padding: '6px 10px', borderRadius: 8 }}>
                <Calendar size={13} style={{ color: '#4F46E5' }} />
                <span style={{ fontWeight: 600 }}>{meeting?.meeting_date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280', background: '#F3F4F6', padding: '6px 10px', borderRadius: 8 }}>
                <Clock size={13} style={{ color: '#4F46E5' }} />
                <span style={{ fontWeight: 600 }}>{meeting?.meeting_time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280', background: '#F3F4F6', padding: '6px 10px', borderRadius: 8 }}>
                <MapPin size={13} style={{ color: '#4F46E5' }} />
                <span style={{ fontWeight: 600 }}>{meeting?.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff list */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 20,
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Users size={16} style={{ color: '#4F46E5' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>Thành phần tham dự ({invitedStaff.length})</span>
          </div>

          <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12, fontWeight: 500 }}>
            Bấm vào tên của bạn để xác nhận điểm danh
          </p>

          {error && (
            <div style={{ padding: '10px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '55vh', overflowY: 'auto' }}>
            {invitedStaff.map(s => (
              <button
                key={s.id}
                onClick={() => !s.alreadyCheckedIn && handleCheckin(s.id, s.full_name)}
                disabled={s.alreadyCheckedIn || processingId === s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: s.alreadyCheckedIn ? '1px solid #BBF7D0' : '1px solid #E5E7EB',
                  background: s.alreadyCheckedIn ? '#F0FDF4' : processingId === s.id ? '#EEF2FF' : 'white',
                  cursor: s.alreadyCheckedIn ? 'default' : 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  opacity: processingId !== null && processingId !== s.id ? 0.5 : 1,
                }}
              >
                <div style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  background: s.alreadyCheckedIn ? '#D1FAE5' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.alreadyCheckedIn ? '#059669' : 'white',
                  fontSize: 12, fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {s.alreadyCheckedIn ? <CheckCircle2 size={18} /> : s.full_name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: s.alreadyCheckedIn ? '#6B7280' : '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.full_name}
                  </div>
                  {s.alreadyCheckedIn && (
                    <div style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>✓ Đã điểm danh</div>
                  )}
                </div>
                {!s.alreadyCheckedIn && processingId !== s.id && (
                  <div style={{
                    padding: '6px 14px',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: 'white',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    Xác nhận
                  </div>
                )}
                {processingId === s.id && (
                  <Loader2 size={18} style={{ color: '#4F46E5', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                )}
              </button>
            ))}
            {invitedStaff.length === 0 && (
              <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, padding: '24px 0' }}>
                Chưa có thành phần tham dự
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
