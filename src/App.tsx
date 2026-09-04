import React, { useEffect, useState } from 'react';
import { AgriPilotProvider } from './context/AgriPilotContext';
import { AppShell } from './components/layout/AppShell';
import { AuthPage } from './components/auth/AuthPage';
import { apiService, AuthSession, AuthUser } from './services/api';

type AuthMode = 'login' | 'register';

const getAuthModeFromPath = (): AuthMode => (window.location.pathname.toLowerCase() === '/register' ? 'register' : 'login');

export const App: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(() => apiService.getStoredToken());
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(Boolean(apiService.getStoredToken()));
  const [authMode, setAuthMode] = useState<AuthMode>(getAuthModeFromPath);

  useEffect(() => {
    const syncFromLocation = () => {
      setAuthMode(getAuthModeFromPath());
    };

    const handleStorageChange = () => {
      const storedToken = apiService.getStoredToken();
      setAuthToken(storedToken);
      if (!storedToken) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthMode(getAuthModeFromPath());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('popstate', syncFromLocation);
    syncFromLocation();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('popstate', syncFromLocation);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      if (!authToken) {
        setIsCheckingSession(false);
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }

      setIsCheckingSession(true);
      const user = await apiService.getMe();
      if (!isMounted) return;

      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        if (window.location.pathname !== '/') {
          window.history.replaceState({}, '', '/');
        }
      } else {
        apiService.clearStoredToken();
        setAuthToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        window.history.replaceState({}, '', '/login');
      }

      setIsCheckingSession(false);
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [authToken]);

  const handleAuthenticate = (session: AuthSession) => {
    apiService.setStoredToken(session.accessToken);
    setAuthToken(session.accessToken);
    setCurrentUser(session.user);
    setIsAuthenticated(true);
    setIsCheckingSession(false);
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    apiService.clearStoredToken();
    apiService.logout().catch(() => undefined);
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsCheckingSession(false);
    window.history.pushState({}, '', '/login');
  };

  return (
    <AgriPilotProvider
      authToken={isAuthenticated ? authToken : null}
      authenticatedUser={isAuthenticated ? currentUser : null}
      onLogout={handleLogout}
    >
      {isCheckingSession ? (
        <div className="min-h-screen flex items-center justify-center bg-background text-charcoal-muted">
          <div className="rounded-3xl border border-emerald-100 bg-white px-6 py-4 shadow-card">
            Checking your farm session...
          </div>
        </div>
      ) : isAuthenticated ? (
        <AppShell />
      ) : (
        <AuthPage initialMode={authMode} onAuthenticate={handleAuthenticate} />
      )}
    </AgriPilotProvider>
  );
};

export default App;
