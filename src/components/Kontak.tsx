import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactInfo = ({ icon: Icon, title, content }: { icon: React.ElementType, title: string, content: string | React.ReactNode }) => {
  return (
    <div className="flex items-start mb-6">
      <div className="mr-4">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full">
          <Icon size={20} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <div className="text-gray-600">{content}</div>
      </div>
    </div>
  );
};

const Kontak = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: '',
    telepon: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ nama: '', email: '', pesan: '', telepon: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="kontak" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ada pertanyaan atau ingin tahu lebih banyak? Tim kami siap membantu Anda.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="lg:w-1/2 p-8 md:p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                Terima kasih! Pesan Anda telah dikirim. Kami akan menghubungi Anda segera.
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="nama@perusahaan.com"
                  />
                </div>
                <div>
                  <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="telepon"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="08123456789"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan
                  </label>
                  <textarea
                    id="pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Bagaimana kami dapat membantu Anda?"
                  ></textarea>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                <Send className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
          
          <div className="lg:w-1/2 p-8 md:p-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <h3 className="text-2xl font-bold mb-8">Informasi Kontak</h3>
            
            <div className="space-y-6">
              <ContactInfo 
                icon={MapPin} 
                title="Alamat" 
                content="Jl. Sudirman No. 123, Jakarta Pusat, 10220, Indonesia"
              />
              <ContactInfo 
                icon={Phone} 
                title="Telepon" 
                content="+62 21 1234 5678"
              />
              <ContactInfo 
                icon={Mail} 
                title="Email" 
                content="info@bisniskita.id"
              />
              <ContactInfo 
                icon={Clock} 
                title="Jam Kerja" 
                content={
                  <>
                    <div>Senin - Jumat: 08.00 - 17.00 WIB</div>
                    <div>Sabtu: 09.00 - 14.00 WIB</div>
                  </>
                }
              />
            </div>
            
            <div className="mt-10">
              <h4 className="text-lg font-medium mb-4">Lokasi Kami</h4>
              <div className="rounded-lg overflow-hidden h-64 w-full">
                <iframe 
                  title="Lokasi BisnisKita"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6664672948383!2d106.82496841476883!3d-6.1753896955310095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJl.%20Jend.%20Sudirman%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1630214046177!5m2!1sid!2sid" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Kontak;