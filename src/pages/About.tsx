import { motion } from 'motion/react';
import { Users, Target, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full bg-white">
      {/* Header */}
      <section className="bg-gray-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-600 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600 rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">CampusVibe</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            We are a passionate team of event enthusiasts dedicated to helping students easily organize memorable events on campus.
          </motion.p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                University life is about more than just academics—it's about the connections you make and the experiences you share. Our mission is to take the stress out of event planning so you can focus on what really matters: having a great time with your friends.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded by former student union leaders, we understand the unique challenges of organizing campus events. From navigating university regulations to finding student-friendly budgets, we've got the expertise to make it happen smoothly.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" 
                alt="Students collaborating" 
                className="relative rounded-3xl shadow-2xl object-cover h-[400px] w-full"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Student-Centric', desc: 'We know what students want because we focus exclusively on campus culture and trends.' },
              { icon: Zap, title: 'High Energy', desc: 'We bring unmatched enthusiasm and creativity to every single event we plan.' },
              { icon: Target, title: 'Detail Oriented', desc: 'From the DJ playlist to the lighting cues, we sweat the small stuff so you don\'t have to.' }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
