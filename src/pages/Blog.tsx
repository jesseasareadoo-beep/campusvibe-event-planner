import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar, User, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  imageUrl: string;
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Top 5 Campus Event Themes for 2026',
    content: 'From Neon Nights to Retro Rewind, discover the themes that are taking campuses by storm this year. We break down how to pull off these looks on a student budget...',
    category: 'Themes',
    author: 'Alex Vibe',
    createdAt: '2026-03-15T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Planning a Legendary Freshers Week',
    content: 'Freshers week is the most important time of the year. Learn how to organize events that help new students connect and create lasting memories...',
    category: 'Guides',
    author: 'Sarah Planner',
    createdAt: '2026-03-20T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Event Planning on a Student Budget',
    content: 'You don\'t need a million dollars to throw a million-dollar party. Our expert tips on DIY decor, student vendors, and smart venue booking...',
    category: 'Budgeting',
    author: 'Mike Finance',
    createdAt: '2026-03-25T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'
  }
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        
        if (fetchedPosts.length > 0) {
          setPosts(fetchedPosts);
        } else {
          setPosts(SAMPLE_POSTS);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts(SAMPLE_POSTS);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-pink-600 text-sm font-bold uppercase tracking-wider mb-4">
              Inspiration Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">Inspiration</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips, guides, and case studies to help you plan the perfect campus event.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-pink-600 uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-pink-500 transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-6 flex-grow">
                    {post.content}
                  </p>
                  
                  <button className="flex items-center gap-2 text-pink-500 font-bold text-sm hover:gap-3 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Featured Case Study */}
        <div className="mt-24">
          <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-full h-full opacity-30">
              <img 
                src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop" 
                alt="Case study background" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="relative z-10 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 text-pink-400 font-bold uppercase tracking-widest text-sm mb-6">
                  <Sparkles className="w-5 h-5" /> Case Study
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                  The 2025 <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Neon Gala</span>
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  How we helped the Engineering Society host their biggest event ever, with 800+ attendees and a custom-built interactive light show.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                    <p className="text-2xl font-bold text-white">850</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Tickets Sold</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                    <p className="text-2xl font-bold text-white">£4.5k</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Budget Managed</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                    <p className="text-2xl font-bold text-white">4.9/5</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Satisfaction</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=1964&auto=format&fit=crop" alt="Gala 1" className="rounded-2xl shadow-lg transform -rotate-3" referrerPolicy="no-referrer" />
                  <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" alt="Gala 2" className="rounded-2xl shadow-lg transform rotate-3 translate-y-8" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
