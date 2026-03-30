import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, PartyPopper, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-pink-500 to-violet-600 p-2 rounded-lg">
                <PartyPopper className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-600">
                CampusVibe
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                  isActive(link.path) ? 'text-pink-500' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-pink-500 transition-colors"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-rose-500 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-bold text-gray-600 hover:text-pink-500 transition-colors"
                  >
                    Client Login
                  </Link>
                  <Link
                    to="/contact"
                    className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all transform hover:-translate-y-0.5"
                  >
                    Book Now
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-pink-500 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-pink-500 bg-pink-50'
                    : 'text-gray-600 hover:text-pink-500 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-100 mt-4">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-bold text-gray-900 hover:text-pink-500 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-bold text-gray-900 hover:text-pink-500 hover:bg-gray-50 mb-2"
                  >
                    Client Login
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-3 rounded-full font-medium"
                  >
                    Book Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
