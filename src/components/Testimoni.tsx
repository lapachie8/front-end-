import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface TestimonialProps {
  content: string;
  name: string;
  title: string;
  company: string;
  image: string;
  rating: number;
}

const TestimonialCard = ({ content, name, title, company, image, rating }: TestimonialProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 flex flex-col h-full">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
      
      <p className="text-gray-600 mb-6 flex-grow">{content}</p>
      
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{title}, {company}</p>
        </div>
      </div>
    </div>
  );
};

const CompanyLogo = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <img src={src} alt={alt} className="h-8 md:h-10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
    </div>
  );
};

const Testimoni = () => {
  const testimonials = [
    {
      content: "Platform BisnisKita telah membantu kami meningkatkan efisiensi operasional hingga 40%. Antarmuka yang mudah digunakan dan dukungan tim yang responsif membuat transisi digital kami sangat lancar.",
      name: "Budi Santoso",
      title: "CEO",
      company: "PT Maju Bersama",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5
    },
    {
      content: "Sebagai UMKM, kami sangat terbantu dengan harga yang terjangkau dan fitur yang lengkap. Analisis real-time membantu kami membuat keputusan bisnis yang lebih baik.",
      name: "Siti Rahma",
      title: "Founder",
      company: "Batik Nusantara",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 4
    },
    {
      content: "Keamanan data adalah prioritas utama kami, dan BisnisKita telah membuktikan komitmen mereka dalam hal ini. Selain itu, fitur kolaborasi tim sangat membantu dalam koordinasi proyek.",
      name: "Agus Wijaya",
      title: "CTO",
      company: "TechIndo",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5
    },
    {
      content: "Integrasi dengan sistem kami yang sudah ada berjalan mulus. Tim support sangat membantu dalam proses migrasi data dan pelatihan tim kami.",
      name: "Diana Putri",
      title: "COO",
      company: "Griya Kuliner",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      rating: 5
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const itemsPerPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      const newTotalPages = Math.ceil(testimonials.length / newItemsPerPage);
      if (activeIndex >= newTotalPages) {
        setActiveIndex(newTotalPages - 1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, testimonials.length]);

  const next = () => {
    setActiveIndex((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1));
  };

  const prev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1));
  };

  const visibleTestimonials = testimonials.slice(
    activeIndex * itemsPerPage,
    Math.min((activeIndex + 1) * itemsPerPage, testimonials.length)
  );

  const companyLogos = [
    { src: "https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Company 1" },
    { src: "https://images.pexels.com/photos/4065883/pexels-photo-4065883.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Company 2" },
    { src: "https://images.pexels.com/photos/4065899/pexels-photo-4065899.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Company 3" },
    { src: "https://images.pexels.com/photos/4065891/pexels-photo-4065891.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Company 4" },
    { src: "https://images.pexels.com/photos/4065886/pexels-photo-4065886.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Company 5" }
  ];

  return (
    <section id="testimoni" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apa Kata Klien Kami</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Dengarkan langsung dari pelanggan kami tentang bagaimana BisnisKita membantu mereka bertumbuh.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visibleTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index} 
                content={testimonial.content} 
                name={testimonial.name} 
                title={testimonial.title} 
                company={testimonial.company}
                image={testimonial.image}
                rating={testimonial.rating} 
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button 
                onClick={prev}
                className="p-2 rounded-full bg-white shadow-md hover:bg-blue-50 border border-gray-200 text-gray-700"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={next}
                className="p-2 rounded-full bg-white shadow-md hover:bg-blue-50 border border-gray-200 text-gray-700"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-8">Dipercaya oleh perusahaan terkemuka</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {companyLogos.map((logo, index) => (
              <CompanyLogo key={index} src={logo.src} alt={logo.alt} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimoni;