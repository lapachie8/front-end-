import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loginAttempts: number;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  loginAttempts: 0,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setAdminUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data: adminProfile, error } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (adminProfile) {
      setAdminUser({
        id: userId,
        email: (await supabase.auth.getUser()).data.user?.email || '',
        role: adminProfile.role,
      });
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    if (loginAttempts >= 3) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: adminProfile, error: adminError } = await supabase
          .from('admin_profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (adminError || !adminProfile) {
          throw new Error('Unauthorized access');
        }

        setLoginAttempts(0);
      }
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      loginAttempts,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};