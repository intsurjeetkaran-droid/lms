import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="contact"
      className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-4">
              LaundryPro
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Modern laundry management platform with transparent pricing and real-time tracking.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-600 dark:text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['home', 'features', 'how-it-works', 'pricing'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {id === 'how-it-works' ? 'How It Works' : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">For Users</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>support@laundrypro.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>123 Laundry Street, Clean City, CC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              © 2026 LaundryPro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
