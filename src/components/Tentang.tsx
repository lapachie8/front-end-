import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Tentang = () => {
  const values = [
    'Inovasi berkelanjutan',
    'Integritas dalam setiap aspek',
    'Fokus pada kepuasan pelanggan',
    'Kolaborasi dan kerja tim'
  ];

  return (
    <section id="tentang-kami" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Tim kami sedang meeting" 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Kantor kami" 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src="https://images.pexels.com/photos/3205568/pexels-photo-3205568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Diskusi tim" 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src="https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Kerja tim" 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tentang BisnisKita</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Didirikan pada tahun 2020, BisnisKita hadir untuk membantu bisnis di Indonesia menghadapi era digital dengan solusi yang mudah digunakan dan terjangkau.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Kami percaya bahwa transformasi digital seharusnya dapat diakses oleh semua skala bisnis, dari UMKM hingga perusahaan besar. Itulah mengapa kami menciptakan platform yang intuitif dan dapat disesuaikan dengan kebutuhan Anda.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nilai-Nilai Kami</h3>
            <ul className="space-y-3 mb-8">
              {values.map((value, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{value}</span>
                </li>
              ))}
            </ul>
            
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tentang;