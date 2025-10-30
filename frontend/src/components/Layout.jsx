import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Background from './Background';
import AlertProvider from './Alert';

export default function Layout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null); // stored user object
  const [admin, setAdmin] = useState(null); // stored admin object
  const location = useLocation();

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      const storedUser = localStorage.getItem("user");
      const storedAdmin = localStorage.getItem("admin");
      
      if (token) {
        setIsAdmin(false);
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setAdmin(null);
      } else if (adminToken) {
        setIsAdmin(true);
        setAdmin(storedAdmin ? JSON.parse(storedAdmin) : null);
        setUser(null);
      } else {
        setUser(null);
        setAdmin(null);
        setIsAdmin(false);
      }
    };

    checkAuthState();

    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);

  // Check if current route is a full-screen page (login/signup)
  const isFullScreenPage = ['/login', '/signup', '/admin/login'].includes(location.pathname);
  
  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isFullScreenPage) {
    return (
      <Background>
        <AlertProvider />
        {children}
      </Background>
    );
  }

  return (
    <Background>
      <AlertProvider />
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        {/* Main Content Area */}
        <main className="flex-1">
          {isAdminRoute && isAdmin ? (
            // Admin Layout
            <div className="container mx-auto px-4 py-6">
              <div className="mb-6">
                <div className="alert alert-info shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Administrator Mode</h3>
                      <div className="text-xs">{admin?.email || 'You have administrative privileges'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Admin Sidebar */}
                <div className="lg:col-span-3">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-4">
                      <h2 className="card-title text-lg">Admin Tools</h2>
                      <div className="space-y-2">
                        <div className="stats stats-vertical shadow">
                          <div className="stat">
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value text-primary">3</div>
                          </div>
                          <div className="stat">
                            <div className="stat-title">Active Polls</div>
                            <div className="stat-value text-secondary">8</div>
                          </div>
                          <div className="stat">
                            <div className="stat-title">Total Votes</div>
                            <div className="stat-value text-accent">9</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Admin Main Content */}
                <div className="lg:col-span-9">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // User Layout
            <div className="container mx-auto px-4 py-6">
              {user && (
                <div className="mb-6">
                  <div className="alert alert-success shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold">Welcome back, {user.name || 'User'}!</h3>
                        <div className="text-xs">{user.email || 'Ready to participate in democracy'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* User Sidebar */}
                {user && (
                  <div className="lg:col-span-3">
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body p-4">
                        <h2 className="card-title text-lg">Quick Stats</h2>
                        <div className="space-y-2">
                          <div className="stats stats-vertical shadow">
                            <div className="stat">
                              <div className="stat-title">Your Votes</div>
                              <div className="stat-value text-primary">2</div>
                            </div>
                            <div className="stat">
                              <div className="stat-title">Available Polls</div>
                              <div className="stat-value text-secondary">8</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* User Main Content */}
                <div className={user ? "lg:col-span-9" : "lg:col-span-12"}>
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
          <div>
            <p> 2024 VoteApp - Secure Democratic Voting Platform</p>
          </div>
        </footer>
      </div>
    </Background>
  );
}
