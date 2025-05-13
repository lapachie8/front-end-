import React from 'react';
import { BarChart3, ShieldCheck, Clock, Globe, Users, Database } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
    </div>
  );
};

const Fitur = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Analisis Real-time',
      description: 'Dapatkan wawasan bisnis dengan analisis data real-time yang komprehensif dan mudah dipahami.'
    },
    {
      icon: ShieldCheck,
      title: 'Keamanan Terjamin',
      description: 'Data Anda selalu aman dengan sistem keamanan berlapis dan enkripsi tingkat tinggi.'
    },
    {
      icon: Clock,
      title: 'Hemat Waktu',
      description: 'Otomatisasi proses bisnis rutin untuk menghemat waktu dan meningkatkan produktivitas.'
    },
    {
      icon: Globe,
      title: 'Akses Dimana Saja',
      description: 'Akses platform dari perangkat apa pun, kapan saja, dan di mana saja.'
    },
    {
      icon: Users,
      title: 'Kolaborasi Tim',
      description: 'Bekerja sama dengan tim Anda secara efisien dengan fitur kolaborasi yang canggih.'
    },
    {
      icon: Database,
      title: 'Integrasi Mudah',
      description: 'Integrasikan dengan sistem yang sudah ada tanpa perlu mengubah infrastruktur.'
    }
  ];

  return (
    <section id="fitur" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Platform kami dirancang untuk membantu bisnis Anda tumbuh lebih cepat dengan fitur-fitur inovatif berikut ini.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fitur;