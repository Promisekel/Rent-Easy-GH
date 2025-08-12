import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  DollarSign, 
  Heart, 
  Star, 
  Eye,
  Grid,
  List,
  SlidersHorizontal,
  Home,
  Building,
  Car,
  Wifi,
  Shield,
  ArrowLeft,
  Calendar,
  ArrowRight,
  TrendingUp,
  Award,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  rating: number;
  reviews: number;
  type: 'apartment' | 'house' | 'studio' | 'condo';
  featured: boolean;
  amenities: string[];
  landlord: {
    name: string;
    verified: boolean;
    avatar: string;
  };
  availableFrom: string;
}

// Mock data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 2-Bedroom Apartment in East Legon',
    location: 'East Legon, Accra',
    price: 1200,
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    ],
    rating: 4.8,
    reviews: 24,
    type: 'apartment',
    featured: true,
    amenities: ['WiFi', 'Parking', 'Security', 'Pool'],
    landlord: {
      name: 'Sarah Johnson',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4d6?w=100'
    },
    availableFrom: '2025-09-01'
  },
  {
    id: '2',
    title: 'Luxury 3-Bedroom House with Garden',
    location: 'Airport Residential, Accra',
    price: 2500,
    bedrooms: 3,
    bathrooms: 3,
    area: 150,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    ],
    rating: 4.9,
    reviews: 18,
    type: 'house',
    featured: true,
    amenities: ['WiFi', 'Parking', 'Security', 'Garden', 'Gym'],
    landlord: {
      name: 'Michael Chen',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    availableFrom: '2025-08-15'
  },
  {
    id: '3',
    title: 'Cozy Studio in Osu',
    location: 'Osu, Accra',
    price: 600,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
    ],
    rating: 4.6,
    reviews: 12,
    type: 'studio',
    featured: false,
    amenities: ['WiFi', 'Security'],
    landlord: {
      name: 'Ama Asante',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    },
    availableFrom: '2025-08-20'
  },
  {
    id: '4',
    title: 'Executive 4-Bedroom Villa',
    location: 'Cantonments, Accra',
    price: 3500,
    bedrooms: 4,
    bathrooms: 4,
    area: 200,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
    rating: 5.0,
    reviews: 8,
    type: 'house',
    featured: true,
    amenities: ['WiFi', 'Parking', 'Security', 'Pool', 'Garden', 'Gym', 'Staff Quarters'],
    landlord: {
      name: 'Robert Wilson',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    availableFrom: '2025-09-15'
  },
  {
    id: '5',
    title: 'Modern 1-Bedroom Apartment',
    location: 'Labone, Accra',
    price: 800,
    bedrooms: 1,
    bathrooms: 1,
    area: 50,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
    ],
    rating: 4.7,
    reviews: 15,
    type: 'apartment',
    featured: false,
    amenities: ['WiFi', 'Parking', 'Security'],
    landlord: {
      name: 'Grace Mensah',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
    },
    availableFrom: '2025-08-25'
  },
  {
    id: '6',
    title: 'Spacious 2-Bedroom Condo',
    location: 'Tema, Greater Accra',
    price: 950,
    bedrooms: 2,
    bathrooms: 2,
    area: 75,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800',
    ],
    rating: 4.5,
    reviews: 22,
    type: 'condo',
    featured: false,
    amenities: ['WiFi', 'Parking', 'Security', 'Pool'],
    landlord: {
      name: 'David Osei',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    availableFrom: '2025-09-01'
  }
];

const BrowseListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [bedroomFilter, setBedroomFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Filter effects
  useEffect(() => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    // Price filter
    filtered = filtered.filter(property =>
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Bedroom filter
    if (bedroomFilter !== 'all') {
      const bedrooms = parseInt(bedroomFilter);
      filtered = filtered.filter(property => property.bedrooms >= bedrooms);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.availableFrom).getTime() - new Date(a.availableFrom).getTime());
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProperties(filtered);
  }, [searchTerm, selectedType, priceRange, bedroomFilter, sortBy, properties]);

  const toggleFavorite = (propertyId: string) => {
    setFavoriteIds(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
    toast.success(
      favoriteIds.includes(propertyId) ? 'Removed from favorites' : 'Added to favorites',
      { icon: favoriteIds.includes(propertyId) ? '💔' : '❤️' }
    );
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Back Navigation */}
          <motion.div 
            variants={itemVariants}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </motion.div>

          {/* Header with colorful gradient */}
          <motion.div 
            variants={itemVariants}
            className="relative mb-12 p-8 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Discover Your Perfect Home 🏠
              </motion.h1>
              <motion.p 
                className="text-xl opacity-90 mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Explore {filteredProperties.length} amazing properties in Ghana
              </motion.p>

              {/* Search and Filter Bar */}
              <motion.div 
                className="flex flex-col lg:flex-row gap-4 items-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="relative flex-1 w-full lg:max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location or property name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </motion.button>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Property Type</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="studio">Studio</option>
                        <option value="condo">Condo</option>
                      </select>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Bedrooms</label>
                      <select
                        value={bedroomFilter}
                        onChange={(e) => setBedroomFilter(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="featured">Featured First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Toggle and Results Count */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-center mb-8"
          >
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-gray-600 font-medium">
                {filteredProperties.length} properties found
              </span>
              {filteredProperties.length !== properties.length && (
                <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Filtered
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <motion.button
                onClick={() => setViewMode('grid')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Properties Grid/List */}
          <motion.div variants={itemVariants}>
            {filteredProperties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="mb-6">
                  <Home className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
                <motion.button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setPriceRange([0, 5000]);
                    setBedroomFilter('all');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                    onClick={() => navigate(`/listing/${property.id}`)}
                  >
                    {/* Image Section */}
                    <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full h-64'} group cursor-pointer`}>
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Property badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {property.featured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        )}
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full capitalize">
                          {property.type}
                        </span>
                      </div>

                      {/* Favorite button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 ${
                            favoriteIds.includes(property.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </motion.button>

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
                      {/* Price and Rating */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">${property.price}</span>
                          <span className="text-gray-500 text-sm">/month</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{property.rating}</span>
                          <span className="text-sm text-gray-500">({property.reviews})</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      {/* Property details */}
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{property.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          <span>{property.area} m²</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg flex items-center"
                          >
                            {amenity === 'WiFi' && <Wifi className="w-3 h-3 mr-1" />}
                            {amenity === 'Parking' && <Car className="w-3 h-3 mr-1" />}
                            {amenity === 'Security' && <Shield className="w-3 h-3 mr-1" />}
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Landlord info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={property.landlord.avatar}
                            alt={property.landlord.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">{property.landlord.name}</span>
                              {property.landlord.verified && (
                                <Check className="w-3 h-3 text-green-500 ml-1" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/listing/${property.id}`);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Load More Button */}
          {filteredProperties.length >= 6 && (
            <motion.div
              variants={itemVariants}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Load More Properties
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BrowseListingsPage;
