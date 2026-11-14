import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS, SUPABASE_URL } from '../../services/supabase';
import {
  Sprout,
  Satellite,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemoUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Supabase authentication failed. Please verify credentials or click one of the demo users below.');
    }
  };

  const handleQuickDemoLogin = async (demoId: 'farmer-sarah' | 'advisor-marcus') => {
    setError(null);
    setActiveDemo(demoId);
    setLoading(true);
    const success = await loginAsDemoUser(demoId);
    setLoading(false);
    setActiveDemo(null);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Demo login attempt failed. Please try manual entry.');
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-lg w-full space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome to Field Shift
          </h2>
          <p className="text-xs text-slate-500">
            Adapting Farms with NASA Earth Telemetry & Supabase Authentication
          </p>
        </div>

        {/* Supabase Status Banner */}
        <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 flex items-center justify-between gap-3 text-xs shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-400">Supabase Auth Connected</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]" title={SUPABASE_URL}>
            {SUPABASE_URL.replace('https://', '')}
          </span>
        </div>

        {/* 2 Demo User Switchers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
              <span>Pre-Seeded Demo User Accounts</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">One-click live access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_USERS.map((demo) => {
              const isSarah = demo.id === 'farmer-sarah';
              return (
                <div
                  key={demo.id}
                  className={`p-3.5 rounded-2xl border transition text-left flex flex-col justify-between ${
                    isSarah
                      ? 'bg-emerald-50/60 border-emerald-200/90 hover:border-emerald-400'
                      : 'bg-sky-50/60 border-sky-200/90 hover:border-sky-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isSarah
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-sky-200 text-sky-900'
                        }`}
                      >
                        {demo.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => fillCredentials(demo.credentials.email, demo.credentials.password)}
                        className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                        title="Copy into form below"
                      >
                        Fill Form
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{demo.name}</h4>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5 truncate">{demo.email}</p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {demo.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(demo.id as 'farmer-sarah' | 'advisor-marcus')}
                    disabled={loading}
                    className={`mt-3 w-full py-2 rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 ${
                      isSarah
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>
                      {activeDemo === demo.id ? 'Connecting...' : `Sign In as ${demo.name.split(' ')[0]}`}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Supabase Email/Password Form */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or sign in with custom credentials
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah.jenkins@fieldshift.earth"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>Remember me</span>
            </label>
            <span className="text-[11px] text-slate-500">
              Demo pwd: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">Password123!</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{loading ? 'Authenticating via Supabase...' : 'Sign In with Supabase'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-1">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-emerald-600 font-bold hover:underline">
            Register your farm with Supabase
          </Link>
        </p>

      </div>
    </div>
  );
};
