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
  position_name?: string | null;
  department_name?: string | null;
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

  // Remove Vietnamese diacritics from a string
  const removeDiacritics = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  // Convert full name to email: "Nghiêm Xuân Quỳnh" → "nghiemxuanquynh@ubndanphu.com"
  const nameToEmail = (name: string): string => {
    return removeDiacritics(name).toLowerCase().replace(/\s+/g, '') + '@ubndanphu.com';
  };

  const resolveUser = async (supabaseUser: User) => {
    const baseUser: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      username: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'User',
      role: 'staff',
      staff_id: supabaseUser.user_metadata?.staff_id || null,
    };

    if (supabaseUser.email) {
      // Step 1: Try exact email match
      let { data: staffRecord } = await supabase
        .from('staff')
        .select('id, status, full_name, positions:position_id(name), departments:department_id(name), party_positions:party_position_id(name), party_departments:party_department_id(name)')
        .eq('email', supabaseUser.email)
        .maybeSingle();

      // Step 2: If no match, try auto-matching by converting staff names to email format
      if (!staffRecord) {
        const { data: allStaff } = await supabase
          .from('staff')
          .select('id, status, full_name, email, positions:position_id(name), departments:department_id(name), party_positions:party_position_id(name), party_departments:party_department_id(name)');

        if (allStaff) {
          const match = allStaff.find((s: any) => nameToEmail(s.full_name) === supabaseUser.email!.toLowerCase());
          if (match) {
            staffRecord = match;
            // Auto-save the email link for future fast lookups
            await supabase.from('staff').update({ email: supabaseUser.email }).eq('id', match.id);
          }
        }
      }

      if (staffRecord) {
        baseUser.staff_id = staffRecord.id;
        baseUser.username = staffRecord.full_name || baseUser.username;
        baseUser.position_name = (staffRecord as any).positions?.name || (staffRecord as any).party_positions?.name || null;
        baseUser.department_name = (staffRecord as any).departments?.name || (staffRecord as any).party_departments?.name || null;
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
