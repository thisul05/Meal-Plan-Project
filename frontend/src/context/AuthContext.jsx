import { createContext, useContext, useState, useEffect } from 'react';

// AuthContext makes the logged-in user available anywhere in the tree
// without prop-drilling through every component.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);   // { id, name, email }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking localStorage

  // On first load, restore the session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const { user, token } = JSON.parse(stored);
        setUser(user);
        setToken(token);
      } catch {
        localStorage.removeItem('auth');
      }
    }
    setLoading(false);
  }, []);

  function login(user, token) {
    setUser(user);
    setToken(token);
    // Security note: localStorage is readable by JS — an XSS vulnerability
    // could steal this token. For higher security, use httpOnly cookies instead.
    localStorage.setItem('auth', JSON.stringify({ user, token }));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — components call useAuth() instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext);
}
