import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const SUPER_ADMINS = ['nghiemquynh0210@gmail.com'];

interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'staff' | 'viewer';
  staff_id?: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveUser = async (supabaseUser: User) => {
    const baseUser: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      username: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'User',
      role: supabaseUser.user_metadata?.role || 'staff',
      staff_id: supabaseUser.user_metadata?.staff_id || null,
    };

    // Check if this user has been promoted to admin via staff table
    if (supabaseUser.email) {
      const { data: staffRecord } = await supabase
        .from('staff')
        .select('id, status, full_name')
        .eq('email', supabaseUser.email)
        .maybeSingle();

      if (staffRecord) {
        baseUser.staff_id = staffRecord.id;
        baseUser.username = staffRecord.full_name || baseUser.username;
        // If staff status is 'admin', override role to admin
        if (staffRecord.status === 'admin') {
          baseUser.role = 'admin';
        }
      }
    }

    // Super admin override — always admin regardless of staff table
    if (SUPER_ADMINS.includes(baseUser.email)) {
      baseUser.role = 'admin';
    }

    return baseUser;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        try {
          const resolved = await resolveUser(session.user);
          setUser(resolved);
        } catch (err) {
          console.error('Failed to resolve user from session:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }).catch((err) => {
      console.error('getSession failed:', err);
      setSession(null);
      setUser(null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        try {
          const resolved = await resolveUser(session.user);
          setUser(resolved);
        } catch (err) {
          console.error('Failed to resolve user on state change:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('signOut error:', err);
    }
    // Always clear local state regardless of signOut success
    setSession(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
