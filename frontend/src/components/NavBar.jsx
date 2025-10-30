import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Icon from "./Icon";
import ThemeSelector from "./ThemeSelector";

export default function NavBar() {
  const [user, setUser] = useState(null); // user object from localStorage
  const [admin, setAdmin] = useState(null); // admin object from localStorage
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
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

    // Initial check
    checkAuthState();

    // Listen for storage changes to update auth state without refresh
    const handleStorageChange = () => {
      checkAuthState();
    };

    // Listen for custom events (for same-tab updates)
    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser(null);
    setAdmin(null);
    setIsAdmin(false);
    setMobileMenuOpen(false);
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('authStateChanged'));
    
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isActiveRoute = (path) => location.pathname === path;

  const navItems = user && !isAdmin ? [
    { to: "/", icon: "home", label: "Home" },
    { to: "/dashboard", icon: "chart-bar", label: "Dashboard" },
    { to: "/polls", icon: "user-group", label: "Polls" },
    { to: "/posts", icon: "chat", label: "Posts" },
    { to: "/candidates", icon: "user-group", label: "Candidates" },
    { to: "/feedback", icon: "chat", label: "Feedback" },
  ] : isAdmin ? [
    { to: "/", icon: "home", label: "Home" },
    { to: "/admin/dashboard", icon: "chart-bar", label: "Dashboard" },
    { to: "/admin/candidates", icon: "user-group", label: "Candidates" },
    { to: "/admin/create-poll", icon: "plus", label: "Create Poll" },
    { to: "/results", icon: "chart-bar", label: "Manage Polls and votes" },
    { to: "/admin/feedback", icon: "chat", label: "Feedback" },
    { to: "/admin/settings", icon: "cog", label: "Settings" },
  ] : [
    { to: "/", icon: "home", label: "Home" },
    { to: "/candidates", icon: "user-group", label: "Browse Candidates" },
    { to: "/posts", icon: "chat", label: "Posts" },
    { to: "/about", icon: "info", label: "About" }
  ];

  const profileLink = isAdmin ? "/admin/dashboard" : "/dashboard";
  const settingsLink = isAdmin ? "/admin/settings" : "/settings";
  const displayName = isAdmin ? (admin?.name || 'Admin') : (user?.name || 'User');
  const displayEmail = isAdmin ? (admin?.email || 'admin@voteapp.com') : (user?.email || 'user@voteapp.com');

  // Helper to resolve avatar URL (filename -> full URL)
  const AVATAR_BASE = "http://localhost:3000/upload/";
  const resolveAvatar = (v) => {
    if (!v) return "";
    return /^https?:\/\//i.test(v) ? v : `${AVATAR_BASE}${v}`;
  };

  const userAvatar = !isAdmin ? resolveAvatar(user?.avatar || "") : "";

  return (
    <>
      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`navbar sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-base-100/95 backdrop-blur-md shadow-lg border-b border-base-300/50' 
          : 'bg-base-100/80 backdrop-blur-sm shadow-sm'
      }`}>
        <div className="navbar-start">
          {/* Mobile menu button with animation */}
          <div className="lg:hidden">
            <button 
              className={`btn btn-ghost btn-square transition-transform duration-200 ${
                mobileMenuOpen ? 'rotate-90' : ''
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <Icon name="close" size="lg" />
              ) : (
                <Icon name="menu" size="lg" />
              )}
            </button>
          </div>

          {/* Logo with enhanced styling */}
          <Link to="/" className="btn btn-ghost text-xl font-bold group hover:scale-105 transition-transform duration-200">
            <div className="relative">
              <div className="avatar">
                <div className="w-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-center h-full text-primary-content font-bold text-lg">
                    V
                  </div>
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VoteApp
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <div className="flex items-center gap-1 bg-base-200/50 rounded-full p-1 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`btn btn-sm rounded-full transition-all duration-200 ${
                  isActiveRoute(item.to)
                    ? 'btn-primary shadow-lg scale-105'
                    : 'btn-ghost hover:btn-primary/20 hover:scale-105'
                }`}
              >
                <Icon name={item.icon} size="sm" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right side elements */}
        <div className="navbar-end gap-3">
          {/* Theme selector with enhanced styling */}
          <div className="hidden sm:block">
            <ThemeSelector />
          </div>
          
          {/* User menu or auth buttons */}
          {user || isAdmin ? (
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform duration-200"
              >
                <div className={`w-12 rounded-full ring-2 ring-offset-2 ring-offset-base-100 hover:ring-primary/60 transition-all duration-300 ${isAdmin ? 'ring-error/50 hover:ring-error' : 'ring-primary/30'}`}>
                  {isAdmin ? (
                    <div className="avatar placeholder">
                      <div className="text-primary-content rounded-full w-12 h-12 flex items-center justify-center shadow-lg bg-gradient-to-br from-error via-warning to-error">
                        <span className="text-sm font-bold"><Icon name="shield" size="md" /></span>
                      </div>
                    </div>
                  ) : userAvatar ? (
                    <img src={userAvatar} alt={displayName} className="rounded-full w-12 h-12 object-cover" />
                  ) : (
                    <div className="avatar placeholder">
                      <div className="text-primary-content rounded-full w-12 h-12 flex items-center justify-center shadow-lg bg-gradient-to-br from-primary via-secondary to-accent">
                        <span className="text-sm font-bold">{getInitials(user?.name || 'U')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-md rounded-2xl z-[1] mt-3 w-56 p-3 shadow-2xl border border-base-300/50">
                <li className="menu-title px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                      {isAdmin ? (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-error/20 to-warning/20">
                          <span className="text-xs font-bold"><Icon name="shield" size="sm" color="text-error" /></span>
                        </div>
                      ) : userAvatar ? (
                        <img src={userAvatar} alt={displayName} className="w-8 h-8 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                          <span className="text-xs font-bold">{getInitials(user?.name || 'U')}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold flex items-center gap-2">
                        {displayName}
                        {isAdmin && <span className="badge badge-error badge-xs">ADMIN</span>}
                      </span>
                      <div className="text-xs text-base-content/60">
                        {displayEmail}
                      </div>
                    </div>
                  </div>
                </li>
                <div className="divider my-2"></div>
                <li>
                  <Link to={profileLink} className="rounded-xl hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                    <Icon name="user" size="sm" /> Profile
                  </Link>
                </li>
                <li>
                  <Link to={settingsLink} className="rounded-xl hover:bg-primary/10" onClick={() => setMobileMenuOpen(false)}>
                    <Icon name="cog" size="sm" /> Settings
                  </Link>
                </li>
                <li className="sm:hidden"><ThemeSelector /></li>
                <div className="divider my-2"></div>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="text-error rounded-xl hover:bg-error/10 w-full text-left"
                  >
                    <Icon name="logout" size="sm" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link 
                to="/login" 
                className="btn btn-ghost btn-sm hover:btn-primary/20 transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile slide-out menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-base-100/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out lg:hidden border-r border-base-300/50 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <div className="flex items-center justify-center h-full text-primary-content font-bold">
                    V
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                VoteApp
              </span>
            </div>
            <button 
              className="btn btn-ghost btn-square btn-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon name="close" size="md" />
            </button>
          </div>

          {/* Mobile navigation items */}
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={item.to} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in-up">
                <Link
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                    isActiveRoute(item.to)
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30'
                      : 'hover:bg-base-200/50'
                  }`}
                >
                  <Icon name={item.icon} size="lg" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile theme selector */}
          <div className="mt-8 p-4 bg-base-200/30 rounded-2xl">
            <div className="text-sm font-medium mb-3">Theme</div>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </>
  );
}