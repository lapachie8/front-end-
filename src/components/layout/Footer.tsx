import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Juiweaprent</h3>
            <p className="text-secondary-200 mb-4">
              Produk berkualitas, periode sewa fleksibel, dan layanan yang luar biasa. Rasakan kenyamanan menyewa daripada membeli.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/jui_weaponrent/" className="text-white hover:text-accent-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-200 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
                    
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Hubungi Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-accent-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-secondary-200">
                  Purballneckhurt
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-accent-500 mr-2 flex-shrink-0" />
                <span className="text-secondary-200">081227683434</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-accent-500 mr-2 flex-shrink-0" />
                <span className="text-secondary-200">yaya@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-300 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Juiweaprent. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-secondary-300 text-sm hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-secondary-300 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;