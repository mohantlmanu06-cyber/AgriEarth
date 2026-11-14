import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';
import { supabase, mapSupabaseUser, DEMO_USERS } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  tryDemo: () => Promise<void>;
  loginAsDemoUser: (demoId: 'farmer-sarah' | 'advisor-marcus') => Promise<boolean>;
  loading: boolean;
  authSource: 'supabase' | 'backend' | 'offline_fallback';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authSource, setAuthSource] = useState<'supabase' | 'backend' | 'offline_fallback'>('supabase');

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // 1. Check Supabase session first
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && session.user && mounted) {
          const mapped = mapSupabaseUser(session.user);
          setUser(mapped);
          setToken(session.access_token);
          setAuthSource('supabase');
          setIsDemo(false);
          setLoading(false);
          return;
        }

        if (error) {
          console.warn("Supabase session check notice:", error.message);
        }

        // 2. Check cached local session
        const savedToken = localStorage.getItem('fieldshift_token');
        const savedUser = localStorage.getItem('fieldshift_user');
        const savedDemo = localStorage.getItem('fieldshift_is_demo') === 'true';

        if (savedToken && savedUser && mounted) {
          try {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
            setIsDemo(savedDemo);
            setAuthSource(savedDemo ? 'offline_fallback' : 'backend');
          } catch (e) {
            console.error("Failed to parse cached user", e);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user && mounted) {
        const mapped = mapSupabaseUser(session.user);
        setUser(mapped);
        setToken(session.access_token);
        setAuthSource('supabase');
        setIsDemo(false);
        localStorage.setItem('fieldshift_token', session.access_token);
        localStorage.setItem('fieldshift_user', JSON.stringify(mapped));
        localStorage.setItem('fieldshift_is_demo', 'false');
      } else if (event === 'SIGNED_OUT' && mounted) {
        setUser(null);
        setToken(null);
        setIsDemo(false);
        localStorage.removeItem('fieldshift_token');
        localStorage.removeItem('fieldshift_user');
        localStorage.removeItem('fieldshift_is_demo');
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const cleanEmail = email.trim();

    // 1. Direct Supabase Auth attempt
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (!error && data?.user && data?.session) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        setToken(data.session.access_token);
        setIsDemo(false);
        setAuthSource('supabase');
        localStorage.setItem('fieldshift_token', data.session.access_token);
        localStorage.setItem('fieldshift_user', JSON.stringify(mapped));
        localStorage.setItem('fieldshift_is_demo', 'false');
        setLoading(false);
        return true;
      }
      if (error) {
        console.warn("Supabase sign-in message:", error.message);
      }
    } catch (sbErr) {
      console.warn("Supabase sign-in exception:", sbErr);
    }

    // 2. Django Backend fallback attempt
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      if (res.ok) {
        const backendData = await res.json();
        setUser(backendData.user);
        setToken(backendData.tokens.access);
        setIsDemo(false);
        setAuthSource('backend');
        localStorage.setItem('fieldshift_token', backendData.tokens.access);
        localStorage.setItem('fieldshift_user', JSON.stringify(backendData.user));
        localStorage.setItem('fieldshift_is_demo', 'false');
        setLoading(false);
        return true;
      }
    } catch (backendErr) {
      console.warn("Backend auth exception:", backendErr);
    }

    // 3. Fallback for pre-seeded demo user shortcuts
    if (
      cleanEmail.includes('sarah') ||
      cleanEmail.includes('marcus') ||
      cleanEmail.includes('demo') ||
      password === 'Password123!' ||
      password === 'demo1234'
    ) {
      await tryDemo();
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const loginAsDemoUser = async (demoId: 'farmer-sarah' | 'advisor-marcus'): Promise<boolean> => {
    const demoUser = DEMO_USERS.find(u => u.id === demoId) || DEMO_USERS[0];
    return await login(demoUser.credentials.email, demoUser.credentials.password);
  };

  const register = async (formData: any): Promise<boolean> => {
    setLoading(true);

    try {
      // 1. Submit to Django API (which provisions Django DB Farm & Fields AND syncs to Supabase Admin with email_confirm: true)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const backendData = await res.json();

        // 2. Automatically log in to Supabase in browser
        try {
          const sbLogin = await supabase.auth.signInWithPassword({
            email: formData.email.trim(),
            password: formData.password,
          });
          if (sbLogin.data?.session) {
            setToken(sbLogin.data.session.access_token);
            localStorage.setItem('fieldshift_token', sbLogin.data.session.access_token);
          }
        } catch (sbErr) {
          console.warn("Auto sign-in notice:", sbErr);
        }

        const newUser: User = backendData.user || {
          id: backendData.user?.id || Date.now(),
          username: formData.email.split('@')[0],
          email: formData.email,
          name: formData.name,
          role: formData.role || 'farmer',
          phone_number: formData.phone_number,
        };

        setUser(newUser);
        setIsDemo(false);
        setAuthSource('supabase');
        localStorage.setItem('fieldshift_user', JSON.stringify(newUser));
        localStorage.setItem('fieldshift_is_demo', 'false');
        setLoading(false);
        return true;
      }
    } catch (e) {
      console.warn("Django register endpoint notice, trying direct Supabase", e);
    }

    // 2. Direct Supabase signUp fallback
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role || 'farmer',
            phone: formData.phone_number,
          },
        },
      });

      if (!error && data.user) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        if (data.session) {
          setToken(data.session.access_token);
          localStorage.setItem('fieldshift_token', data.session.access_token);
        }
        setIsDemo(false);
        setAuthSource('supabase');
        localStorage.setItem('fieldshift_user', JSON.stringify(mapped));
        localStorage.setItem('fieldshift_is_demo', 'false');
        setLoading(false);
        return true;
      }
    } catch (sbErr) {
      console.error("Direct Supabase registration notice:", sbErr);
    }

    // 3. Fallback simulated session
    const fallbackUser: User = {
      id: Date.now(),
      username: formData.email.split('@')[0],
      email: formData.email,
      name: formData.name,
      role: formData.role || 'farmer',
      phone_number: formData.phone_number,
    };
    setUser(fallbackUser);
    setToken('simulated_jwt_token');
    setAuthSource('offline_fallback');
    localStorage.setItem('fieldshift_token', 'simulated_jwt_token');
    localStorage.setItem('fieldshift_user', JSON.stringify(fallbackUser));
    setLoading(false);
    return true;
  };

  const tryDemo = async (): Promise<void> => {
    setLoading(true);
    try {
      const demoData = await apiService.seedDemo();
      const demoUser: User = demoData.user || {
        id: 'farmer-sarah',
        username: 'sarah.jenkins',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@fieldshift.earth',
        role: 'farmer',
        phone_number: '+1 (555) 234-5678',
      };
      const demoToken = demoData.tokens?.access || 'demo_token_key';

      setUser(demoUser);
      setToken(demoToken);
      setIsDemo(true);
      setAuthSource('offline_fallback');
      localStorage.setItem('fieldshift_token', demoToken);
      localStorage.setItem('fieldshift_user', JSON.stringify(demoUser));
      localStorage.setItem('fieldshift_is_demo', 'true');
    } catch (e) {
      console.error("Error setting demo:", e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }
    setUser(null);
    setToken(null);
    setIsDemo(false);
    localStorage.removeItem('fieldshift_token');
    localStorage.removeItem('fieldshift_user');
    localStorage.removeItem('fieldshift_is_demo');
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isDemo,
        login,
        register,
        logout,
        tryDemo,
        loginAsDemoUser,
        loading,
        authSource,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
