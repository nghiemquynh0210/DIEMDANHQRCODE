import React, { useEffect, useState } from 'react';
import { Building2, CalendarDays, Camera, FileBarChart, LayoutDashboard, LogOut, Menu, QrCode, Settings, Users, X, ChevronLeft } from 'lucide-react';
import { cn } from './lib/utils';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import DepartmentManagement from './pages/DepartmentManagement';
import Login from './pages/Login';
import MeetingManagement from './pages/MeetingManagement';
import QRScanner from './pages/QRScanner';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';
import StaffManagement from './pages/StaffManagement';
import StaffQRScanner from './pages/StaffQRScanner';

type Page = 'dashboard' | 'staff' | 'departments' | 'meetings' | 'qr' | 'staff-qr' | 'reports' | 'settings';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { user, loading, signOut } = useAuth();
  
  const [navigationParams, setNavigationParams] = useState<{
    departmentId?: string;
    neighborhoodId?: string;
    triggerAdd?: boolean;
  }>({});

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-route normal staff to QR scanner by default
  useEffect(() => {
    if (user && user.role === 'staff' && activePage === 'dashboard') {
      setActivePage('staff-qr');
    }
  }, [user]);

  const navigateToPage = (
    page: Page,
    params: { departmentId?: string; neighborhoodId?: string; triggerAdd?: boolean } = {},
  ) => {
    setActivePage(page);
    setNavigationParams(params);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-brand-bg gap-4">
        <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-medium text-brand-text/50">Đang tải...</span>
      </div>
    );
  }

  if (!user) {
    return <Login />; // Login now uses Supabase Auth directly, meaning onLogin prop is no longer needed
  }

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, roles: ['admin', 'staff', 'viewer'] },
    { id: 'meetings', label: 'Cuộc họp', icon: CalendarDays, roles: ['admin'] },
    { id: 'staff', label: 'Nhân sự', icon: Users, roles: ['admin'] },
    { id: 'departments', label: 'Cơ cấu', icon: Building2, roles: ['admin'] },
    { id: 'qr', label: 'Điểm danh QR', icon: QrCode, roles: ['admin'] },
    { id: 'staff-qr', label: 'Quét QR', icon: Camera, roles: ['staff'] },
    { id: 'reports', label: 'Báo cáo', icon: FileBarChart, roles: ['admin', 'viewer'] },
    { id: 'settings', label: 'Cài đặt', icon: Settings, roles: ['admin', 'staff', 'viewer'] },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || 'staff'));

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans text-brand-text">
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'sidebar-gradient text-white transition-all duration-300 ease-in-out flex flex-col z-50',
          isMobile ? 'fixed h-full top-0 left-0 shadow-2xl' : 'relative h-full',
          isSidebarOpen ? 'translate-x-0 w-[260px]' : isMobile ? '-translate-x-full w-[260px]' : 'w-[72px] translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm p-1.5 rounded-xl w-10 h-10 flex items-center justify-center overflow-hidden shrink-0 border border-white/20">
              <img src="/logo_an_phu_v4.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {isSidebarOpen && (
              <div className="animate-fade-in">
                <span className="font-bold text-base tracking-tight text-white block leading-tight">An Phú</span>
                <span className="text-[10px] text-white/50 font-medium uppercase tracking-widest">Điểm danh QR</span>
              </div>
            )}
          </div>
          {isMobile && isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="text-white/40 hover:text-white shrink-0 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => navigateToPage(item.id as Page)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-[13px]',
                `delay-${index + 1}`,
                activePage === item.id
                  ? 'bg-white/15 text-white shadow-lg shadow-black/10 backdrop-blur-sm border border-white/10'
                  : 'text-white/55 hover:bg-white/8 hover:text-white/90',
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                activePage === item.id
                  ? 'bg-white/15'
                  : 'group-hover:bg-white/5',
              )}>
                <item.icon size={18} className={cn(
                  'transition-transform duration-200',
                  activePage === item.id ? 'scale-110' : 'group-hover:scale-105',
                )} />
              </div>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-3 border-t border-white/10">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.username}</p>
                <p className="text-[10px] text-white/40 capitalize font-medium">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-white/45 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-medium text-[13px]"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <LogOut size={18} />
            </div>
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl text-brand-text/60 hover:text-brand-text transition-all"
            >
              {isSidebarOpen && !isMobile ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-gradient">
                {menuItems.find((item) => item.id === activePage)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-brand-text">{user.username}</p>
              <p className="text-[10px] text-brand-text/45 capitalize font-medium">{user.role}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-brand-bg to-indigo-50/30">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'staff' && (
            <StaffManagement
              initialDepartmentId={navigationParams.departmentId}
              initialNeighborhoodId={navigationParams.neighborhoodId}
              autoOpenAdd={navigationParams.triggerAdd}
              onClearParams={() => setNavigationParams({})}
            />
          )}
          {activePage === 'departments' && (
            <DepartmentManagement onNavigateToStaff={(params) => navigateToPage('staff', params)} />
          )}
          {activePage === 'meetings' && <MeetingManagement />}
          {activePage === 'qr' && <QRScanner />}
          {activePage === 'staff-qr' && <StaffQRScanner />}
          {activePage === 'reports' && <Reports />}
          {activePage === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}
