import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import ThemeToggle from '../landing/ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-lg border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to={`/${user?.role}/dashboard`} className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            LaundryPro
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline">
              Welcome, <span className="font-medium text-slate-900 dark:text-slate-100">{user?.name}</span>
            </span>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
