import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  Activity,
  Repeat,
  Sparkles,
  Satellite,
  CloudSun,
  Sprout,
  BookOpen,
  GitCompare,
  FileText,
  UserCheck,
  LogOut,
  ShieldCheck,
  History,
  SlidersHorizontal,
  AlertTriangle,
  Database,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navGroups = [
    {
      group: 'Farm & Fields',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Fields', path: '/fields', icon: Layers },
        { label: 'Crop History', path: '/crop-history', icon: History, badge: 'Seasons' },
      ]
    },
    {
      group: 'Rotation Intelligence',
      items: [
        { label: 'Rotation Lab', path: '/planner', icon: Repeat },
        { label: 'Recommendations', path: '/recommendations', icon: Sparkles, badge: 'Core' },
        { label: 'Compare Scenarios', path: '/compare-rotations', icon: GitCompare },
        { label: 'What If? Simulator', path: '/what-if', icon: SlidersHorizontal, badge: 'Sim' },
        { label: 'Risk & Uncertainty', path: '/risk-uncertainty', icon: AlertTriangle },
        { label: 'Crop Database', path: '/crops', icon: BookOpen },
      ]
    },
    {
      group: 'Earth Observation',
      items: [
        { label: 'Earth Explorer', path: '/nasa-explorer', icon: Satellite, badge: 'NASA' },
        { label: 'Field Analysis', path: '/field-analysis', icon: Activity },
        { label: 'Weather & Climate', path: '/weather-climate', icon: CloudSun },
        { label: 'Soil Health', path: '/soil-health', icon: Sprout },
      ]
    },
    {
      group: 'Transparency & Reports',
      items: [
        { label: 'Sustainability Reports', path: '/reports', icon: FileText },
        { label: 'NASA Data Sources', path: '/data-sources', icon: Database, badge: 'Open' },
        { label: 'Profile & Settings', path: '/settings', icon: UserCheck },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-68 bg-emerald-950 text-slate-100 flex flex-col border-r border-emerald-800/50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-emerald-900/80 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                Field Shift
              </span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide">
                NASA Agro Intelligence
              </span>
            </div>
          </NavLink>
        </div>

        {/* Live Telemetry Status Badge */}
        <div className="mx-3 mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NASA Synced Active</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scroll">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-emerald-400/70">
                {grp.group}
              </p>
              {grp.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/40'
                          : 'text-emerald-100/75 hover:text-white hover:bg-emerald-900/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-emerald-300" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-800 text-emerald-300 border border-emerald-600/40">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-emerald-900/80 bg-emerald-950/90">
          <div className="flex items-center justify-between bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0 shadow-sm">
                {user?.name ? user.name[0] : 'F'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Farmer Sarah'}</p>
                <p className="text-[10px] text-emerald-300 capitalize truncate">{user?.role || 'Farmer'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-emerald-300/80 hover:text-red-400 hover:bg-red-950/40 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
