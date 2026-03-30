import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Users, PartyPopper, Music, Camera, Paintbrush, DollarSign, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const EVENT_TYPES = [
  { id: 'party', label: 'House Party / Social', basePrice: 200 },
  { id: 'talent', label: 'Talent Show / Concert', basePrice: 500 },
  { id: 'gala', label: 'Formal Gala / Ball', basePrice: 800 },
  { id: 'workshop', label: 'Workshop / Seminar', basePrice: 150 },
];

const SERVICES = [
  { id: 'dj', label: 'DJ & Sound System', price: 400, icon: Music },
  { id: 'photo', label: 'Professional Photography', price: 300, icon: Camera },
  { id: 'decor', label: 'Full Decoration Set', price: 500, icon: Paintbrush },
  { id: 'catering', label: 'Catering (per guest)', price: 15, icon: PartyPopper },
];

export default function CostCalculator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(EVENT_TYPES[0].id);
  const [guestCount, setGuestCount] = useState(50);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalRange, setTotalRange] = useState({ min: 0, max: 0 });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const base = EVENT_TYPES.find(t => t.id === eventType)?.basePrice || 0;
    let servicesTotal = 0;
    
    selectedServices.forEach(sId => {
      const service = SERVICES.find(s => s.id === sId);
      if (service) {
        if (service.id === 'catering') {
          servicesTotal += service.price * guestCount;
        } else {
          servicesTotal += service.price;
        }
      }
    });

    const total = base + servicesTotal;
    setTotalRange({
      min: Math.floor(total * 0.9),
      max: Math.ceil(total * 1.1)
    });
  }, [eventType, guestCount, selectedServices]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/services' } });
      return;
    }

    setIsBooking(true);
    try {
      const selectedTypeLabel = EVENT_TYPES.find(t => t.id === eventType)?.label || eventType;
      const selectedServiceLabels = selectedServices.map(sId => SERVICES.find(s => s.id === sId)?.label || sId);

      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        eventType: selectedTypeLabel,
        guestCount,
        services: selectedServiceLabels,
        estimatedCost: (totalRange.min + totalRange.max) / 2,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-violet-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-6 h-6" />
          <h3 className="text-2xl font-bold">Event Cost Calculator</h3>
        </div>
        <p className="text-pink-100 opacity-90">Get a transparent estimate for your next campus vibe.</p>
      </div>

      <div className="p-8 space-y-8">
        <AnimatePresence mode="wait">
          {bookingSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Sent!</h4>
              <p className="text-gray-500">Redirecting you to your dashboard...</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Event Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">1. Select Event Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EVENT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setEventType(type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        eventType === type.id 
                          ? 'border-pink-500 bg-pink-50 text-pink-700' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-600'
                      }`}
                    >
                      <p className="font-bold">{type.label}</p>
                      <p className="text-xs opacity-70">Starts from ${type.basePrice}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex justify-between">
                  2. Estimated Guest Count
                  <span className="text-pink-600">{guestCount} Guests</span>
                </label>
                <div className="flex items-center gap-4">
                  <Users className="w-5 h-5 text-gray-400" />
                  <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">3. Preferred Services</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map(service => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                        selectedServices.includes(service.id)
                          ? 'border-violet-500 bg-violet-50 text-violet-700' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-600'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedServices.includes(service.id) ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <service.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{service.label}</p>
                        <p className="text-xs opacity-70">
                          {service.id === 'catering' ? `$${service.price}/guest` : `+$${service.price}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="pt-8 border-t border-gray-100">
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <p className="text-gray-500 font-medium mb-2">Estimated Cost Range</p>
                  <div className="flex items-center justify-center gap-2 text-4xl md:text-5xl font-black text-gray-900">
                    <DollarSign className="w-8 h-8 text-pink-500" />
                    <span>{totalRange.min.toLocaleString()}</span>
                    <span className="text-gray-300 mx-2">-</span>
                    <span>{totalRange.max.toLocaleString()}</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 italic">
                    *This is a rough estimate. Final pricing depends on specific requirements and venue availability.
                  </p>
                </div>
                
                <button 
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-violet-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    user ? 'Book This Package' : 'Login to Book'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
