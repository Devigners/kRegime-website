'use client';

// Admin authentication using API and localStorage for session management
// Password is stored in database and checked via API

export const ADMIN_CREDENTIALS = {
  username: 'admin@kregime.com',
};

export const adminAuth = {
  login: async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('kregime_admin_session', 'true');
          localStorage.setItem('kregime_admin_login_time', Date.now().toString());
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kregime_admin_session');
      localStorage.removeItem('kregime_admin_login_time');
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const session = localStorage.getItem('kregime_admin_session');
    const loginTime = localStorage.getItem('kregime_admin_login_time');
    
    if (!session || !loginTime) return false;
    
    // Session expires after 8 hours (8 * 60 * 60 * 1000 milliseconds)
    const sessionDuration = 8 * 60 * 60 * 1000;
    const currentTime = Date.now();
    const sessionAge = currentTime - parseInt(loginTime);
    
    if (sessionAge > sessionDuration) {
      adminAuth.logout();
      return false;
    }
    
    return true;
  },

  getSessionTimeRemaining: (): number => {
    if (typeof window === 'undefined') return 0;
    
    const loginTime = localStorage.getItem('kregime_admin_login_time');
    if (!loginTime) return 0;
    
    const sessionDuration = 8 * 60 * 60 * 1000;
    const currentTime = Date.now();
    const sessionAge = currentTime - parseInt(loginTime);
    
    return Math.max(0, sessionDuration - sessionAge);
  },
};