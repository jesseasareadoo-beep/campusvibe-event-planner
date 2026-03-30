import { motion } from 'motion/react';

export default function Gallery() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1540039155732-684735035727?q=80&w=2070&auto=format&fit=crop', title: 'Freshers Week 2025', span: 'col-span-1 md:col-span-2 row-span-2' },
    { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop', title: 'Live Concerts', span: 'col-span-1 row-span-1' },
    { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop', title: 'Club Nights', span: 'col-span-1 row-span-1' },
    { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop', title: 'Graduation Gala', span: 'col-span-1 row-span-1' },
    { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61628?q=80&w=2069&auto=format&fit=crop', title: 'Society Ball', span: 'col-span-1 md:col-span-2 row-span-1' },
    { src: 'https://images.unsplash.com/photo-1533174000255-14f122a265a4?q=80&w=2070&auto=format&fit=crop', title: 'Neon Party', span: 'col-span-1 row-span-1' },
  ];

  return (
    <div className="w-full bg-white">
      <section className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
          >
            Event <span className="text-violet-500">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-16"
          >
            Take a look at some of the unforgettable moments we've created for students across the country.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl overflow-hidden group ${img.span}`}
              >
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-bold text-xl">{img.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
