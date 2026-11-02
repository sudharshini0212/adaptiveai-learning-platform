import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Network, 
  Gift, 
  Smartphone, 
  Flame, 
  BookMarked,
  Bell,
  Menu,
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  Info,
  Clock,
  Users,
  LogIn,
  LogOut,
  User,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userProfile: UserProfile;
  isLoggedIn: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenArchitecture?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  userProfile,
  isLoggedIn,
  isOpen,
  onClose,
  onOpenAuthModal,
  onLogout,
  onOpenArchitecture,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'focus', label: 'Focus Timer', icon: Clock },
    { id: 'group', label: 'Group Study', icon: Users },
    { id: 'courses', label: 'Course Library', icon: BookOpen },
    { id: 'syllabus', label: 'Syllabus Lab', icon: BookMarked },
    { id: 'notes', label: 'Notes Studio', icon: FileText },
    { id: 'tutor', label: 'AI Tutor', icon: MessageSquare },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'mastery', label: 'Mastery & Graph', icon: Network },
    { id: 'rewards', label: 'Rewards & Kit', icon: Gift },
    { id: 'android', label: 'Android App', icon: Smartphone },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0F172A] text-slate-300 flex flex-col z-50 transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => {
              setCurrentTab('dashboard');
              onClose();
            }}
          >
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/25">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-xl tracking-tight">AdaptiveAI</span>
              </div>
              <p className="text-[10px] text-indigo-300 font-medium tracking-wide">College Learning Ecosystem</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all text-sm font-medium cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/10 border-l-4 border-indigo-500 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Auth Section at Bottom of Sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 border border-slate-700/40">
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
              {userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CS'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{userProfile.name}</p>
              <p className="text-slate-400 text-[10px] truncate">{userProfile.institution}</p>
              <p className="text-indigo-400 text-[9px] truncate font-mono">
                {userProfile.rollNumber ? `ID: ${userProfile.rollNumber}` : `${userProfile.degree} • ${userProfile.semester}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            {isLoggedIn ? (
              <>
                <button
                  onClick={onOpenAuthModal}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <User className="w-3 h-3" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/50 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Student Sign-In</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

interface HeaderProps {
  userProfile: UserProfile;
  isLoggedIn: boolean;
  onOpenMobileMenu: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenArchitecture?: () => void;
}

export const TopHeader: React.FC<HeaderProps> = ({
  userProfile,
  isLoggedIn,
  onOpenMobileMenu,
  onOpenAuthModal,
  onLogout,
  onNavigateTab,
  onOpenArchitecture,
}) => {
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-slate-800 font-semibold text-sm sm:text-base leading-tight">
            Welcome, <span className="text-indigo-600 font-bold">{userProfile.name.split(' ')[0]}</span>!
          </h1>
          <p className="text-[10px] text-slate-400 truncate max-w-xs">
            {userProfile.institution} • {userProfile.semester}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 shadow-xs">
          <span className="text-amber-500 text-sm">🔥</span>
          <span className="text-amber-700 text-xs font-bold">{userProfile.streak} Day Streak</span>
        </div>

        {/* Quick Launch Buttons for College Students */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('focus')}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold transition cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Focus Timer</span>
          </button>

          <button
            onClick={() => onNavigateTab('group')}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold transition cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Group Study</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-right hidden xs:block">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Learning Points</p>
          <p className="text-indigo-600 font-bold text-sm sm:text-base">{userProfile.points.toLocaleString()} XP</p>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200/80 rounded-full flex items-center justify-center text-slate-600 transition cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>

          {showNotificationToast && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] font-semibold text-indigo-600">Mark read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-slate-700">
                  <p className="font-semibold text-emerald-900">👥 Campus Study Room Active</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Rahul and 3 classmates started a 50m DSA focus sprint.</p>
                </div>
                <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-slate-700">
                  <p className="font-semibold text-indigo-900">Adaptive Rebalance Ready</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">AVL Trees prerequisite unit prioritized for tonight.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Login & Logout Dropdown */}
        <div className="relative">
          {isLoggedIn ? (
            <div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ST'}
                </div>
                <span className="text-xs font-bold text-slate-700 pr-1 hidden sm:inline">
                  {userProfile.name.split(' ')[0]}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-fadeIn space-y-2">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{userProfile.email || 'student@university.edu'}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold truncate mt-0.5">
                      {userProfile.institution}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>College Profile Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


