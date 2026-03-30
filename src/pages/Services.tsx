import { motion } from 'motion/react';
import { CalendarCheck, Music, Sparkles, Camera, Ticket, MapPin, CheckCircle2, Clock, AlertCircle, DollarSign, PieChart, Users, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import CostCalculator from '../components/CostCalculator';

export default function Services() {
  const services = [
    {
      icon: CalendarCheck,
      title: 'Event Planning & Coordination',
      desc: 'Full-scale event management. We handle budgeting, timelines, vendor coordination, and on-the-day execution.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: Music,
      title: 'DJ & Music Services',
      desc: 'Access to top campus DJs, live bands, and premium sound equipment to keep the dance floor packed all night.',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: Sparkles,
      title: 'Decoration & Lighting',
      desc: 'Transform any boring hall into a nightclub or an elegant gala with our custom lighting and thematic decor.',
      color: 'from-violet-400 to-violet-600'
    },
    {
      icon: Camera,
      title: 'Photography & Videography',
      desc: 'Professional media teams to capture the highlights, complete with photobooths and instant social sharing.',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: Ticket,
      title: 'Ticketing & Promotion',
      desc: 'Custom digital ticketing platforms and social media marketing campaigns to ensure your event sells out.',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: MapPin,
      title: 'Venue Booking',
      desc: 'Exclusive partnerships with local clubs, halls, and unique spaces that offer student-friendly rates.',
      color: 'from-rose-400 to-rose-600'
    }
  ];

  const planningStages = [
    { name: 'Initial Consultation', status: 'completed', date: 'Oct 12' },
    { name: 'Venue Secured', status: 'completed', date: 'Oct 25' },
    { name: 'Vendors Booked', status: 'in-progress', date: 'Nov 10' },
    { name: 'Marketing & Ticketing', status: 'pending', date: 'Nov 20' },
    { name: 'Event Day Execution', status: 'pending', date: 'Dec 05' },
  ];

  const vendors = [
    { service: 'DJ & Sound', name: 'DJ VibeZ', status: 'Confirmed', type: 'success' },
    { service: 'Photography', name: 'LensCrafters', status: 'Confirmed', type: 'success' },
    { service: 'Decoration', name: 'Neon Nights', status: 'Pending Contract', type: 'warning' },
    { service: 'Catering', name: 'Campus Bites', status: 'Action Required', type: 'danger' },
  ];

  return (
    <div className="w-full bg-gray-50">
      {/* Header */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
          >
            Our <span className="text-pink-500">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Everything you need to throw an epic campus event, all in one place. Mix and match our services to fit your budget.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 text-white shadow-lg transform group-hover:-translate-y-2 transition-transform`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{service.desc}</p>
                <Link to="/contact" className="text-pink-500 font-semibold flex items-center gap-2 hover:text-pink-600 transition-colors">
                  Inquire Now <span className="text-xl">&rarr;</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Calculator Section */}
      <section className="py-20 bg-white border-y border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Plan Your Budget <br />
                <span className="text-pink-500 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">With Confidence</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                No hidden fees, no surprises. Use our interactive calculator to get an instant estimate for your event. 
                Adjust guest counts, add services, and see how your vision fits your budget.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Transparent Pricing', desc: 'Know exactly what you are paying for from the start.' },
                  { icon: Heart, title: 'Custom Packages', desc: 'Only pay for the services you actually need for your vibe.' },
                  { icon: Sparkles, title: 'Student Discounts', desc: 'Special rates for registered campus societies and clubs.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0 shadow-sm">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <CostCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need a Custom Package?</h2>
          <p className="text-gray-400 mb-10 text-lg">We can tailor our services to match your specific society budget and requirements.</p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-to-r from-pink-500 to-violet-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-pink-500/40 transition-all transform hover:-translate-y-1"
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </div>
  );
}
