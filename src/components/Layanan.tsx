import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LayananProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  popular?: boolean;
  image: string;
}

const LayananCard = ({ title, description, price, features, popular, image }: LayananProps) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${popular ? 'border-blue-500 shadow-lg' : 'border-gray-200 shadow-md'} transition-all duration-300 hover:shadow-xl bg-white`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-4 rounded-bl-lg font-medium text-sm">
          Terpopuler
        </div>
      )}
      
      <div className="overflow-hidden h-48">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 h-12">{description}</p>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          {price !== 'Hubungi Kami' && <span className="text-gray-600">/bulan</span>}
        </div>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <span className="mr-2 text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <button className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center ${popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'} transition-colors`}>
          Pelajari Lebih Lanjut <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const Layanan = () => {
  const services = [
    {
      title: 'Paket Dasar',
      description: 'Solusi lengkap untuk bisnis kecil yang baru memulai.',
      price: 'Rp 499.000',
      features: [
        'Hingga 3 pengguna',
        'Analisis dasar',
        'Penyimpanan 5GB',
        'Dukungan email'
      ],
      popular: false,
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Paket Bisnis',
      description: 'Solusi komprehensif untuk bisnis menengah yang berkembang.',
      price: 'Rp 999.000',
      features: [
        'Hingga 10 pengguna',
        'Analisis lanjutan',
        'Penyimpanan 20GB',
        'Dukungan prioritas'
      ],
      popular: true,
      image: 'https://images.pexels.com/photos/3184305/pexels-photo-3184305.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Paket Enterprise',
      description: 'Solusi kustom untuk perusahaan besar dengan kebutuhan kompleks.',
      price: 'Hubungi Kami',
      features: [
        'Pengguna tidak terbatas',
        'Analisis tingkat lanjut',
        'Penyimpanan tak terbatas',
        'Dukungan 24/7'
      ],
      popular: false,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <section id="layanan" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Layanan Kami</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Semua paket mencakup fitur-fitur utama kami.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <LayananCard 
              key={index} 
              title={service.title} 
              description={service.description} 
              price={service.price} 
              features={service.features} 
              popular={service.popular}
              image={service.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Layanan;