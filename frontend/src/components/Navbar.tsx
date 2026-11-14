import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Satellite, Menu, X, ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, tryDemo, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'NASA Data', path: '/nasa-data' },
    { label: 'Features', path: '/features' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleDemoClick = async () => {
    await tryDemo();
    navigate('/dashboard');
  };

  return (
    <nav className="sticky top-0 z-50 bg-emerald-950/85 backdrop-blur-md border-b border-emerald-800/40 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Satellite className="w-5 h-5 text-sky-400 absolute -top-1 -right-1 opacity-70" />
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white">Field Shift</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-emerald-800/80 text-emerald-300 border border-emerald-600/40">
                  NASA AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 -mt-0.5 tracking-wide">
                Adaptive Agro-Earth Decision Support
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'text-white bg-emerald-800/50 border border-emerald-700/50'
                      : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleDemoClick}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-950/30 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-amber-300" />
              <span>Launch Platform</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Farmer App</span>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-200 hover:text-white hover:bg-emerald-900/60 transition border border-emerald-800/60"
                  title="Sign out of current account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-emerald-100 hover:text-white hover:bg-emerald-900/60 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
                >
                  <span>Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleDemoClick}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/80"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 border-b border-emerald-800/80 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-100 hover:bg-emerald-900"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-emerald-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDemoClick();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-amber-500 text-slate-950"
            >
              <Sparkles className="w-4 h-4 fill-amber-300" />
              <span>Open Farm Platform</span>
            </button>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl font-semibold bg-emerald-600 text-white"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 rounded-xl font-medium bg-emerald-900 text-emerald-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 rounded-xl font-semibold bg-emerald-600 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
