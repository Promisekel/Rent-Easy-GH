import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Shield,
  Zap,
  Droplets,
  Wind,
  Tv,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  X,
  User,
  Home,
  Camera,
  Eye,
  ExternalLink
} from 'lucide-react';

const ListingDetailsPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Mock listing data
  const listing = {
    id: 1,
    title: 'Modern 2-Bedroom Apartment in East Legon',
    location: 'East Legon, Accra, Ghana',
    price: 2500,
    deposit: 5000,
    bedrooms: 2,
    bathrooms: 2,
    size: 75,
    type: 'Apartment',
    furnished: true,
    available: '2025-02-01',
    description: `This stunning modern apartment offers the perfect blend of comfort and convenience in the heart of East Legon. 
    Recently renovated with high-quality finishes throughout, this spacious 2-bedroom unit features an open-plan living area, 
    modern kitchen with built-in appliances, and a private balcony with city views. Located in a secure complex with 24/7 security, 
    backup generator, and ample parking. Walking distance to shops, restaurants, and public transport.`,
    features: [
      { id: 'wifi', name: 'WiFi', icon: Wifi },
      { id: 'parking', name: 'Parking', icon: Car },
      { id: 'security', name: '24/7 Security', icon: Shield },
      { id: 'electricity', name: 'Backup Generator', icon: Zap },
      { id: 'water', name: 'Water Supply', icon: Droplets },
      { id: 'ac', name: 'Air Conditioning', icon: Wind },
      { id: 'tv', name: 'Cable TV Ready', icon: Tv }
    ],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
    ],
    landlord: {
      name: 'Sarah Mensah',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviews: 24,
      verified: true,
      properties: 8,
      responseTime: '< 2 hours',
      joinedDate: 'January 2023'
    },
    nearby: [
      { name: 'East Legon Mall', distance: '0.5km', type: 'Shopping' },
      { name: 'University of Ghana', distance: '2.1km', type: 'Education' },
      { name: 'Marina Mall', distance: '1.8km', type: 'Shopping' },
      { name: 'A&C Shopping Center', distance: '0.8km', type: 'Shopping' },
      { name: 'East Legon Hospital', distance: '1.2km', type: 'Healthcare' }
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const renderImageGallery = () => (
    <motion.div variants={itemVariants} className="relative">
      <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={listing.images[currentImageIndex]}
          alt={`Property ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-all duration-200"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {listing.images.length}
        </div>
      </div>
      
      {/* Thumbnail Strip */}
      <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
        {listing.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              index === currentImageIndex ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderPropertyInfo = () => (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{listing.title}</h1>
          <p className="text-gray-600 flex items-center text-lg">
            <MapPin className="w-5 h-5 mr-2" />
            {listing.location}
          </p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <div className="text-3xl font-bold text-primary-600 mb-1">
            GHS {listing.price.toLocaleString()}<span className="text-lg text-gray-500">/month</span>
          </div>
          <p className="text-gray-600">Deposit: GHS {listing.deposit.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <div className="font-semibold text-gray-900">{listing.bedrooms}</div>
          <div className="text-sm text-gray-600">Bedrooms</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <div className="font-semibold text-gray-900">{listing.bathrooms}</div>
          <div className="text-sm text-gray-600">Bathrooms</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <div className="font-semibold text-gray-900">{listing.size}m²</div>
          <div className="text-sm text-gray-600">Size</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Home className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <div className="font-semibold text-gray-900">{listing.type}</div>
          <div className="text-sm text-gray-600">Property Type</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <div className="font-semibold text-gray-900">Available</div>
          <div className="text-sm text-gray-600">{listing.available}</div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listing.features.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <feature.icon className="w-5 h-5 text-primary-600" />
              <span className="text-gray-900 font-medium">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderLandlordInfo = () => (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Property Owner</h3>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img 
            src={listing.landlord.avatar} 
            alt={listing.landlord.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {listing.landlord.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{listing.landlord.name}</h4>
          <div className="flex items-center space-x-2 mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(listing.landlord.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {listing.landlord.rating} ({listing.landlord.reviews} reviews)
            </span>
          </div>
          {listing.landlord.verified && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <Check className="w-3 h-3 mr-1" />
              Verified Owner
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <span className="text-gray-600">Properties:</span>
          <span className="ml-2 font-medium">{listing.landlord.properties}</span>
        </div>
        <div>
          <span className="text-gray-600">Response time:</span>
          <span className="ml-2 font-medium">{listing.landlord.responseTime}</span>
        </div>
        <div>
          <span className="text-gray-600">Member since:</span>
          <span className="ml-2 font-medium">{listing.landlord.joinedDate}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowContactForm(!showContactForm)}
          className="w-full btn-primary"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Send Message
        </motion.button>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </motion.button>
        </div>
      </div>
      
      {showContactForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-xl"
        >
          <h4 className="font-semibold text-gray-900 mb-3">Send a Message</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <textarea
              rows={3}
              placeholder="I'm interested in this property..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
            <button className="w-full btn-primary">Send Message</button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderNearbyPlaces = () => (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">What's Nearby</h3>
      
      <div className="space-y-4">
        {listing.nearby.map((place, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{place.name}</h4>
              <p className="text-sm text-gray-600">{place.type}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-primary-600">{place.distance}</p>
              <p className="text-xs text-gray-500">away</p>
            </div>
          </div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        View on Map
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {renderImageGallery()}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              {renderPropertyInfo()}
            </div>
            
            <div className="space-y-6">
              {renderLandlordInfo()}
              {renderNearbyPlaces()}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;