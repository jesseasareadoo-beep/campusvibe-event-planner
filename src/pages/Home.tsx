import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, Music, Camera, MapPin, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop" 
            alt="Students partying" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
              #1 Student Event Planners
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Make Your Campus Events <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
                Unforgettable
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              From epic freshers' parties to elegant graduation galas, we handle everything so you can focus on making memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-pink-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Plan Your Event <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need for a <span className="text-pink-500">Legendary</span> Party</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide end-to-end event solutions tailored specifically for university students and campus organizations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Calendar, title: 'Event Planning', desc: 'Full-service coordination from concept to execution.' },
              { icon: Music, title: 'DJ & Entertainment', desc: 'Top campus DJs and live performers to keep the vibe alive.' },
              { icon: Camera, title: 'Photo & Video', desc: 'Professional coverage to capture every unforgettable moment.' },
              { icon: MapPin, title: 'Venue Booking', desc: 'Exclusive access to the best off-campus and on-campus spots.' },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-pink-100 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-violet-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-pink-600 blur-[120px]"></div>
          <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-600 blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Events Organized' },
              { number: '50k+', label: 'Happy Students' },
              { number: '20+', label: 'Partner Venues' },
              { number: '4.9', label: 'Average Rating', icon: Star },
            ].map((stat, idx) => (
              <div key={idx} className="p-6">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <h4 className="text-4xl md:text-5xl font-extrabold text-white">{stat.number}</h4>
                  {stat.icon && <stat.icon className="w-8 h-8 text-yellow-400 fill-yellow-400" />}
                </div>
                <p className="text-pink-200 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-500 to-violet-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to throw the party of the year?</h2>
            <p className="text-lg text-pink-100 mb-10 max-w-2xl mx-auto relative z-10">
              Don't stress over the details. Let our expert team handle the logistics while you take the credit for an amazing night.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-violet-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all relative z-10"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
