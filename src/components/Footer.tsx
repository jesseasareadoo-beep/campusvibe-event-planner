import { Link } from 'react-router-dom';
import { PartyPopper, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-violet-600 p-2 rounded-lg">
                <PartyPopper className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                CampusVibe
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Making your campus events unforgettable. From freshers' parties to graduation galas, we bring the vibe to your university life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Our Services</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Event Gallery</Link></li>
              <li><Link to="/testimonials" className="text-gray-400 hover:text-pink-500 transition-colors text-sm">Student Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">Event Planning</li>
              <li className="text-gray-400 text-sm">DJ & Music</li>
              <li className="text-gray-400 text-sm">Decoration & Lighting</li>
              <li className="text-gray-400 text-sm">Photography</li>
              <li className="text-gray-400 text-sm">Venue Booking</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-pink-500 shrink-0" />
                <span className="text-gray-400 text-sm">University of Mines and Technology (UMaT), Tarkwa</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-pink-500 shrink-0" />
                <span className="text-gray-400 text-sm">+233 540418526</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-pink-500 shrink-0" />
                <span className="text-gray-400 text-sm">hello@campusvibe.events</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CampusVibe Events. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
