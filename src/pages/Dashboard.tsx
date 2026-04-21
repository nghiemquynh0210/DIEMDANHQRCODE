import React, { useEffect, useState } from 'react';
import { Building2, CalendarDays, Shapes, Users, TrendingUp, Clock, MapPin, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: totalStaff },
          { count: totalDepartments },
          { count: totalPositions },
          { count: totalMeetings },
          { data: allMeetings },
          { data: allStaff }
        ] = await Promise.all([
          supabase.from('staff').select('id', { count: 'exact', head: true }),
          supabase.from('departments').select('id', { count: 'exact', head: true }),
          supabase.from('positions').select('id', { count: 'exact', head: true }),
          supabase.from('meetings').select('id', { count: 'exact', head: true }),
          supabase.from('meetings').select('*').order('meeting_date', { ascending: false }).order('meeting_time', { ascending: false }),
          supabase.from('staff').select('id, department_id, position_id, party_department_id, party_position_id').eq('status', 'active')
        ]);

        // Build attendance stats for each meeting
        const meetingsWithStats = [];
        for (const meeting of (allMeetings || [])) {
          const { data: attendance } = await supabase
            .from('attendance')
            .select('status, staff_id')
            .eq('meeting_id', meeting.id);

          let present = 0, late = 0, absent = 0;
          if (attendance) {
            present = attendance.filter(a => a.status === 'present').length;
            late = attendance.filter(a => a.status === 'late').length;

            let invitedStaff = allStaff || [];
            if (meeting.participant_department_ids?.length || meeting.participant_position_ids?.length) {
              invitedStaff = invitedStaff.filter((s: any) =>
                (meeting.participant_department_ids || []).includes(s.department_id) ||
                (meeting.participant_department_ids || []).includes(s.party_department_id) ||
                (meeting.participant_position_ids || []).includes(s.position_id) ||
                (meeting.participant_position_ids || []).includes(s.party_position_id)
              );
            }

            const attendedIds = new Set(attendance.map((a: any) => a.staff_id));
            absent = invitedStaff.filter((s: any) => !attendedIds.has(s.id)).length;
          }

          meetingsWithStats.push({ ...meeting, stats: { present, late, absent } });
        }

        setStats({
          totalStaff: totalStaff || 0,
          totalDepartments: totalDepartments || 0,
          totalPositions: totalPositions || 0,
          totalMeetings: totalMeetings || 0,
          meetings: meetingsWithStats,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    }

    fetchStats();
  }, [location.key]);

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 h-[120px] skeleton" />
          ))}
        </div>
        <div className="rounded-2xl h-[240px] skeleton" />
      </div>
    );
  }

  const cards = [
    { label: 'Tổng nhân sự', value: stats.totalStaff, icon: Users, gradient: 'stat-card-1' },
    { label: 'Phòng ban', value: stats.totalDepartments, icon: Building2, gradient: 'stat-card-2' },
    { label: 'Chức danh', value: stats.totalPositions, icon: Shapes, gradient: 'stat-card-3' },
    { label: 'Cuộc họp', value: stats.totalMeetings, icon: CalendarDays, gradient: 'stat-card-5' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        {cards.map((item, index) => (
          <div
            key={item.label}
            className={`${item.gradient} rounded-2xl p-5 text-white relative overflow-hidden animate-fade-in-up delay-${index + 1} group cursor-default`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">{item.label}</p>
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                  <item.icon size={18} />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold font-mono tracking-tight">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ── All Meetings List ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <CalendarDays size={20} />
            </div>
            <h3 className="text-base font-bold text-brand-text">Danh sách cuộc họp</h3>
          </div>
          <button
            onClick={() => navigate('/meetings')}
            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Quản lý →
          </button>
        </div>

        {stats.meetings.length === 0 ? (
          <div className="text-center py-8 text-brand-text/40">
            <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Chưa có cuộc họp nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.meetings.map((meeting: any) => {
              const total = meeting.stats.present + meeting.stats.late + meeting.stats.absent;
              const attended = meeting.stats.present + meeting.stats.late;
              const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
              const orgLabel = meeting.org_type === 'party' ? 'Đảng' : meeting.org_type === 'government' ? 'Chính quyền' : 'Chung';
              const orgColor = meeting.org_type === 'party' ? 'bg-red-100 text-red-600' : meeting.org_type === 'government' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600';

              return (
                <div
                  key={meeting.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50 transition-all cursor-pointer group"
                  onClick={() => navigate('/meetings')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-bold text-sm text-brand-text truncate">{meeting.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${orgColor} shrink-0`}>{orgLabel}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-brand-text/45 font-medium">
                        <span className="flex items-center gap-1"><CalendarDays size={11} /> {meeting.meeting_date}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {meeting.meeting_time}</span>
                        {meeting.location && <span className="flex items-center gap-1"><MapPin size={11} /> {meeting.location}</span>}
                      </div>
                    </div>

                    {/* Mini stats */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <div className="text-lg font-extrabold font-mono text-emerald-600">{attended}</div>
                        <div className="text-[9px] text-brand-text/35 font-bold uppercase">Có mặt</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-extrabold font-mono text-red-500">{meeting.stats.absent}</div>
                        <div className="text-[9px] text-brand-text/35 font-bold uppercase">Vắng</div>
                      </div>
                      <div className="w-12 h-12 relative">
                        <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4F46E5" strokeWidth="3" strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-brand-text">{pct}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
