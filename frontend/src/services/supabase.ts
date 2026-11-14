import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://trqjqopeguwphzmmowwz.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_QNigGY20RTVajhFY5HSPEA_ZCyToUjB';
export const SUPABASE_JWKS_URL =
  import.meta.env.VITE_SUPABASE_JWKS_URL ||
  'https://trqjqopeguwphzmmowwz.supabase.co/auth/v1/.well-known/jwks.json';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface DemoUserOption {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'advisor' | 'researcher';
  description: string;
  badge: string;
  avatarSeed: string;
  credentials: {
    email: string;
    password: string;
  };
}

export const DEMO_USERS: DemoUserOption[] = [
  {
    id: 'farmer-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@fieldshift.earth',
    role: 'farmer',
    description: 'Farm Operator at Green Valley Sustainable Fields (45 ha). Optimizing rice-legume rotations & SMAP root moisture.',
    badge: 'Farm Producer',
    avatarSeed: 'sarah',
    credentials: {
      email: 'sarah.jenkins@fieldshift.earth',
      password: 'Password123!',
    },
  },
  {
    id: 'advisor-marcus',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@fieldshift.earth',
    role: 'advisor',
    description: 'Senior Agronomist & NASA Space Apps Technical Reviewer. Auditing GPM precipitation & ECOSTRESS thermal stress.',
    badge: 'NASA Science Advisor',
    avatarSeed: 'marcus',
    credentials: {
      email: 'marcus.vance@fieldshift.earth',
      password: 'Password123!',
    },
  },
];

export function mapSupabaseUser(sbUser: any): User {
  if (!sbUser) {
    return {
      id: 1,
      username: 'sarah.jenkins',
      email: 'sarah.jenkins@fieldshift.earth',
      name: 'Sarah Jenkins',
      role: 'farmer',
      phone_number: '+1 (555) 234-5678',
    };
  }

  const metadata = sbUser.user_metadata || {};
  let defaultName = 'Sarah Jenkins';
  let defaultRole: 'farmer' | 'advisor' | 'researcher' = 'farmer';

  if (sbUser.email?.includes('marcus')) {
    defaultName = 'Dr. Marcus Vance';
    defaultRole = 'advisor';
  }

  return {
    id: sbUser.id || 1,
    username: metadata.username || sbUser.email?.split('@')[0] || 'field_operator',
    email: sbUser.email || '',
    name: metadata.name || defaultName,
    role: (metadata.role as 'farmer' | 'advisor' | 'researcher') || defaultRole,
    phone_number: metadata.phone || metadata.phone_number || '+1 (555) 234-5678',
  };
}
