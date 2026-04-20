import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  Settings, 
  CreditCard, 
  Users, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Shirt,
  Store,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ThemeToggle from '../landing/ThemeToggle';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ role, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    console.log('🚪 Logout button clicked');
    logout();
    console.log('✅ Logout function called, navigating to login...');
    navigate('/login');
  };

  const customerLinks = [
    { path: '/customer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/customer/select-provider', icon: Store, label: 'Find Provider' },
    { path: '/customer/orders', icon: ClipboardList, label: 'My Orders' },
  ];

  const providerLinks = [
    { path: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/provider/orders', icon: Package, label: 'Orders' },
    { path: '/provider/garments', icon: Shirt, label: 'Garments' },
    { path: '/provider/payment-setup', icon: CreditCard, label: 'Payment Setup' },
    { path: '/provider/setup', icon: Settings, label: 'Settings' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Manage Users' },
    { path: '/admin/orders', icon: Package, label: 'All Orders' },
    { path: '/admin/complaints', icon: MessageSquare, label: 'Complaints' },
  ];

  const links = role === 'customer' ? customerLinks : role === 'provider' ? providerLinks : adminLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button - Fixed position with better spacing */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:scale-105 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} className="text-slate-700 dark:text-slate-300" /> : <Menu size={20} className="text-slate-700 dark:text-slate-300" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-r border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 z-40 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse Button (Desktop Only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 items-center justify-center bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Logo */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
            <Link to={`/${role}/dashboard`} className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                L
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    LaundryPro
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">{role} Portal</p>
                </div>
              )}
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-blue-100 dark:ring-blue-900">
                {userName?.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{userName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 capitalize">{role}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg scale-105'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:scale-105'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? link.label : ''}
                    >
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                      )}
                      <Icon size={20} className={`${active ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                      {!isCollapsed && <span className="font-medium">{link.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-sm text-slate-600 dark:text-slate-400">Theme</span>
                <ThemeToggle />
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center py-2">
                <ThemeToggle />
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 hover:scale-105 group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`} />

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
