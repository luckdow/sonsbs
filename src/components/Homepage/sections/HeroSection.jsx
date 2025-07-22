import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star,
  Phone,
  Mail,
  Shield,
  Clock,
  Users,
  Truck,
  Globe,
  CheckCircle2,
  Car,
  Plane,
  MapPin
} from 'lucide-react';
import QuickBookingForm from './QuickBookingForm';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 min-h-screen flex items-center pt-20 md:pt-0">
      {/* Background Effects - Minimal */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
      </div>
      
      {/* Simplified particles - Only on desktop */}
      <div className="absolute inset-0 hidden md:block">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Mobile'de önce - Hızlı rezervasyon formu */}
          <div className="order-1 lg:order-2 w-full lg:pl-8">
            <QuickBookingForm />
          </div>

          {/* Mobile'de sonra - Ana içerik */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Ana başlık */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Antalya
              </span>
              <br />
              <span className="text-white">Transfer Hizmeti</span>
            </h1>

            {/* Alt başlık */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0">
              Profesyonel, güvenli ve konforlu havalimanı transfer hizmeti ile Antalya'nın her yerine ulaşın
            </p>

            {/* Özellikler - Icon + Text style, kartlar kaldırıldı */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-8 mb-8 lg:mb-10">
              <div className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                <span className="text-sm lg:text-base font-medium">Güvenli Transfer</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                <span className="text-sm lg:text-base font-medium">7/24 Hizmet</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
                <span className="text-sm lg:text-base font-medium">Profesyonel Şoförler</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Car className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400" />
                <span className="text-sm lg:text-base font-medium">Konforlu Araçlar</span>
              </div>
            </div>

            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 lg:mb-10">
              <Link
                to="/rezervasyon"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Car className="w-5 h-5" />
                Hemen Rezervasyon Yap
              </Link>
              
              <a
                href="tel:+905551234567"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                +90 555 123 4567
              </a>
            </div>

            {/* İstatistikler - Daha minimal */}
            <div className="flex items-center justify-center lg:justify-start gap-8 lg:gap-12 mb-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-white">5000+</div>
                <div className="text-gray-400 text-sm">Mutlu Müşteri</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-white">99%</div>
                <div className="text-gray-400 text-sm">Memnuniyet Oranı</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm">Müşteri Desteği</div>
              </div>
            </div>

            {/* Sosyal kanıt */}
            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-2 font-medium">4.9/5 (2,500+ değerlendirme)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Minimal */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/40 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
