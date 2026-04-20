import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogIn, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';

// ============================================
// LOGIN PAGE COMPONENT
// Handles user authentication with glassmorphism design
// ============================================
const Login = () => {
  // Form state
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get login function from AuthContext
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ============================================
  // HANDLE FORM SUBMISSION
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('📝 Login form submitted');
    console.log(`   📧 Email: ${formData.email}`);
    
    try {
      // Call login function from AuthContext
      console.log('   🔐 Calling login function...');
      const data = await login(formData.email, formData.password);
      
      console.log('✅ Login successful, navigating to dashboard...');
      console.log(`   🎯 Redirecting to: /${data.role}/dashboard`);
      
      // Navigate to role-specific dashboard
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed';
      console.error(`   💬 Error message: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-violet-950">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] animate-grid"></div>
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-float-delayed"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer pointer-events-none"></div>
          
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl mb-4 shadow-lg animate-float">
              <LogIn size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center justify-center gap-2">
              Welcome Back
              <Sparkles size={20} className="text-violet-600 dark:text-violet-400 animate-pulse" />
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to your account
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="backdrop-blur-lg bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 animate-shake">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Lock size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-300 hover:scale-110"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Create account
              </Link>
            </p>
            <Link to="/" className="text-sm text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-all">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(10px);
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
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        @keyframes grid {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(60px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .animate-grid {
          animation: grid 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
