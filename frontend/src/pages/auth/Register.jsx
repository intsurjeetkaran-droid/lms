import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AlertDialog from '../../components/AlertDialog';
import { 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Store, 
  MapPin, 
  Radius,
  ChevronRight,
  ChevronLeft,
  Check,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    // Provider fields
    shopName: '',
    address: '',
    serviceRadius: '',
    location: { lat: '', lng: '' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  // Define steps based on role
  const customerSteps = [
    { id: 'role', title: 'Select Role', icon: UserPlus },
    { id: 'name', title: 'Your Name', icon: User },
    { id: 'email', title: 'Email Address', icon: Mail },
    { id: 'phone', title: 'Phone Number', icon: Phone },
    { id: 'password', title: 'Password', icon: Lock }
  ];

  const providerSteps = [
    { id: 'role', title: 'Select Role', icon: UserPlus },
    { id: 'name', title: 'Your Name', icon: User },
    { id: 'email', title: 'Email Address', icon: Mail },
    { id: 'phone', title: 'Phone Number', icon: Phone },
    { id: 'password', title: 'Password', icon: Lock },
    { id: 'shopName', title: 'Shop Name', icon: Store },
    { id: 'address', title: 'Shop Address', icon: MapPin },
    { id: 'location', title: 'Location', icon: MapPin },
    { id: 'serviceRadius', title: 'Service Radius', icon: Radius }
  ];

  const steps = role === 'customer' ? customerSteps : providerSteps;
  const currentStepData = steps[currentStep];

  // Get current location using browser geolocation API
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location: {
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
          }
        });
        setLoading(false);
        setError('');
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An error occurred while getting your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleNext = () => {
    // Validate current step
    if (!validateStep()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const validateStep = () => {
    const stepId = currentStepData.id;
    
    switch (stepId) {
      case 'role':
        return true;
      case 'name':
        if (!formData.name.trim()) {
          setError('Please enter your name');
          return false;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
      case 'phone':
        if (!formData.phone.trim() || formData.phone.length < 10) {
          setError('Please enter a valid phone number');
          return false;
        }
        break;
      case 'password':
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        break;
      case 'shopName':
        if (!formData.shopName.trim()) {
          setError('Please enter your shop name');
          return false;
        }
        break;
      case 'address':
        if (!formData.address.trim()) {
          setError('Please enter your shop address');
          return false;
        }
        break;
      case 'location':
        if (!formData.location.lat || !formData.location.lng) {
          setError('Please enter location coordinates');
          return false;
        }
        break;
      case 'serviceRadius':
        // Optional field
        break;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role
      };

      // Add provider-specific fields
      if (role === 'provider') {
        registrationData.shopName = formData.shopName;
        registrationData.address = formData.address;
        registrationData.location = {
          lat: parseFloat(formData.location.lat),
          lng: parseFloat(formData.location.lng)
        };
        if (formData.serviceRadius) {
          registrationData.serviceRadius = parseInt(formData.serviceRadius);
        }
      }

      const data = await register(registrationData);
      
      // Navigate based on role
      if (role === 'provider') {
        // Show approval message for providers
        setAlertDialog({
          isOpen: true,
          type: 'success',
          title: 'Account Created',
          message: 'Your provider account has been created! Please wait for admin approval before you can start accepting orders.'
        });
      }
      
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Reset to step 0 when role changes
    if (currentStep > 0) {
      setCurrentStep(0);
    }
  };

  const renderStepContent = () => {
    const stepId = currentStepData.id;
    const Icon = currentStepData.icon;

    switch (stepId) {
      case 'role':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Choose Your Role
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Select how you want to use our platform
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={`p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
                  role === 'customer'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-900/30 shadow-lg scale-105'
                    : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105'
                }`}
              >
                <User size={32} className={`mx-auto mb-3 ${
                  role === 'customer' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                }`} />
                <h4 className={`font-semibold mb-1 ${
                  role === 'customer' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  Customer
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Get laundry services
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('provider')}
                className={`p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
                  role === 'provider'
                    ? 'border-violet-600 bg-violet-50/80 dark:bg-violet-900/30 shadow-lg scale-105'
                    : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 hover:border-violet-400 dark:hover:border-violet-500 hover:scale-105'
                }`}
              >
                <Store size={32} className={`mx-auto mb-3 ${
                  role === 'provider' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
                }`} />
                <h4 className={`font-semibold mb-1 ${
                  role === 'provider' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  Provider
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Offer laundry services
                </p>
              </button>
            </div>
          </div>
        );

      case 'name':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                What's your name?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Let us know how to address you
              </p>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-4 text-lg bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="John Doe"
              autoFocus
            />
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Your email address
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We'll use this for your account
              </p>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-4 text-lg bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="your@email.com"
              autoFocus
            />
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Phone number
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                For order updates and communication
              </p>
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-4 text-lg bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="+1 (555) 000-0000"
              autoFocus
            />
          </div>
        );

      case 'password':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-blue-600 dark:text-blue-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Create a password
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Must be at least 6 characters
              </p>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-4 pr-12 text-lg bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 transition-all"
                placeholder="••••••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all hover:scale-110"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
        );

      case 'shopName':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-violet-600 dark:text-violet-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Shop name
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                What's your business called?
              </p>
            </div>
            <input
              type="text"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              className="w-full px-4 py-4 text-lg bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="CleanWash Services"
              autoFocus
            />
          </div>
        );

      case 'address':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-violet-600 dark:text-violet-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Shop address
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Where is your shop located?
              </p>
            </div>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-4 text-lg bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-slate-900 dark:text-slate-100 transition-all resize-none"
              placeholder="123 Main Street, City, State"
              rows={3}
              autoFocus
            />
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-violet-600 dark:text-violet-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Shop Location
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We need your location to show you to nearby customers
              </p>
            </div>

            {formData.location.lat && formData.location.lng ? (
              <div className="backdrop-blur-lg bg-green-50/80 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full mb-4">
                  <MapPin size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Location Captured!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  Latitude: {parseFloat(formData.location.lat).toFixed(6)}<br />
                  Longitude: {parseFloat(formData.location.lng).toFixed(6)}
                </p>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Update Location
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin size={24} />
                    Get Current Location
                  </>
                )}
              </button>
            )}

            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Your browser will ask for permission to access your location
            </p>
          </div>
        );

      case 'serviceRadius':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Icon size={48} className="mx-auto mb-4 text-violet-600 dark:text-violet-400 animate-float" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Service radius
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                How far can you serve? (in kilometers)
              </p>
            </div>
            <input
              type="number"
              value={formData.serviceRadius}
              onChange={(e) => setFormData({ ...formData, serviceRadius: e.target.value })}
              className="w-full px-4 py-4 text-lg bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 text-slate-900 dark:text-slate-100 transition-all"
              placeholder="10"
              min="1"
              max="50"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Optional - You can set this later
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen relative overflow-x-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-violet-950">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] animate-grid"></div>
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl animate-float-delayed"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg animate-fade-in">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer pointer-events-none"></div>
          
          {/* Progress Bar */}
          <div className="mb-8 relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Sparkles size={16} className="text-violet-600 dark:text-violet-400" />
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  role === 'customer' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                    : 'bg-gradient-to-r from-violet-600 to-purple-600'
                }`}
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="backdrop-blur-lg bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm animate-shake">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8 min-h-[300px] flex items-center">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 font-semibold hover:scale-105"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
            
            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold text-white hover:scale-105 ${
                  role === 'customer'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:shadow-lg'
                }`}
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold text-white ${
                  loading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : role === 'customer'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:scale-105'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:shadow-lg hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-
blue-400 hover:underline font-medium">
                Sign in
              </Link>
            </p>
            <Link to="/" className="text-sm text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 inline-block">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => {
          setAlertDialog({ isOpen: false, type: 'info', title: '', message: '' });
          if (alertDialog.type === 'success') {
            navigate(`/${role}/dashboard`);
          }
        }}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />

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

export default Register;
