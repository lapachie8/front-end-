import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-semibold text-white">BisnisKita</span>
            </div>
            <p className="mb-4">
              Platform solusi bisnis terpadu untuk perusahaan di Indonesia.
              Kami membantu bisnis Anda tumbuh di era digital.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {['Beranda', 'Fitur', 'Tentang Kami', 'Layanan', 'Testimoni', 'Kontak'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Layanan</h3>
            <ul className="space-y-2">
              {['Analisis Bisnis', 'Manajemen Proyek', 'Integrasi Sistem', 'Otomatisasi', 'Keamanan Data', 'Konsultasi'].map((item) => (
                <li key={item}>
                  <a 
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Dapatkan Update</h3>
            <p className="mb-4">
              Berlangganan newsletter kami untuk mendapatkan tips dan berita terbaru.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email Anda"
                className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} BisnisKita. Hak Cipta Dilindungi.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;