'use client';

// Simple admin authentication using localStorage
// In production, this should be replaced with proper JWT tokens and server-side sessions

export const ADMIN_CREDENTIALS = {
  username: 'admin@kregime.com',
  password: '3WC08Wyu01',
};

export const adminAuth = {
  login: (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kregime_admin_session', 'true');
        localStorage.setItem('kregime_admin_login_time', Date.now().toString());
      }
      return true;
    }
    return false;
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