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
    <footer id="contact" className="bg-slate-800 dark:bg-slate-950 text-slate-300 dark:text-slate-400 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
              LaundryPro
            </h3>
            <p className="text-slate-400 dark:text-slate-500 mb-4">
              Modern laundry management platform with transparent pricing and real-time tracking.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-700 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors text-slate-300 dark:text-slate-400">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors text-slate-300 dark:text-slate-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors text-slate-300 dark:text-slate-400">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors text-slate-300 dark:text-slate-400">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white dark:text-slate-200 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('home')} className="hover:text-blue-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('features')} className="hover:text-blue-400 transition-colors">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-400 transition-colors">
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-lg font-semibold text-white dark:text-slate-200 mb-4">For Users</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="hover:text-blue-400 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white dark:text-slate-200 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>support@laundrypro.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span>123 Laundry Street, Clean City, CC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 dark:border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              © 2026 LaundryPro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
