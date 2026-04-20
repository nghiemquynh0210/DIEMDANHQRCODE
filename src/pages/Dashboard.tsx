import React, { useEffect, useState } from 'react';
import { Building2, CalendarDays, MapPinned, Shapes, Users, TrendingUp, Clock, MapPin, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: totalStaff },
          { count: totalDepartments },
          { count: totalPositions },
          { count: totalNeighborhoods },
          { count: totalMeetings },
          { data: recentMeetings },
          { data: allStaff }
        ] = await Promise.all([
          supabase.from('staff').select('id', { count: 'exact', head: true }),
          supabase.from('departments').select('id', { count: 'exact', head: true }),
          supabase.from('positions').select('id', { count: 'exact', head: true }),
          supabase.from('neighborhoods').select('id', { count: 'exact', head: true }),
          supabase.from('meetings').select('id', { count: 'exact', head: true }),
          supabase.from('meetings').select('*').order('meeting_date', { ascending: false }).limit(1),
          supabase.from('staff').select('id, department_id, position_id, neighborhood_id').eq('status', 'active')
        ]);

        let present = 0, late = 0, absent = 0;
        if (recentMeetings && recentMeetings.length > 0) {
          const meeting = recentMeetings[0];
          const meetingId = meeting.id;
          const { data: attendance } = await supabase
            .from('attendance')
            .select('status, staff_id')
            .eq('meeting_id', meetingId);
            
          if (attendance) {
            present = attendance.filter(a => a.status === 'present').length;
            late = attendance.filter(a => a.status === 'late').length;
            
            let invitedStaff = allStaff || [];
            if (meeting.participant_department_ids?.length || meeting.participant_position_ids?.length || meeting.participant_neighborhood_ids?.length) {
              invitedStaff = invitedStaff.filter((s: any) => 
                (meeting.participant_department_ids || []).includes(s.department_id) ||
                (meeting.participant_position_ids || []).includes(s.position_id) ||
                (meeting.participant_neighborhood_ids || []).includes(s.neighborhood_id)
              );
            }
            
            const attendedIds = new Set(attendance.map((a: any) => a.staff_id));
            absent = invitedStaff.filter((s: any) => !attendedIds.has(s.id)).length;
          }
        }

        const latestMeeting = recentMeetings && recentMeetings.length > 0 ? recentMeetings[0] : null;
        setStats({
          totalStaff: totalStaff || 0,
          totalDepartments: totalDepartments || 0,
          totalPositions: totalPositions || 0,
          totalNeighborhoods: totalNeighborhoods || 0,
          totalMeetings: totalMeetings || 0,
          lastMeeting: latestMeeting,
          lastMeetingStats: { present, late, absent }
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    }

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {[...Array(5)].map((_, i) => (
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
    { label: 'Khu phố', value: stats.totalNeighborhoods, icon: MapPinned, gradient: 'stat-card-4' },
    { label: 'Cuộc họp', value: stats.totalMeetings, icon: CalendarDays, gradient: 'stat-card-5' },
  ];

  const total = stats.lastMeetingStats.present + stats.lastMeetingStats.late + stats.lastMeetingStats.absent;
  const presentPct = total > 0 ? Math.round((stats.lastMeetingStats.present / total) * 100) : 0;
  const latePct = total > 0 ? Math.round((stats.lastMeetingStats.late / total) * 100) : 0;
  const absentPct = total > 0 ? Math.round((stats.lastMeetingStats.absent / total) * 100) : 0;

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
            {/* Glow effect */}
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

      {/* ── Latest Meeting Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meeting Info */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <CalendarDays size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-text">Cuộc họp gần nhất</h3>
            </div>
          </div>

          {/* Meeting Details */}
          {stats.lastMeeting && (
            <div className="mb-5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/60 space-y-2">
              <h4 className="font-bold text-brand-text text-sm">{stats.lastMeeting.title}</h4>
              {stats.lastMeeting.content && (
                <div className="flex items-start gap-2 text-xs text-brand-text/60">
                  <FileText size={13} className="text-purple-500 shrink-0 mt-0.5" />
                  <span>{stats.lastMeeting.content}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-text/50 font-medium">
                <span className="flex items-center gap-1"><CalendarDays size={12} className="text-primary" /> {stats.lastMeeting.meeting_date}</span>
                <span className="flex items-center gap-1"><Clock size={12} className="text-primary" /> {stats.lastMeeting.meeting_time}</span>
                {stats.lastMeeting.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {stats.lastMeeting.location}</span>}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex gap-0.5 h-3 rounded-full overflow-hidden bg-gray-100">
              {presentPct > 0 && (
                <div className="bg-emerald-500 rounded-l-full transition-all duration-700" style={{ width: `${presentPct}%` }} />
              )}
              {latePct > 0 && (
                <div className="bg-amber-400 transition-all duration-700" style={{ width: `${latePct}%` }} />
              )}
              {absentPct > 0 && (
                <div className="bg-red-400 rounded-r-full transition-all duration-700" style={{ width: `${absentPct}%` }} />
              )}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-semibold text-brand-text/40 uppercase tracking-wider">
              <span>Có mặt {presentPct}%</span>
              <span>Đi trễ {latePct}%</span>
              <span>Vắng mặt {absentPct}%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 group hover:shadow-md hover:shadow-emerald-100 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Có mặt</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-700 font-mono">{stats.lastMeetingStats.present}</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 group hover:shadow-md hover:shadow-amber-100 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[11px] text-amber-600 font-bold uppercase tracking-wider">Đi trễ</span>
              </div>
              <div className="text-3xl font-extrabold text-amber-700 font-mono">{stats.lastMeetingStats.late}</div>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 group hover:shadow-md hover:shadow-red-100 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[11px] text-red-600 font-bold uppercase tracking-wider">Vắng mặt</span>
              </div>
              <div className="text-3xl font-extrabold text-red-700 font-mono">{stats.lastMeetingStats.absent}</div>
            </div>
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="text-base font-bold text-brand-text">Thống kê nhanh</h3>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/60">
              <span className="text-xs font-semibold text-brand-text/60">Tổng yêu cầu tham gia</span>
              <span className="text-sm font-bold text-indigo-600 font-mono">{total}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/60">
              <span className="text-xs font-semibold text-brand-text/60">Tỉ lệ có mặt</span>
              <span className="text-sm font-bold text-indigo-600 font-mono">{presentPct}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/60">
              <span className="text-xs font-semibold text-brand-text/60">Đã điểm danh/có mặt</span>
              <span className="text-sm font-bold text-emerald-600 font-mono">{stats.lastMeetingStats.present + stats.lastMeetingStats.late}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/60 border border-red-100/60">
              <span className="text-xs font-semibold text-red-600/70">Chưa điểm danh (Vắng)</span>
              <span className="text-sm font-bold text-red-600 font-mono">{stats.lastMeetingStats.absent}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-brand-text/35 font-medium pt-2 border-t border-gray-100">
            <Clock size={12} />
            <span>Cập nhật tự động</span>
          </div>
        </div>
      </div>
    </div>
  );
}
